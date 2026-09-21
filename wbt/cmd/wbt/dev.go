package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
)

func startDevMode(absConfig string) {
	// Mark that we're running under air, so the child binary won't re-exec
	_ = os.Setenv("WBT_AIR", "1")

	wd, err := os.Getwd()
	if err != nil {
		fmt.Fprintf(os.Stderr, "cwd: %v\n", err)
		os.Exit(1)
	}

	binPath := filepath.Join(wd, "tmp", "wbt")
	cfgPath := filepath.Join(wd, ".air-dev.toml")

	cfg := fmt.Sprintf(`root = "%s"
tmp_dir = "%s"

[build]
  bin = "%s"
  cmd = "test -f internal/server/dist/index.html || go generate ./internal/server/; go build -o %s ./cmd/wbt"
  entrypoint = ["%s", "serve", "--config", "%s"]
  delay = 1000
  exclude_dir = ["tmp", "bin", "node_modules", "frontend/node_modules", "frontend/dist"]
  exclude_regex = ["_test\\.go$", "\\.db$", "\\.db-"]
  exclude_unchanged = false
  include_ext = ["go", "tpl", "tmpl", "html"]
  kill_delay = "0s"
  send_interrupt = false
  stop_on_error = false

# Frontend changes rebuild the SPA and write the embedded dist; the resulting
# dist/*.css then triggers the main build above to re-embed and restart.
[[build.rules]]
  name = "frontend"
  include_dir = ["frontend"]
  include_ext = ["ts", "js", "css", "html"]
  exclude_regex = ["node_modules"]
  cmd = "go generate ./internal/server/"

[log]
  time = false

[color]
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[misc]
  clean_on_exit = true
`, wd, filepath.Join(wd, "tmp"), binPath, binPath, binPath, absConfig)

	if err := os.WriteFile(cfgPath, []byte(cfg), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "write air config: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("dev mode: air config → %s\n", cfgPath)
	fmt.Printf("hint: frontend HMR is not required here; changes rebuild via go generate\n")

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
