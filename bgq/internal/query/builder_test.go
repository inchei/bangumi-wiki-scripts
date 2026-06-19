package query

import (
	"testing"

	"github.com/inchei/bangumi-query/internal/config"
)

func TestBuildSQL(t *testing.T) {
	cfg := &config.Config{
		DataDir: "/home/ooo/workspace/bangumi-wiki-scripts/bangumi_archive",
		Limit:   10,
		Output:  config.Output{Format: "table", Columns: []string{"id", "name", "score"}},
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
		DataDir: "/home/ooo/workspace/bangumi-wiki-scripts/bangumi_archive",
		Limit:   10,
		Output:  config.Output{Format: "table", Columns: []string{"id", "name", "name_cn", "score", "出版社", "作者"}},
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
		DataDir: "/home/ooo/workspace/bangumi-wiki-scripts/bangumi_archive",
		Limit:   10,
		Output:  config.Output{Format: "table", Columns: []string{"id", "name"}},
		Filters: []config.Filter{
			{Type: &config.TypeFilter{Value: 1}},
			{Relation: &config.RelationFilter{
				Type:       "单行本",
				Mode:       "any",
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
		DataDir: "/home/ooo/workspace/bangumi-wiki-scripts/bangumi_archive",
		Limit:   10,
		Output:  config.Output{Format: "table", Columns: []string{"id", "name"}},
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
		DataDir: "/home/ooo/workspace/bangumi-wiki-scripts/bangumi_archive",
		Limit:   10,
		Output:  config.Output{Format: "table", Columns: []string{"id", "name"}},
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
		DataDir: "/home/ooo/workspace/bangumi-wiki-scripts/bangumi_archive",
		Limit:   10,
		Output:  config.Output{Format: "table", Columns: []string{"id", "name"}},
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
		DataDir:   "/home/ooo/workspace/bangumi-wiki-scripts/bangumi_archive",
		Limit:     10,
		Output:    config.Output{Format: "table", Columns: []string{"person_id", "name"}},
		Target:    "person",
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
		DataDir:   "/home/ooo/workspace/bangumi-wiki-scripts/bangumi_archive",
		Limit:     10,
		Output:    config.Output{Format: "table", Columns: []string{"person_id", "name"}},
		Target:    "person",
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
