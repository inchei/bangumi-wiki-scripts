package model

// Relation type constants — 动画 (Anime)
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

// Relation type constants — 书籍 (Book)
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

// Relation type constants — 音乐 (Music)
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

// Relation type constants — 游戏 (Game)
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

// Relation type constants — 三次元 (Real)
var RealRelations = map[int]string{
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

// PersonRelationTypes — 人物-人物关系类型 (person_type=prsn)
// Source: https://github.com/bangumi/common/blob/master/person_relations.yml
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

// PersonRelationNames returns all person relation type names.
func PersonRelationNames() []string {
	var names []string
	for _, name := range PersonRelationTypes {
		names = append(names, name)
	}
	return names
}
