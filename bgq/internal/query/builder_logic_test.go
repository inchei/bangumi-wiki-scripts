package query

import (
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"github.com/inchei/bangumi-query/internal/config"
)

// testDataDir returns the absolute path to bangumi_archive relative to the repo root.
func testDataDir() string {
	// This file is at bgq/internal/query/builder_logic_test.go
	_, filename, _, _ := runtime.Caller(0)
	return filepath.Join(filepath.Dir(filename), "..", "..", "..", "bangumi_archive")
}

// testExecuteDataDir returns the path to a small test archive for execute tests.
func testExecuteDataDir() string {
	_, filename, _, _ := runtime.Caller(0)
	return filepath.Join(filepath.Dir(filename), "testdata", "archive")
}

// --- Logic structure tests (unit: verify SQL semantics, not just execution) ---

func TestBuildLogicOR(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name", "score"}},
		Filters: []config.Filter{
			{Logic: &config.LogicFilter{
				Op: "or",
				Items: []config.Filter{
					{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8"}},
					{Tag: &config.TagFilter{Operator: "contains", Value: "轻小说"}},
				},
			}},
		},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
	if !strings.Contains(sql, " OR ") {
		t.Errorf("expected OR in SQL, got:\n%s", sql)
	}
	if !strings.Contains(sql, "(") {
		t.Errorf("expected parentheses for OR group, got:\n%s", sql)
	}
}

func TestBuildLogicNested(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name", "score"}},
		Filters: []config.Filter{
			{Logic: &config.LogicFilter{
				Op: "or",
				Items: []config.Filter{
					{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8.5"}},
					{Logic: &config.LogicFilter{
						Op: "and",
						Items: []config.Filter{
							{Tag: &config.TagFilter{Operator: "contains", Value: "轻小说"}},
							{Field: &config.FieldFilter{Field: "date", Operator: "after", Value: "2020-01-01"}},
						},
					}},
				},
			}},
		},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
	if !strings.Contains(sql, " OR ") {
		t.Errorf("expected OR in SQL, got:\n%s", sql)
	}
}

func TestBuildLogicSingleItem(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Logic: &config.LogicFilter{
				Op: "or",
				Items: []config.Filter{
					{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "9"}},
				},
			}},
		},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
	if strings.Contains(sql, " OR ") {
		t.Errorf("single-item logic should not contain OR, got:\n%s", sql)
	}
}
