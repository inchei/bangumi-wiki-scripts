package query

import (
	"fmt"
	"strings"

	"github.com/inchei/bangumi-query/internal/config"
)

// buildPersonCharacterOutput generates a subquery for a person's character
// association (target: person) — e.g. CV.name returns the first character the
// person voices, matching the person_character / person_cast_subject filter conditions.
func (b *SQLBuilder) buildPersonCharacterOutput(typeName, field string) (string, error) {
	typeID, ok := b.getPersonCharacterTypeID(typeName)
	if !ok {
		return "", fmt.Errorf("未找到出演类型: %s", typeName)
	}
	var charWhereParts []string
	entityJoin := "LEFT JOIN characters c ON pc.character_id = c.character_id"
	// collect character conditions from both filter kinds sharing this prefix
	if pf0 := b.findFilter(filterTypePersonCharacter, typeName); pf0 != nil {
		if f, ok := pf0.(*config.PersonCharacterFilter); ok && len(f.Conditions) > 0 {
			cw, err := b.buildPersonCharCharacterWhere(f.Conditions)
			if err != nil {
				return "", fmt.Errorf("person_character output: %w", err)
			}
			if cw != "" && cw != "TRUE" {
				charWhereParts = append(charWhereParts, cw)
			}
		}
	}
	if pf1 := b.findFilter(filterTypePersonCastSubject, typeName); pf1 != nil {
		if f, ok := pf1.(*config.PersonCastSubjectFilter); ok && len(f.CharacterConditions) > 0 {
			cw, err := b.buildPersonCharCharacterWhere(f.CharacterConditions)
			if err != nil {
				return "", fmt.Errorf("person_cast_subject output: %w", err)
			}
			if cw != "" && cw != "TRUE" {
				charWhereParts = append(charWhereParts, cw)
			}
		}
	}
	charWhere := ""
	if len(charWhereParts) > 0 {
		charWhere = strings.Join(charWhereParts, " AND ")
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
		entityAlias: "c", entityPK: "character_id", field: field, label: quotedLabel(typeName, field),
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
		entityAlias: "p", entityPK: "person_id", field: field, label: quotedLabel(typeName, field),
		directFields: personDirectFields, distinct: true, subjectAlias: subjectAlias,
	})
}

// groupHasSubjectFields reports whether a "{f1|f2|...}" group field contains
// members prefixed "s." (subject-level fields of person_character /
// character_person junction rows).
func groupHasSubjectFields(field string) bool {
	fields, isGroup := parseGroupField(field)
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
// filter's character conditions AND subject conditions, or person_cast_subject
// filter's subject conditions AND character conditions.
func (b *SQLBuilder) buildPersonCharacterSubjectOutput(typeName, field string) (string, error) {
	typeID, ok := b.getPersonCharacterTypeID(typeName)
	if !ok {
		return "", fmt.Errorf("未找到出演类型: %s", typeName)
	}
	var charWhereParts, subjectWhereParts []string
	entityJoin := "LEFT JOIN subjects rs ON pc.subject_id = rs.id LEFT JOIN characters c ON pc.character_id = c.character_id"
	if pf0 := b.findFilter(filterTypePersonCharacter, typeName); pf0 != nil {
		if f, ok := pf0.(*config.PersonCharacterFilter); ok {
			if len(f.Conditions) > 0 {
				cw, err := b.buildPersonCharCharacterWhere(f.Conditions)
				if err != nil {
					return "", fmt.Errorf("person_character subject output: %w", err)
				}
				if cw != "" && cw != "TRUE" {
					charWhereParts = append(charWhereParts, cw)
				}
			}
			if len(f.SubjectConditions) > 0 {
				sw, err := b.buildWhereForAlias(f.SubjectConditions, "rs")
				if err != nil {
					return "", fmt.Errorf("person_character subject output: %w", err)
				}
				if sw != "" && sw != "TRUE" {
					subjectWhereParts = append(subjectWhereParts, sw)
				}
			}
		}
	}
	if pf1 := b.findFilter(filterTypePersonCastSubject, typeName); pf1 != nil {
		if f, ok := pf1.(*config.PersonCastSubjectFilter); ok {
			if len(f.CharacterConditions) > 0 {
				cw, err := b.buildPersonCharCharacterWhere(f.CharacterConditions)
				if err != nil {
					return "", fmt.Errorf("person_cast_subject subject output: %w", err)
				}
				if cw != "" && cw != "TRUE" {
					charWhereParts = append(charWhereParts, cw)
				}
			}
			if len(f.Conditions) > 0 {
				sw, err := b.buildWhereForAlias(f.Conditions, "rs")
				if err != nil {
					return "", fmt.Errorf("person_cast_subject subject output: %w", err)
				}
				if sw != "" && sw != "TRUE" {
					subjectWhereParts = append(subjectWhereParts, sw)
				}
			}
		}
	}
	charWhere := ""
	if len(charWhereParts) > 0 {
		charWhere = strings.Join(charWhereParts, " AND ")
	}
	subjectWhere := ""
	if len(subjectWhereParts) > 0 {
		subjectWhere = strings.Join(subjectWhereParts, " AND ")
	}
	typeCond := fmt.Sprintf("pc.type = %d", typeID)
	return b.buildAssocSubquery(assocSubConfig{
		junction: "person_characters", ja: "pc", mainFK: "person_id",
		entityJoin: entityJoin, typeCond: typeCond, extraWhere: combineWhere(charWhere, subjectWhere),
		entityAlias: "rs", entityPK: "id", field: field, label: quotedLabel(typeName, "s", field),
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
		entityAlias: "rs", entityPK: "id", field: field, label: quotedLabel(typeName, "s", field),
		directFields: subjectDirectFields, distinct: true,
	})
}
