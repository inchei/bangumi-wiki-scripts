package model

// RelationTypes maps relation type ID to Chinese name, grouped by subject type.
var RelationTypes = map[int]map[int]string{
	1: BookRelations,   // 书籍
	2: AnimeRelations,  // 动画
	3: MusicRelations,  // 音乐
	4: GameRelations,   // 游戏
	6: RealRelations,   // 三次元
}

// AllRelations collects all relation names for lookup.
var AllRelations = buildAllRelations()

func buildAllRelations() map[string]bool {
	result := make(map[string]bool)
	for _, relMap := range RelationTypes {
		for _, name := range relMap {
			result[name] = true
		}
	}
	return result
}

// GetRelationID returns the relation type ID for a Chinese name and subject type.
// Returns 0 if not found.
func GetRelationID(typeCode int, chineseName string) int {
	relMap, ok := RelationTypes[typeCode]
	if !ok {
		return 0
	}
	for id, name := range relMap {
		if name == chineseName {
			return id
		}
	}
	return 0
}

// GetRelationName returns the Chinese name for a relation ID.
func GetRelationName(relationID int) string {
	for _, relMap := range RelationTypes {
		if name, ok := relMap[relationID]; ok {
			return name
		}
	}
	return ""
}

// GetCNToPositionID returns the position ID for a Chinese position name and subject type.
func GetCNToPositionID(typeCode int, chineseName string) int {
	posMap, ok := StaffPositions[typeCode]
	if !ok {
		return 0
	}
	for id, name := range posMap {
		if name == chineseName {
			return id
		}
	}
	return 0
}

// GetPositionName returns the Chinese name for a position ID.
func GetPositionName(positionID int) string {
	for _, posMap := range StaffPositions {
		if name, ok := posMap[positionID]; ok {
			return name
		}
	}
	return ""
}
