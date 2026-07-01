package main

import (
	"context"
	"fmt"
	"os"
	"strconv"
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
		fmt.Fprintln(os.Stderr, "错误: episodes 子命令尚未实现")
		os.Exit(1)

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

	sql := buildCheckSQL(typeCode, name, positions)
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
