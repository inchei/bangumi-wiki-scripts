package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
)

func startDevMode(bgqDir, dataDir, listen, dbPath, aliasesFile string) {
	// Mark that we're running under air, so the child binary won't re-exec
	_ = os.Setenv("BGQ_AIR", "1")

	absDir, err := filepath.Abs(bgqDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "abs: %v\n", err)
		os.Exit(1)
	}

	absDataDir, err := filepath.Abs(dataDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "abs data dir: %v\n", err)
		os.Exit(1)
	}

	binPath := filepath.Join(absDir, "tmp", "bgq")
	cfgPath := filepath.Join(absDir, ".air-dev.toml")

	dbFlag := ""
	if dbPath != "" {
		absDB, err := filepath.Abs(dbPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "abs db path: %v\n", err)
			os.Exit(1)
		}
		dbFlag = fmt.Sprintf(`, "--db", "%s"`, absDB)
	}

	aliasesFlag := ""
	if aliasesFile != "" {
		absAliases, err := filepath.Abs(aliasesFile)
		if err != nil {
			fmt.Fprintf(os.Stderr, "abs aliases path: %v\n", err)
			os.Exit(1)
		}
		aliasesFlag = fmt.Sprintf(`, "--aliases-file", "%s"`, absAliases)
	}

	cfg := fmt.Sprintf(`root = "%s"
tmp_dir = "%s"

[build]
  bin = "%s"
  cmd = "go build -o %s ./cmd/bgq"
  entrypoint = ["%s", "serve", "--data-dir", "%s", "--listen", "%s"%s%s]
  delay = 1000
  exclude_dir = ["tmp", "deploy", "bin"]
  exclude_regex = ["_test.go$", "\\.db$"]
  exclude_unchanged = false
  include_ext = ["go", "tpl", "tmpl", "html"]
  kill_delay = "0s"
  send_interrupt = false
  stop_on_error = false

[log]
  time = false

[color]
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[misc]
  clean_on_exit = true
`, absDir, filepath.Join(absDir, "tmp"), binPath, binPath, binPath, absDataDir, listen, dbFlag, aliasesFlag)

	if err := os.WriteFile(cfgPath, []byte(cfg), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "write air config: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("dev mode: air config → %s\n", cfgPath)

	goPath, err := exec.LookPath("go")
	if err != nil {
		fmt.Fprintf(os.Stderr, "go not found: %v\n", err)
		os.Exit(1)
	}

	argv := []string{"go", "tool", "air", "-c", cfgPath}
	if err := syscall.Exec(goPath, argv, os.Environ()); err != nil {
		fmt.Fprintf(os.Stderr, "exec air: %v\n", err)
		os.Exit(1)
	}
}
