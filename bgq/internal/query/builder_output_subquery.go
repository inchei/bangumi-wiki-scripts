package query

import (
	"fmt"
	"strings"
)

// assocSubConfig configures a correlated subquery for association type output columns.
type assocSubConfig struct {
	junction     string          // table name
	ja           string          // table alias
	mainFK       string          // FK in junction referencing main entity
	entityJoin   string          // LEFT JOIN clause (empty if no join needed)
	typeCond     string          // type/position filter condition
	extraWhere   string          // additional conditions from filter
	entityAlias  string          // entity alias for field resolution
	entityPK     string          // entity primary key column ("id" for subjects; persons/characters/episodes rename it to person_id/character_id/episode_id)
	field        string          // field name (supports "count")
	label        string          // column label (already quoted)
	directFields map[string]bool // direct fields for this entity type
	distinct     bool            // deduplicate the aggregation by entity
	subjectAlias string          // when set, group members prefixed "s." resolve against this subjects alias
}

// buildAssocSubquery generates a correlated subquery for association field output.
func (b *SQLBuilder) buildAssocSubquery(cfg assocSubConfig) (string, error) {
	field := cfg.field

	// Group JSON output: "{f1|f2|...}" → JSON array.
	if groupFields, isGroup := parseGroupField(field); isGroup {
		return b.buildAssocGroupSubquery(cfg, groupFields)
	}

	// "~min"/"~max" suffix selects min/max aggregation for sorting association columns.
	aggMinMax := ""
	if strings.HasSuffix(field, "~min") || strings.HasSuffix(field, "~max") {
		aggMinMax = field[len(field)-3:]
		field = strings.TrimSuffix(field, "~"+aggMinMax)
	}

	pred := cfg.typeCond
	if cfg.extraWhere != "" && cfg.extraWhere != "TRUE" {
		pred = pred + " AND " + cfg.extraWhere
	}
	mainRef := fmt.Sprintf("%s.%s", b.mainAlias, b.tc.idColumn)

	entityPK := cfg.entityPK
	if entityPK == "" {
		entityPK = "id"
	}

	// Count mode
	if field == "count" && aggMinMax == "" {
		if cfg.distinct {
			return fmt.Sprintf(
				"(SELECT COUNT(DISTINCT %s.%s) FROM %s %s %s WHERE %s.%s = %s AND %s) AS %s",
				cfg.entityAlias, entityPK, cfg.junction, cfg.ja, cfg.entityJoin, cfg.ja, cfg.mainFK, mainRef, pred, cfg.label,
			), nil
		}
		return fmt.Sprintf(
			"(SELECT COUNT(*) FROM %s %s %s WHERE %s.%s = %s AND %s) AS %s",
			cfg.junction, cfg.ja, cfg.entityJoin, cfg.ja, cfg.mainFK, mainRef, pred, cfg.label,
		), nil
	}

	// Build field expression
	ea := cfg.entityAlias
	var fieldExpr string
	if field == "id" || field == "ID" {
		fieldExpr = ea + "." + entityPK
	} else if cfg.directFields[field] {
		fieldExpr = ea + "." + quoteIdent(field)
	} else {
		fieldExpr = b.infoboxExtractExpr(field, ea)
	}

	// Min/max aggregation for association columns: normalize dates/numbers
	// first so min/max are chronological / numeric.
	if aggMinMax != "" {
		fe := fieldExpr
		if dateFields[field] {
			fe = normalizeDate(fe)
		} else if numericFields[field] {
			fe = extractNum(fe)
		}
		return fmt.Sprintf(
			"(SELECT %s(%s) FROM %s %s %s WHERE %s.%s = %s AND %s) AS %s",
			aggMinMax, fe, cfg.junction, cfg.ja, cfg.entityJoin, cfg.ja, cfg.mainFK, mainRef, pred, cfg.label,
		), nil
	}

	lim := b.assocLimit()
	if cfg.distinct {
		// Deduplicate by entity then aggregate, ordering by the entity PK.
		return fmt.Sprintf(
			`(SELECT string_agg(CAST("agg"."_v" AS VARCHAR), ', ' ORDER BY "agg"."%[1]s") FROM (SELECT DISTINCT %[2]s.%[1]s AS "%[1]s", %[3]s AS "_v" FROM %[4]s %[5]s %[6]s WHERE %[5]s.%[7]s = %[8]s AND %[9]s ORDER BY %[2]s.%[1]s LIMIT %[11]d) "agg") AS %[10]s`,
			entityPK, ea, fieldExpr, cfg.junction, cfg.ja, cfg.entityJoin, cfg.mainFK, mainRef, pred, cfg.label, lim,
		), nil
	}
	return fmt.Sprintf(
		`(SELECT string_agg(CAST(t."_v" AS VARCHAR), ', ' ORDER BY t."_ord") FROM (SELECT %s AS "_v", %s.%s AS "_ord" FROM %s %s %s WHERE %s.%s = %s AND %s ORDER BY %s.%s LIMIT %d) t) AS %s`,
		fieldExpr, ea, entityPK, cfg.junction, cfg.ja, cfg.entityJoin, cfg.ja, cfg.mainFK, mainRef, pred, ea, entityPK, lim, cfg.label,
	), nil
}

// parseGroupField parses a "{f1|f2|...}" field into its member fields.
// Uses "|" (not ",") so the group column stays a single field when output
// columns are comma-separated in the UI/YAML. Returns (fields, isGroup).
func parseGroupField(field string) ([]string, bool) {
	if !strings.HasPrefix(field, "{") {
		return nil, false
	}
	end := strings.Index(field, "}")
	if end < 0 {
		return nil, false
	}
	var fields []string
	for _, f := range strings.Split(field[1:end], "|") {
		if f = strings.TrimSpace(f); f != "" {
			fields = append(fields, f)
		}
	}
	return fields, len(fields) > 0
}

// buildAssocGroupSubquery generates a JSON array of related entries, each an
// object of the group's fields. Empty values become null.
func (b *SQLBuilder) buildAssocGroupSubquery(cfg assocSubConfig, groupFields []string) (string, error) {
	pred := cfg.typeCond
	if cfg.extraWhere != "" && cfg.extraWhere != "TRUE" {
		pred = pred + " AND " + cfg.extraWhere
	}
	mainRef := fmt.Sprintf("%s.%s", b.mainAlias, b.tc.idColumn)
	entityPK := cfg.entityPK
	if entityPK == "" {
		entityPK = "id"
	}
	ea := cfg.entityAlias

	args := make([]string, len(groupFields))
	for i, gf := range groupFields {
		var e string
		if sub, ok := strings.CutPrefix(gf, "s."); ok && cfg.subjectAlias != "" {
			// Subject-level member (person_character / character_person):
			// resolve against the joined subjects alias, keep "s.x" as key.
			e = b.resolveAssocField(sub, cfg.subjectAlias, "id", subjectDirectFields)
		} else {
			e = b.resolveAssocField(gf, ea, entityPK, cfg.directFields)
		}
		args[i] = fmt.Sprintf("%s := NULLIF(CAST(%s AS VARCHAR), '')", quoteIdent(gf), e)
	}
	structArgs := strings.Join(args, ", ")

	orderExpr, asc, _ := b.groupOrderBy(cfg.label, groupFields, ea, entityPK, cfg.directFields, cfg.subjectAlias)
	orderClause := ""
	if orderExpr != "" {
		dir := "DESC"
		if asc {
			dir = "ASC"
		}
		orderClause = fmt.Sprintf(" ORDER BY %s %s", orderExpr, dir)
	} else {
		orderClause = fmt.Sprintf(" ORDER BY %s.%s ASC", ea, entityPK)
	}

	return fmt.Sprintf(
		"(SELECT to_json(list(_r._s)) FROM (SELECT struct_pack(%s) AS _s FROM %s %s %s WHERE %s.%s = %s AND %s%s LIMIT %d) _r) AS %s",
		structArgs, cfg.junction, cfg.ja, cfg.entityJoin, cfg.ja, cfg.mainFK, mainRef, pred, orderClause, b.assocLimit(), cfg.label,
	), nil
}

// resolveAssocField maps an output field name to a SQL expression on the given
// entity alias: "id" → PK column, direct fields → quoted column, otherwise an
// infobox extraction.
func (b *SQLBuilder) resolveAssocField(field, alias, entityPK string, directFields map[string]bool) string {
	if field == "id" || field == "ID" {
		return alias + "." + entityPK
	}
	if directFields[field] {
		return alias + "." + quoteIdent(field)
	}
	return b.infoboxExtractExpr(field, alias)
}

// groupOrderBy finds a sort rule matching the group column's prefix and one of
// its member fields (e.g. group 导演.{name|生日|id} with sort 导演.生日),
// returning the normalized ORDER BY expression and ascending direction.
// Members prefixed "s." resolve against subjectAlias (subjects join).
func (b *SQLBuilder) groupOrderBy(label string, groupFields []string, ea, entityPK string, directFields map[string]bool, subjectAlias string) (string, bool, bool) {
	idx := strings.Index(label, ".{")
	if idx < 0 {
		return "", false, false
	}
	prefix := label[1:idx]
	for _, s := range b.cfg.Sort {
		sf := s.Field
		parts := strings.SplitN(sf, ".", 2)
		if len(parts) != 2 || parts[0] != prefix {
			continue
		}
		f := parts[1]
		if !containsString(groupFields, f) {
			continue
		}
		name, alias, pk, df := f, ea, entityPK, directFields
		if sub, ok := strings.CutPrefix(f, "s."); ok && subjectAlias != "" {
			name, alias, pk, df = sub, subjectAlias, "id", subjectDirectFields
		}
		e := b.resolveAssocField(name, alias, pk, df)
		if dateFields[name] {
			e = normalizeDate(e)
		} else if numericFields[name] {
			e = extractNum(e)
		}
		return e, s.Direction != "desc", true
	}
	return "", false, false
}
