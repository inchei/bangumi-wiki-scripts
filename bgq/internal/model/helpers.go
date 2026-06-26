package model

import "strconv"

// --- Platform ---

// PlatformEntry represents a platform option for the UI.
type PlatformEntry struct {
	Code int    `json:"code"`
	Name string `json:"name"`
}

// PlatformsByType returns platform codes and names for a given subject type.
// typeCode 0 returns all platforms across all types, deduplicating by
// (code, name) pair — the same code with different names across types
// (e.g. code 1 = "TV" for anime vs "日剧" for real) are both preserved.
func PlatformsByType(typeCode int) []PlatformEntry {
	if typeCode == 0 {
		var entries []PlatformEntry
		seen := make(map[string]bool)
		for _, m := range TypePlatforms {
			for code, name := range m {
				key := strconv.Itoa(code) + ":" + name
				if !seen[key] {
					seen[key] = true
					entries = append(entries, PlatformEntry{Code: code, Name: name})
				}
			}
		}
		return entries
	}
	m, ok := TypePlatforms[typeCode]
	if !ok {
		return nil
	}
	entries := make([]PlatformEntry, 0, len(m))
	for code, name := range m {
		entries = append(entries, PlatformEntry{Code: code, Name: name})
	}
	return entries
}

// GetPlatformName returns the Chinese name for a platform code (context-agnostic).
func GetPlatformName(code int) string {
	for _, m := range TypePlatforms {
		if name, ok := m[code]; ok {
			return name
		}
	}
	return ""
}

// --- Relation ---

// RelationTypes maps relation type ID to Chinese name, grouped by subject type.
var RelationTypes = map[int]map[int]string{
	1: BookRelations,
	2: AnimeRelations,
	3: MusicRelations,
	4: GameRelations,
	6: RealRelations,
}

// RelationsByType returns relation names for a given subject type.
// typeCode 0 returns all relations across all types.
func RelationsByType(typeCode int) []string {
	if typeCode == 0 {
		seen := make(map[string]bool)
		var names []string
		for _, relMap := range RelationTypes {
			for _, name := range relMap {
				if !seen[name] {
					seen[name] = true
					names = append(names, name)
				}
			}
		}
		return names
	}
	relMap, ok := RelationTypes[typeCode]
	if !ok {
		return nil
	}
	var names []string
	for _, name := range relMap {
		names = append(names, name)
	}
	return names
}

// PersonRelationNames returns all person relation type names.
func PersonRelationNames() []string {
	var names []string
	for _, name := range PersonRelationTypes {
		names = append(names, name)
	}
	return names
}

// CharacterRelationNames returns all character relation type names.
func CharacterRelationNames() []string {
	var names []string
	for _, name := range CharacterRelationTypes {
		names = append(names, name)
	}
	return names
}

// AllRelations collects all relation names for lookup.
var AllRelations = func() map[string]bool {
	result := make(map[string]bool)
	for _, relMap := range RelationTypes {
		for _, name := range relMap {
			result[name] = true
		}
	}
	return result
}()

// --- Staff ---

// PositionsByType returns staff position names for a given subject type.
// typeCode 0 returns all positions across all types.
func PositionsByType(typeCode int) []string {
	if typeCode == 0 {
		seen := make(map[string]bool)
		var names []string
		for _, posMap := range StaffPositions {
			for _, name := range posMap {
				if !seen[name] {
					seen[name] = true
					names = append(names, name)
				}
			}
		}
		return names
	}
	posMap, ok := StaffPositions[typeCode]
	if !ok {
		return nil
	}
	var names []string
	for _, name := range posMap {
		names = append(names, name)
	}
	return names
}

// --- MetaTags ---

// MetaTagsForType returns meta tags for a subject type, or all if typeCode is 0.
func MetaTagsForType(typeCode int) []string {
	if typeCode == 0 {
		return AllMetaTags()
	}
	if tags, ok := MetaTagsByType[typeCode]; ok {
		return tags
	}
	return nil
}

// AllMetaTags returns all unique meta tags across all types.
func AllMetaTags() []string {
	seen := make(map[string]bool)
	var result []string
	for _, tags := range MetaTagsByType {
		for _, tag := range tags {
			if !seen[tag] {
				seen[tag] = true
				result = append(result, tag)
			}
		}
	}
	return result
}
