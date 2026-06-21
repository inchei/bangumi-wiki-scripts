package query

import (
	"context"
	"path/filepath"
	"runtime"
	"testing"
)

// testBinDir returns the absolute path to bgq/bin relative to the repo root.
func testBinDir() string {
	_, filename, _, _ := runtime.Caller(0)
	return filepath.Join(filepath.Dir(filename), "..", "..", "..", "bin")
}

func TestExecuteSimple(t *testing.T) {
	SetDuckDBPath(filepath.Join(testBinDir(), "duckdb"))

	// Test that DuckDB execution works via temp file
	result, err := executeSQLDirectly(context.Background(), "SELECT 1 AS test, 2 AS num;")
	if err != nil {
		t.Fatalf("executeSQLDirectly failed: %v", err)
	}
	t.Logf("Columns: %v", result.Columns)
	t.Logf("Rows: %v", result.Rows)
	if len(result.Rows) != 1 {
		t.Errorf("Expected 1 row, got %d", len(result.Rows))
	}
}

func TestExecuteWithJSON(t *testing.T) {
	SetDuckDBPath(filepath.Join(testBinDir(), "duckdb"))

	archiveDir := testDataDir()
	engine := NewEngine("", archiveDir)
	// Use direct executeSQL
	sql := "WITH subjects AS (SELECT * FROM read_json_auto('" + filepath.Join(archiveDir, "subject.jsonlines") + "', format='newline_delimited'))\n" +
		`SELECT s.id, s.name, s.score
FROM subjects s
WHERE s.type = 2 AND CAST(s.score AS DOUBLE) > 8.5
ORDER BY s.score DESC
LIMIT 3;`

	result, err := engine.executeSQL(context.Background(), sql)
	if err != nil {
		t.Fatalf("executeSQL failed: %v", err)
	}
	t.Logf("Got %d results", result.TotalRows)
	if result.TotalRows == 0 {
		t.Error("Expected results, got 0")
	}
}

// executeSQLDirectly calls executeSQL on a zero-value Engine (accessing unexported method via test in same package).
func executeSQLDirectly(ctx context.Context, sql string) (*QueryResult, error) {
	e := &Engine{}
	return e.executeSQL(ctx, sql)
}
