package query

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/inchei/bangumi-query/internal/config"
	"github.com/inchei/bangumi-query/internal/model"
)

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

// buildFieldExpr builds a DuckDB expression to read a field value from an alias,
// handling direct fields, infobox extraction, date normalization, and numeric extraction.
func (b *SQLBuilder) buildFieldExpr(field, alias string, isDate, isNumeric bool) string {
	var expr string
	if b.isDirectField(field) {
		expr = alias + "." + quoteIdent(field)
	} else {
		expr = b.infoboxExtractExpr(field, alias)
	}
	switch {
	case isDate:
		expr = b.infoboxFirstDateExpr(field, alias)
	case isNumeric:
		expr = extractNum(expr)
	}
	return expr
}

// splitFieldRef splits a field reference like "连载开始+300" into ("连载开始", "+300").
func splitFieldRef(s string) (field, modifier string) {
	for i := 1; i < len(s); i++ {
		if s[i] == '+' || s[i] == '-' || s[i] == '*' || s[i] == '/' {
			return s[:i], s[i:]
		}
	}
	return s, ""
}

// buildFieldCompare generates a field-to-field comparison condition.
// rhsModifier is an optional arithmetic suffix like "+300" to apply to the RHS expression.
func (b *SQLBuilder) buildFieldCompare(lhsField, rhsField, rhsModifier, op, lhsAlias, rhsAlias string) (string, error) {
	isDate := dateFields[lhsField] && dateFields[rhsField] && (op == "before" || op == "after")
	isNumeric := isNumericOp(op)
	lhs := b.buildFieldExpr(lhsField, lhsAlias, isDate, isNumeric)
	rhs := b.buildFieldExpr(rhsField, rhsAlias, isDate, isNumeric)

	switch op {
	case "eq":
		return fmt.Sprintf("CAST(%s AS VARCHAR) = CAST(%s AS VARCHAR)", lhs, rhs), nil
	case "gt":
		return fmt.Sprintf("%s > %s", lhs, rhs), nil
	case "gte":
		return fmt.Sprintf("%s >= %s", lhs, rhs), nil
	case "lt":
		return fmt.Sprintf("%s < %s", lhs, rhs), nil
	case "lte":
		return fmt.Sprintf("%s <= %s", lhs, rhs), nil
	case "before":
		return fmt.Sprintf("%s < %s", normalizeDate(lhs), b.applyDateModifier(normalizeDate(rhs), rhsModifier)), nil
	case "after":
		return fmt.Sprintf("%s > %s", normalizeDate(lhs), b.applyDateModifier(normalizeDate(rhs), rhsModifier)), nil
	case "contains":
		return fmt.Sprintf("CAST(%s AS VARCHAR) LIKE '%%' || CAST(%s AS VARCHAR) || '%%'", lhs, rhs), nil
	case "not_contains":
		return fmt.Sprintf("CAST(%s AS VARCHAR) NOT LIKE '%%' || CAST(%s AS VARCHAR) || '%%' AND TRIM(CAST(%s AS VARCHAR)) <> ''", lhs, rhs, lhs), nil
	case "regex":
		return fmt.Sprintf("regexp_matches(CAST(%s AS VARCHAR), CAST(%s AS VARCHAR))", lhs, rhs), nil
	default:
		return "", fmt.Errorf("field compare: unsupported operator %q", op)
	}
}

// applyDateModifier wraps a date expression with an optional arithmetic modifier.
// E.g., for expr=TRY_CAST(date AS DATE) and modifier="+300" → (TRY_CAST(date AS DATE) + 300)
func (b *SQLBuilder) applyDateModifier(expr, modifier string) string {
	if modifier == "" {
		return expr
	}
	return fmt.Sprintf("(%s %s)", expr, modifier)
}

func (b *SQLBuilder) fieldFilter(f *config.FieldFilter, tableAlias string) (string, error) {
	// Field-to-field comparison: value starting with "$" references another field
	// "$main." prefix references the main entity (e.g., parent subject's id)
	valueStr := fmt.Sprintf("%v", f.Value)
	if strings.HasPrefix(valueStr, "$") {
		refValue := valueStr[1:]
		refAlias := tableAlias
		if strings.HasPrefix(refValue, "main.") {
			refAlias = b.mainAlias
			refValue = refValue[5:]
		}
		refField, modifier := splitFieldRef(refValue)
		return b.buildFieldCompare(f.Field, refField, modifier, f.Operator, tableAlias, refAlias)
	}

	fieldName := f.Field

	// Map "type" to "person_type" for person target
	if b.target == "person" && fieldName == "type" {
		fieldName = "person_type"
	}
	// Map "id" to actual column name (differs when CTE renames id→person_id etc.)
	if fieldName == "id" {
		fieldName = b.actualColumn("id")
	}

	// Handle career as LIST_CONTAINS for person target
	if b.target == "person" && fieldName == "career" {
		switch f.Operator {
		case "regex":
			return fmt.Sprintf("regexp_matches(%s.career::VARCHAR, '%s')", tableAlias, sqlEscapeRegexString(valueStr)), nil
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

	// Infobox field — extract with regex, and apply numeric/date extraction for comparison ops
	fieldExpr := b.infoboxExtractExpr(f.Field, tableAlias)
	if dateFields[f.Field] && (f.Operator == "before" || f.Operator == "after") {
		fieldExpr = b.infoboxFirstDateExpr(f.Field, tableAlias)
	}
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
		return fmt.Sprintf("regexp_matches(%s, '%s')", infobox, sqlEscapeRegexString(valueStr)), nil
	case "not_regex":
		return fmt.Sprintf("NOT regexp_matches(%s, '%s')", infobox, sqlEscapeRegexString(valueStr)), nil
	case "contains":
		return fmt.Sprintf("%s LIKE '%%%s%%'", infobox, escapeLike(valueStr)), nil
	case "eq":
		return fmt.Sprintf("%s = '%s'", infobox, escapeSQLString(valueStr)), nil
	default:
		return "", fmt.Errorf("global filter: unsupported operator %q", f.Operator)
	}
}

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
	if strings.HasPrefix(valueStr, "$") {
		refValue := valueStr[1:]
		refAlias := alias
		if strings.HasPrefix(refValue, "main.") {
			refAlias = b.mainAlias
			refValue = refValue[5:]
		}
		refField, modifier := splitFieldRef(refValue)
		return b.buildFieldCompare(f.Field, refField, modifier, f.Operator, alias, refAlias)
	}
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
		return fmt.Sprintf("regexp_matches(%s.infobox, '%s')", alias, sqlEscapeRegexString(valueStr)), nil
	case "not_regex":
		return fmt.Sprintf("NOT regexp_matches(%s.infobox, '%s')", alias, sqlEscapeRegexString(valueStr)), nil
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

func (b *SQLBuilder) staffFilter(f *config.StaffFilter) (string, error) {
	nested := getNestedConfig(b.target, "staff")
	if nested == nil {
		return "", fmt.Errorf("staff filter not supported for target %s", b.target)
	}

	// Collect positions: Positions overrides single Position
	positions := f.Positions
	if len(positions) == 0 && f.Position != "" {
		positions = []string{f.Position}
	}

	if len(positions) == 0 {
		positions = []string{""} // wildcard — any position
	}

	// Resolve position names to ID sets
	posIDSets := make([][]int, len(positions))
	for i, name := range positions {
		if name == "" || name == "任意" {
			posIDSets[i] = nil // nil means wildcard
		} else {
			ids := b.getPositionIDsForName(name)
			if len(ids) == 0 {
				return "", fmt.Errorf("未找到职位类型: %s", name)
			}
			posIDSets[i] = ids
		}
	}

	// Build person conditions
	var personWhere string
	if b.target == "subject" && len(f.Conditions) > 0 {
		var err error
		personWhere, err = b.buildPersonWhereForAlias(f.Conditions, nested.junctionTable)
		if err != nil {
			return "", fmt.Errorf("staff condition: %w", err)
		}
	}

	// Multi-position: self-join to check same person across position groups
	if len(positions) > 1 {
		return b.multiStaffFilter(nested, posIDSets, personWhere, f)
	}

	// Single position: use existing manyToMany logic
	ja := nested.junctionTable
	posCond := "TRUE"
	if posIDSets[0] != nil {
		posCond = fmt.Sprintf("%s.position IN (%s)", ja, intListToSQL(posIDSets[0]))
	}

	var relatedWhere string
	var relatedJoin string
	if b.target == "person" {
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
		if len(f.Conditions) > 0 {
			var err error
			relatedWhere, err = b.buildPersonWhereForAlias(f.Conditions, ja)
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
		extraCond:      posCond,
		relatedWhere:   relatedWhere,
		relatedJoin:    relatedJoin,
		mode:           f.Mode,
		countOp:        f.CountOp,
		countVal:       f.CountVal,
		countDistinct:  posIDSets[0] == nil,
	})
}

func (b *SQLBuilder) multiStaffFilter(nested *nestedEntityConfig, posIDSets [][]int, personWhere string, f *config.StaffFilter) (string, error) {
	jt := nested.junctionTable
	ma := b.mainAlias
	mp := nested.mainPK
	jmf := nested.junctionMainFK

	// Build self-join chain: sp1 ↔ sp2 ↔ sp3 ... all sharing same person_id
	var joins []string
	var conds []string
	for i := range posIDSets {
		alias := fmt.Sprintf("sp%d", i+1)
		if i == 0 {
			cond := "TRUE"
			if posIDSets[i] != nil {
				cond = fmt.Sprintf("%s.position IN (%s)", alias, intListToSQL(posIDSets[i]))
			}
			conds = append(conds, fmt.Sprintf("%s.%s = %s.%s AND %s", alias, jmf, ma, mp, cond))
		} else {
			joins = append(joins, fmt.Sprintf("JOIN %s %s ON %s.%s = sp1.%s AND %s.%s = sp1.%s",
				jt, alias, alias, jmf, jmf, alias, nested.relatedFK, nested.relatedFK))
			cond := "TRUE"
			if posIDSets[i] != nil {
				cond = fmt.Sprintf("%s.position IN (%s)", alias, intListToSQL(posIDSets[i]))
			}
			conds = append(conds, cond)
		}
	}

	baseConds := strings.Join(conds, " AND ")
	joinsBase := append([]string(nil), joins...)
	allConds := baseConds
	joinsAll := joinsBase
	if personWhere != "" && personWhere != "TRUE" {
		allConds += " AND " + personWhere
		joinsAll = append(append([]string(nil), joinsBase...), fmt.Sprintf("LEFT JOIN %s %s ON sp1.%s = %s.%s",
			nested.relatedTable, nested.relatedAlias, nested.relatedFK, nested.relatedAlias, nested.relatedPK))
	}

	// count / all semantics: works (or persons) where the same entity holds all
	// the listed positions at once, counted / compared with DISTINCT dedup.
	if f.Mode == "count" {
		countExpr := fmt.Sprintf("(SELECT COUNT(DISTINCT sp1.%s) FROM %s sp1 %s WHERE %s)",
			nested.relatedFK, jt, strings.Join(joinsAll, " "), allConds)
		return b.buildCondition(countExpr, f.CountOp, fmt.Sprintf("%v", f.CountVal))
	}
	if f.Mode == "all" {
		existsClause := fmt.Sprintf("EXISTS (SELECT 1 FROM %s sp1 %s WHERE %s)",
			jt, strings.Join(joinsBase, " "), baseConds)
		matchCount := fmt.Sprintf("(SELECT COUNT(DISTINCT sp1.%s) FROM %s sp1 %s WHERE %s)",
			nested.relatedFK, jt, strings.Join(joinsAll, " "), allConds)
		totalCount := fmt.Sprintf("(SELECT COUNT(DISTINCT sp1.%s) FROM %s sp1 %s WHERE %s)",
			nested.relatedFK, jt, strings.Join(joinsBase, " "), baseConds)
		return fmt.Sprintf("%s AND\n %s =\n %s", existsClause, matchCount, totalCount), nil
	}

	// none mode
	if f.Mode == "none" {
		return fmt.Sprintf("NOT EXISTS (SELECT 1 FROM %s sp1 %s WHERE %s)",
			jt, strings.Join(joinsAll, " "), allConds), nil
	}

	// any mode
	return fmt.Sprintf("EXISTS (SELECT 1 FROM %s sp1 %s WHERE %s)",
		jt, strings.Join(joinsAll, " "), allConds), nil
}

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

// isPersonCharacterTypeName reports whether name is a person_character type
// (CV, 演员, 日配, ...).
func (b *SQLBuilder) isPersonCharacterTypeName(name string) bool {
	for _, cnName := range model.PersonCharacterTypes {
		if cnName == name {
			return true
		}
	}
	return false
}

// buildPersonWhereForAlias generates WHERE clauses for person-level nested conditions.
func (b *SQLBuilder) buildPersonWhereForAlias(filters []config.Filter, junctionAlias string) (string, error) {
	return b.buildClauses(filters, clauseContext{alias: "p", isPersonCtx: true, junctionAlias: junctionAlias})
}

// personFilterForAlias dispatches a single filter for person-level conditions.
// filterForNestedContext dispatches a single filter for nested entity conditions (person/character).
func (b *SQLBuilder) filterForNestedContext(f config.Filter, idx int, nestedAlias string, fieldMap map[string]string, typeCol string, junctionAlias string) (string, error) {
	switch {
	case f.Field != nil:
		return b.fieldFilterForNested(f.Field, nestedAlias, fieldMap, junctionAlias)
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
func (b *SQLBuilder) fieldFilterForNested(f *config.FieldFilter, nestedAlias string, fieldMap map[string]string, junctionAlias string) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	if strings.HasPrefix(valueStr, "$") {
		refValue := valueStr[1:]
		refAlias := nestedAlias
		if strings.HasPrefix(refValue, "main.") {
			refAlias = b.mainAlias
			refValue = refValue[5:]
		}
		refField, modifier := splitFieldRef(refValue)
		return b.buildFieldCompare(f.Field, refField, modifier, f.Operator, nestedAlias, refAlias)
	}

	// Special case: appear_eps in staff person context references junction table
	if f.Field == "appear_eps" && junctionAlias != "" {
		return b.buildCondition(junctionAlias+".appear_eps", f.Operator, valueStr)
	}

	// Check field map for direct column mapping
	if expr, ok := fieldMap[f.Field]; ok {
		// Special case: rank 0 means no ranking
		if f.Field == "rank" {
			switch f.Operator {
			case "empty":
				return fmt.Sprintf("(%s = 0 OR %s IS NULL)", expr, expr), nil
			case "gt", "gte", "lt", "lte":
				cond, _ := b.buildCondition(expr, f.Operator, valueStr)
				return fmt.Sprintf("%s != 0 AND %s", expr, cond), nil
			}
		}
		return b.buildCondition(expr, f.Operator, valueStr)
	}

	// Special case: rank on infobox fields (not in fieldMap)
	if f.Field == "rank" {
		col := nestedAlias + "." + quoteIdent("rank")
		switch f.Operator {
		case "empty":
			return fmt.Sprintf("(%s = 0 OR %s IS NULL)", col, col), nil
		case "gt", "gte", "lt", "lte":
			cond, _ := b.buildCondition(col, f.Operator, valueStr)
			return fmt.Sprintf("%s != 0 AND %s", col, cond), nil
		}
	}

	// Special case: career field (person only) — LIST_CONTAINS
	if f.Field == "career" {
		if f.Operator == "regex" {
			return fmt.Sprintf("regexp_matches(%s.career::VARCHAR, '%s')", nestedAlias, sqlEscapeRegexString(valueStr)), nil
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
	if dateFields[f.Field] && (f.Operator == "before" || f.Operator == "after") {
		fieldExpr = b.infoboxFirstDateExpr(f.Field, nestedAlias)
	}
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
		return fmt.Sprintf("regexp_matches(%s.infobox, '%s')", nestedAlias, sqlEscapeRegexString(valueStr)), nil
	case "not_regex":
		return fmt.Sprintf("NOT regexp_matches(%s.infobox, '%s')", nestedAlias, sqlEscapeRegexString(valueStr)), nil
	case "contains":
		return fmt.Sprintf("%s.infobox LIKE '%%%s%%'", nestedAlias, escapeLike(valueStr)), nil
	default:
		return "", fmt.Errorf("global filter: unsupported operator %q", f.Operator)
	}
}

// personEntityFieldMap maps person field names to direct columns on the persons table (alias "p").
// Used when filtering person attributes inside staff/relation subqueries,
// where the junction table alias is NOT "sp".
var personEntityFieldMap = map[string]string{
	"person_id": "p.person_id",
	"id":        "p.person_id",
	"name":      "p.name",
	"type":      "p.person_type",
	"career":    "p.career",
}

// characterEntityFieldMap maps character field names to direct columns on the characters table (alias "c").
var characterEntityFieldMap = map[string]string{
	"character_id": "c.character_id",
	"id":           "c.character_id",
	"name":         "c.name",
	"role":         "c.role",
	"comments":     "c.comments",
	"collects":     "c.collects",
}

// personFilterForAlias dispatches a single filter for person-level conditions.
func (b *SQLBuilder) personFilterForAlias(f config.Filter, idx int, junctionAlias string) (string, error) {
	return b.filterForNestedContext(f, idx, "p", personEntityFieldMap, "p.person_type", junctionAlias)
}

// characterFilterForAlias dispatches a single filter for character-level conditions.
func (b *SQLBuilder) characterFilterForAlias(f config.Filter, idx int) (string, error) {
	return b.filterForNestedContext(f, idx, "c", characterEntityFieldMap, "", "")
}

func (b *SQLBuilder) episodeFilter(f *config.EpisodeFilter) (string, error) {
	if f.Logic == nil {
		return "TRUE", nil
	}
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

// episodeFieldFilter builds a field filter on episode data.
func (b *SQLBuilder) episodeFieldFilter(f *config.FieldFilter) (string, error) {
	valueStr := fmt.Sprintf("%v", f.Value)
	switch f.Field {
	case "id", "episode_id":
		return b.buildCondition("e.episode_id", f.Operator, valueStr)
	case "name", "name_cn", "description", "airdate", "duration", "sort", "disc", "subject_id":
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
		return fmt.Sprintf("CAST(%s AS VARCHAR) NOT LIKE '%%%s%%' AND TRIM(CAST(%s AS VARCHAR)) <> ''", expr, escapeLike(value), expr), nil
	case "regex":
		// CAST is required: regexp_matches has no overload for non-VARCHAR
		// first arguments (e.g. DOUBLE columns like s.score).
		return fmt.Sprintf("regexp_matches(CAST(%s AS VARCHAR), '%s')", expr, sqlEscapeRegexString(value)), nil
	case "not_regex":
		return fmt.Sprintf("NOT regexp_matches(CAST(%s AS VARCHAR), '%s') AND TRIM(CAST(%s AS VARCHAR)) <> ''", expr, sqlEscapeRegexString(value), expr), nil
	case "empty":
		return fmt.Sprintf("COALESCE(CAST(%s AS VARCHAR), '') = ''", expr), nil
	case "gt":
		num, err := safeNum(value)
		if err != nil {
			return "", err
		}
		return fmt.Sprintf("CAST(%s AS DOUBLE) > %s", expr, num), nil
	case "gte":
		num, err := safeNum(value)
		if err != nil {
			return "", err
		}
		return fmt.Sprintf("CAST(%s AS DOUBLE) >= %s", expr, num), nil
	case "lt":
		num, err := safeNum(value)
		if err != nil {
			return "", err
		}
		return fmt.Sprintf("CAST(%s AS DOUBLE) < %s", expr, num), nil
	case "lte":
		num, err := safeNum(value)
		if err != nil {
			return "", err
		}
		return fmt.Sprintf("CAST(%s AS DOUBLE) <= %s", expr, num), nil
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
