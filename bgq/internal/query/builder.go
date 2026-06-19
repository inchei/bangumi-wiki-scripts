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
	cfg      *config.Config
	dataDir  string
	useDB    bool   // if true, reference tables directly instead of JSON CTEs
	target   string // "subject" or "person"
	mainAlias string // "s" or "p"
	paramIdx int
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
	if b.target == "person" {
		sql.WriteString("\nFROM persons p\n")
	} else {
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

	sql.WriteString(fmt.Sprintf("LIMIT %d", limit))

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

	// Episodes CTE
	if b.cfg.NeedsEpisodes() {
		epFile := b.dataDir + "/episode.jsonlines"
		ctes = append(ctes, fmt.Sprintf(
			`episodes AS (SELECT * FROM read_json_auto('%s', format='newline_delimited'))`,
			escapeSQLString(epFile),
		))
	}

	return ctes, nil
}

func (b *SQLBuilder) buildWhere() (string, error) {
	var clauses []string

	for i, f := range b.cfg.Filters {
		clause, err := b.filterToSQL(f, i)
		if err != nil {
			return "", fmt.Errorf("筛选条件 %d: %w", i+1, err)
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

func (b *SQLBuilder) filterToSQL(f config.Filter, idx int) (string, error) {
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
	case f.Staff != nil:
		return b.staffFilter(f.Staff)
	case f.Episode != nil:
		return b.episodeFilter(f.Episode)
	case f.Count != nil:
		return b.countFilter(f.Count)
	default:
		return "", fmt.Errorf("unknown filter type")
	}
}

// typeFilter handles type-based filtering.
func (b *SQLBuilder) typeFilter(f *config.TypeFilter) (string, error) {
	a := b.mainAlias
	col := a + ".type"
	if b.target == "person" {
		col = a + ".person_type"
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

	// Determine if this is a direct JSON field or infobox field
	if isDirectField(f.Field) {
		return b.buildCondition(tableAlias+"."+quoteIdent(f.Field), f.Operator, valueStr)
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

	switch f.Operator {
	case "regex":
		return fmt.Sprintf("regexp_matches(s.infobox, '%s')", escapeRegex(valueStr)), nil
	case "contains":
		return fmt.Sprintf("s.infobox LIKE '%%%s%%'", escapeLike(valueStr)), nil
	case "eq":
		return fmt.Sprintf("s.infobox = '%s'", escapeSQLString(valueStr)), nil
	default:
		return "", fmt.Errorf("global filter: unsupported operator %q", f.Operator)
	}
}

// tagFilter handles tag-based filtering.
func (b *SQLBuilder) tagFilter(f *config.TagFilter) (string, error) {
	switch f.Operator {
	case "contains", "eq":
		cond := fmt.Sprintf("EXISTS (SELECT 1 FROM (SELECT UNNEST(s.tags) AS t) WHERE t.name = '%s')",
			escapeSQLString(f.Value))
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
		cond := fmt.Sprintf("LIST_CONTAINS(COALESCE(s.meta_tags, []), '%s')", escapeSQLString(f.Value))
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
	// Resolve relation type name to IDs
	relIDs := b.getRelationIDsForName(f.Type)
	if len(relIDs) == 0 {
		return "", fmt.Errorf("未找到关系类型: %s", f.Type)
	}
	relIDList := intListToSQL(relIDs)

	// For "none" mode: no matching relations should exist
	if f.Mode == "none" {
		return fmt.Sprintf(
			"NOT EXISTS (SELECT 1 FROM subject_relations r WHERE r.subject_id = s.id AND r.relation_type IN (%s))",
			relIDList), nil
	}

	// Build subquery for related subjects
	var subClauses []string
	subClauses = append(subClauses, fmt.Sprintf("r.relation_type IN (%s)", relIDList))

	// Filter by conditions on the related subject (support all filter types = nested)
	relatedWhere, err := b.buildWhereForAlias(f.Conditions, "rs")
	if err != nil {
		return "", fmt.Errorf("relation condition: %w", err)
	}
	if relatedWhere != "" {
		subClauses = append(subClauses, relatedWhere)
	}

	subWhere := strings.Join(subClauses, " AND ")

	// For "all" mode: count of matching relations = count of all relations of this type
	if f.Mode == "all" {
		nestedWhere, _ := b.buildWhereForAlias(f.Conditions, "rs")
		return fmt.Sprintf(
			`(SELECT COUNT(*) FROM subject_relations r LEFT JOIN subjects rs ON r.related_subject_id = rs.id WHERE r.subject_id = s.id AND r.relation_type IN (%s) AND %s) =
			 (SELECT COUNT(*) FROM subject_relations r WHERE r.subject_id = s.id AND r.relation_type IN (%s))`,
			relIDList, nestedWhere, relIDList), nil
	}

	// For "any" mode: at least one matching relation
	return fmt.Sprintf(
		"EXISTS (SELECT 1 FROM subject_relations r LEFT JOIN subjects rs ON r.related_subject_id = rs.id WHERE r.subject_id = s.id AND %s)",
		subWhere), nil
}

// buildWhereForAlias generates WHERE clauses for a given table alias, supporting all filter types.
// Used for nested filtering on related subjects (rs), persons (sp), or episodes (e).
func (b *SQLBuilder) buildWhereForAlias(filters []config.Filter, alias string) (string, error) {
	var clauses []string
	for i, f := range filters {
		clause, err := b.filterForAlias(f, alias, i)
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
	case f.Count != nil:
		return b.countFilterForAlias(f.Count, alias)
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

func (b *SQLBuilder) countFilterForAlias(f *config.CountFilter, alias string) (string, error) {
	var countExpr string
	if f.What == "ep" {
		countExpr = fmt.Sprintf("(SELECT COUNT(*) FROM episodes e WHERE e.subject_id = %s.id)", alias)
	} else {
		relIDs := b.getRelationIDsForName(f.What)
		if len(relIDs) == 0 {
			return "", fmt.Errorf("未找到关系类型用于计数: %s", f.What)
		}
		countExpr = fmt.Sprintf(
			"(SELECT COUNT(*) FROM subject_relations r WHERE r.subject_id = %s.id AND r.relation_type IN (%s))",
			alias, intListToSQL(relIDs),
		)
	}
	return b.buildCondition(countExpr, f.Operator, fmt.Sprintf("%v", f.Value))
}

// staffFilter handles staff/person-based filtering.
func (b *SQLBuilder) staffFilter(f *config.StaffFilter) (string, error) {
	posIDs := b.getPositionIDsForName(f.Position)
	if len(posIDs) == 0 {
		return "", fmt.Errorf("未找到职位类型: %s", f.Position)
	}
	posIDList := intListToSQL(posIDs)

	// For person target: conditions on associated subjects (like relation filter)
	if b.target == "person" {
		// none mode: exclude persons with this position
		if f.Mode == "none" {
			return fmt.Sprintf(
				"NOT EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.person_id = p.person_id AND sp.position IN (%s))",
				posIDList), nil
		}

		// Build conditions on associated subjects using buildWhereForAlias (same as relation filter)
		subClauses := []string{fmt.Sprintf("sp.position IN (%s)", posIDList)}
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

		if f.Mode == "all" {
			condWhere := "TRUE"
			if len(f.Conditions) > 0 {
				condWhere, _ = b.buildWhereForAlias(f.Conditions, "rs")
			}
			return fmt.Sprintf(
				`(SELECT COUNT(*) FROM subject_persons sp LEFT JOIN subjects rs ON sp.subject_id = rs.id WHERE sp.person_id = p.person_id AND sp.position IN (%s) AND %s) =
				 (SELECT COUNT(*) FROM subject_persons sp WHERE sp.person_id = p.person_id AND sp.position IN (%s))`,
				posIDList, condWhere, posIDList), nil
		}

		return fmt.Sprintf(
			"EXISTS (SELECT 1 FROM subject_persons sp LEFT JOIN subjects rs ON sp.subject_id = rs.id WHERE sp.person_id = p.person_id AND %s)",
			subWhere), nil
	}

	// Subject target: conditions on persons

	// none mode: exclude subjects with this position
	if f.Mode == "none" {
		return fmt.Sprintf(
			"NOT EXISTS (SELECT 1 FROM subject_persons sp WHERE sp.subject_id = s.id AND sp.position IN (%s))",
			posIDList), nil
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

	if f.Mode == "all" {
		return fmt.Sprintf(
			`(SELECT COUNT(*) FROM %s WHERE sp.subject_id = s.id AND sp.position IN (%s) AND %s) =
			 (SELECT COUNT(*) FROM subject_persons sp WHERE sp.subject_id = s.id AND sp.position IN (%s))`,
			fromClause, posIDList, personWhere, posIDList), nil
	}

	return fmt.Sprintf(
		"EXISTS (SELECT 1 FROM %s WHERE sp.subject_id = s.id AND sp.position IN (%s) AND %s)",
		fromClause, posIDList, personWhere), nil
}

// buildPersonWhereForAlias generates WHERE clauses for person-level nested conditions.
func (b *SQLBuilder) buildPersonWhereForAlias(filters []config.Filter) (string, error) {
	if len(filters) == 0 {
		return "TRUE", nil
	}
	var clauses []string
	for i, f := range filters {
		clause, err := b.personFilterForAlias(f, i)
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

// personFilterForAlias dispatches a single filter for person-level conditions.
func (b *SQLBuilder) personFilterForAlias(f config.Filter, idx int) (string, error) {
	switch {
	case f.Field != nil:
		return b.personFieldFilterForAlias(f.Field)
	case f.Global != nil:
		return b.personGlobalFilterForAlias(f.Global)
	case f.Type != nil:
		return b.personTypeFilterForAlias(f.Type)
	case f.Count != nil:
		return b.personCountFilterForAlias(f.Count)
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

// personCountFilterForAlias builds a count filter on person appearances.
func (b *SQLBuilder) personCountFilterForAlias(f *config.CountFilter) (string, error) {
	var countExpr string
	if f.What == "ep" {
		countExpr = "(SELECT COUNT(*) FROM subject_persons sp2 WHERE sp2.person_id = p.person_id)"
	} else {
		posIDs := b.getPositionIDsForName(f.What)
		if len(posIDs) == 0 {
			return "", fmt.Errorf("未找到职位类型用于计数: %s", f.What)
		}
		countExpr = fmt.Sprintf(
			"(SELECT COUNT(*) FROM subject_persons sp2 WHERE sp2.person_id = p.person_id AND sp2.position IN (%s))",
			intListToSQL(posIDs))
	}
	return b.buildCondition(countExpr, f.Operator, fmt.Sprintf("%v", f.Value))
}

// episodeFilter handles episode-based filtering.
func (b *SQLBuilder) episodeFilter(f *config.EpisodeFilter) (string, error) {
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
		// Every episode must match
		return fmt.Sprintf(
			`(SELECT COUNT(*) FROM episodes e WHERE e.subject_id = s.id AND %s) =
			 (SELECT COUNT(*) FROM episodes e WHERE e.subject_id = s.id)`,
			strings.Join(normalConds, " AND ")), nil
	}

	return fmt.Sprintf(
		"EXISTS (SELECT 1 FROM episodes e WHERE e.subject_id = s.id AND %s)",
		subWhere), nil
}

// episodeFieldFilter builds a field filter on episode data.
func (b *SQLBuilder) episodeFieldFilter(f *config.FieldFilter) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	switch f.Field {
	case "name", "name_cn", "description", "airdate", "duration", "sort", "type", "disc", "id":
		return b.buildCondition("e."+quoteIdent(f.Field), f.Operator, valueStr)
	default:
		return "", fmt.Errorf("unknown episode field: %s", f.Field)
	}
}

// countFilter handles count-based filtering (number of relations or episodes).
func (b *SQLBuilder) countFilter(f *config.CountFilter) (string, error) {
	var countExpr string
	if f.What == "ep" {
		countExpr = "(SELECT COUNT(*) FROM episodes e WHERE e.subject_id = s.id)"
	} else {
		relIDs := b.getRelationIDsForName(f.What)
		if len(relIDs) == 0 {
			return "", fmt.Errorf("未找到关系类型用于计数: %s", f.What)
		}
		countExpr = fmt.Sprintf(
			"(SELECT COUNT(*) FROM subject_relations r WHERE r.subject_id = s.id AND r.relation_type IN (%s))",
			intListToSQL(relIDs),
		)
	}

	return b.buildCondition(countExpr, f.Operator, fmt.Sprintf("%v", f.Value))
}

// buildCondition generates a SQL comparison expression.
func (b *SQLBuilder) buildCondition(expr, op, value string) (string, error) {
	switch op {
	case "eq":
		return fmt.Sprintf("CAST(%s AS VARCHAR) = '%s'", expr, escapeSQLString(value)), nil
	case "contains":
		return fmt.Sprintf("CAST(%s AS VARCHAR) LIKE '%%%s%%'", expr, escapeLike(value)), nil
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
// Uses minimal nesting to avoid DuckDB expression depth limits.
func normalizeDate(expr string) string {
	// Step 1: Replace Chinese date markers (年→-, 月→-) with a single regexp_replace
	// Step 2: Remove 日 suffix
	// Step 3: Trim and pad partial dates
	normalized := fmt.Sprintf(
		"regexp_replace(regexp_replace(TRIM(%s), '[年月]', '-'), '日', '')",
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
	cols := b.cfg.Output.Columns
	a := b.mainAlias
	if len(cols) == 0 {
		if b.target == "person" {
			return []string{a + ".person_id as id", a + ".name", a + ".career"}
		}
		return []string{a + ".id", a + ".name", a + ".name_cn", a + ".type", a + ".score", a + ".date"}
	}

	var result []string
	for _, col := range cols {
		switch {
		case col == "id" || col == "ID":
			if b.target == "person" {
				result = append(result, a+".person_id as id")
			} else {
				result = append(result, a+".id")
			}
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
	default:
		return false
	}
}

// mainDot returns the main table alias followed by a dot (e.g., "s." or "p.").
func (b *SQLBuilder) mainDot() string { return b.mainAlias + "." }

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

func regexEscapeFieldName(name string) string {
	// For Chinese field names, most regex chars don't appear
	// But be safe and escape
	return escapeRegex(name)
}

func (b *SQLBuilder) safeNum(v string) string {
	// Ensure the value is a valid number expression
	v = strings.TrimSpace(v)
	if v == "" {
		return "0"
	}
	return v
}
