package model

// --- Relation ---

// RelationTypes maps relation type ID to Chinese name, grouped by subject type.
var RelationTypes = map[int]map[int]string{
	1: BookRelations,
	2: AnimeRelations,
	3: MusicRelations,
	4: GameRelations,
	6: RealRelations,
}
