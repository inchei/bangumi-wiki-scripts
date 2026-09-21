package main

import (
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"

	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/config"
	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/csvsource"
	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/server"
	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/store"
)

func main() {
	if len(os.Args) < 2 {
		usage()
		os.Exit(1)
	}
	switch os.Args[1] {
	case "serve":
		cmdServe(os.Args[2:])
	case "import":
		cmdImport(os.Args[2:])
	case "remove":
		cmdRemove(os.Args[2:])
	case "completions":
		cmdCompletions(os.Args[2:])
	default:
		usage()
		os.Exit(1)
	}
}

func usage() {
	fmt.Fprintln(os.Stderr, `用法:
  wbt serve [--config wbt.toml] [--dev]   启动服务（--dev 用 air 热重载）
  wbt import [--name <名称>] --db <db路径> --file <csv路径> [...]  导入一次性 CSV（--name 缺省时用文件名去扩展名）
  wbt remove --db <db路径> --name <名称> [...]  删除工作组（连同其全部条目；无参数时列出全部工作组）
  wbt completions [bash|zsh]  输出 shell 补全脚本（remove --name 支持 Tab 补全工作组名）`)
}

func arg(args []string, i *int) string {
	*i++
	if *i >= len(args) {
		fmt.Fprintln(os.Stderr, "参数缺少取值")
		os.Exit(1)
	}
	return args[*i]
}

func openStore(dbPath string) *store.Store {
	st, err := store.Open(dbPath)
	if err != nil {
		fmt.Fprintln(os.Stderr, "打开数据库失败:", err)
		os.Exit(1)
	}
	return st
}

func cmdServe(args []string) {
	configPath := "wbt.toml"
	dev := false
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--config":
			configPath = arg(args, &i)
		case "--dev":
			dev = true
		default:
			fmt.Fprintln(os.Stderr, "未知参数:", args[i])
			usage()
			os.Exit(1)
		}
	}

	// Under --dev and not already running under air: re-exec as air so
	// Go/frontend changes rebuild and restart automatically.
	if dev && os.Getenv("WBT_AIR") == "" {
		absConfig, err := filepath.Abs(configPath)
		if err != nil {
			fmt.Fprintln(os.Stderr, "abs config path:", err)
			os.Exit(1)
		}
		startDevMode(absConfig)
		return
	}

	cfg, err := config.Load(configPath)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	st := openStore(cfg.DBPath)
	defer func() { _ = st.Close() }()

	configured := make(map[string]store.SourceConfigEntry, len(cfg.Sources))
	for _, src := range cfg.Sources {
		configured[src.Name] = store.SourceConfigEntry{URL: src.URL, CronSpec: src.Cron}
	}
	if err := st.ReconcileSources(configured); err != nil {
		fmt.Fprintln(os.Stderr, "对账配置与数据库来源失败:", err)
		os.Exit(1)
	}

	httpServer, scheduler := server.Setup(cfg, st)
	if err := scheduler.Start(); err != nil {
		fmt.Fprintln(os.Stderr, "调度器启动失败:", err)
		os.Exit(1)
	}

	errCh := make(chan error, 1)
	go func() {
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			errCh <- err
		}
	}()
	fmt.Printf("wbt serve 监听 %s（数据库 %s）\n", cfg.Listen, cfg.DBPath)

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	select {
	case err := <-errCh:
		scheduler.Stop()
		fmt.Fprintln(os.Stderr, "服务异常退出:", err)
		os.Exit(1)
	case <-sigCh:
		scheduler.Stop()
	}
}

func cmdImport(args []string) {
	var names, files []string
	dbPath := "wbt.db"
	i := 0
	for i < len(args) {
		switch args[i] {
		case "--name":
			names = append(names, arg(args, &i))
		case "--file":
			files = append(files, arg(args, &i))
		case "--db":
			dbPath = arg(args, &i)
		default:
			fmt.Fprintln(os.Stderr, "未知参数:", args[i])
			usage()
			os.Exit(1)
		}
		i++
	}
	if len(files) == 0 {
		fmt.Fprintln(os.Stderr, "用法: wbt import [--name <名称>] --file <csv路径>")
		os.Exit(1)
	}
	// no --name given: derive workgroup name from file name without extension
	if len(names) > len(files) || (len(names) > 0 && len(names) != len(files)) {
		fmt.Fprintln(os.Stderr, "--name 与 --file 数量不一致")
		os.Exit(1)
	}
	for len(names) < len(files) {
		base := filepath.Base(files[len(names)])
		names = append(names, strings.TrimSuffix(base, filepath.Ext(base)))
	}

	st := openStore(dbPath)
	defer func() { _ = st.Close() }()

	csvSvc := csvsource.New(st)
	totalAdded, totalUpdated := 0, 0
	for i := range names {
		f, err := os.Open(files[i])
		if err != nil {
			fmt.Fprintln(os.Stderr, "打开文件失败:", err)
			os.Exit(1)
		}
		added, updated, err := csvSvc.Import(names[i], f)
		_ = f.Close()
		if err != nil {
			fmt.Fprintf(os.Stderr, "导入 %q 失败: %v\n", names[i], err)
			os.Exit(1)
		}
		fmt.Printf("已导入 %q: 新增 %d，更新 %d\n", names[i], added, updated)
		totalAdded += added
		totalUpdated += updated
	}
	fmt.Printf("导入完成: 共新增 %d，更新 %d\n", totalAdded, totalUpdated)
}
func cmdRemove(args []string) {
	var names []string
	dbPath := "wbt.db"
	namesOnly := false
	i := 0
	for i < len(args) {
		switch args[i] {
		case "--name":
			names = append(names, arg(args, &i))
		case "--db":
			dbPath = arg(args, &i)
		case "--names-only":
			namesOnly = true
		default:
			fmt.Fprintln(os.Stderr, "未知参数:", args[i])
			usage()
			os.Exit(1)
		}
		i++
	}

	st := openStore(dbPath)
	defer func() { _ = st.Close() }()

	if namesOnly && len(names) == 0 {
		// names-only mode lists every workgroup name (for Tab completion)
		srcs, err := st.ListAllSources()
		if err != nil {
			fmt.Fprintln(os.Stderr, "读取工作组失败:", err)
			os.Exit(1)
		}
		for _, src := range srcs {
			fmt.Println(src.Name)
		}
		return
	}

	if len(names) == 0 {
		// interactive picker: show every workgroup with pending counts
		printSourcesHint(st)
		fmt.Fprintln(os.Stderr, "\n用法: wbt remove --db <db路径> --name <名称>")
		os.Exit(1)
	}

	for _, name := range names {
		deleted, err := st.DeleteSource(name)
		if err != nil {
			fmt.Fprintf(os.Stderr, "删除 %q 失败: %v\n", name, err)
			os.Exit(1)
		}
		if deleted {
			fmt.Printf("已删除工作组 %q（连同其全部条目）\n", name)
		} else {
			fmt.Printf("工作组 %q 不存在，跳过\n", name)
		}
	}
}

// printSourcesHint lists workgroups for interactive selection.
func printSourcesHint(st *store.Store) {
	srcs, err := st.ListAllSources()
	if err != nil {
		fmt.Fprintln(os.Stderr, "读取工作组失败:", err)
		os.Exit(1)
	}
	if len(srcs) == 0 {
		fmt.Println("（暂无工作组）")
		return
	}
	for _, src := range srcs {
		pending, _ := st.CountByStatus(src.ID, "pending")
		fmt.Printf("  %d. %s (%s) 待审核 %d / 总数 %d\n", src.ID, src.Name, src.Kind, pending, src.Total)
	}
}

func cmdCompletions(args []string) {
	shell := "bash"
	if len(args) > 0 {
		shell = args[0]
	}
	switch shell {
	case "bash":
		fmt.Print(bashCompletion)
	case "zsh":
		fmt.Print(zshCompletion)
	default:
		fmt.Fprintln(os.Stderr, "不支持的 shell:", shell)
		os.Exit(1)
	}
}

const bashCompletion = `#!/bin/bash
# wbt completion: Tab completes subcommands and remove --name workgroup names
_wbt_complete() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local prev="${COMP_WORDS[COMP_CWORD-1]}"
    if [ "$prev" = "--name" ] || [ "$prev" = "--name=" ]; then
        local pre=("${COMP_WORDS[@]:0:COMP_CWORD-1}")
        local db="./wbt.db"
        for ((i=0; i<${#pre[@]}; i++)); do
            [ "${pre[i]}" = "--db" ] && [ -v "pre[i+1]" ] && db="${pre[i+1]}"
        done
        [ -f "$db" ] && comps=$(wbt remove --names-only --db "$db" 2>/dev/null)
        COMPREPLY=($(compgen -W "$comps" -- "$cur"))
        return
    fi
    COMPREPLY=($(compgen -W "serve import remove completions" -- "$cur"))
}
complete -o default -F _wbt_complete wbt
`

const zshCompletion = `#compdef wbt
# wbt completion for zsh: enable with: eval "$(wbt completions zsh)"
autoload -Uz compinit && compinit -u
_wbt() {
    local -a subcmds
    subcmds=(serve import remove completions)
    if [ "$CURRENT" -ge 2 ] && [ "$words[2]" = "remove" ]; then
        local db="./wbt.db"
        local i
        for ((i = 2; i <= CURRENT; i++)); do
            [ "${words[i]}" = "--db" ] && [ -n "${words[i+1]}" ] && db="${words[i+1]}"
        done
        _values 'workgroup' $(wbt remove --names-only --db "$db" 2>/dev/null)
        return
    fi
    _describe 'subcommand' subcmds
}
compdef _wbt wbt
`
