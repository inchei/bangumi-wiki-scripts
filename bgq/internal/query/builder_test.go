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
	// This file is at bgq/internal/query/builder_test.go
	_, filename, _, _ := runtime.Caller(0)
	return filepath.Join(filepath.Dir(filename), "..", "..", "..", "bangumi_archive")
}

func TestBuildSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name", "score"}},
		Filters: []config.Filter{
			{Type: &config.TypeFilter{Value: 2}},
			{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8.5"}},
		},
		Sort: []config.SortRule{{Field: "score", Direction: "desc"}},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
}

func TestBuildComplexSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name", "name_cn", "score", "出版社", "作者"}},
		Filters: []config.Filter{
			{Type: &config.TypeFilter{Value: 1}},
			{Field: &config.FieldFilter{Field: "出版社", Operator: "contains", Value: "角川"}},
			{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "7.5"}},
		},
		Sort: []config.SortRule{{Field: "score", Direction: "desc"}},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
}

func TestBuildRelationSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Type: &config.TypeFilter{Value: 1}},
			{Relation: &config.RelationFilter{
				Type: "单行本",
				Mode: "any",
				Conditions: []config.Filter{
					{Field: &config.FieldFilter{Field: "发售日", Operator: "after", Value: "2020-01-01"}},
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
}

func TestBuildStaffSQL_SubjectTarget(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Type: &config.TypeFilter{Value: 2}},
			{Staff: &config.StaffFilter{
				Position: "原作",
				Mode:     "any",
				Conditions: []config.Filter{
					{Field: &config.FieldFilter{Field: "name", Operator: "contains", Value: "虚渊"}},
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
}

func TestBuildStaffSQL_SubjectTarget_MultiCond(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Staff: &config.StaffFilter{
				Position: "原作",
				Mode:     "any",
				Conditions: []config.Filter{
					{Field: &config.FieldFilter{Field: "name", Operator: "contains", Value: "虚渊"}},
					{Global: &config.GlobalFilter{Operator: "contains", Value: "1980"}},
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
}

func TestBuildStaffSQL_SubjectTarget_None(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Staff: &config.StaffFilter{
				Position: "导演",
				Mode:     "none",
			}},
		},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
}

func TestBuildStaffSQL_PersonTarget(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"person_id", "name"}},
		Target:  "person",
		Filters: []config.Filter{
			{Staff: &config.StaffFilter{
				Position: "原作",
				Mode:     "any",
				Conditions: []config.Filter{
					{Type: &config.TypeFilter{Value: 2}},
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
}

func TestBuildStaffSQL_PersonTarget_MultiCond(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"person_id", "name"}},
		Target:  "person",
		Filters: []config.Filter{
			{Staff: &config.StaffFilter{
				Position: "原作",
				Mode:     "any",
				Conditions: []config.Filter{
					{Type: &config.TypeFilter{Value: 1}},
					{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8"}},
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
}

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

func TestBuildLogicInRelation(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Type: &config.TypeFilter{Value: 1}},
			{Relation: &config.RelationFilter{
				Type: "单行本",
				Mode: "any",
				Conditions: []config.Filter{
					{Logic: &config.LogicFilter{
						Op: "or",
						Items: []config.Filter{
							{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8"}},
							{Field: &config.FieldFilter{Field: "name", Operator: "contains", Value: "文库"}},
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
		t.Errorf("expected OR in relation subquery, got:\n%s", sql)
	}
}

func TestBuildLogicInStaff(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Type: &config.TypeFilter{Value: 2}},
			{Staff: &config.StaffFilter{
				Position: "原作",
				Mode:     "any",
				Conditions: []config.Filter{
					{Logic: &config.LogicFilter{
						Op: "or",
						Items: []config.Filter{
							{Field: &config.FieldFilter{Field: "name", Operator: "contains", Value: "虚渊"}},
							{Field: &config.FieldFilter{Field: "name", Operator: "contains", Value: "奈须"}},
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
		t.Errorf("expected OR in staff subquery, got:\n%s", sql)
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
	// Single item should be unwrapped (no parentheses needed)
	if strings.Contains(sql, " OR ") {
		t.Errorf("single-item logic should not contain OR, got:\n%s", sql)
	}
}

func TestBuildTagSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Tag: &config.TagFilter{Operator: "contains", Value: "轻小说"}},
		},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
	if !strings.Contains(sql, "UNNEST") {
		t.Errorf("expected UNNEST for tag filter, got:\n%s", sql)
	}
}

func TestBuildMetaTagSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{MetaTag: &config.TagFilter{Operator: "contains", Value: "TV"}},
		},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
	if !strings.Contains(sql, "LIST_CONTAINS") {
		t.Errorf("expected LIST_CONTAINS for meta_tag filter, got:\n%s", sql)
	}
}

func TestBuildGlobalSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Global: &config.GlobalFilter{Operator: "contains", Value: "完结"}},
		},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
	if !strings.Contains(sql, "infobox") {
		t.Errorf("expected infobox in global filter, got:\n%s", sql)
	}
}

func TestBuildEpisodeSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Episode: &config.EpisodeFilter{
				Mode: "any",
				Logic: &config.LogicFilter{
					Op: "and",
					Items: []config.Filter{
						{Field: &config.FieldFilter{Field: "name", Operator: "regex", Value: "第\\d+話"}},
					},
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
	if !strings.Contains(sql, "episodes") {
		t.Errorf("expected episodes table, got:\n%s", sql)
	}
}

func TestBuildPersonRelationSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Target:  "person",
		Output:  &config.Output{Format: "table", Columns: []string{"person_id", "name"}},
		Filters: []config.Filter{
			{PersonRelation: &config.PersonRelationFilter{
				Type: "同事",
				Mode: "any",
			}},
		},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
	if !strings.Contains(sql, "person_relations") {
		t.Errorf("expected person_relations table, got:\n%s", sql)
	}
}

func TestBuildCharacterFilterSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Character: &config.CharacterFilter{
				Type: "主角",
				Mode: "any",
				Conditions: []config.Filter{
					{Field: &config.FieldFilter{Field: "name", Operator: "contains", Value: "ルルーシュ"}},
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
	if !strings.Contains(sql, "subject_characters") {
		t.Errorf("expected subject_characters table, got:\n%s", sql)
	}
}

func TestBuildPersonCharacterSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Target:  "person",
		Output:  &config.Output{Format: "table", Columns: []string{"person_id", "name"}},
		Filters: []config.Filter{
			{PersonCharacter: &config.PersonCharacterFilter{
				Type:        "CV",
				Mode:        "any",
				SubjectMode: "any",
				SubjectConditions: []config.Filter{
					{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8"}},
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
	if !strings.Contains(sql, "person_characters") {
		t.Errorf("expected person_characters table, got:\n%s", sql)
	}
}

func TestBuildAppearEpsSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Staff: &config.StaffFilter{
				Position:  "原作",
				Mode:      "any",
				AppearEps: &config.FieldFilter{Field: "appear_eps", Operator: "contains", Value: "1,2,3"},
			}},
		},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
	if !strings.Contains(sql, "appear_eps") {
		t.Errorf("expected appear_eps in SQL, got:\n%s", sql)
	}
}

func TestBuildRelationAnySQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: testDataDir(),
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Relation: &config.RelationFilter{
				Type: "任意",
				Mode: "none",
			}},
		},
	}
	b := NewSQLBuilder(cfg, cfg.DataDir)
	sql, err := b.Build()
	if err != nil {
		t.Fatalf("Build failed: %v", err)
	}
	t.Logf("Generated SQL:\n%s", sql)
	if !strings.Contains(sql, "NOT EXISTS") {
		t.Errorf("expected NOT EXISTS for none mode, got:\n%s", sql)
	}
}
