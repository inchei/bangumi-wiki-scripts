package model

// Source: https://github.com/bangumi/common/blob/master/subject_platforms.yml
// Run `go generate` or update manually when upstream changes.

// BookPlatforms — 书籍 platform codes.
var BookPlatforms = map[int]string{
	0:    "其他",
	1001: "漫画",
	1002: "小说",
	1003: "画集",
	1004: "绘本",
	1005: "写真",
	1006: "公式书",
}

// AnimePlatforms — 动画 platform codes.
var AnimePlatforms = map[int]string{
	0:    "其他",
	1:    "TV",
	2:    "OVA",
	3:    "剧场版",
	5:    "WEB",
	2006: "动态漫画",
}

// MusicPlatforms — 音乐 platform codes.
var MusicPlatforms = map[int]string{
	3001: "专辑",
	3002: "广播剧",
	3003: "有声书",
	3004: "电台",
}

// GamePlatforms — 游戏 platform codes.
var GamePlatforms = map[int]string{
	0:    "其他",
	4001: "游戏",
	4002: "软件",
	4003: "扩展包",
	4005: "桌游",
}

// RealPlatforms — 三次元 platform codes.
var RealPlatforms = map[int]string{
	0:    "其他",
	1:    "日剧",
	2:    "欧美剧",
	3:    "华语剧",
	6001: "电视剧",
	6002: "电影",
	6003: "演出",
	6004: "综艺",
}

// GameHardwarePlatforms — 游戏硬件平台 codes.
var GameHardwarePlatforms = map[int]string{
	4:  "PC",
	5:  "NDS",
	6:  "PSP",
	7:  "PS2",
	8:  "PS3",
	9:  "Xbox360",
	10: "Wii",
	11: "iOS",
	12: "街机",
	15: "XBOX",
	17: "GameCube",
	18: "NEOGEO Pocket Color",
	19: "SFC",
	20: "FC",
	21: "Nintendo 64",
	22: "GBA",
	23: "GB",
	25: "Virtual Boy",
	26: "WonderSwan Color",
	27: "Dreamcast",
	28: "PlayStation",
	29: "WonderSwan",
	30: "PS Vita",
	31: "3DS",
	32: "Android",
	33: "Mac OS",
	34: "PS4",
	35: "Xbox One",
	36: "Wii U",
	37: "Nintendo Switch",
	38: "PS5",
	39: "Xbox Series X/S",
}

// BookSeriesTypes — 书籍系列类型.
var BookSeriesTypes = map[int]string{
	0: "单行本",
	1: "系列",
}

// TypePlatforms maps subject type to its platform codes.
var TypePlatforms = map[int]map[int]string{
	1: BookPlatforms,
	2: AnimePlatforms,
	3: MusicPlatforms,
	4: GamePlatforms,
	6: RealPlatforms,
}

// PlatformEntry represents a platform option for the UI.
type PlatformEntry struct {
	Code int    `json:"code"`
	Name string `json:"name"`
}

// PlatformsByType returns platform codes and names for a given subject type.
// typeCode 0 returns all platforms across all types.
func PlatformsByType(typeCode int) []PlatformEntry {
	var entries []PlatformEntry
	seen := make(map[int]bool)

	collect := func(m map[int]string) {
		for code, name := range m {
			if !seen[code] {
				seen[code] = true
				entries = append(entries, PlatformEntry{Code: code, Name: name})
			}
		}
	}

	if typeCode == 0 {
		for _, m := range TypePlatforms {
			collect(m)
		}
	} else if m, ok := TypePlatforms[typeCode]; ok {
		collect(m)
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
