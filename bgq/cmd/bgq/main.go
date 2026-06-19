package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/inchei/bangumi-query/internal/config"
	"github.com/inchei/bangumi-query/internal/query"
	webui "github.com/inchei/bangumi-query/internal/server"
)

const (
	version = "0.1.0"
	banner  = `
  ██████╗   ██████╗   ██████╗
  ██╔══██╗ ██╔════╝  ██╔═══██╗
  ██████╔╝ ██║  ███╗ ██║   ██║  Bangumi Query
  ██╔══██╗ ██║   ██║ ██║▄▄ ██║  v` + version + `
  ██████╔╝ ╚██████╔╝ ╚██████╔╝
  ╚═════╝   ╚═════╝   ╚══▀▀═╝

`
)

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	// Find DuckDB binary
	duckdbPath := findDuckDB()
	query.SetDuckDBPath(duckdbPath)

	switch os.Args[1] {
	case "query":
		cmdQuery(os.Args[2:])
	case "serve":
		cmdServe(os.Args[2:])
	case "ingest":
		cmdIngest(os.Args[2:])
	case "export-deploy":
		cmdExportDeploy(os.Args[2:])
	case "interactive":
		cmdInteractive(os.Args[2:])
	case "version", "--version", "-v":
		fmt.Printf("bgq version %s\n", version)
	case "help", "--help", "-h":
		printUsage()
	default:
		fmt.Fprintf(os.Stderr, "未知命令: %s\n", os.Args[1])
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Print(banner)
	fmt.Println(`用法:
  bgq query --config <yaml文件> [--data-dir <数据目录>] [--output <输出文件>]
  bgq query --interactive [--data-dir <数据目录>]
  bgq serve [--data-dir <数据目录>] [--listen <地址:端口>] [--dev]
  bgq ingest --data-dir <数据目录> --db <数据库路径>
  bgq version
  bgq help

子命令:
  query       执行筛选查询（从YAML配置文件）
  serve       启动Web界面
  ingest      将数据导入DuckDB数据库（加速后续查询）
  interactive 交互式模式（兼容旧版Python脚本）
  version     显示版本信息
  help        显示此帮助信息

示例:
  bgq query --config query.yaml
  bgq serve --listen :8080
  bgq serve --dev
  bgq ingest --data-dir ./bangumi_archive --db ./bangumi.db
  bgq query --interactive`)
}

func findDuckDB() string {
	// Check DUCKDB_PATH environment variable first
	if envPath := os.Getenv("DUCKDB_PATH"); envPath != "" {
		if _, err := os.Stat(envPath); err == nil {
			return envPath
		}
	}

	// For development: look in common relative locations
	candidates := []string{
		"bin/duckdb",
		"../bin/duckdb",
	}

	// Check relative to the executable
	if execPath, err := os.Executable(); err == nil {
		execDir := filepath.Dir(execPath)
		candidates = append(candidates,
			filepath.Join(execDir, "duckdb"),
			filepath.Join(execDir, "bin", "duckdb"),
		)
	}

	// Check relative to current working directory
	if cwd, err := os.Getwd(); err == nil {
		candidates = append(candidates,
			filepath.Join(cwd, "bin", "duckdb"),
		)
		// Also check parent directories (for development from bgq/ subdirectory)
		for dir := cwd; dir != "/" && dir != "."; dir = filepath.Dir(dir) {
			candidates = append(candidates,
				filepath.Join(dir, "bgq", "bin", "duckdb"),
				filepath.Join(dir, "bin", "duckdb"),
			)
		}
	}

	for _, path := range candidates {
		if _, err := os.Stat(path); err == nil {
			return path
		}
	}

	// Last resort: check PATH
	return "duckdb"
}

func cmdQuery(args []string) {
	var configFile, dataDir, outputFile, formatOverride string
	verbose := false

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--config", "-c":
			if i+1 < len(args) {
				configFile = args[i+1]
				i++
			}
		case "--data-dir", "-d":
			if i+1 < len(args) {
				dataDir = args[i+1]
				i++
			}
		case "--output", "-o":
			if i+1 < len(args) {
				outputFile = args[i+1]
				i++
			}
		case "--format", "-f":
			if i+1 < len(args) {
				formatOverride = args[i+1]
				i++
			}
		case "--verbose", "-v":
			verbose = true
		}
	}

	if configFile == "" {
		fmt.Fprintln(os.Stderr, "错误: 需要指定 --config <yaml文件>")
		fmt.Fprintln(os.Stderr, "或使用 --interactive 进入交互模式")
		os.Exit(1)
	}

	if dataDir == "" {
		dataDir = "bangumi_archive"
	}

	// Load config
	cfg, err := config.Load(configFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "加载配置文件失败: %v\n", err)
		os.Exit(1)
	}

	// Use config's data_dir if command-line didn't specify one
	if dataDir == "bangumi_archive" && cfg.DataDir != "" {
		dataDir = cfg.DataDir
	}

	// Resolve data directory relative to config file if needed
	dataDir = resolveDataDir(dataDir, configFile)

	// Override format if specified
	if formatOverride != "" {
		cfg.Output.Format = formatOverride
	}

	// Execute query
	runQuery(cfg, dataDir, outputFile, verbose)
}

func cmdInteractive(args []string) {
	dataDir := "bangumi_archive"
	for i := 0; i < len(args); i++ {
		if args[i] == "--data-dir" || args[i] == "-d" {
			if i+1 < len(args) {
				dataDir = args[i+1]
				i++
			}
		}
	}

	fmt.Print(banner)
	fmt.Println("交互式筛选模式")
	fmt.Println("输入筛选条件（格式参考 bgq-interactive --help），输入空行执行查询，输入 :q 退出")
	fmt.Println()

	interactiveMode(dataDir)
}

func cmdServe(args []string) {
	dataDir := "bangumi_archive"
	listen := ":8080"
	dev := false

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--data-dir", "-d":
			if i+1 < len(args) {
				dataDir = args[i+1]
				i++
			}
		case "--listen", "-l":
			if i+1 < len(args) {
				listen = args[i+1]
				i++
			}
		case "--dev":
			dev = true
		}
	}

	// If --dev is set and we're not already running under air, start air
	if dev && os.Getenv("BGQ_AIR") == "" {
		bgqDir, err := os.Getwd()
		if err != nil {
			fmt.Fprintf(os.Stderr, "cwd: %v\n", err)
			os.Exit(1)
		}
		startDevMode(bgqDir, dataDir, listen)
		return
	}

	fmt.Printf("启动Web服务器 http://localhost%s ...\n", listen)
	fmt.Printf("数据目录: %s\n", dataDir)

	startServer(dataDir, listen)
}

func cmdIngest(args []string) {
	var dataDir, dbPath string

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--data-dir", "-d":
			if i+1 < len(args) {
				dataDir = args[i+1]
				i++
			}
		case "--db":
			if i+1 < len(args) {
				dbPath = args[i+1]
				i++
			}
		}
	}

	if dataDir == "" {
		dataDir = "bangumi_archive"
	}
	if dbPath == "" {
		dbPath = "bangumi.db"
	}

	fmt.Printf("正在导入数据...\n")
	fmt.Printf("数据目录: %s\n", dataDir)
	fmt.Printf("数据库: %s\n", dbPath)

	if err := runIngest(dataDir, dbPath); err != nil {
		fmt.Fprintf(os.Stderr, "导入失败: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("导入完成！")
	fmt.Printf("数据库大小: ")
	if info, err := os.Stat(dbPath); err == nil {
		fmt.Printf("%.1f MB\n", float64(info.Size())/(1024*1024))
	}
}

func runQuery(cfg *config.Config, dataDir, outputFile string, verbose bool) {
	ctx := context.Background()
	engine := query.NewEngine(cfg.Database, dataDir)

	fmt.Printf("正在执行查询...\n")

	result, err := engine.Execute(ctx, cfg)
	if err != nil {
		fmt.Fprintf(os.Stderr, "查询失败: %v\n", err)
		os.Exit(1)
	}

	if verbose {
		fmt.Fprintf(os.Stderr, "\n--- 生成的 SQL ---\n%s\n--- 结束 ---\n\n", result.SQL)
	}

	// Output
	switch cfg.Output.Format {
	case "csv":
		path := outputFile
		if path == "" {
			path = cfg.Output.Path
		}
		if path == "" {
			path = "results.csv"
		}
		if err := result.WriteCSV(path); err != nil {
			fmt.Fprintf(os.Stderr, "写入CSV失败: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("结果保存至: %s\n", path)
		fmt.Printf("共 %d 行, 耗时 %v\n", result.TotalRows, result.Duration.Round(time.Millisecond))
	case "json":
		path := outputFile
		if path == "" {
			path = cfg.Output.Path
		}
		if path == "" {
			path = "results.json"
		}
		if err := result.WriteJSON(path); err != nil {
			fmt.Fprintf(os.Stderr, "写入JSON失败: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("结果保存至: %s\n", path)
		fmt.Printf("共 %d 行, 耗时 %v\n", result.TotalRows, result.Duration.Round(time.Millisecond))
	default:
		fmt.Print(result.FormatTable(50))
	}
}

func cmdExportDeploy(args []string) {
	output := "deploy/index.html"
	for i := 0; i < len(args); i++ {
		if args[i] == "--output" || args[i] == "-o" {
			if i+1 < len(args) {
				output = args[i+1]
				i++
			}
		}
	}
	if err := os.WriteFile(output, []byte(webui.WebUIHTML), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "写入失败: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("已导出到 %s (%d bytes)\n", output, len(webui.WebUIHTML))
}

func resolveDataDir(dataDir, configFile string) string {
	// If absolute path, return as-is
	if strings.HasPrefix(dataDir, "/") {
		return dataDir
	}

	// Try relative to current working directory first
	if _, err := os.Stat(dataDir); err == nil {
		return dataDir
	}

	// Try relative to config file's directory
	if configFile != "" {
		configAbs, err := filepath.Abs(configFile)
		if err == nil {
			configDir := filepath.Dir(configAbs)
			resolved := filepath.Join(configDir, dataDir)
			if _, err := os.Stat(resolved); err == nil {
				return resolved
			}
		}
	}

	return dataDir
}

func runIngest(dataDir, dbPath string) error {
	// Create DuckDB database and import JSONLines files
	ctx := context.Background()

	sql := fmt.Sprintf(`
-- Create tables from JSONLines files
CREATE TABLE IF NOT EXISTS subjects AS
  SELECT * FROM read_json_auto('%s/subject.jsonlines', format='newline_delimited');

CREATE TABLE IF NOT EXISTS subject_relations AS
  SELECT * FROM read_json_auto('%s/subject-relations.jsonlines', format='newline_delimited');

CREATE TABLE IF NOT EXISTS subject_persons AS
  SELECT * FROM read_json_auto('%s/subject-persons.jsonlines', format='newline_delimited');

CREATE TABLE IF NOT EXISTS episodes AS
  SELECT * FROM read_json_auto('%s/episode.jsonlines', format='newline_delimited');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subjects_type ON subjects(type);
CREATE INDEX IF NOT EXISTS idx_relations_subject ON subject_relations(subject_id);
CREATE INDEX IF NOT EXISTS idx_relations_type ON subject_relations(relation_type);
CREATE INDEX IF NOT EXISTS idx_persons_subject ON subject_persons(subject_id);
CREATE INDEX IF NOT EXISTS idx_persons_position ON subject_persons(position);
CREATE INDEX IF NOT EXISTS idx_episodes_subject ON episodes(subject_id);
`, dataDir, dataDir, dataDir, dataDir)

	return query.ExecuteDuckDBSQL(ctx, dbPath, sql)
}
