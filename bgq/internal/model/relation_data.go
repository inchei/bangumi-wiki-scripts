package model

// Source: https://github.com/bangumi/common/blob/master/subject_relations.yml
// Source: https://github.com/bangumi/common/blob/master/person_relations.yml
// Run `go generate` or update manually when upstream changes.

// Relation type constants — Book
var BookRelations = map[int]string{
	1:    "改编",
	1002: "系列",
	1003: "单行本",
	1004: "画集",
	1005: "前传",
	1006: "续集",
	1007: "番外篇",
	1008: "主线故事",
	1010: "不同版本",
	1011: "角色出演",
	1012: "相同世界观",
	1013: "不同世界观",
	1014: "联动",
	1015: "不同演绎",
	1099: "其他",
}

// Relation type constants — Anime
var AnimeRelations = map[int]string{
	1:  "改编",
	2:  "前传",
	3:  "续集",
	4:  "总集篇",
	5:  "全集",
	6:  "番外篇",
	7:  "角色出演",
	8:  "相同世界观",
	9:  "不同世界观",
	10: "不同演绎",
	11: "衍生",
	12: "主线故事",
	14: "联动",
	99: "其他",
}

// Relation type constants — Music
var MusicRelations = map[int]string{
	3001: "原声集",
	3002: "角色歌",
	3003: "片头曲",
	3004: "片尾曲",
	3005: "插入歌",
	3006: "印象曲",
	3007: "广播剧",
	3099: "其他",
}

// Relation type constants — Game
var GameRelations = map[int]string{
	1:    "改编",
	4002: "前传",
	4003: "续集",
	4006: "外传",
	4007: "角色出演",
	4008: "相同世界观",
	4009: "不同世界观",
	4010: "不同演绎",
	4012: "主线故事",
	4014: "联动",
	4015: "扩展包",
	4016: "不同版本",
	4017: "主版本",
	4018: "合集",
	4019: "收录作品",
	4099: "其他",
}

// Relation type constants — Real
var RealRelations = map[int]string{}

// PersonRelationTypes — person-to-person relation types (person_type=prsn)
var PersonRelationTypes = map[int]string{
	1001: "家人",
	1002: "配偶",
	1003: "离异",
	1004: "创始人",
	1005: "员工",
	1006: "成员",
	1008: "从属事业",
	1009: "主体事业",
	1010: "品牌",
	1011: "原成员",
	1012: "团体",
	1013: "老师",
	1014: "学生",
	1015: "同事",
	1016: "运营",
	1017: "经纪公司",
}

// CharacterRelationTypes — character-to-character relation types (person_type=crt)
var CharacterRelationTypes = map[int]string{
	2001: "形态",
	2002: "朋友",
	2003: "恋人",
	2004: "单恋",
	2005: "对手",
	2006: "亲属",
	2007: "成员",
	2008: "创始人",
	2009: "主人",
	2010: "宠物",
	2011: "学生",
	2012: "老师",
	2015: "驾驶员",
	2016: "侍从",
	2017: "配偶",
	2018: "下属",
	2019: "上司",
	2020: "改编",
	2021: "原型",
	2022: "前任",
	2023: "同事",
	2024: "亲戚",
	2025: "同学",
	2026: "同门",
	2027: "进化",
	2028: "前身",
	2029: "饲主",
	2099: "其他",
}
