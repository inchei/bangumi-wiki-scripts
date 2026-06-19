package model

// MetaTagsByType maps subject type to common meta tag names.
// Auto-generated from archive data. Update periodically via GitHub Action.
var MetaTagsByType = map[int][]string{
	1: {"漫画", "日本", "已完结", "原创", "系列", "单行本", "韩国", "纸质书", "小说", "连载中", "BL", "R18", "小说改", "中国", "恋爱", "电子书", "少女", "TL", "奇幻", "美国", "短篇集", "短篇", "青年", "校园", "推理", "少年", "穿越", "战斗", "百合", "科幻", "公式书", "画集", "游戏改", "悬疑", "GL", "运动", "动画改", "搞笑", "一般向", "写真集", "日常", "台湾", "职场", "名著", "女性", "后宫", "冒险", "美食", "香港", "恐怖", "影视改", "特典", "惊悚", "历史", "玄幻", "儿童", "漫画改", "武侠", "绘本", "机战", "电子单话", "法国", "音乐", "同人志", "杂志", "限定流通", "TRPG", "MOOK", "剧本", "停载", "马来西亚"},
	2: {"TV", "日本", "剧场版", "中国", "WEB", "漫画改", "OVA", "原创", "欧美", "短片", "小说改", "奇幻", "战斗", "游戏改", "科幻", "美国", "恋爱", "子供向", "R18", "日常", "校园", "百合", "后宫", "喜剧", "法国", "冒险", "韩国", "玄幻", "机战", "悬疑", "运动", "穿越", "音乐", "少年向", "MV", "剧情", "少女向", "BL", "推理", "历史", "动态漫画", "武侠", "英国", "青年向", "耽美", "PV", "萌系", "同人", "美食", "女性向", "职场", "捷克", "CM", "苏联", "乙女", "影视改", "恐怖", "台湾", "香港", "惊悚", "俄罗斯", "GL"},
	3: {"日本", "专辑", "同人音乐", "CD", "OST", "Digital", "游戏", "电子", "动画", "Vocaloid", "单曲", "中国", "ASMR", "Drama", "Radio", "黑胶", "ED", "OP", "VOCAL", "JPOP", "电视剧", "原创", "BL", "磁带", "摇滚", "角色歌", "Remix", "印象曲", "IN", "艺人专辑", "电影", "hardcore", "Arrange", "古典", "韩国", "欧美", "trance", "精选集", "8cm", "漫画", "TM", "Techno", "乙女", "R18", "DVD", "有声作品", "朗读剧", "小说"},
	4: {"游戏", "PC", "ADV", "RPG", "Android", "iOS", "AVG", "Windows", "R18", "NS", "Galgame", "PS4", "ACT", "XboxOne", "Web", "乙女", "PS5", "SLG", "全年龄", "SIM", "XSX", "Mac", "BL", "休闲", "PS2", "PSP", "PS3", "街机", "PUZ", "STG", "PSV", "PS", "VN", "ARPG", "Xbox360", "Linux", "NDS", "FPS", "同人", "3DS", "Horror", "SRPG", "FTG", "RAC", "AAVG", "Wii", "FC", "SPG", "Strategy", "SFC", "GBA", "DOS", "扩展包", "MMORPG", "桌游", "RTS", "Roguelike", "TPS", "MUG", "WiiU", "SS", "VR", "XBOX", "galgame", "Platform", "Survival", "MD", "NS2", "DLC", "GB", "NGC", "DC", "GL", "GBC", "软件", "N64", "DBG", "JRPG", "AppleII", "TAB", "Symbian", "Xbox", "2024", "MOBA", "RTT", "Sandbox", "PSVR2", "PC98", "mod", "DRPG", "2023", "FD", "TCG", "CCG", "合集", "PC88", "CRPG", "Rhythm", "改版", "PCE", "EDU", "2018", "2022", "X68000", "2021", "2020", "Amiga", "TBS"},
	6: {"电视剧", "日本", "欧美", "剧情", "美国", "电影", "中国", "华语", "犯罪", "动作", "喜剧", "小说改", "爱情", "演出", "悬疑", "科幻", "英国", "特摄", "广播剧", "惊悚", "奇幻", "韩国", "冒险", "漫画改", "原创", "恐怖", "古装", "综艺", "历史", "香港", "电台", "纪录片", "家庭", "台湾", "同性", "加拿大", "战争", "校园", "推理", "法国", "职场", "音乐", "布袋戏", "运动", "武侠", "传记", "泰国", "游戏改", "歌舞", "灾难", "西部", "俄罗斯", "有声剧", "美食", "2024", "影视改", "意大利", "玄幻", "少儿", "选集剧", "新西兰", "短剧"},
}

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
