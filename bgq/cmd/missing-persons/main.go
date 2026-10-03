package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"time"

	"github.com/inchei/bangumi-query/internal/missingpersons"
	"github.com/inchei/bangumi-query/internal/query"
)

const missingQueryTimeout = 5 * time.Minute

func main() {
	query.SetDuckDBPath(query.FindDuckDB())

	fs := flag.NewFlagSet("missing-persons", flag.ExitOnError)
	var dbPath, archiveDir, aliasFile, outputDir string
	var statsOnly bool
	var statsJSON string
	fs.StringVar(&dbPath, "db", "", "数据库路径")
	fs.StringVar(&archiveDir, "archive-dir", "", "归档目录")
	fs.StringVar(&aliasFile, "aliases-file", "", "别名文件（person_alias.json）")
	fs.StringVar(&outputDir, "output-dir", "", "输出目录")
	fs.BoolVar(&statsOnly, "stats-only", false, "仅输出统计，不生成 HTML")
	fs.StringVar(&statsJSON, "stats-json", "", "统计 JSON 输出路径（默认 stdout）")
	_ = fs.Parse(os.Args[1:])

	if dbPath == "" {
		dbPath = findDefaultDB([]string{"bangumi.db", "bgq/bangumi.db", "../bangumi.db"})
	}
	if dbPath == "" {
		fmt.Fprintln(os.Stderr, "错误: 未找到 bangumi.db，请先运行 bgq ingest 或指定 --db 参数")
		os.Exit(1)
	}

	if archiveDir == "" {
		archiveDir = resolveArchiveDir("bangumi_archive", "bgq/bangumi_archive", "../bangumi_archive")
	}

	if aliasFile == "" {
		for _, p := range []string{"person_alias.json", "bgq/../person_alias.json", "../person_alias.json"} {
			if fi, err := os.Stat(p); err == nil && !fi.IsDir() {
				aliasFile = p
				break
			}
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), missingQueryTimeout)
	defer cancel()

	if err := missingpersons.Run(ctx, missingpersons.Options{
		DBPath:     dbPath,
		ArchiveDir: archiveDir,
		AliasFile:  aliasFile,
		OutputDir:  outputDir,
		StatsOnly:  statsOnly,
		StatsJSON:  statsJSON,
	}); err != nil {
		os.Exit(1)
	}
}

func findDefaultDB(candidates []string) string {
	for _, p := range candidates {
		if fi, err := os.Stat(p); err == nil && !fi.IsDir() {
			return p
		}
	}
	return ""
}

func resolveArchiveDir(candidates ...string) string {
	for _, p := range candidates {
		if fi, err := os.Stat(p); err == nil && fi.IsDir() {
			return p
		}
	}
	return ""
}
