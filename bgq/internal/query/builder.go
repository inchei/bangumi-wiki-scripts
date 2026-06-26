package query

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/inchei/bangumi-query/internal/config"
	"github.com/inchei/bangumi-query/internal/model"
)

// SQLBuilder generates DuckDB SQL from a Config.
type SQLBuilder struct {
	cfg       *config.Config
	dataDir   string
	useDB     bool   // if true, reference tables directly instead of JSON CTEs
	target    string // "subject", "person", or "character"
	mainAlias string // "s", "p", or "c"
	tc        *targetConfig
}

// clauseContext controls how filters are generated in different SQL contexts.
type clauseContext struct {
	alias          string // table alias: "s" (main subject), "rs" (related subject), "p" (person), "c" (character), "rc" (related character)
	isPersonCtx    bool   // true when filtering person-level conditions (uses personFilterForAlias)
	isCharacterCtx bool   // true when filtering character-level conditions (uses characterFilterForAlias)
	isEpisodeCtx   bool   // true when filtering episode conditions (direct fields only, no infobox)
}

// NewSQLBuilder creates a new SQL builder.
func NewSQLBuilder(cfg *config.Config, dataDir string) *SQLBuilder {
	target := cfg.Target
	if target == "" {
		target = "subject"
	}
	tc := newTargetConfig(target)
	return &SQLBuilder{
		cfg:       cfg,
		dataDir:   dataDir,
		useDB:     cfg.HasDatabase(),
		target:    target,
		mainAlias: tc.mainAlias,
		tc:        tc,
	}
}

// Build generates the complete DuckDB SQL query.
func (b *SQLBuilder) Build() (string, error) {
	// Generate CTEs for data sources
	ctes, err := b.buildCTEs()
	if err != nil {
		return "", err
	}

	// Generate WHERE clauses
	where, err := b.buildWhere()
	if err != nil {
		return "", err
	}

	// Generate SELECT columns
	selectCols := b.buildSelect()

	// Generate ORDER BY
	orderBy := b.buildOrderBy()

	// Generate LIMIT
	limit := b.cfg.Limit
	if limit <= 0 {
		limit = 1000
	}

	// Assemble the query
	var sql strings.Builder
	if len(ctes) > 0 {
		sql.WriteString("WITH ")
		sql.WriteString(strings.Join(ctes, ",\n"))
		sql.WriteString("\n")
	}

	sql.WriteString("SELECT ")
	sql.WriteString(strings.Join(selectCols, ", "))
	fmt.Fprintf(&sql, "\nFROM %s %s\n", b.tc.mainTable, b.mainAlias)

	// Add JOINs for relations, persons, episodes
	joins := b.buildJoins()
	for _, j := range joins {
		sql.WriteString(j)
		sql.WriteString("\n")
	}

	if where != "" {
		sql.WriteString("WHERE ")
		sql.WriteString(where)
		sql.WriteString("\n")
	}

	if orderBy != "" {
		sql.WriteString("ORDER BY ")
		sql.WriteString(orderBy)
		sql.WriteString("\n")
	}

	fmt.Fprintf(&sql, "LIMIT %d", limit)

	return sql.String(), nil
}

func (b *SQLBuilder) buildCTEs() ([]string, error) {
	// If using a persistent database, no CTEs needed — tables already exist
	if b.useDB {
		return nil, nil
	}

	var ctes []string

	// Main subjects CTE — reads the JSONLines file
	subjectFile := b.dataDir + "/subject.jsonlines"
	ctes = append(ctes, fmt.Sprintf(
		`subjects AS (SELECT * FROM read_json_auto('%s', format='newline_delimited'))`,
		escapeSQLString(subjectFile),
	))

	// For person target: also load persons as main table
	personsLoaded := false
	if b.target == "person" {
		personFile := b.dataDir + "/person.jsonlines"
		ctes = append(ctes, fmt.Sprintf(
			`persons AS (SELECT id as person_id, name, type as person_type, career, COALESCE(infobox,'') as infobox, summary FROM read_json_auto('%s', format='newline_delimited'))`,
			escapeSQLString(personFile),
		))
		personsLoaded = true
	}

	// For character target: load characters as main table
	charactersLoaded := false
	if b.target == "character" {
		charFile := b.dataDir + "/character.jsonlines"
		ctes = append(ctes, fmt.Sprintf(
			`characters AS (SELECT id as character_id, role, name, COALESCE(infobox,'') as infobox, summary, comments, collects FROM read_json_auto('%s', format='newline_delimited'))`,
			escapeSQLString(charFile),
		))
		charactersLoaded = true
	}

	// Relations CTE
	if b.cfg.NeedsRelations() {
		relFile := b.dataDir + "/subject-relations.jsonlines"
		ctes = append(ctes, fmt.Sprintf(
			`subject_relations AS (SELECT * FROM read_json_auto('%s', format='newline_delimited'))`,
			escapeSQLString(relFile),
		))
	}

	// Persons CTE
	if b.cfg.NeedsPersons() {
		persFile := b.dataDir + "/subject-persons.jsonlines"
		ctes = append(ctes, fmt.Sprintf(
			`subject_persons AS (SELECT * FROM read_json_auto('%s', format='newline_delimited'))`,
			escapeSQLString(persFile),
		))
		// Also load person data for name lookups and infobox field extraction (skip if already loaded as main)
		if !personsLoaded {
			personFile := b.dataDir + "/person.jsonlines"
			ctes = append(ctes, fmt.Sprintf(
				`persons AS (SELECT id as person_id, name, type as person_type, career, COALESCE(infobox,'') as infobox FROM read_json_auto('%s', format='newline_delimited'))`,
				escapeSQLString(personFile),
			))
		}
	}

	// Person Relations CTE (person-to-person, filtered by person_type='prsn')
	if b.cfg.NeedsPersonRelations() {
		persRelFile := b.dataDir + "/person-relations.jsonlines"
		ctes = append(ctes, fmt.Sprintf(
			`person_relations AS (SELECT * FROM read_json_auto('%s', format='newline_delimited') WHERE person_type = 'prsn')`,
			escapeSQLString(persRelFile),
		))
		// Ensure persons table is loaded for related person lookups
		if !personsLoaded {
			personFile := b.dataDir + "/person.jsonlines"
			ctes = append(ctes, fmt.Sprintf(
				`persons AS (SELECT id as person_id, name, type as person_type, career, COALESCE(infobox,'') as infobox FROM read_json_auto('%s', format='newline_delimited'))`,
				escapeSQLString(personFile),
			))
			personsLoaded = true
		}
	}

	// Character Relations CTE (character-to-character, filtered by person_type='crt')
	if b.cfg.NeedsCharacterRelations() {
		charRelFile := b.dataDir + "/person-relations.jsonlines"
		ctes = append(ctes, fmt.Sprintf(
			`character_relations AS (SELECT * FROM read_json_auto('%s', format='newline_delimited') WHERE person_type = 'crt')`,
			escapeSQLString(charRelFile),
		))
		// Ensure characters table is loaded for related character lookups
		if !charactersLoaded {
			charFile := b.dataDir + "/character.jsonlines"
			ctes = append(ctes, fmt.Sprintf(
				`characters AS (SELECT id as character_id, role, name, COALESCE(infobox,'') as infobox, summary, comments, collects FROM read_json_auto('%s', format='newline_delimited'))`,
				escapeSQLString(charFile),
			))
			charactersLoaded = true
		}
	}

	// Subject Characters CTE
	if b.cfg.NeedsCharacters() {
		subCharFile := b.dataDir + "/subject-characters.jsonlines"
		ctes = append(ctes, fmt.Sprintf(
			`subject_characters AS (SELECT * FROM read_json_auto('%s', format='newline_delimited'))`,
			escapeSQLString(subCharFile),
		))
		// Ensure characters table is loaded for character lookups
		if !charactersLoaded {
			charFile := b.dataDir + "/character.jsonlines"
			ctes = append(ctes, fmt.Sprintf(
				`characters AS (SELECT id as character_id, role, name, COALESCE(infobox,'') as infobox, summary, comments, collects FROM read_json_auto('%s', format='newline_delimited'))`,
				escapeSQLString(charFile),
			))
			charactersLoaded = true
		}
	}

	// Person Characters CTE (three-way join: person-character-subject)
	if b.cfg.NeedsPersonCharacters() {
		perCharFile := b.dataDir + "/person-characters.jsonlines"
		ctes = append(ctes, fmt.Sprintf(
			`person_characters AS (SELECT * FROM read_json_auto('%s', format='newline_delimited'))`,
			escapeSQLString(perCharFile),
		))
		// Ensure characters table is loaded
		if !charactersLoaded {
			charFile := b.dataDir + "/character.jsonlines"
			ctes = append(ctes, fmt.Sprintf(
				`characters AS (SELECT id as character_id, role, name, COALESCE(infobox,'') as infobox, summary, comments, collects FROM read_json_auto('%s', format='newline_delimited'))`,
				escapeSQLString(charFile),
			))
		}
		// Ensure persons table is loaded
		if !personsLoaded {
			personFile := b.dataDir + "/person.jsonlines"
			ctes = append(ctes, fmt.Sprintf(
				`persons AS (SELECT id as person_id, name, type as person_type, career, COALESCE(infobox,'') as infobox, summary FROM read_json_auto('%s', format='newline_delimited'))`,
				escapeSQLString(personFile),
			))
		}
	}

	// Episodes CTE
	episodesLoaded := false
	if b.target == "episode" {
		epFile := b.dataDir + "/episode.jsonlines"
		ctes = append(ctes, fmt.Sprintf(
			`episodes AS (SELECT * FROM read_json_auto('%s', format='newline_delimited'))`,
			escapeSQLString(epFile),
		))
		episodesLoaded = true
	}
	if !episodesLoaded && b.cfg.NeedsEpisodes() {
		epFile := b.dataDir + "/episode.jsonlines"
		ctes = append(ctes, fmt.Sprintf(
			`episodes AS (SELECT * FROM read_json_auto('%s', format='newline_delimited'))`,
			escapeSQLString(epFile),
		))
	}

	return ctes, nil
}

func (b *SQLBuilder) buildWhere() (string, error) {
	return b.buildClauses(b.cfg.Filters, clauseContext{alias: b.mainAlias})
}

// buildClauses recursively builds WHERE clauses from a list of filters.
// Logic filters are handled recursively, with OR groups wrapped in parentheses.
func (b *SQLBuilder) buildClauses(filters []config.Filter, ctx clauseContext) (string, error) {
	var clauses []string
	for i, f := range filters {
		clause, err := b.filterToCtx(f, ctx, i)
		if err != nil {
			return "", err
		}
		if clause != "" {
			clauses = append(clauses, clause)
		}
	}
	if len(clauses) == 0 {
		return "TRUE", nil
	}
	return strings.Join(clauses, " AND "), nil
}

// buildClausesWithOp recursively builds clauses and joins with the given op ("and" or "or").
// OR groups are wrapped in parentheses for correct precedence.
func (b *SQLBuilder) buildClausesWithOp(filters []config.Filter, ctx clauseContext, op string) (string, error) {
	var clauses []string
	sep := " AND "
	if op == "or" {
		sep = " OR "
	}
	for i, f := range filters {
		clause, err := b.filterToCtx(f, ctx, i)
		if err != nil {
			return "", err
		}
		if clause != "" {
			clauses = append(clauses, clause)
		}
	}
	if len(clauses) == 0 {
		return "TRUE", nil
	}
	joined := strings.Join(clauses, sep)
	if op == "or" && len(clauses) > 1 {
		joined = "(" + joined + ")"
	}
	return joined, nil
}

// filterToCtx dispatches a single filter to the appropriate handler based on context.
func (b *SQLBuilder) filterToCtx(f config.Filter, ctx clauseContext, idx int) (string, error) {
	// Logic filter: recursively build clauses with the specified op
	if f.Logic != nil {
		return b.buildClausesWithOp(f.Logic.Items, ctx, f.Logic.Op)
	}

	// Episode context: only field and count filters, direct fields only
	if ctx.isEpisodeCtx {
		return b.episodeFilterForCtx(f, idx)
	}

	// Person context: use person-specific handlers
	if ctx.isPersonCtx {
		return b.personFilterForAlias(f, idx)
	}

	// Character context: use character-specific handlers
	if ctx.isCharacterCtx {
		return b.characterFilterForAlias(f, idx)
	}

	// Main alias context (top-level): use main handlers
	if ctx.alias == b.mainAlias {
		return b.filterToSQLMain(f, idx)
	}

	// Nested alias context (rs, etc.): use alias handlers
	return b.filterForAlias(f, ctx.alias, idx)
}

// episodeFilterForCtx handles filters in episode context (no infobox).
func (b *SQLBuilder) episodeFilterForCtx(f config.Filter, idx int) (string, error) {
	switch {
	case f.Field != nil:
		return b.episodeFieldFilter(f.Field)
	default:
		return "", fmt.Errorf("剧集筛选不支持此条件类型 (index %d)", idx)
	}
}

// filterToSQLMain dispatches a single filter using main-table handlers.
func (b *SQLBuilder) filterToSQLMain(f config.Filter, idx int) (string, error) {
	// Episode target: only field filters are supported
	if b.target == "episode" {
		switch {
		case f.Field != nil:
			return b.episodeFieldFilter(f.Field)
		default:
			return "", fmt.Errorf("剧集筛选不支持此条件类型 (index %d)", idx)
		}
	}

	switch {
	case f.Type != nil:
		return b.typeFilter(f.Type)
	case f.Field != nil:
		return b.fieldFilter(f.Field, b.mainAlias)
	case f.Global != nil:
		return b.globalFilter(f.Global)
	case f.Tag != nil:
		return b.tagFilter(f.Tag)
	case f.MetaTag != nil:
		return b.metaTagFilter(f.MetaTag)
	case f.Relation != nil:
		return b.relationFilter(f.Relation)
	case f.PersonRelation != nil:
		return b.personRelationFilter(f.PersonRelation)
	case f.CharacterRelation != nil:
		return b.characterRelationFilter(f.CharacterRelation)
	case f.Staff != nil:
		return b.staffFilter(f.Staff)
	case f.Character != nil:
		return b.characterFilter(f.Character)
	case f.PersonCharacter != nil:
		return b.personCharacterFilter(f.PersonCharacter)
	case f.CharacterPerson != nil:
		return b.characterPersonFilter(f.CharacterPerson)
	case f.Episode != nil:
		return b.episodeFilter(f.Episode)
	default:
		return "", fmt.Errorf("unknown filter type at index %d", idx)
	}
}

// typeFilter handles type-based filtering.
func (b *SQLBuilder) typeFilter(f *config.TypeFilter) (string, error) {
	col := b.mainAlias + "." + b.tc.typeColumn
	switch v := f.Value.(type) {
	case int:
		return fmt.Sprintf("%s = %d", col, v), nil
	case float64:
		return fmt.Sprintf("%s = %d", col, int(v)), nil
	case string:
		if num, err := strconv.Atoi(v); err == nil {
			return fmt.Sprintf("%s = %d", col, num), nil
		}
		typeNum, ok := model.TypeCNToNum[v]
		if !ok {
			return "", fmt.Errorf("未知的条目类型: %s", v)
		}
		return fmt.Sprintf("%s = %d", col, typeNum), nil
	default:
		return "", fmt.Errorf("type filter value must be int or string, got %T", v)
	}
}

// fieldFilter handles field-based filtering (JSON field or infobox field).
func (b *SQLBuilder) fieldFilter(f *config.FieldFilter, tableAlias string) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	fieldName := f.Field

	// Map "type" to "person_type" for person target
	if b.target == "person" && fieldName == "type" {
		fieldName = "person_type"
	}

	// Handle career as LIST_CONTAINS for person target
	if b.target == "person" && fieldName == "career" {
		switch f.Operator {
		case "regex":
			return fmt.Sprintf("regexp_matches(%s.career::VARCHAR, '%s')", tableAlias, escapeRegex(valueStr)), nil
		case "not_contains":
			return fmt.Sprintf("NOT LIST_CONTAINS(COALESCE(%s.career, []), '%s')", tableAlias, escapeSQLString(valueStr)), nil
		case "empty":
			return fmt.Sprintf("LEN(COALESCE(%s.career, [])) = 0", tableAlias), nil
		default:
			return fmt.Sprintf("LIST_CONTAINS(COALESCE(%s.career, []), '%s')", tableAlias, escapeSQLString(valueStr)), nil
		}
	}

	// Special case: rank 0 means no ranking
	if fieldName == "rank" {
		col := tableAlias + "." + quoteIdent(fieldName)
		switch f.Operator {
		case "empty":
			return fmt.Sprintf("(%s = 0 OR %s IS NULL)", col, col), nil
		case "gt", "gte", "lt", "lte":
			cond, _ := b.buildCondition(col, f.Operator, valueStr)
			return fmt.Sprintf("%s != 0 AND %s", col, cond), nil
		}
	}

	// Determine if this is a direct JSON field or infobox field
	if b.isDirectField(fieldName) {
		return b.buildCondition(tableAlias+"."+quoteIdent(fieldName), f.Operator, valueStr)
	}

	// Special case: 性别=其他 means gender exists and is not 男/♀
	if f.Field == "性别" && valueStr == "其他" && f.Operator == "contains" {
		expr := b.infoboxExtractExpr("性别", tableAlias)
		return fmt.Sprintf("COALESCE(%s, '') != '' AND %s NOT LIKE '%%男%%' AND %s NOT LIKE '%%♂%%' AND %s NOT LIKE '%%女%%' AND %s NOT LIKE '%%♀%%'", expr, expr, expr, expr, expr), nil
	}

	// Infobox field — extract with regex, and apply numeric extraction for comparison ops
	fieldExpr := b.infoboxExtractExpr(f.Field, tableAlias)
	if isNumericOp(f.Operator) {
		fieldExpr = extractNum(fieldExpr)
	}
	return b.buildCondition(fieldExpr, f.Operator, valueStr)
}

// globalFilter searches across all infobox fields.
func (b *SQLBuilder) globalFilter(f *config.GlobalFilter) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	infobox := b.mainAlias + ".infobox"

	switch f.Operator {
	case "regex":
		return fmt.Sprintf("regexp_matches(%s, '%s')", infobox, escapeRegex(valueStr)), nil
	case "contains":
		return fmt.Sprintf("%s LIKE '%%%s%%'", infobox, escapeLike(valueStr)), nil
	case "eq":
		return fmt.Sprintf("%s = '%s'", infobox, escapeSQLString(valueStr)), nil
	default:
		return "", fmt.Errorf("global filter: unsupported operator %q", f.Operator)
	}
}

// tagFilter handles tag-based filtering.
func (b *SQLBuilder) tagFilter(f *config.TagFilter) (string, error) {
	switch f.Operator {
	case "contains", "eq":
		cond := fmt.Sprintf("EXISTS (SELECT 1 FROM (SELECT UNNEST(%s.tags) AS t) WHERE t.name = '%s')",
			b.mainAlias, escapeSQLString(f.Value))
		if f.Negate {
			return "NOT " + cond, nil
		}
		return cond, nil
	default:
		return "", fmt.Errorf("tag filter: unsupported operator %q", f.Operator)
	}
}

// metaTagFilter handles meta tag filtering.
// meta_tags is a simple string array (unlike tags which is array of {name, count} objects).
// Some entries have meta_tags as null, so we COALESCE to empty list.
func (b *SQLBuilder) metaTagFilter(f *config.TagFilter) (string, error) {
	switch f.Operator {
	case "contains", "eq":
		// DuckDB: LIST_CONTAINS for simple arrays
		// COALESCE to handle NULL meta_tags (some entries don't have meta tags)
		cond := fmt.Sprintf("LIST_CONTAINS(COALESCE(%s.meta_tags, []), '%s')", b.mainAlias, escapeSQLString(f.Value))
		if f.Negate {
			return "NOT " + cond, nil
		}
		return cond, nil
	default:
		return "", fmt.Errorf("meta_tag filter: unsupported operator %q", f.Operator)
	}
}

// relationFilter handles relation-based filtering.
func (b *SQLBuilder) relationFilter(f *config.RelationFilter) (string, error) {
	anyType := f.Type == "" || f.Type == "任意"
	extra := "TRUE"
	if !anyType {
		relIDs := b.getRelationIDsForName(f.Type)
		if len(relIDs) == 0 {
			return "", fmt.Errorf("未找到关系类型: %s", f.Type)
		}
		extra = fmt.Sprintf("r.relation_type IN (%s)", intListToSQL(relIDs))
	}

	var relatedWhere string
	var relatedJoin string
	if len(f.Conditions) > 0 {
		var err error
		relatedWhere, err = b.buildWhereForAlias(f.Conditions, "rs")
		if err != nil {
			return "", fmt.Errorf("relation condition: %w", err)
		}
		relatedJoin = "LEFT JOIN subjects rs ON r.related_subject_id = rs.id"
	}

	return b.manyToManyFilter(manyToManyConfig{
		junction:       "subject_relations",
		alias:          "r",
		mainAlias:      b.mainAlias,
		mainPK:         "id",
		junctionMainFK: "subject_id",
		relatedAlias:   "rs",
		relatedTable:   "subjects",
		relatedPK:      "id",
		relatedFK:      "related_subject_id",
		extraCond:      extra,
		relatedWhere:   relatedWhere,
		relatedJoin:    relatedJoin,
		mode:           f.Mode,
		countOp:        f.CountOp,
		countVal:       f.CountVal,
	})
}

// personRelationFilter handles person-to-person relation filtering (person_type=prsn).
func (b *SQLBuilder) personRelationFilter(f *config.PersonRelationFilter) (string, error) {
	if b.target != "person" {
		return "", fmt.Errorf("person_relation filter only supported for person target")
	}

	anyType := f.Type == "" || f.Type == "任意"
	extra := "TRUE"
	if !anyType {
		relIDs := b.getPersonRelationIDsForName(f.Type)
		if len(relIDs) == 0 {
			return "", fmt.Errorf("未找到人物关系类型: %s", f.Type)
		}
		extra = fmt.Sprintf("pr.relation_type IN (%s)", intListToSQL(relIDs))
	}

	var relatedWhere string
	var relatedJoin string
	if len(f.Conditions) > 0 {
		var err error
		relatedWhere, err = b.buildPersonRelationWhereForAlias(f.Conditions)
		if err != nil {
			return "", fmt.Errorf("person_relation condition: %w", err)
		}
		relatedJoin = "LEFT JOIN persons rp ON pr.related_person_id = rp.person_id"
	}

	return b.manyToManyFilter(manyToManyConfig{
		junction:       "person_relations",
		alias:          "pr",
		mainAlias:      b.mainAlias,
		mainPK:         "person_id",
		junctionMainFK: "person_id",
		relatedAlias:   "rp",
		relatedTable:   "persons",
		relatedPK:      "person_id",
		relatedFK:      "related_person_id",
		extraCond:      extra,
		relatedWhere:   relatedWhere,
		relatedJoin:    relatedJoin,
		mode:           f.Mode,
		countOp:        f.CountOp,
		countVal:       f.CountVal,
	})
}

// getPersonRelationIDsForName returns all person relation type IDs for a given Chinese name.
func (b *SQLBuilder) getPersonRelationIDsForName(name string) []int {
	var ids []int
	for id, cnName := range model.PersonRelationTypes {
		if cnName == name {
			ids = append(ids, id)
		}
	}
	return ids
}

// buildPersonRelationWhereForAlias generates WHERE clauses for related person conditions.
func (b *SQLBuilder) buildPersonRelationWhereForAlias(filters []config.Filter) (string, error) {
	return b.buildClauses(filters, clauseContext{alias: "rp", isPersonCtx: true})
}

// characterRelationFilter handles character-to-character relation filtering (person_type=crt).
func (b *SQLBuilder) characterRelationFilter(f *config.CharacterRelationFilter) (string, error) {
	if b.target != "character" {
		return "", fmt.Errorf("character_relation filter only supported for character target")
	}

	anyType := f.Type == "" || f.Type == "任意"
	extra := "TRUE"
	if !anyType {
		relIDs := b.getCharacterRelationIDsForName(f.Type)
		if len(relIDs) == 0 {
			return "", fmt.Errorf("未找到角色关系类型: %s", f.Type)
		}
		extra = fmt.Sprintf("cr.relation_type IN (%s)", intListToSQL(relIDs))
	}

	var relatedWhere string
	var relatedJoin string
	if len(f.Conditions) > 0 {
		var err error
		relatedWhere, err = b.buildCharacterRelationWhereForAlias(f.Conditions)
		if err != nil {
			return "", fmt.Errorf("character_relation condition: %w", err)
		}
		relatedJoin = "LEFT JOIN characters rc ON cr.related_person_id = rc.character_id"
	}

	return b.manyToManyFilter(manyToManyConfig{
		junction:       "character_relations",
		alias:          "cr",
		mainAlias:      b.mainAlias,
		mainPK:         "character_id",
		junctionMainFK: "person_id",
		relatedAlias:   "rc",
		relatedTable:   "characters",
		relatedPK:      "character_id",
		relatedFK:      "related_person_id",
		extraCond:      extra,
		relatedWhere:   relatedWhere,
		relatedJoin:    relatedJoin,
		mode:           f.Mode,
		countOp:        f.CountOp,
		countVal:       f.CountVal,
	})
}

// getCharacterRelationIDsForName returns all character relation type IDs for a given Chinese name.
func (b *SQLBuilder) getCharacterRelationIDsForName(name string) []int {
	var ids []int
	for id, cnName := range model.CharacterRelationTypes {
		if cnName == name {
			ids = append(ids, id)
		}
	}
	return ids
}

// buildCharacterRelationWhereForAlias generates WHERE clauses for related character conditions.
func (b *SQLBuilder) buildCharacterRelationWhereForAlias(filters []config.Filter) (string, error) {
	return b.buildClauses(filters, clauseContext{alias: "rc", isCharacterCtx: true})
}

// buildWhereForAlias generates WHERE clauses for a given table alias, supporting all filter types.
// Used for nested filtering on related subjects (rs), persons (sp), or episodes (e).
func (b *SQLBuilder) buildWhereForAlias(filters []config.Filter, alias string) (string, error) {
	return b.buildClauses(filters, clauseContext{alias: alias})
}

// filterForAlias generates SQL for a single filter on a given alias.
func (b *SQLBuilder) filterForAlias(f config.Filter, alias string, idx int) (string, error) {
	switch {
	case f.Type != nil:
		return b.typeFilterForAlias(f.Type, alias)
	case f.Field != nil:
		return b.fieldFilterForAlias(f.Field, alias)
	case f.Global != nil:
		return b.globalFilterForAlias(f.Global, alias)
	case f.Tag != nil:
		return b.tagFilterForAlias(f.Tag, alias)
	case f.MetaTag != nil:
		return b.metaTagFilterForAlias(f.MetaTag, alias)
	default:
		return "", fmt.Errorf("unsupported nested filter type at index %d", idx)
	}
}

func (b *SQLBuilder) typeFilterForAlias(f *config.TypeFilter, alias string) (string, error) {
	switch v := f.Value.(type) {
	case int:
		return fmt.Sprintf("%s.type = %d", alias, v), nil
	case float64:
		return fmt.Sprintf("%s.type = %d", alias, int(v)), nil
	case string:
		if num, err := strconv.Atoi(v); err == nil {
			return fmt.Sprintf("%s.type = %d", alias, num), nil
		}
		typeNum, ok := model.TypeCNToNum[v]
		if !ok {
			return "", fmt.Errorf("未知的条目类型: %s", v)
		}
		return fmt.Sprintf("%s.type = %d", alias, typeNum), nil
	default:
		return "", fmt.Errorf("type filter value must be int or string, got %T", v)
	}
}

func (b *SQLBuilder) fieldFilterForAlias(f *config.FieldFilter, alias string) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	// Special case: rank 0 means no ranking
	if f.Field == "rank" {
		col := alias + "." + quoteIdent("rank")
		switch f.Operator {
		case "empty":
			return fmt.Sprintf("(%s = 0 OR %s IS NULL)", col, col), nil
		case "gt", "gte", "lt", "lte":
			cond, _ := b.buildCondition(col, f.Operator, valueStr)
			return fmt.Sprintf("%s != 0 AND %s", col, cond), nil
		}
	}
	if b.isDirectField(f.Field) {
		return b.buildCondition(alias+"."+quoteIdent(f.Field), f.Operator, valueStr)
	}
	fieldExpr := b.infoboxExtractExpr(f.Field, alias)
	if isNumericOp(f.Operator) {
		fieldExpr = extractNum(fieldExpr)
	}
	return b.buildCondition(fieldExpr, f.Operator, valueStr)
}

func (b *SQLBuilder) globalFilterForAlias(f *config.GlobalFilter, alias string) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	switch f.Operator {
	case "regex":
		return fmt.Sprintf("regexp_matches(%s.infobox, '%s')", alias, escapeRegex(valueStr)), nil
	case "contains":
		return fmt.Sprintf("%s.infobox LIKE '%%%s%%'", alias, escapeLike(valueStr)), nil
	default:
		return "", fmt.Errorf("global filter: unsupported operator %q", f.Operator)
	}
}

func (b *SQLBuilder) tagFilterForAlias(f *config.TagFilter, alias string) (string, error) {
	cond := fmt.Sprintf("EXISTS (SELECT 1 FROM (SELECT UNNEST(%s.tags) AS t) WHERE t.name = '%s')",
		alias, escapeSQLString(f.Value))
	if f.Negate {
		return "NOT " + cond, nil
	}
	return cond, nil
}

func (b *SQLBuilder) metaTagFilterForAlias(f *config.TagFilter, alias string) (string, error) {
	cond := fmt.Sprintf("LIST_CONTAINS(COALESCE(%s.meta_tags, []), '%s')", alias, escapeSQLString(f.Value))
	if f.Negate {
		return "NOT " + cond, nil
	}
	return cond, nil
}

// staffFilter handles staff/person-based filtering.
func (b *SQLBuilder) staffFilter(f *config.StaffFilter) (string, error) {
	nested := getNestedConfig(b.target, "staff")
	if nested == nil {
		return "", fmt.Errorf("staff filter not supported for target %s", b.target)
	}
	ja := nested.junctionTable // junction alias (use full table name)

	// Resolve position name to IDs; empty or "任意" means any position
	anyPos := f.Position == "" || f.Position == "任意"
	var posCond string
	if anyPos {
		posCond = "TRUE"
	} else {
		posIDs := b.getPositionIDsForName(f.Position)
		if len(posIDs) == 0 {
			return "", fmt.Errorf("未找到职位类型: %s", f.Position)
		}
		posCond = fmt.Sprintf("%s.position IN (%s)", ja, intListToSQL(posIDs))
	}

	// Build appear_eps condition (subject target only)
	appearEpsCond := "TRUE"
	if f.AppearEps != nil {
		var epsErr error
		appearEpsCond, epsErr = b.buildCondition(ja+".appear_eps", f.AppearEps.Operator, fmt.Sprintf("%v", f.AppearEps.Value))
		if epsErr != nil {
			return "", fmt.Errorf("appear_eps condition: %w", epsErr)
		}
	}

	// Combine extra conditions
	extra := posCond
	if appearEpsCond != "TRUE" {
		if extra == "TRUE" {
			extra = appearEpsCond
		} else {
			extra = extra + " AND " + appearEpsCond
		}
	}

	// Build related entity conditions
	var relatedWhere string
	var relatedJoin string
	if b.target == "person" {
		// Person target: conditions on associated subjects
		if len(f.Conditions) > 0 {
			var err error
			relatedWhere, err = b.buildWhereForAlias(f.Conditions, "rs")
			if err != nil {
				return "", fmt.Errorf("staff condition: %w", err)
			}
		}
		relatedJoin = fmt.Sprintf("LEFT JOIN %s %s ON %s.%s = %s.%s",
			nested.relatedTable, nested.relatedAlias, ja, nested.relatedFK, nested.relatedAlias, nested.relatedPK)
	} else {
		// Subject target: conditions on associated persons
		if len(f.Conditions) > 0 {
			var err error
			relatedWhere, err = b.buildPersonWhereForAlias(f.Conditions)
			if err != nil {
				return "", fmt.Errorf("staff condition: %w", err)
			}
			relatedJoin = fmt.Sprintf("LEFT JOIN %s %s ON %s.%s = %s.%s",
				nested.relatedTable, nested.relatedAlias, ja, nested.relatedFK, nested.relatedAlias, nested.relatedPK)
		}
	}

	return b.manyToManyFilter(manyToManyConfig{
		junction:       nested.junctionTable,
		mainAlias:      b.mainAlias,
		mainPK:         nested.mainPK,
		junctionMainFK: nested.junctionMainFK,
		relatedAlias:   nested.relatedAlias,
		relatedTable:   nested.relatedTable,
		relatedFK:      nested.relatedFK,
		extraCond:      extra,
		relatedWhere:   relatedWhere,
		relatedJoin:    relatedJoin,
		mode:           f.Mode,
		countOp:        f.CountOp,
		countVal:       f.CountVal,
	})
}

// characterFilter handles character-based filtering for subject queries.
func (b *SQLBuilder) characterFilter(f *config.CharacterFilter) (string, error) {
	nested := getNestedConfig(b.target, "character")
	if nested == nil {
		return "", fmt.Errorf("character filter not supported for target %s", b.target)
	}
	ja := nested.junctionTable // junction alias (use full table name)

	// Resolve association type name to ID; empty or "任意" means any type
	anyType := f.Type == "" || f.Type == "任意"
	var typeCond string
	if anyType {
		typeCond = "TRUE"
	} else {
		typeID, found := b.getCharacterAssociationTypeID(f.Type)
		if !found {
			return "", fmt.Errorf("未找到角色关联类型: %s", f.Type)
		}
		typeCond = fmt.Sprintf("%s.type = %d", ja, typeID)
	}

	// Build related entity conditions
	var relatedWhere string
	var relatedJoin string
	if b.target == "character" {
		// Character target: conditions on associated subjects
		if len(f.Conditions) > 0 {
			var err error
			relatedWhere, err = b.buildWhereForAlias(f.Conditions, "rs")
			if err != nil {
				return "", fmt.Errorf("character condition: %w", err)
			}
		}
		relatedJoin = fmt.Sprintf("LEFT JOIN %s %s ON %s.%s = %s.%s",
			nested.relatedTable, nested.relatedAlias, ja, nested.relatedFK, nested.relatedAlias, nested.relatedPK)
	} else {
		// Subject target: conditions on associated characters
		if len(f.Conditions) > 0 {
			var err error
			relatedWhere, err = b.buildCharacterWhereForAlias(f.Conditions)
			if err != nil {
				return "", fmt.Errorf("character condition: %w", err)
			}
			relatedJoin = fmt.Sprintf("LEFT JOIN %s %s ON %s.%s = %s.%s",
				nested.relatedTable, nested.relatedAlias, ja, nested.relatedFK, nested.relatedAlias, nested.relatedPK)
		}
	}

	return b.manyToManyFilter(manyToManyConfig{
		junction:       nested.junctionTable,
		mainAlias:      b.mainAlias,
		mainPK:         nested.mainPK,
		junctionMainFK: nested.junctionMainFK,
		relatedAlias:   nested.relatedAlias,
		relatedTable:   nested.relatedTable,
		relatedFK:      nested.relatedFK,
		extraCond:      typeCond,
		relatedWhere:   relatedWhere,
		relatedJoin:    relatedJoin,
		mode:           f.Mode,
		countOp:        f.CountOp,
		countVal:       f.CountVal,
	})
}

// getCharacterAssociationTypeID returns the ID for a Chinese association type name.
func (b *SQLBuilder) getCharacterAssociationTypeID(name string) (int, bool) {
	for id, cnName := range model.CharacterAssociationTypes {
		if cnName == name {
			return id, true
		}
	}
	return 0, false
}

// buildCharacterWhereForAlias generates WHERE clauses for character-level nested conditions.
func (b *SQLBuilder) buildCharacterWhereForAlias(filters []config.Filter) (string, error) {
	return b.buildClauses(filters, clauseContext{alias: "c", isCharacterCtx: true})
}

// personCharacterFilter filters persons by their associated characters (via person_characters).
func (b *SQLBuilder) personCharacterFilter(f *config.PersonCharacterFilter) (string, error) {
	if b.target != "person" {
		return "", fmt.Errorf("person_character filter only supported for person target")
	}

	anyType := f.Type == "" || f.Type == "任意"
	var typeCond string
	if anyType {
		typeCond = "TRUE"
	} else {
		typeID, found := b.getPersonCharacterTypeID(f.Type)
		if !found {
			return "", fmt.Errorf("未找到出演类型: %s", f.Type)
		}
		typeCond = fmt.Sprintf("pc.type = %d", typeID)
	}

	// Build character-level conditions
	sideWhere := "TRUE"
	if len(f.Conditions) > 0 {
		var err error
		sideWhere, err = b.buildPersonCharCharacterWhere(f.Conditions)
		if err != nil {
			return "", fmt.Errorf("person_character condition: %w", err)
		}
	}

	// Build subject-level conditions (相关条目)
	subjectWhere := "TRUE"
	if len(f.SubjectConditions) > 0 {
		var err error
		subjectWhere, err = b.buildWhereForAlias(f.SubjectConditions, "rs")
		if err != nil {
			return "", fmt.Errorf("person_character subject condition: %w", err)
		}
	}

	// Build side join
	sideJoin := ""
	if sideWhere != "TRUE" {
		sideJoin = "LEFT JOIN characters c ON pc.character_id = c.character_id"
	}

	return b.threeWayFilter(threeWayConfig{
		mainAlias:        "p",
		mainFK:           "person_id",
		sideAlias:        "c",
		sideTable:        "characters",
		sideFK:           "character_id",
		sideCtx:          clauseContext{alias: "c", isCharacterCtx: true},
		typeCond:         typeCond,
		mode:             f.Mode,
		countOp:          f.CountOp,
		countVal:         f.CountVal,
		sideWhere:        sideWhere,
		sideJoin:         sideJoin,
		subjectMode:      f.SubjectMode,
		subjectCountOp:   f.SubjectCountOp,
		subjectCountVal:  f.SubjectCountVal,
		subjectWhere:     subjectWhere,
		countDistinctCol: "character_id",
	})
}

// buildPersonCharCharacterWhere generates WHERE clauses for character conditions in person_characters context.
func (b *SQLBuilder) buildPersonCharCharacterWhere(filters []config.Filter) (string, error) {
	return b.buildClauses(filters, clauseContext{alias: "c", isCharacterCtx: true})
}

// characterPersonFilter filters characters by their associated persons (via person_characters).
func (b *SQLBuilder) characterPersonFilter(f *config.CharacterPersonFilter) (string, error) {
	if b.target != "character" {
		return "", fmt.Errorf("character_person filter only supported for character target")
	}

	anyType := f.Type == "" || f.Type == "任意"
	var typeCond string
	if anyType {
		typeCond = "TRUE"
	} else {
		typeID, found := b.getPersonCharacterTypeID(f.Type)
		if !found {
			return "", fmt.Errorf("未找到出演类型: %s", f.Type)
		}
		typeCond = fmt.Sprintf("pc.type = %d", typeID)
	}

	// Build person-level conditions
	sideWhere := "TRUE"
	if len(f.Conditions) > 0 {
		var err error
		sideWhere, err = b.buildCharPersonPersonWhere(f.Conditions)
		if err != nil {
			return "", fmt.Errorf("character_person condition: %w", err)
		}
	}

	// Build subject-level conditions (相关条目)
	subjectWhere := "TRUE"
	if len(f.SubjectConditions) > 0 {
		var err error
		subjectWhere, err = b.buildWhereForAlias(f.SubjectConditions, "rs")
		if err != nil {
			return "", fmt.Errorf("character_person subject condition: %w", err)
		}
	}

	// Build side join
	sideJoin := ""
	if sideWhere != "TRUE" {
		sideJoin = "LEFT JOIN persons p ON pc.person_id = p.person_id"
	}

	return b.threeWayFilter(threeWayConfig{
		mainAlias:        "c",
		mainFK:           "character_id",
		sideAlias:        "p",
		sideTable:        "persons",
		sideFK:           "person_id",
		sideCtx:          clauseContext{alias: "p", isPersonCtx: true},
		typeCond:         typeCond,
		mode:             f.Mode,
		countOp:          f.CountOp,
		countVal:         f.CountVal,
		sideWhere:        sideWhere,
		sideJoin:         sideJoin,
		subjectMode:      f.SubjectMode,
		subjectCountOp:   f.SubjectCountOp,
		subjectCountVal:  f.SubjectCountVal,
		subjectWhere:     subjectWhere,
		countDistinctCol: "person_id",
	})
}

// buildCharPersonPersonWhere generates WHERE clauses for person conditions in character_person context.
func (b *SQLBuilder) buildCharPersonPersonWhere(filters []config.Filter) (string, error) {
	return b.buildClauses(filters, clauseContext{alias: "p", isPersonCtx: true})
}

// getPersonCharacterTypeID returns the ID for a Chinese CV type name.
func (b *SQLBuilder) getPersonCharacterTypeID(name string) (int, bool) {
	for id, cnName := range model.PersonCharacterTypes {
		if cnName == name {
			return id, true
		}
	}
	return 0, false
}

// buildPersonWhereForAlias generates WHERE clauses for person-level nested conditions.
func (b *SQLBuilder) buildPersonWhereForAlias(filters []config.Filter) (string, error) {
	return b.buildClauses(filters, clauseContext{alias: "p", isPersonCtx: true})
}

// personFilterForAlias dispatches a single filter for person-level conditions.
// filterForNestedContext dispatches a single filter for nested entity conditions (person/character).
func (b *SQLBuilder) filterForNestedContext(f config.Filter, idx int, nestedAlias string, fieldMap map[string]string, typeCol string) (string, error) {
	switch {
	case f.Field != nil:
		return b.fieldFilterForNested(f.Field, nestedAlias, fieldMap)
	case f.Global != nil:
		return b.globalFilterForNested(f.Global, nestedAlias)
	case f.Type != nil:
		if typeCol == "" {
			return "", fmt.Errorf("此上下文不支持类型筛选 (index %d)", idx)
		}
		return fmt.Sprintf("%s = '%s'", typeCol, escapeSQLString(fmt.Sprintf("%v", f.Type.Value))), nil
	default:
		return "", fmt.Errorf("此上下文不支持此条件类型 (index %d)", idx)
	}
}

// fieldFilterForNested builds a field filter for a nested entity context using a field map.
func (b *SQLBuilder) fieldFilterForNested(f *config.FieldFilter, nestedAlias string, fieldMap map[string]string) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)

	// Check field map for direct column mapping
	if expr, ok := fieldMap[f.Field]; ok {
		return b.buildCondition(expr, f.Operator, valueStr)
	}

	// Special case: career field (person only) — LIST_CONTAINS
	if f.Field == "career" {
		if f.Operator == "regex" {
			return fmt.Sprintf("regexp_matches(%s.career::VARCHAR, '%s')", nestedAlias, escapeRegex(valueStr)), nil
		}
		return fmt.Sprintf("LIST_CONTAINS(COALESCE(%s.career, []), '%s')", nestedAlias, escapeSQLString(valueStr)), nil
	}

	// Special case: 性别=其他
	if f.Field == "性别" && valueStr == "其他" && f.Operator == "contains" {
		expr := b.infoboxExtractExpr("性别", nestedAlias)
		return fmt.Sprintf("COALESCE(%s, '') != '' AND %s NOT LIKE '%%男%%' AND %s NOT LIKE '%%♂%%' AND %s NOT LIKE '%%女%%' AND %s NOT LIKE '%%♀%%'", expr, expr, expr, expr, expr), nil
	}

	// Default: infobox field extraction
	fieldExpr := b.infoboxExtractExpr(f.Field, nestedAlias)
	if isNumericOp(f.Operator) {
		fieldExpr = extractNum(fieldExpr)
	}
	return b.buildCondition(fieldExpr, f.Operator, valueStr)
}

// globalFilterForNested builds a global search on a nested entity's infobox.
func (b *SQLBuilder) globalFilterForNested(f *config.GlobalFilter, nestedAlias string) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	switch f.Operator {
	case "regex":
		return fmt.Sprintf("regexp_matches(%s.infobox, '%s')", nestedAlias, escapeRegex(valueStr)), nil
	case "contains":
		return fmt.Sprintf("%s.infobox LIKE '%%%s%%'", nestedAlias, escapeLike(valueStr)), nil
	default:
		return "", fmt.Errorf("global filter: unsupported operator %q", f.Operator)
	}
}

// personFilterForAlias dispatches a single filter for person-level conditions.
func (b *SQLBuilder) personFilterForAlias(f config.Filter, idx int) (string, error) {
	return b.filterForNestedContext(f, idx, "p", b.tc.nestedFieldMap, b.tc.nestedTypeCol)
}

// characterFilterForAlias dispatches a single filter for character-level conditions.
func (b *SQLBuilder) characterFilterForAlias(f config.Filter, idx int) (string, error) {
	return b.filterForNestedContext(f, idx, "c", b.tc.nestedFieldMap, b.tc.nestedTypeCol)
}

// episodeFilter handles episode-based filtering.
func (b *SQLBuilder) episodeFilter(f *config.EpisodeFilter) (string, error) {
	// New: logic tree mode
	if f.Logic != nil {
		episodeWhere, err := b.buildClausesWithOp(f.Logic.Items, clauseContext{alias: "e", isEpisodeCtx: true}, f.Logic.Op)
		if err != nil {
			return "", fmt.Errorf("episode logic: %w", err)
		}
		if f.Mode == "all" {
			return fmt.Sprintf(
				`EXISTS (SELECT 1 FROM episodes e WHERE e.subject_id = s.id) AND
				 (SELECT COUNT(*) FROM episodes e WHERE e.subject_id = s.id AND %s) =
				 (SELECT COUNT(*) FROM episodes e WHERE e.subject_id = s.id)`,
				episodeWhere), nil
		}
		if f.Mode == "count" {
			countExpr := fmt.Sprintf(
				"(SELECT COUNT(*) FROM episodes e WHERE e.subject_id = s.id AND %s)",
				episodeWhere)
			return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
		}
		return fmt.Sprintf(
			"EXISTS (SELECT 1 FROM episodes e WHERE e.subject_id = s.id AND %s)",
			episodeWhere), nil
	}

	// Legacy: flat field conditions
	var subClauses []string

	var normalConds []string
	for _, cond := range f.Conditions {
		if cond.Field == "count" {
			continue
		}
		condSQL, err := b.episodeFieldFilter(&cond)
		if err != nil {
			return "", fmt.Errorf("episode condition: %w", err)
		}
		normalConds = append(normalConds, condSQL)
	}

	if len(normalConds) > 0 {
		subClauses = append(subClauses, strings.Join(normalConds, " AND "))
	}

	// Count condition
	for _, cond := range f.Conditions {
		if cond.Field == "count" {
			countSQL, err := b.buildCondition(
				"(SELECT COUNT(*) FROM episodes e2 WHERE e2.subject_id = s.id)",
				cond.Operator,
				fmt.Sprintf("%v", cond.Value),
			)
			if err != nil {
				return "", err
			}
			subClauses = append(subClauses, countSQL)
		}
	}

	subWhere := strings.Join(subClauses, " AND ")
	if subWhere == "" {
		return "TRUE", nil
	}

	if f.Mode == "all" {
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM episodes e WHERE e.subject_id = s.id) AND
			 (SELECT COUNT(*) FROM episodes e WHERE e.subject_id = s.id AND %s) =
			 (SELECT COUNT(*) FROM episodes e WHERE e.subject_id = s.id)`,
			strings.Join(normalConds, " AND ")), nil
	}

	if f.Mode == "count" {
		countWhere := subWhere
		if countWhere == "" {
			countWhere = "TRUE"
		}
		countExpr := fmt.Sprintf(
			"(SELECT COUNT(*) FROM episodes e WHERE e.subject_id = s.id AND %s)",
			countWhere)
		return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
	}

	return fmt.Sprintf(
		"EXISTS (SELECT 1 FROM episodes e WHERE e.subject_id = s.id AND %s)",
		subWhere), nil
}

// episodeFieldFilter builds a field filter on episode data.
func (b *SQLBuilder) episodeFieldFilter(f *config.FieldFilter) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	switch f.Field {
	case "name", "name_cn", "description", "airdate", "duration", "sort", "disc", "id", "subject_id":
		return b.buildCondition("e."+quoteIdent(f.Field), f.Operator, valueStr)
	case "type":
		// Map Chinese episode type names to numbers
		epTypes := map[string]int{
			"本篇": 0, "特别篇": 1, "SP": 1, "sp": 1,
			"OP": 2, "op": 2, "ED": 3, "ed": 3,
			"CM": 4, "cm": 4, "MAD": 5, "mad": 5, "其他": 6,
		}
		if typeNum, ok := epTypes[valueStr]; ok {
			return b.buildCondition("e.type", f.Operator, fmt.Sprintf("%d", typeNum))
		}
		return b.buildCondition("e.type", f.Operator, valueStr)
	default:
		return "", fmt.Errorf("unknown episode field: %s", f.Field)
	}
}

// buildCondition generates a SQL comparison expression.
func (b *SQLBuilder) buildCondition(expr, op, value string) (string, error) {
	switch op {
	case "eq":
		return fmt.Sprintf("CAST(%s AS VARCHAR) = '%s'", expr, escapeSQLString(value)), nil
	case "contains":
		return fmt.Sprintf("CAST(%s AS VARCHAR) LIKE '%%%s%%'", expr, escapeLike(value)), nil
	case "not_contains":
		return fmt.Sprintf("CAST(%s AS VARCHAR) NOT LIKE '%%%s%%'", expr, escapeLike(value)), nil
	case "regex":
		// regexp_matches auto-casts first arg to VARCHAR
		return fmt.Sprintf("regexp_matches(%s, '%s')", expr, sqlEscapeRegexString(value)), nil
	case "empty":
		return fmt.Sprintf("COALESCE(CAST(%s AS VARCHAR), '') = ''", expr), nil
	case "gt":
		return fmt.Sprintf("CAST(%s AS DOUBLE) > %s", expr, b.safeNum(value)), nil
	case "gte":
		return fmt.Sprintf("CAST(%s AS DOUBLE) >= %s", expr, b.safeNum(value)), nil
	case "lt":
		return fmt.Sprintf("CAST(%s AS DOUBLE) < %s", expr, b.safeNum(value)), nil
	case "lte":
		return fmt.Sprintf("CAST(%s AS DOUBLE) <= %s", expr, b.safeNum(value)), nil
	case "before":
		return fmt.Sprintf("%s < CAST('%s' AS DATE)", normalizeDate(expr), escapeSQLString(value)), nil
	case "after":
		return fmt.Sprintf("%s > CAST('%s' AS DATE)", normalizeDate(expr), escapeSQLString(value)), nil
	default:
		return "", fmt.Errorf("unknown operator: %q (supported: eq, contains, regex, gt, gte, lt, lte, before, after)", op)
	}
}

// isNumericOp returns true if the operator performs numeric comparison.
func isNumericOp(op string) bool {
	switch op {
	case "gt", "gte", "lt", "lte":
		return true
	}
	return false
}

// extractNum wraps an expression to safely extract a numeric value from a string.
// Handles values like "NT$160", "1,200円", "JPY 3,980", "17.00." → 160, 1200, 3980, 17.0.
// Uses TRY_CAST to silently return NULL for unparseable values instead of throwing errors.
func extractNum(expr string) string {
	return fmt.Sprintf(
		"TRY_CAST(NULLIF(REPLACE(regexp_extract(%s, '(\\d[\\d,]*(?:\\.\\d+)?)', 1), ',', ''), '') AS DOUBLE)",
		expr,
	)
}

// normalizeDate wraps an expression to safely parse various date formats.
// Handles: "2007-12-15", "2007-12", "2007年12月15日", "2007年12月", "2007年"
// All partial dates default to the 1st. Invalid dates return NULL via TRY_CAST.
func normalizeDate(expr string) string {
	// Replace Chinese date markers and trim; TRY_CAST handles trailing control chars
	normalized := fmt.Sprintf(
		"replace(replace(replace(TRIM(%s), '年', '-'), '月', '-'), '日', '')",
		expr,
	)
	padded := fmt.Sprintf(
		"CASE "+
			"WHEN regexp_matches(%[1]s, '^\\d{4}$') THEN %[1]s || '-01-01' "+
			"WHEN regexp_matches(%[1]s, '^\\d{4}-\\d{1,2}$') THEN %[1]s || '-01' "+
			"ELSE %[1]s END",
		normalized,
	)
	return fmt.Sprintf("TRY_CAST(%s AS DATE)", padded)
}

func (b *SQLBuilder) buildSelect() []string {
	var cols []string
	if b.cfg.Output != nil {
		cols = b.cfg.Output.Columns
	}
	a := b.mainAlias
	tc := b.tc

	if len(cols) == 0 {
		result := make([]string, len(tc.defaultCols))
		for i, c := range tc.defaultCols {
			result[i] = a + "." + c
		}
		return result
	}

	var result []string
	for _, col := range cols {
		switch {
		case col == "id" || col == "ID":
			result = append(result, a+"."+tc.idColumn+" as id")
		case col == "subject_id" && b.target == "episode":
			result = append(result, a+".subject_id")
		case col == "type" && tc.typeColumn != "type":
			result = append(result, a+"."+quoteIdent(tc.typeColumn)+" AS type")
		case b.isDirectField(col):
			result = append(result, a+"."+quoteIdent(col))
		case col == "name_cn" && b.target == "person":
			result = append(result, a+".name AS name_cn")
		default:
			expr := b.infoboxExtractExpr(col, a)
			result = append(result, fmt.Sprintf("%s AS \"%s\"", expr, col))
		}
	}
	return result
}

func (b *SQLBuilder) buildJoins() []string {
	// With CTEs, we don't need explicit JOINs in the main query
	// Relations, persons, and episodes are accessed via subqueries
	return nil
}

var dateFields = map[string]bool{
	"date": true, "airdate": true,
	"生日": true, "播出日期": true, "播放开始": true, "播放结束": true, "发售日": true,
}

func (b *SQLBuilder) buildOrderBy() string {
	if len(b.cfg.Sort) == 0 {
		return ""
	}

	a := b.mainAlias
	var parts []string
	for _, s := range b.cfg.Sort {
		dir := "ASC"
		if s.Direction == "desc" {
			dir = "DESC"
		}

		var expr string
		if b.isDirectField(s.Field) {
			expr = a + "." + quoteIdent(s.Field)
		} else {
			expr = b.infoboxExtractExpr(s.Field, a)
		}
		if dateFields[s.Field] {
			expr = normalizeDate(expr)
		}
		parts = append(parts, fmt.Sprintf("%s %s", expr, dir))
	}
	return strings.Join(parts, ", ")
}

// infoboxExtractExpr generates a DuckDB expression to extract a field value from infobox.
func (b *SQLBuilder) infoboxExtractExpr(fieldName, alias string) string {
	// Build regex to extract |fieldName: value or |fieldName= value
	// The regex matches: |fieldName :/= value (until |, }}, newline, or end)
	// Only escape the field name; the rest of the pattern is literal
	escapedField := regexEscapeLiteral(fieldName)
	pattern := fmt.Sprintf(`(?i)\|%s\s*[:=]\s*([^|}\n]*)`, escapedField)
	return fmt.Sprintf("regexp_extract(%s.infobox, '%s', 1)", alias, sqlEscapeRegexString(pattern))
}

// regexEscapeLiteral escapes a literal string for use inside a regex pattern.
// Only escapes characters that are regex meta-characters.
func regexEscapeLiteral(s string) string {
	// RE2 meta-characters: . * + ? ( ) [ ] { } \ ^ $ |
	var result strings.Builder
	for _, ch := range s {
		switch ch {
		case '.', '*', '+', '?', '(', ')', '[', ']', '{', '}', '\\', '^', '$', '|':
			result.WriteRune('\\')
			result.WriteRune(ch)
		default:
			result.WriteRune(ch)
		}
	}
	return result.String()
}

// sqlEscapeRegexString escapes a regex pattern string for use in a SQL string literal.
// Only needs to escape single quotes (since the pattern is in single-quoted SQL string).
func sqlEscapeRegexString(s string) string {
	return strings.ReplaceAll(s, "'", "''")
}

// getRelationIDsForName returns all relation type IDs for a given Chinese name.
// A name may map to different IDs across different subject types.
func (b *SQLBuilder) getRelationIDsForName(name string) []int {
	seen := make(map[int]bool)
	var ids []int
	for _, relMap := range model.RelationTypes {
		for id, cnName := range relMap {
			if cnName == name && !seen[id] {
				ids = append(ids, id)
				seen[id] = true
			}
		}
	}
	return ids
}

// getPositionIDsForName returns all position IDs for a given Chinese name.
func (b *SQLBuilder) getPositionIDsForName(name string) []int {
	seen := make(map[int]bool)
	var ids []int
	for _, posMap := range model.StaffPositions {
		for id, cnName := range posMap {
			if cnName == name && !seen[id] {
				ids = append(ids, id)
				seen[id] = true
			}
		}
	}
	return ids
}

// isDirectField returns true if the field is a direct JSON column (not infobox).
// Uses the target config's directFields map when available, falls back to checking all fields.
func (b *SQLBuilder) isDirectField(field string) bool {
	if b.tc != nil {
		return b.tc.directFields[field]
	}
	// Fallback for when tc is not set (should not happen in practice)
	return subjectDirectFields[field] || personDirectFields[field] ||
		characterDirectFields[field] || episodeDirectFields[field]
}

// Helper functions

func quoteIdent(s string) string {
	// Simple identifier quoting — only needed for reserved words
	// DuckDB uses double quotes
	switch strings.ToLower(s) {
	case "type", "date", "rank", "sort", "order", "limit", "select", "from", "where":
		return `"` + s + `"`
	}
	return s
}

// toSQLOp converts a config operator (gt, gte, lt, lte, eq) to a SQL operator.
func toSQLOp(op string) string {
	switch op {
	case "gt":
		return ">"
	case "gte":
		return ">="
	case "lt":
		return "<"
	case "lte":
		return "<="
	case "eq":
		return "="
	default:
		return ">="
	}
}

func intListToSQL(ids []int) string {
	strs := make([]string, len(ids))
	for i, id := range ids {
		strs[i] = strconv.Itoa(id)
	}
	return strings.Join(strs, ", ")
}

func escapeSQLString(s string) string {
	return strings.ReplaceAll(s, "'", "''")
}

func escapeLike(s string) string {
	s = strings.ReplaceAll(s, "'", "''")
	s = strings.ReplaceAll(s, "%", "\\%")
	s = strings.ReplaceAll(s, "_", "\\_")
	return s
}

func escapeRegex(s string) string {
	// Escape special regex characters for DuckDB/RE2
	special := []string{`\`, `.`, `*`, `+`, `?`, `(`, `)`, `[`, `]`, `{`, `}`, `^`, `$`, `|`}
	for _, ch := range special {
		s = strings.ReplaceAll(s, ch, `\`+ch)
	}
	return s
}

func (b *SQLBuilder) safeNum(v string) string {
	// Ensure the value is a valid number expression
	v = strings.TrimSpace(v)
	if v == "" {
		return "0"
	}
	return v
}
