package model

// Source: https://github.com/bangumi/common/blob/master/subject_platforms.yml
// Run `go generate` or update manually when upstream changes.

// BookPlatforms — platform codes.
var BookPlatforms = map[int]string{
	0:    "其他",
	1001: "漫画",
	1002: "小说",
	1003: "画集",
	1004: "绘本",
	1005: "写真",
	1006: "公式书",
}

// AnimePlatforms — platform codes.
var AnimePlatforms = map[int]string{
	0:    "其他",
	1:    "TV",
	2:    "OVA",
	3:    "剧场版",
	5:    "WEB",
	2006: "动态漫画",
}

// MusicPlatforms — platform codes.
var MusicPlatforms = map[int]string{}

// GamePlatforms — platform codes.
var GamePlatforms = map[int]string{
	0:    "其他",
	4001: "游戏",
	4002: "软件",
	4003: "扩展包",
	4005: "桌游",
}

// RealPlatforms — platform codes.
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

// TypePlatforms maps subject type to its platform codes.
var TypePlatforms = map[int]map[int]string{
	1: BookPlatforms,
	2: AnimePlatforms,
	3: MusicPlatforms,
	4: GamePlatforms,
	6: RealPlatforms,
}
