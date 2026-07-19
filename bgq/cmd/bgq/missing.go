package main

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/inchei/bangumi-query/internal/model"
	"github.com/inchei/bangumi-query/internal/query"
)

const missingQueryTimeout = 5 * time.Minute

func findDefaultDB(candidates []string) string {
	for _, p := range candidates {
		if fi, err := os.Stat(p); err == nil && !fi.IsDir() {
			return p
		}
	}
	return ""
}

func cmdMissing(args []string) {
	if len(args) < 2 {
		fmt.Fprintln(os.Stderr, "用法: bgq missing subjects <人名> --type <条目类型> [--db <数据库>]")
		fmt.Fprintln(os.Stderr, "       bgq missing episodes <人名> [--db <数据库>]")
		os.Exit(1)
	}

	subcommand := args[0]
	name := args[1]
	var dbPath string

	for i := 2; i < len(args); i++ {
		switch args[i] {
		case "--db":
			if i+1 < len(args) {
				dbPath = args[i+1]
				i++
			}
		case "--data-dir", "-d":
			if i+1 < len(args) {
				i++ // ignored, missing only works with ingested db
			}
		}
	}

	if dbPath == "" {
		dbPath = findDefaultDB([]string{"bangumi.db"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), missingQueryTimeout)
	defer cancel()

	switch subcommand {
	case "subjects":
		typeCode := 0
		for i := 2; i < len(args); i++ {
			if args[i] == "--type" && i+1 < len(args) {
				typeCode, _ = strconv.Atoi(args[i+1])
				break
			}
		}
		if typeCode == 0 {
			fmt.Fprintln(os.Stderr, "需要 --type 参数: 1(书籍) 2(动画) 3(音乐) 4(游戏) 6(三次元)")
			os.Exit(1)
		}
		if dbPath == "" {
			fmt.Fprintln(os.Stderr, "错误: 未找到 bangumi.db，请先运行 bgq ingest 或在当前目录放置 bangumi.db，或指定 --db 参数")
			os.Exit(1)
		}
		runMissingSubjects(ctx, name, typeCode, dbPath)

	case "episodes":
		if dbPath == "" {
			fmt.Fprintln(os.Stderr, "错误: 未找到 bangumi.db，请先运行 bgq ingest 或在当前目录放置 bangumi.db，或指定 --db 参数")
			os.Exit(1)
		}
		runMissingEpisodes(ctx, name, dbPath)

	default:
		fmt.Fprintf(os.Stderr, "未知子命令: %s\n", subcommand)
		os.Exit(1)
	}
}

func runMissingSubjects(ctx context.Context, name string, typeCode int, dbPath string) {
	positions := model.StaffPositions[typeCode]
	if len(positions) == 0 {
		fmt.Fprintf(os.Stderr, "条目类型 %d 没有职位定义\n", typeCode)
		os.Exit(1)
	}

	sql := buildCheckSQL(typeCode, name, positions, 0)
	engine := query.NewEngine(dbPath, "")
	result, err := engine.ExecuteRaw(ctx, sql)
	if err != nil {
		fmt.Fprintf(os.Stderr, "查询失败: %v\n", err)
		os.Exit(1)
	}

	if len(result.Rows) == 0 {
		fmt.Println("未发现缺失")
		return
	}

	fmt.Printf("共发现 %d 个可能缺失的条目:\n\n", len(result.Rows))
	for _, row := range result.Rows {
		if len(row) >= 3 {
			fmt.Printf("  %s (id=%s) 缺少职位: %s\n", row[1], row[0], positionsName(row[2]))
		}
	}
}

func runMissingEpisodes(ctx context.Context, name string, dbPath string) {
	positions := make(map[int]string)
	for _, m := range model.StaffPositions {
		for id, posName := range m {
			positions[id] = posName
		}
	}

	lit2pid, combinedRe := buildEpPositionTable(positions)
	if combinedRe == nil {
		fmt.Fprintln(os.Stderr, "构建职位正则失败")
		os.Exit(1)
	}

	nameClean := strings.ReplaceAll(strings.ReplaceAll(name, "　", ""), " ", "")
	nameRe := regexp.MustCompile(fmt.Sprintf(`(?i)(^|%s|\n)%s($|%s|\n)`,
		delimClass, regexp.QuoteMeta(nameClean), delimClass))

	escapedNameSQL := strings.ReplaceAll(name, "'", "''")
	linked := queryLinkedCLI(ctx, dbPath, escapedNameSQL)

	sql := fmt.Sprintf(`
SELECT e.episode_id, e.subject_id, s.name AS subject_name, e.sort, e.type, e.description
FROM episodes e
JOIN subjects s ON e.subject_id = s.id
WHERE e.disc = 0
  AND s.type = 2
  AND REPLACE(REPLACE(e.description, '　', ''), ' ', '')
        LIKE '%%' || REPLACE(REPLACE('%s', '　', ''), ' ', '') || '%%'
ORDER BY e.subject_id, e.sort, e.type
`, escapedNameSQL)

	engine := query.NewEngine(dbPath, "")
	result, err := engine.ExecuteRaw(ctx, sql)
	if err != nil {
		fmt.Fprintf(os.Stderr, "查询失败: %v\n", err)
		os.Exit(1)
	}

	type unmatchedEp struct {
		EpisodeID int
		Label     string
	}

	type epSubject struct {
		Name      string
		Episodes  map[int][]string
		AllEps    []unmatchedEp
		LinkedSet map[string]bool
	}

	temp := make(map[int]*epSubject)
	for _, row := range result.Rows {
		if len(row) < 6 {
			continue
		}
		episodeID, _ := strconv.Atoi(row[0])
		sid, _ := strconv.Atoi(row[1])
		subjName := row[2]
		sortNum, _ := strconv.ParseFloat(row[3], 64)
		epType, _ := strconv.Atoi(row[4])
		desc := row[5]

		label := epLabel(sortNum, epType)
		cleanDesc := strings.ReplaceAll(desc, "\r", "")

		if temp[sid] == nil {
			temp[sid] = &epSubject{
				Name:     subjName,
				Episodes: make(map[int][]string),
			}
		}
		temp[sid].AllEps = append(temp[sid].AllEps, unmatchedEp{EpisodeID: episodeID, Label: label})

		allMatches := combinedRe.FindAllStringIndex(cleanDesc, -1)
		if allMatches == nil {
			continue
		}

		accepted := resolveOverlaps(allMatches)

		for i, m := range accepted {
			matchedStr := cleanDesc[m[0]:m[1]]
			posID, ok := lit2pid[matchedStr]
			if !ok {
				continue
			}

			if linked[posID] != nil {
				if epLabels, ok := linked[posID][sid]; ok {
					if epLabels[label] {
						if temp[sid].LinkedSet == nil {
							temp[sid].LinkedSet = make(map[string]bool)
						}
						temp[sid].LinkedSet[label] = true
						continue
					}
				}
			}

			segEnd := len(cleanDesc)
			if i+1 < len(accepted) {
				segEnd = accepted[i+1][0]
			}
			seg := cleanDesc[m[1]:segEnd]

			if !nameRe.MatchString(seg) {
				continue
			}

			temp[sid].Episodes[posID] = append(temp[sid].Episodes[posID], label)
		}
	}

	matchedCount := 0
	for sid, subj := range temp {
		matchedSet := make(map[string]bool)
		m := make(map[int][]string)
		for pid, labels := range subj.Episodes {
			m[pid] = labels
			for _, l := range labels {
				matchedSet[l] = true
			}
		}
		if len(m) > 0 {
			matchedCount++
			fmt.Printf("✓ %s (id=%d):\n", subj.Name, sid)
			for pid, labels := range m {
				fmt.Printf("    %s: %s\n", positionsName(strconv.Itoa(pid)), strings.Join(labels, ", "))
			}
		}
	}

	if matchedCount == 0 {
		fmt.Println("未发现匹配剧集")
	}
}

func queryLinkedCLI(ctx context.Context, dbPath, escapedNameSQL string) map[int]map[int]map[string]bool {
	sql := fmt.Sprintf(`
SELECT subject_id, position, COALESCE(appear_eps, '') AS appear_eps
FROM subject_persons sp
JOIN persons p ON sp.person_id = p.person_id
WHERE LOWER(REPLACE(REPLACE(TRIM(p.name), '　', ''), ' ', '')) = LOWER(REPLACE(REPLACE('%s', '　', ''), ' ', ''))
`, escapedNameSQL)

	engine := query.NewEngine(dbPath, "")
	result, err := engine.ExecuteRaw(ctx, sql)
	if err != nil {
		return make(map[int]map[int]map[string]bool)
	}

	linked := make(map[int]map[int]map[string]bool)
	for _, row := range result.Rows {
		if len(row) < 3 {
			continue
		}
		pid, _ := strconv.Atoi(row[1])
		sid, _ := strconv.Atoi(row[0])
		epSet := expandAppearEps(row[2])
		if linked[pid] == nil {
			linked[pid] = make(map[int]map[string]bool)
		}
		linked[pid][sid] = epSet
	}
	return linked
}

func positionsName(pidStr string) string {
	pid, err := strconv.Atoi(pidStr)
	if err != nil {
		return pidStr
	}
	for _, m := range model.StaffPositions {
		if name, ok := m[pid]; ok {
			return name
		}
	}
	return pidStr
}
