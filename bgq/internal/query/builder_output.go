package query

import (
	"fmt"
	"strings"

	"github.com/inchei/bangumi-query/internal/config"
)

// outputCTENeeds records which junction CTEs are required purely by
// association output columns (e.g. "原作.name", "episode.id"), independent of
// the filters. Prefix resolution mirrors the switch in buildSelect.
type outputCTENeeds struct {
	relations          bool // subject_relations
	persons            bool // subject_persons + persons
	characters         bool // subject_characters + characters
	personRelations    bool // person_relations
	characterRelations bool // character_relations
	personCharacters   bool // person_characters
	episodes           bool
}

// cteNeedsFromOutputColumns scans cfg.Output.Columns for "prefix.field"
// association columns and reports which junction CTEs they need.
func (b *SQLBuilder) cteNeedsFromOutputColumns() outputCTENeeds {
	var n outputCTENeeds
	if b.cfg.Output == nil {
		return n
	}
	for _, col := range b.cfg.Output.Columns {
		prefix, _, ok := strings.Cut(col, ".")
		if !ok {
			continue
		}
		switch {
		case prefix == "episode":
			n.episodes = true
		case len(b.getRelationIDsForName(prefix)) > 0:
			n.relations = true
		case b.target == "subject" && len(b.getPositionIDsForName(prefix)) > 0:
			n.persons = true
		case b.target == "subject":
			if _, ok := b.getCharacterAssociationTypeID(prefix); ok {
				n.characters = true
			}
		case b.target == "person" && len(b.getPersonRelationIDsForName(prefix)) > 0:
			n.personRelations = true
		case b.target == "character" && len(b.getCharacterRelationIDsForName(prefix)) > 0:
			n.characterRelations = true
		case (b.target == "person" || b.target == "character") && b.isPersonCharacterTypeName(prefix):
			n.personCharacters = true
		}
	}
	return n
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
		// Association output column syntax: "类型.字段名", "类型.字段名+",
		// or "类型.s.字段名" (subject-level field for person_character /
		// character_person types, e.g. CV.s.name).
		if subquery, ok, err := b.assocOutputColumn(col); ok && err == nil {
			result = append(result, subquery)
			continue
		}

		realCol := b.actualColumn(col)
		switch {
		case col == "id" || col == "ID":
			result = append(result, a+"."+quoteIdent(realCol)+" as id")
		case col == "subject_id" && b.target == "episode":
			result = append(result, a+".subject_id")
		case col == "type" && tc.typeColumn != "type":
			result = append(result, a+"."+quoteIdent(tc.typeColumn)+" AS type")
		case b.isDirectField(realCol):
			result = append(result, a+"."+quoteIdent(realCol))
		case col == "name_cn" && b.target == "person":
			result = append(result, a+".name AS name_cn")
		default:
			expr := b.infoboxExtractExpr(col, a)
			result = append(result, fmt.Sprintf("%s AS \"%s\"", expr, col))
		}
	}
	return result
}

// assocOutputColumn resolves an association output column ("类型.字段[+]" or
// "类型.s.字段[+]") into its correlated subquery (WITH the "AS label").
// Returns ("", false, nil) when col is not an association column.
func (b *SQLBuilder) assocOutputColumn(col string) (string, bool, error) {
	prefix, rest, found := strings.Cut(col, ".")
	if !found {
		return "", false, nil
	}
	field := rest
	isSubjectLevel := false
	// Brace-aware split: group fields ("{f1|f2|...}") may contain dots in
	// "s.xxx" members, so a leading "{" consumes the whole rest as field.
	// Otherwise a second dot is only valid as the "s." subject-level marker.
	if !strings.HasPrefix(rest, "{") {
		if mid, tail, ok := strings.Cut(rest, "."); ok {
			if mid != "s" {
				return "", false, nil
			}
			isSubjectLevel = true
			field = tail
		}
	}

	var subquery string
	var err error
	switch {
	case prefix == "episode":
		if !isSubjectLevel {
			subquery, err = b.buildEpisodeOutput(field)
		}
	case len(b.getRelationIDsForName(prefix)) > 0:
		if !isSubjectLevel {
			subquery, err = b.buildRelationOutput(prefix, field)
		}
	case b.target == "subject" && len(b.getPositionIDsForName(prefix)) > 0:
		if !isSubjectLevel {
			subquery, err = b.buildStaffOutput(prefix, field)
		}
	case b.target == "subject":
		if !isSubjectLevel {
			if id, ok := b.getCharacterAssociationTypeID(prefix); ok {
				subquery, err = b.buildCharacterOutput(prefix, field, id)
			}
		}
	case b.target == "person" && len(b.getPersonRelationIDsForName(prefix)) > 0:
		if !isSubjectLevel {
			subquery, err = b.buildPersonRelationOutput(prefix, field)
		}
	case b.target == "person" && len(b.getPositionIDsForName(prefix)) > 0:
		if !isSubjectLevel {
			subquery, err = b.buildStaffOutputForPerson(prefix, field)
		}
	case b.target == "character" && len(b.getCharacterRelationIDsForName(prefix)) > 0:
		if !isSubjectLevel {
			subquery, err = b.buildCharacterRelationOutput(prefix, field)
		}
	case b.target == "person" && b.isPersonCharacterTypeName(prefix):
		if isSubjectLevel {
			subquery, err = b.buildPersonCharacterSubjectOutput(prefix, field)
		} else {
			subquery, err = b.buildPersonCharacterOutput(prefix, field)
		}
	case b.target == "character" && b.isPersonCharacterTypeName(prefix):
		if isSubjectLevel {
			subquery, err = b.buildCharacterPersonSubjectOutput(prefix, field)
		} else {
			subquery, err = b.buildCharacterPersonOutput(prefix, field)
		}
	}
	if err != nil {
		return "", false, err
	}
	if subquery == "" {
		return "", false, nil
	}
	return subquery, true, nil
}

// assocOrderExpr returns the association subquery expression (WITHOUT its
// trailing "AS label") for use in ORDER BY, or ("", false, nil) if col is not
// an association column.
func (b *SQLBuilder) assocOrderExpr(col string) (string, bool, error) {
	sql, ok, err := b.assocOutputColumn(col)
	if !ok || err != nil {
		return "", ok, err
	}
	return stripAssocLabel(sql), true, nil
}

// stripAssocLabel removes the trailing ` AS "<label>"` from an association
// subquery. The label is always the last ` AS "..."` because we generate it.
func stripAssocLabel(sql string) string {
	if i := strings.LastIndex(sql, ` AS "`); i >= 0 {
		return sql[:i]
	}
	return sql
}

// buildRelationOutput generates a subquery for related subject fields (单行本.发售日).
func (b *SQLBuilder) buildRelationOutput(relType, field string) (string, error) {
	relIDs := b.getRelationIDsForName(relType)
	if len(relIDs) == 0 {
		return "", fmt.Errorf("未找到关系类型: %s", relType)
	}
	rf := b.findFilter(filterTypeRelation, relType)
	var conds *config.RelationFilter
	if rf != nil {
		conds = rf.(*config.RelationFilter)
	}

	var relatedWhere string
	relatedJoin := "LEFT JOIN subjects rs ON r.related_subject_id = rs.id"
	if conds != nil && len(conds.Conditions) > 0 {
		var err error
		relatedWhere, err = b.buildWhereForAlias(conds.Conditions, "rs")
		if err != nil {
			return "", fmt.Errorf("relation output: %w", err)
		}
	}
	typeCond := fmt.Sprintf("r.relation_type IN (%s)", intListToSQL(relIDs))
	return b.buildAssocSubquery(assocSubConfig{
		junction: "subject_relations", ja: "r", mainFK: "subject_id",
		entityJoin: relatedJoin, typeCond: typeCond, extraWhere: relatedWhere,
		entityAlias: "rs", entityPK: "id", field: field, label: fmt.Sprintf("\"%s.%s\"", relType, field),
		directFields: subjectDirectFields,
	})
}

// buildStaffOutput generates a subquery for staff fields (原作.name).
func (b *SQLBuilder) buildStaffOutput(position, field string) (string, error) {
	posIDs := b.getPositionIDsForName(position)
	if len(posIDs) == 0 {
		return "", fmt.Errorf("未找到职位类型: %s", position)
	}
	sf := b.findFilter(filterTypeStaff, position)
	var personWhere string
	entityJoin := "LEFT JOIN persons p ON sp.person_id = p.person_id"
	if sf != nil {
		s := sf.(*config.StaffFilter)
		if len(s.Conditions) > 0 {
			var err error
			personWhere, err = b.buildPersonWhereForAlias(s.Conditions, "sp")
			if err != nil {
				return "", fmt.Errorf("staff output: %w", err)
			}
		}
	}
	typeCond := fmt.Sprintf("sp.position IN (%s)", intListToSQL(posIDs))
	return b.buildAssocSubquery(assocSubConfig{
		junction: "subject_persons", ja: "sp", mainFK: "subject_id",
		entityJoin: entityJoin, typeCond: typeCond, extraWhere: personWhere,
		entityAlias: "p", entityPK: "person_id", field: field, label: fmt.Sprintf("\"%s.%s\"", position, field),
		directFields: personDirectFields,
	})
}

// buildStaffOutputForPerson generates a subquery for a person's staff position
// (target: person), outputting a field of the related subject — e.g.
// 系列构成.name returns the first subject where the person holds that position,
// matching the same staff filter conditions. Mirrors staffFilter's target=person
// direction (conditions apply to the related subject alias "rs").
func (b *SQLBuilder) buildStaffOutputForPerson(position, field string) (string, error) {
	posIDs := b.getPositionIDsForName(position)
	if len(posIDs) == 0 {
		return "", fmt.Errorf("未找到职位类型: %s", position)
	}
	sf := b.findFilter(filterTypeStaff, position)
	var subjectWhere string
	entityJoin := "LEFT JOIN subjects rs ON sp.subject_id = rs.id"
	if sf != nil {
		s := sf.(*config.StaffFilter)
		if len(s.Conditions) > 0 {
			var err error
			subjectWhere, err = b.buildWhereForAlias(s.Conditions, "rs")
			if err != nil {
				return "", fmt.Errorf("staff output: %w", err)
			}
		}
	}
	typeCond := fmt.Sprintf("sp.position IN (%s)", intListToSQL(posIDs))
	return b.buildAssocSubquery(assocSubConfig{
		junction: "subject_persons", ja: "sp", mainFK: "person_id",
		entityJoin: entityJoin, typeCond: typeCond, extraWhere: subjectWhere,
		entityAlias: "rs", entityPK: "id", field: field, label: fmt.Sprintf("\"%s.%s\"", position, field),
		directFields: subjectDirectFields,
	})
}

// buildPersonCharacterOutput generates a subquery for a person's character
// association (target: person) — e.g. CV.name returns the first character the
// person voices, matching the person_character filter conditions.
func (b *SQLBuilder) buildPersonCharacterOutput(typeName, field string) (string, error) {
	typeID, ok := b.getPersonCharacterTypeID(typeName)
	if !ok {
		return "", fmt.Errorf("未找到出演类型: %s", typeName)
	}
	pf := b.findFilter(filterTypePersonCharacter, typeName)
	var charWhere string
	entityJoin := "LEFT JOIN characters c ON pc.character_id = c.character_id"
	if pf != nil {
		f := pf.(*config.PersonCharacterFilter)
		if len(f.Conditions) > 0 {
			var err error
			charWhere, err = b.buildPersonCharCharacterWhere(f.Conditions)
			if err != nil {
				return "", fmt.Errorf("person_character output: %w", err)
			}
		}
	}
	typeCond := fmt.Sprintf("pc.type = %d", typeID)
	subjectAlias := ""
	if groupHasSubjectFields(field) {
		entityJoin += " LEFT JOIN subjects rs ON pc.subject_id = rs.id"
		subjectAlias = "rs"
	}
	return b.buildAssocSubquery(assocSubConfig{
		junction: "person_characters", ja: "pc", mainFK: "person_id",
		entityJoin: entityJoin, typeCond: typeCond, extraWhere: charWhere,
		entityAlias: "c", entityPK: "character_id", field: field, label: fmt.Sprintf("\"%s.%s\"", typeName, field),
		directFields: characterDirectFields, distinct: true, subjectAlias: subjectAlias,
	})
}

// buildCharacterPersonOutput generates a subquery for a character's person
// association (target: character) — e.g. CV.name returns the first person who
// voices the character, matching the character_person filter conditions.
func (b *SQLBuilder) buildCharacterPersonOutput(typeName, field string) (string, error) {
	typeID, ok := b.getPersonCharacterTypeID(typeName)
	if !ok {
		return "", fmt.Errorf("未找到出演类型: %s", typeName)
	}
	cf := b.findFilter(filterTypeCharacterPerson, typeName)
	var personWhere string
	entityJoin := "LEFT JOIN persons p ON pc.person_id = p.person_id"
	if cf != nil {
		f := cf.(*config.CharacterPersonFilter)
		if len(f.Conditions) > 0 {
			var err error
			personWhere, err = b.buildClauses(f.Conditions, clauseContext{alias: "p", isPersonCtx: true})
			if err != nil {
				return "", fmt.Errorf("character_person output: %w", err)
			}
		}
	}
	typeCond := fmt.Sprintf("pc.type = %d", typeID)
	subjectAlias := ""
	if groupHasSubjectFields(field) {
		entityJoin += " LEFT JOIN subjects rs ON pc.subject_id = rs.id"
		subjectAlias = "rs"
	}
	return b.buildAssocSubquery(assocSubConfig{
		junction: "person_characters", ja: "pc", mainFK: "character_id",
		entityJoin: entityJoin, typeCond: typeCond, extraWhere: personWhere,
		entityAlias: "p", entityPK: "person_id", field: field, label: fmt.Sprintf("\"%s.%s\"", typeName, field),
		directFields: personDirectFields, distinct: true, subjectAlias: subjectAlias,
	})
}

// groupHasSubjectFields reports whether a "{f1|f2|...}[+]" group field contains
// members prefixed "s." (subject-level fields of person_character /
// character_person junction rows).
func groupHasSubjectFields(field string) bool {
	fields, isGroup, _ := parseGroupField(field)
	if !isGroup {
		return false
	}
	for _, f := range fields {
		if strings.HasPrefix(f, "s.") {
			return true
		}
	}
	return false
}

// buildPersonCharacterSubjectOutput generates a subquery for the subject where
// a person voices a character (target: person) — e.g. CV.s.name returns the
// first subject the person voices in as typeName, matching the person_character
// filter's character conditions AND subject conditions.
func (b *SQLBuilder) buildPersonCharacterSubjectOutput(typeName, field string) (string, error) {
	typeID, ok := b.getPersonCharacterTypeID(typeName)
	if !ok {
		return "", fmt.Errorf("未找到出演类型: %s", typeName)
	}
	pf := b.findFilter(filterTypePersonCharacter, typeName)
	var charWhere, subjectWhere string
	entityJoin := "LEFT JOIN subjects rs ON pc.subject_id = rs.id LEFT JOIN characters c ON pc.character_id = c.character_id"
	if pf != nil {
		f := pf.(*config.PersonCharacterFilter)
		if len(f.Conditions) > 0 {
			var err error
			charWhere, err = b.buildPersonCharCharacterWhere(f.Conditions)
			if err != nil {
				return "", fmt.Errorf("person_character subject output: %w", err)
			}
		}
		if len(f.SubjectConditions) > 0 {
			var err error
			subjectWhere, err = b.buildWhereForAlias(f.SubjectConditions, "rs")
			if err != nil {
				return "", fmt.Errorf("person_character subject output: %w", err)
			}
		}
	}
	typeCond := fmt.Sprintf("pc.type = %d", typeID)
	return b.buildAssocSubquery(assocSubConfig{
		junction: "person_characters", ja: "pc", mainFK: "person_id",
		entityJoin: entityJoin, typeCond: typeCond, extraWhere: combineWhere(charWhere, subjectWhere),
		entityAlias: "rs", entityPK: "id", field: field, label: fmt.Sprintf("\"%s.s.%s\"", typeName, field),
		directFields: subjectDirectFields, distinct: true,
	})
}

// buildCharacterPersonSubjectOutput generates a subquery for the subject where
// a character is voiced (target: character) — e.g. CV.s.name returns the first
// subject the character appears in as typeName, matching the character_person
// filter's person conditions AND subject conditions.
func (b *SQLBuilder) buildCharacterPersonSubjectOutput(typeName, field string) (string, error) {
	typeID, ok := b.getPersonCharacterTypeID(typeName)
	if !ok {
		return "", fmt.Errorf("未找到出演类型: %s", typeName)
	}
	cf := b.findFilter(filterTypeCharacterPerson, typeName)
	var personWhere, subjectWhere string
	entityJoin := "LEFT JOIN subjects rs ON pc.subject_id = rs.id LEFT JOIN persons p ON pc.person_id = p.person_id"
	if cf != nil {
		f := cf.(*config.CharacterPersonFilter)
		if len(f.Conditions) > 0 {
			var err error
			personWhere, err = b.buildClauses(f.Conditions, clauseContext{alias: "p", isPersonCtx: true})
			if err != nil {
				return "", fmt.Errorf("character_person subject output: %w", err)
			}
		}
		if len(f.SubjectConditions) > 0 {
			var err error
			subjectWhere, err = b.buildWhereForAlias(f.SubjectConditions, "rs")
			if err != nil {
				return "", fmt.Errorf("character_person subject output: %w", err)
			}
		}
	}
	typeCond := fmt.Sprintf("pc.type = %d", typeID)
	return b.buildAssocSubquery(assocSubConfig{
		junction: "person_characters", ja: "pc", mainFK: "character_id",
		entityJoin: entityJoin, typeCond: typeCond, extraWhere: combineWhere(personWhere, subjectWhere),
		entityAlias: "rs", entityPK: "id", field: field, label: fmt.Sprintf("\"%s.s.%s\"", typeName, field),
		directFields: subjectDirectFields, distinct: true,
	})
}

// combineWhere joins two optional WHERE fragments with AND, ignoring empty/TRUE.
func combineWhere(a, b string) string {
	a = strings.TrimSpace(a)
	b = strings.TrimSpace(b)
	if a == "" || a == "TRUE" {
		return b
	}
	if b == "" || b == "TRUE" {
		return a
	}
	return a + " AND " + b
}

// buildCharacterOutput generates a subquery for character fields (主角.name).
func (b *SQLBuilder) buildCharacterOutput(charType, field string, typeID int) (string, error) {
	cf := b.findFilter(filterTypeCharacter, charType)
	var charWhere string
	entityJoin := "LEFT JOIN characters c ON sc.character_id = c.character_id"
	if cf != nil {
		c := cf.(*config.CharacterFilter)
		if len(c.Conditions) > 0 {
			var err error
			charWhere, err = b.buildCharacterWhereForAlias(c.Conditions)
			if err != nil {
				return "", fmt.Errorf("character output: %w", err)
			}
		}
	}
	typeCond := fmt.Sprintf("sc.type = %d", typeID)
	return b.buildAssocSubquery(assocSubConfig{
		junction: "subject_characters", ja: "sc", mainFK: "subject_id",
		entityJoin: entityJoin, typeCond: typeCond, extraWhere: charWhere,
		entityAlias: "c", entityPK: "character_id", field: field, label: fmt.Sprintf("\"%s.%s\"", charType, field),
		directFields: characterDirectFields,
	})
}

// buildEpisodeOutput generates a subquery for episode fields (episode.name).
func (b *SQLBuilder) buildEpisodeOutput(field string) (string, error) {
	ef := b.findFilter(filterTypeEpisode, "")
	var epWhere string
	if ef != nil {
		e := ef.(*config.EpisodeFilter)
		if e.Logic != nil && len(e.Logic.Items) > 0 {
			var err error
			epWhere, err = b.buildClausesWithOp(e.Logic.Items, clauseContext{alias: "e", isEpisodeCtx: true}, e.Logic.Op)
			if err != nil {
				return "", fmt.Errorf("episode output: %w", err)
			}
		}
	}
	return b.buildAssocSubquery(assocSubConfig{
		junction: "episodes", ja: "e", mainFK: "subject_id",
		entityJoin: "", typeCond: "TRUE", extraWhere: epWhere,
		entityAlias: "e", entityPK: "episode_id", field: field, label: fmt.Sprintf("\"episode.%s\"", field),
		directFields: episodeDirectFields,
	})
}

// buildPersonRelationOutput generates a subquery for person relation fields (同事.name).
func (b *SQLBuilder) buildPersonRelationOutput(relType, field string) (string, error) {
	if b.target != "person" {
		return "", fmt.Errorf("person_relation output only supported for person target")
	}
	relIDs := b.getPersonRelationIDsForName(relType)
	if len(relIDs) == 0 {
		return "", fmt.Errorf("未找到人物关系类型: %s", relType)
	}
	pf := b.findFilter(filterTypePersonRelation, relType)
	var relatedWhere string
	entityJoin := "LEFT JOIN persons rp ON pr.related_person_id = rp.person_id"
	if pf != nil {
		p := pf.(*config.PersonRelationFilter)
		if len(p.Conditions) > 0 {
			var err error
			relatedWhere, err = b.buildPersonRelationWhereForAlias(p.Conditions)
			if err != nil {
				return "", fmt.Errorf("person_relation output: %w", err)
			}
		}
	}
	typeCond := fmt.Sprintf("pr.relation_type IN (%s)", intListToSQL(relIDs))
	return b.buildAssocSubquery(assocSubConfig{
		junction: "person_relations", ja: "pr", mainFK: "person_id",
		entityJoin: entityJoin, typeCond: typeCond, extraWhere: relatedWhere,
		entityAlias: "rp", entityPK: "person_id", field: field, label: fmt.Sprintf("\"%s.%s\"", relType, field),
		directFields: personDirectFields,
	})
}

// buildCharacterRelationOutput generates a subquery for character relation fields (朋友.name).
func (b *SQLBuilder) buildCharacterRelationOutput(relType, field string) (string, error) {
	if b.target != "character" {
		return "", fmt.Errorf("character_relation output only supported for character target")
	}
	relIDs := b.getCharacterRelationIDsForName(relType)
	if len(relIDs) == 0 {
		return "", fmt.Errorf("未找到角色关系类型: %s", relType)
	}
	cf := b.findFilter(filterTypeCharacterRelation, relType)
	var relatedWhere string
	entityJoin := "LEFT JOIN characters rc ON cr.related_person_id = rc.character_id"
	if cf != nil {
		c := cf.(*config.CharacterRelationFilter)
		if len(c.Conditions) > 0 {
			var err error
			relatedWhere, err = b.buildCharacterRelationWhereForAlias(c.Conditions)
			if err != nil {
				return "", fmt.Errorf("character_relation output: %w", err)
			}
		}
	}
	typeCond := fmt.Sprintf("cr.relation_type IN (%s)", intListToSQL(relIDs))
	return b.buildAssocSubquery(assocSubConfig{
		junction: "character_relations", ja: "cr", mainFK: "person_id",
		entityJoin: entityJoin, typeCond: typeCond, extraWhere: relatedWhere,
		entityAlias: "rc", entityPK: "character_id", field: field, label: fmt.Sprintf("\"%s.%s\"", relType, field),
		directFields: characterDirectFields,
	})
}

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
	field        string          // field name (supports "count", "field+")
	label        string          // column label (already quoted)
	directFields map[string]bool // direct fields for this entity type
	distinct     bool            // deduplicate the "+" aggregation by entity
	subjectAlias string          // when set, group members prefixed "s." resolve against this subjects alias
}

// buildAssocSubquery generates a correlated subquery for association field output.
func (b *SQLBuilder) buildAssocSubquery(cfg assocSubConfig) (string, error) {
	field := cfg.field

	// Group JSON output: "{f1,f2,...}[+]" → one JSON object per related entry
	// (array for "+"), e.g. 导演.{name,生日,id}+.
	if groupFields, isGroup, groupPlus := parseGroupField(field); isGroup {
		return b.buildAssocGroupSubquery(cfg, groupFields, groupPlus)
	}

	// "~min"/"~max" suffix selects min/max aggregation (used for sorting "+"
	// aggregation columns, e.g. 导演.生日+ → 导演.生日~max).
	aggMinMax := ""
	if strings.HasSuffix(field, "~min") || strings.HasSuffix(field, "~max") {
		aggMinMax = field[len(field)-3:]
		field = strings.TrimSuffix(field, "~"+aggMinMax)
	}
	allMode := strings.HasSuffix(field, "+")
	if allMode {
		field = strings.TrimSuffix(field, "+")
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

	// Min/max aggregation (ORDER BY for "+" columns): normalize dates/numbers
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

	if allMode {
		if cfg.distinct {
			// Deduplicate by entity then aggregate, ordering by the entity PK.
			return fmt.Sprintf(
				`(SELECT string_agg(CAST("agg"."_v" AS VARCHAR), ', ' ORDER BY "agg"."%[1]s") FROM (SELECT DISTINCT %[2]s.%[1]s AS "%[1]s", %[3]s AS "_v" FROM %[4]s %[5]s %[6]s WHERE %[5]s.%[7]s = %[8]s AND %[9]s) "agg") AS %[10]s`,
				entityPK, ea, fieldExpr, cfg.junction, cfg.ja, cfg.entityJoin, cfg.mainFK, mainRef, pred, cfg.label,
			), nil
		}
		return fmt.Sprintf(
			"(SELECT string_agg(CAST(%s AS VARCHAR), ', ' ORDER BY %s.%s) FROM %s %s %s WHERE %s.%s = %s AND %s) AS %s",
			fieldExpr, ea, entityPK, cfg.junction, cfg.ja, cfg.entityJoin, cfg.ja, cfg.mainFK, mainRef, pred, cfg.label,
		), nil
	}
	return fmt.Sprintf(
		"(SELECT %s FROM %s %s %s WHERE %s.%s = %s AND %s LIMIT 1) AS %s",
		fieldExpr, cfg.junction, cfg.ja, cfg.entityJoin, cfg.ja, cfg.mainFK, mainRef, pred, cfg.label,
	), nil
}

// parseGroupField parses a "{f1|f2|...}[+]" field into its member fields.
// Uses "|" (not ",") so the group column stays a single field when output
// columns are comma-separated in the UI/YAML. Returns (fields, isGroup, hasPlus).
func parseGroupField(field string) ([]string, bool, bool) {
	if !strings.HasPrefix(field, "{") {
		return nil, false, false
	}
	end := strings.Index(field, "}")
	if end < 0 {
		return nil, false, false
	}
	hasPlus := strings.HasSuffix(field, "+")
	var fields []string
	for _, f := range strings.Split(field[1:end], "|") {
		if f = strings.TrimSpace(f); f != "" {
			fields = append(fields, f)
		}
	}
	return fields, len(fields) > 0, hasPlus
}

// buildAssocGroupSubquery generates a JSON array (or single object) of related
// entries, each an object of the group's fields. Empty values become null.
func (b *SQLBuilder) buildAssocGroupSubquery(cfg assocSubConfig, groupFields []string, groupPlus bool) (string, error) {
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

	if groupPlus {
		return fmt.Sprintf(
			"(SELECT to_json(list(struct_pack(%s)%s)) FROM %s %s %s WHERE %s.%s = %s AND %s) AS %s",
			structArgs, orderClause, cfg.junction, cfg.ja, cfg.entityJoin, cfg.ja, cfg.mainFK, mainRef, pred, cfg.label,
		), nil
	}
	return fmt.Sprintf(
		"(SELECT to_json(struct_pack(%s)) FROM %s %s %s WHERE %s.%s = %s AND %s LIMIT 1) AS %s",
		structArgs, cfg.junction, cfg.ja, cfg.entityJoin, cfg.ja, cfg.mainFK, mainRef, pred, cfg.label,
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
// its member fields (e.g. group 导演.{name|生日|id}+ with sort 导演.生日+),
// returning the normalized ORDER BY expression and ascending direction.
// Members prefixed "s." resolve against subjectAlias (subjects join).
func (b *SQLBuilder) groupOrderBy(label string, groupFields []string, ea, entityPK string, directFields map[string]bool, subjectAlias string) (string, bool, bool) {
	idx := strings.Index(label, ".{")
	if idx < 0 {
		return "", false, false
	}
	prefix := label[1:idx]
	for _, s := range b.cfg.Sort {
		sf := strings.TrimSuffix(s.Field, "+")
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

// findFilter walks the filter tree to find the first filter of the given type
// whose type/position/relation name matches. Returns nil if not found.
// The returned interface{} must be type-asserted to the appropriate filter type.
func (b *SQLBuilder) findFilter(ft filterType, typeName string) interface{} {
	for _, f := range b.cfg.Filters {
		if result := findFilterInNode(f, ft, typeName); result != nil {
			return result
		}
	}
	return nil
}

// findFilterInNode recursively searches a filter tree node for a matching filter.
func findFilterInNode(f config.Filter, ft filterType, typeName string) interface{} {
	switch ft {
	case filterTypeRelation:
		if f.Relation != nil && f.Relation.Type == typeName {
			return f.Relation
		}
	case filterTypeStaff:
		if f.Staff != nil && (f.Staff.Position == typeName || containsString(f.Staff.Positions, typeName)) {
			return f.Staff
		}
	case filterTypeCharacter:
		if f.Character != nil && f.Character.Type == typeName {
			return f.Character
		}
	case filterTypeEpisode:
		if f.Episode != nil {
			return f.Episode
		}
	case filterTypePersonRelation:
		if f.PersonRelation != nil && f.PersonRelation.Type == typeName {
			return f.PersonRelation
		}
	case filterTypeCharacterRelation:
		if f.CharacterRelation != nil && f.CharacterRelation.Type == typeName {
			return f.CharacterRelation
		}
	case filterTypePersonCharacter:
		if f.PersonCharacter != nil && (f.PersonCharacter.Type == typeName || f.PersonCharacter.Type == "") {
			return f.PersonCharacter
		}
	case filterTypeCharacterPerson:
		if f.CharacterPerson != nil && (f.CharacterPerson.Type == typeName || f.CharacterPerson.Type == "") {
			return f.CharacterPerson
		}
	}
	// Recurse into logic and other containers
	if f.Logic != nil {
		for _, child := range f.Logic.Items {
			if result := findFilterInNode(child, ft, typeName); result != nil {
				return result
			}
		}
	}
	if f.Staff != nil {
		for _, child := range f.Staff.Conditions {
			if result := findFilterInNode(child, ft, typeName); result != nil {
				return result
			}
		}
	}
	if f.Character != nil {
		for _, child := range f.Character.Conditions {
			if result := findFilterInNode(child, ft, typeName); result != nil {
				return result
			}
		}
	}
	if f.PersonCharacter != nil {
		for _, child := range f.PersonCharacter.Conditions {
			if result := findFilterInNode(child, ft, typeName); result != nil {
				return result
			}
		}
		for _, child := range f.PersonCharacter.SubjectConditions {
			if result := findFilterInNode(child, ft, typeName); result != nil {
				return result
			}
		}
	}
	if f.CharacterPerson != nil {
		for _, child := range f.CharacterPerson.Conditions {
			if result := findFilterInNode(child, ft, typeName); result != nil {
				return result
			}
		}
		for _, child := range f.CharacterPerson.SubjectConditions {
			if result := findFilterInNode(child, ft, typeName); result != nil {
				return result
			}
		}
	}
	return nil
}

func containsString(slice []string, s string) bool {
	for _, v := range slice {
		if v == s {
			return true
		}
	}
	return false
}
