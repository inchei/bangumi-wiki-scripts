package query

import (
	"github.com/inchei/bangumi-query/internal/config"
)

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
	case filterTypePersonCastSubject:
		if f.PersonCastSubject != nil && (f.PersonCastSubject.Type == typeName || f.PersonCastSubject.Type == "") {
			return f.PersonCastSubject
		}
	case filterTypeCharacterPerson:
		if f.CharacterPerson != nil && (f.CharacterPerson.Type == typeName || f.CharacterPerson.Type == "") {
			return f.CharacterPerson
		}
	case filterTypeSubjectCast:
		if f.SubjectCast != nil && (f.SubjectCast.Type == typeName || f.SubjectCast.Type == "") {
			return f.SubjectCast
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
	if f.PersonCastSubject != nil {
		for _, child := range f.PersonCastSubject.Conditions {
			if result := findFilterInNode(child, ft, typeName); result != nil {
				return result
			}
		}
		for _, child := range f.PersonCastSubject.CharacterConditions {
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
	if f.SubjectCast != nil {
		for _, child := range f.SubjectCast.PersonConditions {
			if result := findFilterInNode(child, ft, typeName); result != nil {
				return result
			}
		}
		for _, child := range f.SubjectCast.CharacterConditions {
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
