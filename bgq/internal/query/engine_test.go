package query

import (
	"context"
	"testing"
)

func TestExecuteSimple(t *testing.T) {
	SetDuckDBPath("/home/ooo/workspace/bangumi-wiki-scripts/bgq/bin/duckdb")

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
	SetDuckDBPath("/home/ooo/workspace/bangumi-wiki-scripts/bgq/bin/duckdb")

	engine := NewEngine("", "/home/ooo/workspace/bangumi-wiki-scripts/bangumi_archive")
	// Use direct executeSQL
	sql := `WITH subjects AS (SELECT * FROM read_json_auto('/home/ooo/workspace/bangumi-wiki-scripts/bangumi_archive/subject.jsonlines', format='newline_delimited'))
SELECT s.id, s.name, s.score
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
