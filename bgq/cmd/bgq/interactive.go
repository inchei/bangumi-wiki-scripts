package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"github.com/inchei/bangumi-query/internal/config"
	"github.com/inchei/bangumi-query/internal/model"
)

func interactiveMode(dataDir string) {
	reader := bufio.NewReader(os.Stdin)
	cfg := &config.Config{
		DataDir: dataDir,
		Output: &config.Output{
			Format: "table",
		},
		Limit: 50,
	}

	fmt.Println("格式说明:")
	fmt.Println("  条目类型: 直接输入中文（如: 动画、书籍、音乐、游戏、三次元）")
	fmt.Println("  普通字段: 字段名:条件（如: 出版社:角川）")
	fmt.Println("  正则匹配: 字段名:re:模式（如: name:re:魔法）")
	fmt.Println("  数字比较: 字段名:大于:值 或 字段名:小于:值（如: 评分:大于:8）")
	fmt.Println("  日期比较: 字段名:早于:日期 或 字段名:晚于:日期")
	fmt.Println("  人物筛选: staff:职位名:字段名:条件（如: staff:原作:name:川原砾）")
	fmt.Println("  剧集筛选: ep:字段名:条件（如: ep:name:re:第\\d+话）")
	fmt.Println("  关系筛选: relation:关系名（如: relation:单行本）")
	fmt.Println("  全局搜索: *:条件（如: *:re:完结）")
	fmt.Println("")

	for {
		fmt.Print("条件 > ")
		input, _ := reader.ReadString('\n')
		input = strings.TrimSpace(input)

		if input == "" {
			if len(cfg.Filters) == 0 {
				fmt.Println("未添加任何筛选条件")
				continue
			}
			break
		}
		if input == ":q" || input == ":quit" {
			fmt.Println("退出")
			return
		}
		if input == ":h" || input == ":help" {
			printInteractiveHelp()
			continue
		}

		filter, err := parseInteractiveCondition(input)
		if err != nil {
			fmt.Printf("解析错误: %v\n", err)
			continue
		}
		cfg.Filters = append(cfg.Filters, filter)
		fmt.Printf("已添加条件: %s\n", input)
	}

	if len(cfg.Filters) == 0 {
		fmt.Println("未添加任何筛选条件，退出")
		return
	}

	fmt.Println("\n正在查询...")
	runQuery(cfg, dataDir, "", false)
}

func parseInteractiveCondition(input string) (config.Filter, error) {
	// Check for Chinese type name
	if typeNum, ok := model.TypeCNToNum[input]; ok {
		return config.Filter{
			Type: &config.TypeFilter{Value: typeNum},
		}, nil
	}

	// Check for staff: prefix
	if strings.HasPrefix(input, "staff:") {
		return parseStaffCondition(input)
	}

	// Check for ep: prefix
	if strings.HasPrefix(input, "ep:") {
		return parseEpisodeCondition(input)
	}

	// Check for meta_tag: or 公共标签: prefix
	if strings.HasPrefix(input, "meta_tag:") || strings.HasPrefix(input, "公共标签:") {
		return parseMetaTagCondition(input)
	}

	// Check for tag: prefix
	if strings.HasPrefix(input, "tag:") {
		return parseTagCondition(input)
	}

	// Check for relation: prefix
	if strings.HasPrefix(input, "relation:") {
		return parseRelationCondition(input)
	}

	// Check for *: prefix (global search)
	if strings.HasPrefix(input, "*:") {
		op, val := parseOperatorValue(input[2:])
		return config.Filter{
			Global: &config.GlobalFilter{Operator: op, Value: val},
		}, nil
	}

	// Standard field:condition format
	if strings.Contains(input, ":") {
		parts := strings.SplitN(input, ":", 2)
		field := strings.TrimSpace(parts[0])
		rest := strings.TrimSpace(parts[1])

		// Check if this is a relation name (for backwards compat)
		if model.AllRelations[field] && field != "其他" && strings.Contains(rest, ":") {
			return parseInlineRelationCondition(field, rest)
		}

		op, val := parseOperatorValue(rest)
		return config.Filter{
			Field: &config.FieldFilter{Field: field, Operator: op, Value: val},
		}, nil
	}

	return config.Filter{}, fmt.Errorf("无法识别的条件格式: %s", input)
}

func parseOperatorValue(raw string) (string, string) {
	// Handle prefixed operators
	switch {
	case strings.HasPrefix(raw, "大于:"):
		return "gt", raw[3:]
	case strings.HasPrefix(raw, "gt:"):
		return "gt", raw[3:]
	case strings.HasPrefix(raw, "小于:"):
		return "lt", raw[3:]
	case strings.HasPrefix(raw, "lt:"):
		return "lt", raw[3:]
	case strings.HasPrefix(raw, "早于:"):
		return "before", raw[3:]
	case strings.HasPrefix(raw, "晚于:"):
		return "after", raw[3:]
	case strings.HasPrefix(raw, "re:"):
		return "regex", raw[3:]
	case strings.HasPrefix(raw, "等于:"):
		return "eq", raw[3:]
	default:
		return "contains", raw
	}
}

func parseStaffCondition(input string) (config.Filter, error) {
	// Format: staff:职位名:字段名:条件  or  staff:职位名
	parts := strings.SplitN(input, ":", 4)
	if len(parts) < 2 {
		return config.Filter{}, fmt.Errorf("staff格式: staff:职位名[:字段名:条件]")
	}

	posCN := strings.TrimSpace(parts[1])
	if posCN == "" {
		return config.Filter{}, fmt.Errorf("职位名不能为空")
	}

	f := &config.StaffFilter{
		Position: posCN,
		Mode:     "any",
	}

	if len(parts) >= 4 {
		field := strings.TrimSpace(parts[2])
		op, val := parseOperatorValue(strings.TrimSpace(parts[3]))
		f.Conditions = []config.Filter{{Field: &config.FieldFilter{Field: field, Operator: op, Value: val}}}
	}

	return config.Filter{Staff: f}, nil
}

func parseEpisodeCondition(input string) (config.Filter, error) {
	// Format: ep:字段名:条件
	parts := strings.SplitN(input, ":", 3)
	if len(parts) < 3 {
		return config.Filter{}, fmt.Errorf("ep格式: ep:字段名:条件")
	}

	field := strings.TrimSpace(parts[1])
	op, val := parseOperatorValue(strings.TrimSpace(parts[2]))

	return config.Filter{
		Episode: &config.EpisodeFilter{
			Mode:       "any",
			Conditions: []config.FieldFilter{{Field: field, Operator: op, Value: val}},
		},
	}, nil
}

func parseRelationCondition(input string) (config.Filter, error) {
	// Format: relation:关系名   or  relation:!关系名
	rest := input[len("relation:"):]
	rest = strings.TrimSpace(rest)

	negate := false
	if strings.HasPrefix(rest, "!") {
		negate = true
		rest = rest[1:]
	}

	mode := "any"
	if negate {
		mode = "none"
	}

	return config.Filter{
		Relation: &config.RelationFilter{
			Type: rest,
			Mode: mode,
		},
	}, nil
}

func parseInlineRelationCondition(relName, rest string) (config.Filter, error) {
	// Format: 关系名:字段名:条件
	parts := strings.SplitN(rest, ":", 2)
	if len(parts) < 2 {
		return config.Filter{}, fmt.Errorf("关系条件格式: 关系名:字段名:条件")
	}

	field := strings.TrimSpace(parts[0])
	op, val := parseOperatorValue(strings.TrimSpace(parts[1]))

	return config.Filter{
		Relation: &config.RelationFilter{
			Type: relName,
			Mode: "any",
			Conditions: []config.Filter{
				{Field: &config.FieldFilter{Field: field, Operator: op, Value: val}},
			},
		},
	}, nil
}

func parseMetaTagCondition(input string) (config.Filter, error) {
	// Format: meta_tag:标签名  or  公共标签:标签名
	rest := input
	if idx := strings.Index(input, ":"); idx >= 0 {
		rest = strings.TrimSpace(input[idx+1:])
	}
	negate := false
	if strings.HasPrefix(rest, "!") {
		negate = true
		rest = rest[1:]
	}
	if rest == "" {
		return config.Filter{}, fmt.Errorf("公共标签名不能为空")
	}
	return config.Filter{
		MetaTag: &config.TagFilter{Operator: "contains", Value: rest, Negate: negate},
	}, nil
}

func parseTagCondition(input string) (config.Filter, error) {
	// Format: tag:标签名
	rest := strings.TrimPrefix(input, "tag:")
	rest = strings.TrimSpace(rest)
	negate := false
	if strings.HasPrefix(rest, "!") {
		negate = true
		rest = rest[1:]
	}
	if rest == "" {
		return config.Filter{}, fmt.Errorf("标签名不能为空")
	}
	return config.Filter{
		Tag: &config.TagFilter{Operator: "contains", Value: rest, Negate: negate},
	}, nil
}

func printInteractiveHelp() {
	fmt.Print(`
帮助 - 条件格式
========================
类型筛选:
  动画、书籍、音乐、游戏、三次元             直接输入中文类型名

字段筛选:
  字段名:条件                                 包含匹配
  字段名:re:正则                              正则匹配
  字段名:大于:数值                            大于比较
  字段名:小于:数值                            小于比较
  字段名:早于:日期                            日期早于（如 2024-01-01）
  字段名:晚于:日期                            日期晚于
  *:条件                                     在所有字段中搜索

人物筛选:
  staff:职位名                               筛选有该职位人物的条目
  staff:职位名:name:人名                      人物姓名匹配

剧集筛选:
  ep:字段名:条件                              剧集条件匹配

关系筛选:
  relation:关系名                             有该关系的条目
  relation:!关系名                            没有该关系的条目
  关系名:字段名:条件                           单行关系条件

直接字段名: id, type, name, name_cn, score, rank, date, platform, summary, nsfw, series
`)
}
