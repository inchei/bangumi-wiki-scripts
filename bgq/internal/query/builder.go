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
	alias := "s"
	if target == "person" {
		alias = "p"
	} else if target == "character" {
		alias = "c"
	} else if target == "episode" {
		alias = "e"
	}
	return &SQLBuilder{
		cfg:       cfg,
		dataDir:   dataDir,
		useDB:     cfg.HasDatabase(),
		target:    target,
		mainAlias: alias,
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
	switch b.target {
	case "person":
		sql.WriteString("\nFROM persons p\n")
	case "character":
		sql.WriteString("\nFROM characters c\n")
	case "episode":
		sql.WriteString("\nFROM episodes e\n")
	default:
		sql.WriteString("\nFROM subjects s\n")
	}

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
			charactersLoaded = true
		}
		// Ensure persons table is loaded
		if !personsLoaded {
			personFile := b.dataDir + "/person.jsonlines"
			ctes = append(ctes, fmt.Sprintf(
				`persons AS (SELECT id as person_id, name, type as person_type, career, COALESCE(infobox,'') as infobox, summary FROM read_json_auto('%s', format='newline_delimited'))`,
				escapeSQLString(personFile),
			))
			personsLoaded = true
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
	a := b.mainAlias
	col := a + ".type"
	if b.target == "person" {
		col = a + ".person_type"
	} else if b.target == "character" {
		col = a + ".role"
	}
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
	if isDirectField(fieldName) {
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
	// Resolve relation type name to IDs; empty or "任意" means any relation type
	anyType := f.Type == "" || f.Type == "任意"
	var relIDList string
	if !anyType {
		relIDs := b.getRelationIDsForName(f.Type)
		if len(relIDs) == 0 {
			return "", fmt.Errorf("未找到关系类型: %s", f.Type)
		}
		relIDList = intListToSQL(relIDs)
	}

	// For "none" mode: no matching relations should exist
	if f.Mode == "none" {
		if anyType {
			return "NOT EXISTS (SELECT 1 FROM subject_relations r WHERE r.subject_id = s.id)", nil
		}
		return fmt.Sprintf(
			"NOT EXISTS (SELECT 1 FROM subject_relations r WHERE r.subject_id = s.id AND r.relation_type IN (%s))",
			relIDList), nil
	}

	// Build subquery for related subjects
	var subClauses []string
	if !anyType {
		subClauses = append(subClauses, fmt.Sprintf("r.relation_type IN (%s)", relIDList))
	}

	// Filter by conditions on the related subject (support all filter types = nested)
	relatedWhere, err := b.buildWhereForAlias(f.Conditions, "rs")
	if err != nil {
		return "", fmt.Errorf("relation condition: %w", err)
	}
	if relatedWhere != "" {
		subClauses = append(subClauses, relatedWhere)
	}

	subWhere := strings.Join(subClauses, " AND ")
	if subWhere == "" {
		subWhere = "TRUE"
	}

	// For "all" mode: count of matching relations = count of all relations of this type
	if f.Mode == "all" {
		nestedWhere, _ := b.buildWhereForAlias(f.Conditions, "rs")
		if anyType {
			return fmt.Sprintf(
				`EXISTS (SELECT 1 FROM subject_relations r WHERE r.subject_id = s.id) AND
				 (SELECT COUNT(*) FROM subject_relations r LEFT JOIN subjects rs ON r.related_subject_id = rs.id WHERE r.subject_id = s.id AND %s) =
				 (SELECT COUNT(*) FROM subject_relations r WHERE r.subject_id = s.id)`,
				nestedWhere), nil
		}
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM subject_relations r WHERE r.subject_id = s.id AND r.relation_type IN (%s)) AND
			 (SELECT COUNT(*) FROM subject_relations r LEFT JOIN subjects rs ON r.related_subject_id = rs.id WHERE r.subject_id = s.id AND r.relation_type IN (%s) AND %s) =
			 (SELECT COUNT(*) FROM subject_relations r WHERE r.subject_id = s.id AND r.relation_type IN (%s))`,
			relIDList, relIDList, nestedWhere, relIDList), nil
	}

	// For "count" mode: count of matching relations <op> threshold
	if f.Mode == "count" {
		countWhere := subWhere
		if countWhere == "" {
			countWhere = "TRUE"
		}
		var countExpr string
		if anyType {
			countExpr = fmt.Sprintf(
				"(SELECT COUNT(*) FROM subject_relations r LEFT JOIN subjects rs ON r.related_subject_id = rs.id WHERE r.subject_id = s.id AND %s)",
				countWhere)
		} else {
			countExpr = fmt.Sprintf(
				"(SELECT COUNT(*) FROM subject_relations r LEFT JOIN subjects rs ON r.related_subject_id = rs.id WHERE r.subject_id = s.id AND r.relation_type IN (%s) AND %s)",
				relIDList, countWhere)
		}
		return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
	}

	// For "any" mode: at least one matching relation
	return fmt.Sprintf(
		"EXISTS (SELECT 1 FROM subject_relations r LEFT JOIN subjects rs ON r.related_subject_id = rs.id WHERE r.subject_id = s.id AND %s)",
		subWhere), nil
}

// personRelationFilter handles person-to-person relation filtering (person_type=prsn).
func (b *SQLBuilder) personRelationFilter(f *config.PersonRelationFilter) (string, error) {
	// Only valid for person target
	if b.target != "person" {
		return "", fmt.Errorf("person_relation filter only supported for person target")
	}

	// Resolve relation type name to IDs; empty or "任意" means any type
	anyType := f.Type == "" || f.Type == "任意"
	var relIDList string
	if !anyType {
		relIDs := b.getPersonRelationIDsForName(f.Type)
		if len(relIDs) == 0 {
			return "", fmt.Errorf("未找到人物关系类型: %s", f.Type)
		}
		relIDList = intListToSQL(relIDs)
	}

	// For "none" mode: no matching person relations should exist
	if f.Mode == "none" {
		if anyType {
			return "NOT EXISTS (SELECT 1 FROM person_relations pr WHERE pr.person_id = p.person_id)", nil
		}
		return fmt.Sprintf(
			"NOT EXISTS (SELECT 1 FROM person_relations pr WHERE pr.person_id = p.person_id AND pr.relation_type IN (%s))",
			relIDList), nil
	}

	// Build subquery for related person
	var subClauses []string
	if !anyType {
		subClauses = append(subClauses, fmt.Sprintf("pr.relation_type IN (%s)", relIDList))
	}

	// Filter by conditions on the related person
	relatedWhere := "TRUE"
	if len(f.Conditions) > 0 {
		var err error
		relatedWhere, err = b.buildPersonRelationWhereForAlias(f.Conditions)
		if err != nil {
			return "", fmt.Errorf("person_relation condition: %w", err)
		}
	}
	if relatedWhere != "TRUE" {
		subClauses = append(subClauses, relatedWhere)
	}

	subWhere := strings.Join(subClauses, " AND ")
	if subWhere == "" {
		subWhere = "TRUE"
	}

	personJoin := "person_relations pr LEFT JOIN persons rp ON pr.related_person_id = rp.person_id"

	// For "all" mode: count of matching = count of all
	if f.Mode == "all" {
		nestedWhere := "TRUE"
		if len(f.Conditions) > 0 {
			nestedWhere, _ = b.buildPersonRelationWhereForAlias(f.Conditions)
		}
		if anyType {
			return fmt.Sprintf(
				`EXISTS (SELECT 1 FROM person_relations pr WHERE pr.person_id = p.person_id) AND
				 (SELECT COUNT(*) FROM %s WHERE pr.person_id = p.person_id AND %s) =
				 (SELECT COUNT(*) FROM person_relations pr WHERE pr.person_id = p.person_id)`,
				personJoin, nestedWhere), nil
		}
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_relations pr WHERE pr.person_id = p.person_id AND pr.relation_type IN (%s)) AND
			 (SELECT COUNT(*) FROM %s WHERE pr.person_id = p.person_id AND pr.relation_type IN (%s) AND %s) =
			 (SELECT COUNT(*) FROM person_relations pr WHERE pr.person_id = p.person_id AND pr.relation_type IN (%s))`,
			relIDList, personJoin, relIDList, nestedWhere, relIDList), nil
	}

	// For "count" mode: count of matching person relations <op> threshold
	if f.Mode == "count" {
		countWhere := subWhere
		if countWhere == "" {
			countWhere = "TRUE"
		}
		var countExpr string
		if anyType {
			countExpr = fmt.Sprintf(
				"(SELECT COUNT(*) FROM %s WHERE pr.person_id = p.person_id AND %s)",
				personJoin, countWhere)
		} else {
			countExpr = fmt.Sprintf(
				"(SELECT COUNT(*) FROM %s WHERE pr.person_id = p.person_id AND pr.relation_type IN (%s) AND %s)",
				personJoin, relIDList, countWhere)
		}
		return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
	}

	// For "any" mode
	return fmt.Sprintf(
		"EXISTS (SELECT 1 FROM %s WHERE pr.person_id = p.person_id AND %s)",
		personJoin, subWhere), nil
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
	// Only valid for character target
	if b.target != "character" {
		return "", fmt.Errorf("character_relation filter only supported for character target")
	}

	// Resolve relation type name to IDs; empty or "任意" means any type
	anyType := f.Type == "" || f.Type == "任意"
	var relIDList string
	if !anyType {
		relIDs := b.getCharacterRelationIDsForName(f.Type)
		if len(relIDs) == 0 {
			return "", fmt.Errorf("未找到角色关系类型: %s", f.Type)
		}
		relIDList = intListToSQL(relIDs)
	}

	// For "none" mode: no matching character relations should exist
	if f.Mode == "none" {
		if anyType {
			return "NOT EXISTS (SELECT 1 FROM character_relations cr WHERE cr.person_id = c.character_id)", nil
		}
		return fmt.Sprintf(
			"NOT EXISTS (SELECT 1 FROM character_relations cr WHERE cr.person_id = c.character_id AND cr.relation_type IN (%s))",
			relIDList), nil
	}

	// Build subquery for related character
	var subClauses []string
	if !anyType {
		subClauses = append(subClauses, fmt.Sprintf("cr.relation_type IN (%s)", relIDList))
	}

	// Filter by conditions on the related character
	relatedWhere := "TRUE"
	if len(f.Conditions) > 0 {
		var err error
		relatedWhere, err = b.buildCharacterRelationWhereForAlias(f.Conditions)
		if err != nil {
			return "", fmt.Errorf("character_relation condition: %w", err)
		}
	}
	if relatedWhere != "TRUE" {
		subClauses = append(subClauses, relatedWhere)
	}

	subWhere := strings.Join(subClauses, " AND ")
	if subWhere == "" {
		subWhere = "TRUE"
	}

	charJoin := "character_relations cr LEFT JOIN characters rc ON cr.related_person_id = rc.character_id"

	// For "all" mode: count of matching = count of all
	if f.Mode == "all" {
		nestedWhere := "TRUE"
		if len(f.Conditions) > 0 {
			nestedWhere, _ = b.buildCharacterRelationWhereForAlias(f.Conditions)
		}
		if anyType {
			return fmt.Sprintf(
				`EXISTS (SELECT 1 FROM character_relations cr WHERE cr.person_id = c.character_id) AND
				 (SELECT COUNT(*) FROM %s WHERE cr.person_id = c.character_id AND %s) =
				 (SELECT COUNT(*) FROM character_relations cr WHERE cr.person_id = c.character_id)`,
				charJoin, nestedWhere), nil
		}
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM character_relations cr WHERE cr.person_id = c.character_id AND cr.relation_type IN (%s)) AND
			 (SELECT COUNT(*) FROM %s WHERE cr.person_id = c.character_id AND cr.relation_type IN (%s) AND %s) =
			 (SELECT COUNT(*) FROM character_relations cr WHERE cr.person_id = c.character_id AND cr.relation_type IN (%s))`,
			relIDList, charJoin, relIDList, nestedWhere, relIDList), nil
	}

	// For "count" mode: count of matching character relations <op> threshold
	if f.Mode == "count" {
		countWhere := subWhere
		if countWhere == "" {
			countWhere = "TRUE"
		}
		var countExpr string
		if anyType {
			countExpr = fmt.Sprintf(
				"(SELECT COUNT(*) FROM %s WHERE cr.person_id = c.character_id AND %s)",
				charJoin, countWhere)
		} else {
			countExpr = fmt.Sprintf(
				"(SELECT COUNT(*) FROM %s WHERE cr.person_id = c.character_id AND cr.relation_type IN (%s) AND %s)",
				charJoin, relIDList, countWhere)
		}
		return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
	}

	// For "any" mode
	return fmt.Sprintf(
		"EXISTS (SELECT 1 FROM %s WHERE cr.person_id = c.character_id AND %s)",
		charJoin, subWhere), nil
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
	if isDirectField(f.Field) {
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
	// Resolve position name to IDs; empty or "任意" means any position
	anyPos := f.Position == "" || f.Position == "任意"
	var posIDList string
	if !anyPos {
		posIDs := b.getPositionIDsForName(f.Position)
		if len(posIDs) == 0 {
			return "", fmt.Errorf("未找到职位类型: %s", f.Position)
		}
		posIDList = intListToSQL(posIDs)
	}

	// For person target: conditions on associated subjects (like relation filter)
	if b.target == "person" {
		// none mode: exclude persons with this position
		if f.Mode == "none" {
			if anyPos {
				return "NOT EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.person_id = p.person_id)", nil
			}
			return fmt.Sprintf(
				"NOT EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.person_id = p.person_id AND sp.position IN (%s))",
				posIDList), nil
		}

		// Build conditions on associated subjects using buildWhereForAlias (same as relation filter)
		var subClauses []string
		if !anyPos {
			subClauses = append(subClauses, fmt.Sprintf("sp.position IN (%s)", posIDList))
		}
		if len(f.Conditions) > 0 {
			relatedWhere, err := b.buildWhereForAlias(f.Conditions, "rs")
			if err != nil {
				return "", fmt.Errorf("staff condition: %w", err)
			}
			if relatedWhere != "TRUE" {
				subClauses = append(subClauses, relatedWhere)
			}
		}
		subWhere := strings.Join(subClauses, " AND ")
		if subWhere == "" {
			subWhere = "TRUE"
		}

		if f.Mode == "all" {
			condWhere := "TRUE"
			if len(f.Conditions) > 0 {
				condWhere, _ = b.buildWhereForAlias(f.Conditions, "rs")
			}
			if anyPos {
				return fmt.Sprintf(
					`EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.person_id = p.person_id) AND
					 (SELECT COUNT(*) FROM subject_persons sp LEFT JOIN subjects rs ON sp.subject_id = rs.id WHERE sp.person_id = p.person_id AND %s) =
					 (SELECT COUNT(*) FROM subject_persons sp WHERE sp.person_id = p.person_id)`,
					condWhere), nil
			}
			return fmt.Sprintf(
				`EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.person_id = p.person_id AND sp.position IN (%s)) AND
				 (SELECT COUNT(*) FROM subject_persons sp LEFT JOIN subjects rs ON sp.subject_id = rs.id WHERE sp.person_id = p.person_id AND sp.position IN (%s) AND %s) =
				 (SELECT COUNT(*) FROM subject_persons sp WHERE sp.person_id = p.person_id AND sp.position IN (%s))`,
				posIDList, posIDList, condWhere, posIDList), nil
		}

		// count mode (person target)
		if f.Mode == "count" {
			countWhere := subWhere
			if countWhere == "" {
				countWhere = "TRUE"
			}
			countExpr := fmt.Sprintf(
				"(SELECT COUNT(*) FROM subject_persons sp LEFT JOIN subjects rs ON sp.subject_id = rs.id WHERE sp.person_id = p.person_id AND %s)",
				countWhere)
			return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
		}

		return fmt.Sprintf(
			"EXISTS (SELECT 1 FROM subject_persons sp LEFT JOIN subjects rs ON sp.subject_id = rs.id WHERE sp.person_id = p.person_id AND %s)",
			subWhere), nil
	}

	// Subject target: conditions on persons

	// Build appear_eps condition
	appearEpsCond := "TRUE"
	if f.AppearEps != nil {
		var epsErr error
		appearEpsCond, epsErr = b.buildCondition("sp.appear_eps", f.AppearEps.Operator, fmt.Sprintf("%v", f.AppearEps.Value))
		if epsErr != nil {
			return "", fmt.Errorf("appear_eps condition: %w", epsErr)
		}
	}

	// none mode: exclude subjects with this position
	if f.Mode == "none" {
		if anyPos && appearEpsCond == "TRUE" {
			return "NOT EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.subject_id = s.id)", nil
		}
		cond := "TRUE"
		if !anyPos {
			cond = fmt.Sprintf("sp.position IN (%s)", posIDList)
		}
		if appearEpsCond != "TRUE" {
			cond = cond + " AND " + appearEpsCond
		}
		return fmt.Sprintf(
			"NOT EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.subject_id = s.id AND %s)",
			cond), nil
	}

	// Build person-specific conditions
	personWhere, err := b.buildPersonWhereForAlias(f.Conditions)
	if err != nil {
		return "", fmt.Errorf("staff condition: %w", err)
	}

	// Always join persons table when there are conditions
	fromClause := "subject_persons sp"
	if len(f.Conditions) > 0 {
		fromClause = "subject_persons sp LEFT JOIN persons p ON sp.person_id = p.person_id"
	}

	// Build combined position + appear_eps condition
	posAppearCond := "TRUE"
	if !anyPos {
		posAppearCond = fmt.Sprintf("sp.position IN (%s)", posIDList)
	}
	if appearEpsCond != "TRUE" {
		posAppearCond = posAppearCond + " AND " + appearEpsCond
	}

	if f.Mode == "all" {
		if posAppearCond == "TRUE" {
			return fmt.Sprintf(
				`EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.subject_id = s.id) AND
				 (SELECT COUNT(*) FROM %s WHERE sp.subject_id = s.id AND %s) =
				 (SELECT COUNT(*) FROM subject_persons sp WHERE sp.subject_id = s.id)`,
				fromClause, personWhere), nil
		}
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.subject_id = s.id AND %s) AND
			 (SELECT COUNT(*) FROM %s WHERE sp.subject_id = s.id AND %s AND %s) =
			 (SELECT COUNT(*) FROM subject_persons sp WHERE sp.subject_id = s.id AND %s)`,
			posAppearCond, fromClause, posAppearCond, personWhere, posAppearCond), nil
	}

	// count mode (subject target)
	if f.Mode == "count" {
		countWhere := posAppearCond
		if personWhere != "TRUE" {
			if countWhere == "TRUE" {
				countWhere = personWhere
			} else {
				countWhere = countWhere + " AND " + personWhere
			}
		}
		countExpr := fmt.Sprintf(
			"(SELECT COUNT(*) FROM %s WHERE sp.subject_id = s.id AND %s)",
			fromClause, countWhere)
		return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
	}

	if posAppearCond == "TRUE" {
		return fmt.Sprintf(
			"EXISTS (SELECT 1 FROM %s WHERE sp.subject_id = s.id AND %s)",
			fromClause, personWhere), nil
	}
	return fmt.Sprintf(
		"EXISTS (SELECT 1 FROM %s WHERE sp.subject_id = s.id AND %s AND %s)",
		fromClause, posAppearCond, personWhere), nil
}

// characterFilter handles character-based filtering for subject queries.
func (b *SQLBuilder) characterFilter(f *config.CharacterFilter) (string, error) {
	// Resolve association type name to ID; empty or "任意" means any type
	anyType := f.Type == "" || f.Type == "任意"
	var typeID int
	if !anyType {
		var found bool
		typeID, found = b.getCharacterAssociationTypeID(f.Type)
		if !found {
			return "", fmt.Errorf("未找到角色关联类型: %s", f.Type)
		}
	}

	// Build type condition
	typeCond := "TRUE"
	if !anyType {
		typeCond = fmt.Sprintf("sc.type = %d", typeID)
	}

	// For character target: filter characters by their associated subjects
	if b.target == "character" {
		// none mode: exclude characters with this association
		if f.Mode == "none" {
			if anyType {
				return "NOT EXISTS (SELECT 1 FROM subject_characters sc WHERE sc.character_id = c.character_id)", nil
			}
			return fmt.Sprintf(
				"NOT EXISTS (SELECT 1 FROM subject_characters sc WHERE sc.character_id = c.character_id AND %s)",
				typeCond), nil
		}

		// Build subject-level conditions
		subWhere := typeCond
		if len(f.Conditions) > 0 {
			subjectWhere, err := b.buildWhereForAlias(f.Conditions, "rs")
			if err != nil {
				return "", fmt.Errorf("character condition: %w", err)
			}
			if subjectWhere != "TRUE" {
				subWhere = strings.Join([]string{typeCond, subjectWhere}, " AND ")
			}
		}

		if f.Mode == "all" {
			condWhere := typeCond
			if len(f.Conditions) > 0 {
				subjectWhere, _ := b.buildWhereForAlias(f.Conditions, "rs")
				if subjectWhere != "TRUE" {
					condWhere = strings.Join([]string{typeCond, subjectWhere}, " AND ")
				}
			}
			return fmt.Sprintf(
				`EXISTS (SELECT 1 FROM subject_characters sc WHERE sc.character_id = c.character_id AND %s) AND
				 (SELECT COUNT(*) FROM subject_characters sc LEFT JOIN subjects rs ON sc.subject_id = rs.id WHERE sc.character_id = c.character_id AND %s) =
				 (SELECT COUNT(*) FROM subject_characters sc WHERE sc.character_id = c.character_id AND %s)`,
				typeCond, condWhere, typeCond), nil
		}

		// count mode (character target)
		if f.Mode == "count" {
			countExpr := fmt.Sprintf(
				"(SELECT COUNT(*) FROM subject_characters sc LEFT JOIN subjects rs ON sc.subject_id = rs.id WHERE sc.character_id = c.character_id AND %s)",
				subWhere)
			return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
		}

		// any mode
		return fmt.Sprintf(
			"EXISTS (SELECT 1 FROM subject_characters sc LEFT JOIN subjects rs ON sc.subject_id = rs.id WHERE sc.character_id = c.character_id AND %s)",
			subWhere), nil
	}

	// For subject target: filter subjects by their associated characters

	// For "none" mode: no matching characters should exist
	if f.Mode == "none" {
		if anyType {
			return "NOT EXISTS (SELECT 1 FROM subject_characters sc WHERE sc.subject_id = s.id)", nil
		}
		return fmt.Sprintf(
			"NOT EXISTS (SELECT 1 FROM subject_characters sc WHERE sc.subject_id = s.id AND %s)",
			typeCond), nil
	}

	// Build character-level conditions
	charWhere := "TRUE"
	if len(f.Conditions) > 0 {
		var err error
		charWhere, err = b.buildCharacterWhereForAlias(f.Conditions)
		if err != nil {
			return "", fmt.Errorf("character condition: %w", err)
		}
	}

	fromClause := "subject_characters sc"
	if len(f.Conditions) > 0 {
		fromClause = "subject_characters sc LEFT JOIN characters c ON sc.character_id = c.character_id"
	}

	subWhere := strings.Join([]string{typeCond, charWhere}, " AND ")

	if f.Mode == "all" {
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM subject_characters sc WHERE sc.subject_id = s.id AND %s) AND
			 (SELECT COUNT(*) FROM %s WHERE sc.subject_id = s.id AND %s) =
			 (SELECT COUNT(*) FROM subject_characters sc WHERE sc.subject_id = s.id AND %s)`,
			typeCond, fromClause, subWhere, typeCond), nil
	}

	// count mode (subject target)
	if f.Mode == "count" {
		countExpr := fmt.Sprintf(
			"(SELECT COUNT(*) FROM %s WHERE sc.subject_id = s.id AND %s)",
			fromClause, subWhere)
		return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
	}

	// any mode
	return fmt.Sprintf(
		"EXISTS (SELECT 1 FROM %s WHERE sc.subject_id = s.id AND %s)",
		fromClause, subWhere), nil
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
	// Only valid for person target
	if b.target != "person" {
		return "", fmt.Errorf("person_character filter only supported for person target")
	}

	// Resolve CV type name to ID; empty or "任意" means any type
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
	charWhere := "TRUE"
	if len(f.Conditions) > 0 {
		var err error
		charWhere, err = b.buildPersonCharCharacterWhere(f.Conditions)
		if err != nil {
			return "", fmt.Errorf("person_character condition: %w", err)
		}
	}

	// Build subject-level conditions (相关条目)
	hasSubjConds := len(f.SubjectConditions) > 0
	subjectWhere := "TRUE"
	if hasSubjConds {
		var err error
		subjectWhere, err = b.buildWhereForAlias(f.SubjectConditions, "rs")
		if err != nil {
			return "", fmt.Errorf("person_character subject condition: %w", err)
		}
	}

	subjMode := f.SubjectMode
	if subjMode == "" {
		subjMode = "any"
	}

	// For "none" mode
	if f.Mode == "none" {
		charJoin := ""
		if charWhere != "TRUE" {
			charJoin = "LEFT JOIN characters c ON pc.character_id = c.character_id"
		}
		charPred := typeCond
		if charWhere != "TRUE" {
			charPred = typeCond + " AND " + charWhere
		}

		if !hasSubjConds || subjMode == "any" {
			// No character has any matching subject (or no subject conditions at all)
			if anyType && charWhere == "TRUE" {
				return "NOT EXISTS (SELECT 1 FROM person_characters pc WHERE pc.person_id = p.person_id)", nil
			}
			return fmt.Sprintf(
				"NOT EXISTS (SELECT 1 FROM person_characters pc %s WHERE pc.person_id = p.person_id AND %s)",
				charJoin, charPred), nil
		}

		// subject_mode=all: No character has ALL its subjects matching
		// I.e., for every character that matches, at least one subject doesn't match
		if anyType && charWhere == "TRUE" {
			// No character exists where all its subjects match
			return fmt.Sprintf(
				`NOT EXISTS (
				   SELECT 1 FROM person_characters pc
				   WHERE pc.person_id = p.person_id
				   AND NOT EXISTS (
				     SELECT 1 FROM person_characters pc2
				     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
				     WHERE pc2.person_id = p.person_id AND pc2.character_id = pc.character_id
				     AND NOT (%s)
				   )
				 )`, subjectWhere), nil
		}
		return fmt.Sprintf(
			`NOT EXISTS (
			   SELECT 1 FROM person_characters pc %s
			   WHERE pc.person_id = p.person_id AND %s
			   AND NOT EXISTS (
			     SELECT 1 FROM person_characters pc2
			     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
			     WHERE pc2.person_id = p.person_id AND pc2.character_id = pc.character_id
			     AND NOT (%s)
			   )
			 )`, charJoin, charPred, subjectWhere), nil
	}

	// When no subject conditions, treat as simple flat query
	if !hasSubjConds {
		fromClause := "person_characters pc"
		joins := []string{}
		if charWhere != "TRUE" {
			joins = append(joins, "LEFT JOIN characters c ON pc.character_id = c.character_id")
		}
		if len(joins) > 0 {
			fromClause = "person_characters pc " + strings.Join(joins, " ")
		}
		cond := strings.Join([]string{typeCond, charWhere}, " AND ")

		if f.Mode == "all" {
			return fmt.Sprintf(
				`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.person_id = p.person_id AND %s) AND
				 (SELECT COUNT(*) FROM %s WHERE pc.person_id = p.person_id AND %s) =
				 (SELECT COUNT(*) FROM person_characters pc WHERE pc.person_id = p.person_id AND %s)`,
				typeCond, fromClause, cond, typeCond), nil
		}
		if f.Mode == "count" {
			countExpr := fmt.Sprintf(
				"(SELECT COUNT(*) FROM %s WHERE pc.person_id = p.person_id AND %s)",
				fromClause, cond)
			return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
		}
		return fmt.Sprintf(
			"EXISTS (SELECT 1 FROM %s WHERE pc.person_id = p.person_id AND %s)",
			fromClause, cond), nil
	}

	// Has subject conditions — use two-level quantifier
	charJoin := ""
	if charWhere != "TRUE" {
		charJoin = "LEFT JOIN characters c ON pc.character_id = c.character_id"
	}

	// Build "character matches" predicate: type + char conditions
	charPred := typeCond
	if charWhere != "TRUE" {
		charPred = typeCond + " AND " + charWhere
	}

	// Build "subject matches" predicate
	subjPred := subjectWhere

	// Count mode with subject conditions
	if f.Mode == "count" {
		countExpr := fmt.Sprintf(
			"(SELECT COUNT(DISTINCT pc.character_id) FROM person_characters pc %s LEFT JOIN subjects rs ON pc.subject_id = rs.id WHERE pc.person_id = p.person_id AND %s AND %s)",
			charJoin, charPred, subjPred)
		return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
	}

	switch {
	case f.Mode == "any" && subjMode == "any":
		// EXISTS a row where character AND subject both match
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc %s
			 LEFT JOIN subjects rs ON pc.subject_id = rs.id
			 WHERE pc.person_id = p.person_id AND %s AND %s)`,
			charJoin, charPred, subjPred), nil

	case f.Mode == "any" && subjMode == "all":
		// EXISTS a character where ALL its subjects match
		return fmt.Sprintf(
			`EXISTS (
		   SELECT 1 FROM person_characters pc %s
		   WHERE pc.person_id = p.person_id AND %s
		   AND NOT EXISTS (
		     SELECT 1 FROM person_characters pc2
		     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
		     WHERE pc2.person_id = p.person_id AND pc2.character_id = pc.character_id
		     AND NOT (%s)
		   )
		 )`, charJoin, charPred, subjPred), nil

	case f.Mode == "all" && subjMode == "any":
		// ALL characters have at least one matching subject
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.person_id = p.person_id AND %s) AND
			 (SELECT COUNT(*) FROM (
			   SELECT pc.character_id FROM person_characters pc %s
			   LEFT JOIN subjects rs ON pc.subject_id = rs.id
			   WHERE pc.person_id = p.person_id AND %s AND %s
			   GROUP BY pc.character_id
			 ) t) =
			 (SELECT COUNT(DISTINCT pc.character_id) FROM person_characters pc WHERE pc.person_id = p.person_id AND %s)`,
			typeCond, charJoin, charPred, subjPred, typeCond), nil

	case f.Mode == "all" && subjMode == "all":
		// ALL characters have ALL subjects matching
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.person_id = p.person_id AND %s) AND
			 NOT EXISTS (
			   SELECT 1 FROM person_characters pc %s
			   WHERE pc.person_id = p.person_id AND %s
			   AND EXISTS (
			     SELECT 1 FROM person_characters pc2
			     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
			     WHERE pc2.person_id = p.person_id AND pc2.character_id = pc.character_id
			     AND NOT (%s)
			   )
			 )`,
			typeCond, charJoin, charPred, subjPred), nil

	case f.Mode == "any" && subjMode == "count":
		// EXISTS a character where count of matching subjects <op> threshold
		subjCountOp := f.SubjectCountOp
		if subjCountOp == "" {
			subjCountOp = "gte"
		}
		return fmt.Sprintf(
			`EXISTS (
			   SELECT 1 FROM person_characters pc %s
			   WHERE pc.person_id = p.person_id AND %s
			   AND (SELECT COUNT(*) FROM person_characters pc2
			     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
			     WHERE pc2.person_id = p.person_id AND pc2.character_id = pc.character_id
			     AND %s) %s %v
			 )`,
			charJoin, charPred, subjPred, subjCountOp, f.SubjectCountVal), nil

	case f.Mode == "all" && subjMode == "count":
		// ALL characters have count of matching subjects <op> threshold
		subjCountOp := f.SubjectCountOp
		if subjCountOp == "" {
			subjCountOp = "gte"
		}
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.person_id = p.person_id AND %s) AND
			 NOT EXISTS (
			   SELECT 1 FROM person_characters pc %s
			   WHERE pc.person_id = p.person_id AND %s
			   AND NOT ((SELECT COUNT(*) FROM person_characters pc2
			     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
			     WHERE pc2.person_id = p.person_id AND pc2.character_id = pc.character_id
			     AND %s) %s %v)
			 )`,
			typeCond, charJoin, charPred, subjPred, subjCountOp, f.SubjectCountVal), nil
	}

	return "TRUE", nil
}

// buildPersonCharCharacterWhere generates WHERE clauses for character conditions in person_characters context.
func (b *SQLBuilder) buildPersonCharCharacterWhere(filters []config.Filter) (string, error) {
	return b.buildClauses(filters, clauseContext{alias: "c", isCharacterCtx: true})
}

// characterPersonFilter filters characters by their associated persons (via person_characters).
func (b *SQLBuilder) characterPersonFilter(f *config.CharacterPersonFilter) (string, error) {
	// Only valid for character target
	if b.target != "character" {
		return "", fmt.Errorf("character_person filter only supported for character target")
	}

	// Resolve CV type name to ID; empty or "任意" means any type
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
	personWhere := "TRUE"
	if len(f.Conditions) > 0 {
		var err error
		personWhere, err = b.buildCharPersonPersonWhere(f.Conditions)
		if err != nil {
			return "", fmt.Errorf("character_person condition: %w", err)
		}
	}

	// Build subject-level conditions (相关条目)
	hasSubjConds := len(f.SubjectConditions) > 0
	subjectWhere := "TRUE"
	if hasSubjConds {
		var err error
		subjectWhere, err = b.buildWhereForAlias(f.SubjectConditions, "rs")
		if err != nil {
			return "", fmt.Errorf("character_person subject condition: %w", err)
		}
	}

	subjMode := f.SubjectMode
	if subjMode == "" {
		subjMode = "any"
	}

	// For "none" mode
	if f.Mode == "none" {
		personJoin := ""
		if personWhere != "TRUE" {
			personJoin = "LEFT JOIN persons p ON pc.person_id = p.person_id"
		}
		personPred := typeCond
		if personWhere != "TRUE" {
			personPred = typeCond + " AND " + personWhere
		}

		if !hasSubjConds || subjMode == "any" {
			// No person has any matching subject (or no subject conditions at all)
			if anyType && personWhere == "TRUE" {
				return "NOT EXISTS (SELECT 1 FROM person_characters pc WHERE pc.character_id = c.character_id)", nil
			}
			return fmt.Sprintf(
				"NOT EXISTS (SELECT 1 FROM person_characters pc %s WHERE pc.character_id = c.character_id AND %s)",
				personJoin, personPred), nil
		}

		// subject_mode=all: No person has ALL its subjects matching
		if anyType && personWhere == "TRUE" {
			return fmt.Sprintf(
				`NOT EXISTS (
				   SELECT 1 FROM person_characters pc
				   WHERE pc.character_id = c.character_id
				   AND NOT EXISTS (
				     SELECT 1 FROM person_characters pc2
				     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
				     WHERE pc2.character_id = c.character_id AND pc2.person_id = pc.person_id
				     AND NOT (%s)
				   )
				 )`, subjectWhere), nil
		}
		return fmt.Sprintf(
			`NOT EXISTS (
			   SELECT 1 FROM person_characters pc %s
			   WHERE pc.character_id = c.character_id AND %s
			   AND NOT EXISTS (
			     SELECT 1 FROM person_characters pc2
			     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
			     WHERE pc2.character_id = c.character_id AND pc2.person_id = pc.person_id
			     AND NOT (%s)
			   )
			 )`, personJoin, personPred, subjectWhere), nil
	}

	// When no subject conditions, treat as simple flat query
	if !hasSubjConds {
		fromClause := "person_characters pc"
		joins := []string{}
		if personWhere != "TRUE" {
			joins = append(joins, "LEFT JOIN persons p ON pc.person_id = p.person_id")
		}
		if len(joins) > 0 {
			fromClause = "person_characters pc " + strings.Join(joins, " ")
		}
		cond := strings.Join([]string{typeCond, personWhere}, " AND ")

		if f.Mode == "all" {
			return fmt.Sprintf(
				`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.character_id = c.character_id AND %s) AND
				 (SELECT COUNT(*) FROM %s WHERE pc.character_id = c.character_id AND %s) =
				 (SELECT COUNT(*) FROM person_characters pc WHERE pc.character_id = c.character_id AND %s)`,
				typeCond, fromClause, cond, typeCond), nil
		}
		if f.Mode == "count" {
			countExpr := fmt.Sprintf(
				"(SELECT COUNT(*) FROM %s WHERE pc.character_id = c.character_id AND %s)",
				fromClause, cond)
			return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
		}
		return fmt.Sprintf(
			"EXISTS (SELECT 1 FROM %s WHERE pc.character_id = c.character_id AND %s)",
			fromClause, cond), nil
	}

	// Has subject conditions — use two-level quantifier
	personJoin := ""
	if personWhere != "TRUE" {
		personJoin = "LEFT JOIN persons p ON pc.person_id = p.person_id"
	}

	// Build "person matches" predicate: type + person conditions
	personPred := typeCond
	if personWhere != "TRUE" {
		personPred = typeCond + " AND " + personWhere
	}

	// Build "subject matches" predicate
	subjPred := subjectWhere

	// Count mode with subject conditions
	if f.Mode == "count" {
		countExpr := fmt.Sprintf(
			"(SELECT COUNT(DISTINCT pc.person_id) FROM person_characters pc %s LEFT JOIN subjects rs ON pc.subject_id = rs.id WHERE pc.character_id = c.character_id AND %s AND %s)",
			personJoin, personPred, subjPred)
		return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
	}

	switch {
	case f.Mode == "any" && subjMode == "any":
		// EXISTS a row where person AND subject both match
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc %s
			 LEFT JOIN subjects rs ON pc.subject_id = rs.id
			 WHERE pc.character_id = c.character_id AND %s AND %s)`,
			personJoin, personPred, subjPred), nil

	case f.Mode == "any" && subjMode == "all":
		// EXISTS a person where ALL its subjects match
		return fmt.Sprintf(
			`EXISTS (
		   SELECT 1 FROM person_characters pc %s
		   WHERE pc.character_id = c.character_id AND %s
		   AND NOT EXISTS (
		     SELECT 1 FROM person_characters pc2
		     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
		     WHERE pc2.character_id = c.character_id AND pc2.person_id = pc.person_id
		     AND NOT (%s)
		   )
		 )`, personJoin, personPred, subjPred), nil

	case f.Mode == "all" && subjMode == "any":
		// ALL persons have at least one matching subject
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.character_id = c.character_id AND %s) AND
			 (SELECT COUNT(*) FROM (
			   SELECT pc.person_id FROM person_characters pc %s
			   LEFT JOIN subjects rs ON pc.subject_id = rs.id
			   WHERE pc.character_id = c.character_id AND %s AND %s
			   GROUP BY pc.person_id
			 ) t) =
			 (SELECT COUNT(DISTINCT pc.person_id) FROM person_characters pc WHERE pc.character_id = c.character_id AND %s)`,
			typeCond, personJoin, personPred, subjPred, typeCond), nil

	case f.Mode == "all" && subjMode == "all":
		// ALL persons have ALL subjects matching
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.character_id = c.character_id AND %s) AND
			 NOT EXISTS (
			   SELECT 1 FROM person_characters pc %s
			   WHERE pc.character_id = c.character_id AND %s
			   AND EXISTS (
			     SELECT 1 FROM person_characters pc2
			     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
			     WHERE pc2.character_id = c.character_id AND pc2.person_id = pc.person_id
			     AND NOT (%s)
			   )
			 )`,
			typeCond, personJoin, personPred, subjPred), nil

	case f.Mode == "any" && subjMode == "count":
		// EXISTS a person where count of matching subjects <op> threshold
		subjCountOp := f.SubjectCountOp
		if subjCountOp == "" {
			subjCountOp = "gte"
		}
		return fmt.Sprintf(
			`EXISTS (
			   SELECT 1 FROM person_characters pc %s
			   WHERE pc.character_id = c.character_id AND %s
			   AND (SELECT COUNT(*) FROM person_characters pc2
			     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
			     WHERE pc2.character_id = c.character_id AND pc2.person_id = pc.person_id
			     AND %s) %s %v
			 )`,
			personJoin, personPred, subjPred, subjCountOp, f.SubjectCountVal), nil

	case f.Mode == "all" && subjMode == "count":
		// ALL persons have count of matching subjects <op> threshold
		subjCountOp := f.SubjectCountOp
		if subjCountOp == "" {
			subjCountOp = "gte"
		}
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.character_id = c.character_id AND %s) AND
			 NOT EXISTS (
			   SELECT 1 FROM person_characters pc %s
			   WHERE pc.character_id = c.character_id AND %s
			   AND NOT ((SELECT COUNT(*) FROM person_characters pc2
			     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
			     WHERE pc2.character_id = c.character_id AND pc2.person_id = pc.person_id
			     AND %s) %s %v)
			 )`,
			typeCond, personJoin, personPred, subjPred, subjCountOp, f.SubjectCountVal), nil
	}

	return "TRUE", nil
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
func (b *SQLBuilder) personFilterForAlias(f config.Filter, idx int) (string, error) {
	switch {
	case f.Field != nil:
		return b.personFieldFilterForAlias(f.Field)
	case f.Global != nil:
		return b.personGlobalFilterForAlias(f.Global)
	case f.Type != nil:
		return b.personTypeFilterForAlias(f.Type)
	default:
		return "", fmt.Errorf("人物筛选不支持此条件类型 (index %d)", idx)
	}
}

// personFieldFilterForAlias builds a field filter on person data (supports all operators).
func (b *SQLBuilder) personFieldFilterForAlias(f *config.FieldFilter) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	switch f.Field {
	case "name":
		return b.buildCondition("p.name", f.Operator, valueStr)
	case "id", "person_id":
		return b.buildCondition("sp.person_id", f.Operator, valueStr)
	case "type":
		return b.buildCondition("p.person_type", f.Operator, valueStr)
	case "career":
		if f.Operator == "regex" {
			return fmt.Sprintf("regexp_matches(p.career::VARCHAR, '%s')", escapeRegex(valueStr)), nil
		}
		return fmt.Sprintf("LIST_CONTAINS(COALESCE(p.career, []), '%s')", escapeSQLString(valueStr)), nil
	case "appear_eps":
		return b.buildCondition("sp.appear_eps", f.Operator, valueStr)
	default:
		// Try person infobox field
		fieldExpr := b.infoboxExtractExpr(f.Field, "p")
		if isNumericOp(f.Operator) {
			fieldExpr = extractNum(fieldExpr)
		}
		return b.buildCondition(fieldExpr, f.Operator, valueStr)
	}
}

// personGlobalFilterForAlias builds a global search on person infobox.
func (b *SQLBuilder) personGlobalFilterForAlias(f *config.GlobalFilter) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	switch f.Operator {
	case "regex":
		return fmt.Sprintf("regexp_matches(p.infobox, '%s')", escapeRegex(valueStr)), nil
	case "contains":
		return fmt.Sprintf("p.infobox LIKE '%%%s%%'", escapeLike(valueStr)), nil
	default:
		return "", fmt.Errorf("global filter: unsupported operator %q", f.Operator)
	}
}

// personTypeFilterForAlias builds a person type filter.
func (b *SQLBuilder) personTypeFilterForAlias(f *config.TypeFilter) (string, error) {
	return fmt.Sprintf("p.person_type = '%s'", escapeSQLString(fmt.Sprintf("%v", f.Value))), nil
}

// characterFilterForAlias dispatches a single filter for character-level conditions.
func (b *SQLBuilder) characterFilterForAlias(f config.Filter, idx int) (string, error) {
	switch {
	case f.Field != nil:
		return b.characterFieldFilterForAlias(f.Field)
	case f.Global != nil:
		return b.characterGlobalFilterForAlias(f.Global)
	default:
		return "", fmt.Errorf("角色筛选不支持此条件类型 (index %d)", idx)
	}
}

// characterFieldFilterForAlias builds a field filter on character data (supports all operators).
func (b *SQLBuilder) characterFieldFilterForAlias(f *config.FieldFilter) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	switch f.Field {
	case "name":
		return b.buildCondition("c.name", f.Operator, valueStr)
	case "id", "character_id":
		return b.buildCondition("sc.character_id", f.Operator, valueStr)
	case "role":
		return b.buildCondition("c.role", f.Operator, valueStr)
	case "comments":
		return b.buildCondition("c.comments", f.Operator, valueStr)
	case "collects":
		return b.buildCondition("c.collects", f.Operator, valueStr)
	default:
		// Special case: 性别=其他 means gender exists and is not 男/♀
		if f.Field == "性别" && valueStr == "其他" && f.Operator == "contains" {
			expr := b.infoboxExtractExpr("性别", "c")
			return fmt.Sprintf("COALESCE(%s, '') != '' AND %s NOT LIKE '%%男%%' AND %s NOT LIKE '%%♂%%' AND %s NOT LIKE '%%女%%' AND %s NOT LIKE '%%♀%%'", expr, expr, expr, expr, expr), nil
		}
		// Try character infobox field
		fieldExpr := b.infoboxExtractExpr(f.Field, "c")
		if isNumericOp(f.Operator) {
			fieldExpr = extractNum(fieldExpr)
		}
		return b.buildCondition(fieldExpr, f.Operator, valueStr)
	}
}

// characterGlobalFilterForAlias builds a global search on character infobox.
func (b *SQLBuilder) characterGlobalFilterForAlias(f *config.GlobalFilter) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	switch f.Operator {
	case "regex":
		return fmt.Sprintf("regexp_matches(c.infobox, '%s')", escapeRegex(valueStr)), nil
	case "contains":
		return fmt.Sprintf("c.infobox LIKE '%%%s%%'", escapeLike(valueStr)), nil
	default:
		return "", fmt.Errorf("global filter: unsupported operator %q", f.Operator)
	}
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
	if len(cols) == 0 {
		switch b.target {
		case "person":
			return []string{a + ".person_id as id", a + ".name", a + ".career"}
		case "character":
			return []string{a + ".character_id as id", a + ".name", a + ".role"}
		case "episode":
			return []string{a + ".id", a + ".name", a + ".name_cn", a + ".type", a + ".airdate", a + ".duration", a + ".sort"}
		default:
			return []string{a + ".id", a + ".name", a + ".name_cn", a + ".type", a + ".score", a + ".date"}
		}
	}

	var result []string
	for _, col := range cols {
		switch {
		case col == "id" || col == "ID":
			switch b.target {
			case "person":
				result = append(result, a+".person_id as id")
			case "character":
				result = append(result, a+".character_id as id")
			default:
				result = append(result, a+".id")
			}
		case col == "subject_id" && b.target == "episode":
			result = append(result, a+".subject_id")
		case isDirectField(col):
			result = append(result, a+"."+quoteIdent(col))
		case col == "name_cn":
			if b.target == "person" {
				result = append(result, a+".name AS name_cn")
			} else {
				result = append(result, a+".name_cn AS name_cn")
			}
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
		if isDirectField(s.Field) {
			expr = a + "." + quoteIdent(s.Field)
		} else {
			expr = b.infoboxExtractExpr(s.Field, a)
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
func isDirectField(field string) bool {
	switch field {
	case "id", "type", "name", "name_cn", "platform", "summary",
		"nsfw", "score", "rank", "date", "series", "infobox":
		return true
	// Person direct fields
	case "person_id", "person_type", "career":
		return true
	// Character direct fields
	case "character_id", "role", "comments", "collects":
		return true
	// Episode direct fields
	case "subject_id", "airdate", "duration", "sort", "disc", "desc":
		return true
	default:
		return false
	}
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
