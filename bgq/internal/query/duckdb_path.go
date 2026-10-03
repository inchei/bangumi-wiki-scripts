package query

import (
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

// FindDuckDB locates the DuckDB CLI binary. Resolution order: DUCKDB_PATH
// env var, common relative locations (bin/duckdb next to the executable or
// cwd and its ancestors), then PATH.
func FindDuckDB() string {
	// Check DUCKDB_PATH environment variable first
	if envPath := os.Getenv("DUCKDB_PATH"); envPath != "" {
		if _, err := os.Stat(envPath); err == nil {
			if abs, err := filepath.Abs(envPath); err == nil {
				return abs
			}
			return envPath
		}
	}

	bin := "duckdb"
	if runtime.GOOS == "windows" {
		bin = "duckdb.exe"
	}

	// For development: look in common relative locations
	candidates := []string{
		filepath.Join("bin", bin),
		filepath.Join("..", "bin", bin),
	}

	// Check relative to the executable
	if execPath, err := os.Executable(); err == nil {
		execDir := filepath.Dir(execPath)
		candidates = append(candidates,
			filepath.Join(execDir, bin),
			filepath.Join(execDir, "bin", bin),
		)
	}

	// Check relative to current working directory
	if cwd, err := os.Getwd(); err == nil {
		candidates = append(candidates,
			filepath.Join(cwd, "bin", bin),
		)
		// Also check parent directories (for development from bgq/ subdirectory)
		for dir := cwd; ; dir = filepath.Dir(dir) {
			if dir == filepath.Dir(dir) {
				break // reached root (works on both Linux and Windows)
			}
			candidates = append(candidates,
				filepath.Join(dir, "bgq", "bin", bin),
				filepath.Join(dir, "bin", bin),
			)
		}
	}

	for _, path := range candidates {
		if _, err := os.Stat(path); err == nil {
			if abs, err := filepath.Abs(path); err == nil {
				return abs
			}
			return path
		}
	}

	// Last resort: check PATH
	name := "duckdb"
	if runtime.GOOS == "windows" {
		name = "duckdb.exe"
	}
	if p, err := exec.LookPath(name); err == nil {
		if abs, err := filepath.Abs(p); err == nil {
			return abs
		}
		return p
	}
	return name
}
