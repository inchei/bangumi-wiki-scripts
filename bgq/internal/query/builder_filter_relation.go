package query

import (
	"fmt"

	"github.com/inchei/bangumi-query/internal/config"
	"github.com/inchei/bangumi-query/internal/model"
)

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
