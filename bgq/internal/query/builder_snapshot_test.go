package query

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"testing"

	"github.com/inchei/bangumi-query/internal/config"
)

var update = flag.Bool("update", false, "update golden files")
var execute = flag.Bool("execute", false, "also execute SQL against DuckDB")

// inClauseRe matches IN (val1, val2, ...) clauses.
var inClauseRe = regexp.MustCompile(`IN \(([^)]+)\)`)

// normalizeSQL sorts values in IN clauses to make output deterministic.
func normalizeSQL(sql string) string {
	return inClauseRe.ReplaceAllStringFunc(sql, func(match string) string {
		inner := match[4 : len(match)-1] // strip "IN (" and ")"
		parts := strings.Split(inner, ", ")
		var nums []int
		for _, p := range parts {
			n, err := strconv.Atoi(strings.TrimSpace(p))
			if err != nil {
				return match // not numeric, leave as-is
			}
			nums = append(nums, n)
		}
		sort.Ints(nums)
		strs := make([]string, len(nums))
		for i, n := range nums {
			strs[i] = strconv.Itoa(n)
		}
		return "IN (" + strings.Join(strs, ", ") + ")"
	})
}

// generateAllSQL returns all valid target × filter × mode combinations as name→SQL pairs.
func generateAllSQL() map[string]string {
	type combo struct {
		filterName string
		targets    []string
	}
	modes := []string{"any", "all", "none", "count"}
	combos := []combo{
		{"staff", []string{"subject", "person"}},
		{"character", []string{"subject", "character"}},
		{"relation", []string{"subject"}},
		{"person_relation", []string{"person"}},
		{"character_relation", []string{"character"}},
		{"person_character", []string{"person"}},
		{"character_person", []string{"character"}},
	}

	results := make(map[string]string)

	for _, c := range combos {
		for _, target := range c.targets {
			for _, mode := range modes {
				var f config.Filter
				switch c.filterName {
				case "staff":
					f = config.Filter{Staff: &config.StaffFilter{
						Position: "原作", Mode: mode, CountOp: "gte", CountVal: 1,
						Conditions: []config.Filter{{Field: &config.FieldFilter{Field: "name", Operator: "contains", Value: "test"}}},
					}}
				case "character":
					f = config.Filter{Character: &config.CharacterFilter{
						Type: "主角", Mode: mode, CountOp: "gte", CountVal: 1,
						Conditions: []config.Filter{{Field: &config.FieldFilter{Field: "name", Operator: "contains", Value: "test"}}},
					}}
				case "relation":
					f = config.Filter{Relation: &config.RelationFilter{
						Type: "单行本", Mode: mode, CountOp: "gte", CountVal: 1,
						Conditions: []config.Filter{{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8"}}},
					}}
				case "person_relation":
					f = config.Filter{PersonRelation: &config.PersonRelationFilter{Type: "同事", Mode: mode, CountOp: "gte", CountVal: 1}}
				case "character_relation":
					f = config.Filter{CharacterRelation: &config.CharacterRelationFilter{Type: "朋友", Mode: mode, CountOp: "gte", CountVal: 1}}
				case "person_character":
					f = config.Filter{PersonCharacter: &config.PersonCharacterFilter{
						Type: "CV", Mode: mode, CountOp: "gte", CountVal: 1,
						SubjectConditions: []config.Filter{{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8"}}},
					}}
				case "character_person":
					f = config.Filter{CharacterPerson: &config.CharacterPersonFilter{
						Type: "CV", Mode: mode, CountOp: "gte", CountVal: 1,
						SubjectConditions: []config.Filter{{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8"}}},
					}}
				}
				name := fmt.Sprintf("%s_%s_%s", c.filterName, target, mode)
				cfg := &config.Config{
					DataDir: testDataDir(), Limit: 10, Target: target,
					Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
					Filters: []config.Filter{f},
				}
				sql, err := NewSQLBuilder(cfg, cfg.DataDir).Build()
				if err != nil {
					results[name] = "ERROR: " + err.Error()
				} else {
					results[name] = sql
				}
			}
		}
	}

	// Three-way: mode × subjectMode
	subjectModes := []string{"any", "all", "count"}
	threeWay := []struct {
		name   string
		target string
		make   func(mode, subjMode string) config.Filter
	}{
		{"person_character", "person", func(mode, subjMode string) config.Filter {
			return config.Filter{PersonCharacter: &config.PersonCharacterFilter{
				Type: "CV", Mode: mode, CountOp: "gte", CountVal: 1,
				SubjectMode: subjMode, SubjectCountOp: "gte", SubjectCountVal: 1,
				SubjectConditions: []config.Filter{{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8"}}},
			}}
		}},
		{"character_person", "character", func(mode, subjMode string) config.Filter {
			return config.Filter{CharacterPerson: &config.CharacterPersonFilter{
				Type: "CV", Mode: mode, CountOp: "gte", CountVal: 1,
				SubjectMode: subjMode, SubjectCountOp: "gte", SubjectCountVal: 1,
				SubjectConditions: []config.Filter{{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8"}}},
			}}
		}},
	}
	for _, tw := range threeWay {
		for _, mode := range modes {
			for _, subjMode := range subjectModes {
				name := fmt.Sprintf("%s_%s_%s_subj%s", tw.name, tw.target, mode, subjMode)
				f := tw.make(mode, subjMode)
				cfg := &config.Config{
					DataDir: testDataDir(), Limit: 10, Target: tw.target,
					Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
					Filters: []config.Filter{f},
				}
				sql, err := NewSQLBuilder(cfg, cfg.DataDir).Build()
				if err != nil {
					results[name] = "ERROR: " + err.Error()
				} else {
					results[name] = sql
				}
			}
		}
	}

	// Simple filters
	simpleFilters := []struct {
		name    string
		targets []string
		filter  config.Filter
	}{
		{"type", []string{"subject", "person", "character"}, config.Filter{Type: &config.TypeFilter{Value: 1}}},
		{"field", []string{"subject", "person", "character", "episode"}, config.Filter{Field: &config.FieldFilter{Field: "name", Operator: "contains", Value: "test"}}},
		{"tag", []string{"subject"}, config.Filter{Tag: &config.TagFilter{Operator: "contains", Value: "test"}}},
		{"meta_tag", []string{"subject"}, config.Filter{MetaTag: &config.TagFilter{Operator: "contains", Value: "TV"}}},
		{"global", []string{"subject"}, config.Filter{Global: &config.GlobalFilter{Operator: "contains", Value: "test"}}},
		{"episode", []string{"subject"}, config.Filter{Episode: &config.EpisodeFilter{
			Mode: "any", Logic: &config.LogicFilter{Op: "and", Items: []config.Filter{
				{Field: &config.FieldFilter{Field: "name", Operator: "contains", Value: "test"}},
			}},
		}}},
	}
	for _, sf := range simpleFilters {
		for _, target := range sf.targets {
			name := fmt.Sprintf("%s_%s", sf.name, target)
			cfg := &config.Config{
				DataDir: testDataDir(), Limit: 10, Target: target,
				Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
				Filters: []config.Filter{sf.filter},
			}
			sql, err := NewSQLBuilder(cfg, cfg.DataDir).Build()
			if err != nil {
				results[name] = "ERROR: " + err.Error()
			} else {
				results[name] = sql
			}
		}
	}

	// Special cases
	specials := []struct {
		name   string
		filter config.Filter
	}{
		{"staff_appear_eps", config.Filter{Staff: &config.StaffFilter{
			Position: "原作", Mode: "any",
			Conditions: []config.Filter{
				{Field: &config.FieldFilter{Field: "appear_eps", Operator: "contains", Value: "1,2,3"}},
			},
		}}},
		{"logic_or", config.Filter{Logic: &config.LogicFilter{Op: "or", Items: []config.Filter{
			{Field: &config.FieldFilter{Field: "score", Operator: "gt", Value: "8"}},
			{Tag: &config.TagFilter{Operator: "contains", Value: "test"}},
		}}}},
		{"tag_negate", config.Filter{Tag: &config.TagFilter{Operator: "contains", Value: "test", Negate: true}}},
		{"meta_tag_negate", config.Filter{MetaTag: &config.TagFilter{Operator: "contains", Value: "TV", Negate: true}}},
	}
	for _, sp := range specials {
		cfg := &config.Config{
			DataDir: testDataDir(), Limit: 10,
			Output:  &config.Output{Format: "table", Columns: []string{"id", "name"}},
			Filters: []config.Filter{sp.filter},
		}
		sql, err := NewSQLBuilder(cfg, cfg.DataDir).Build()
		if err != nil {
			results[sp.name] = "ERROR: " + err.Error()
		} else {
			results[sp.name] = sql
		}
	}

	return results
}

func TestAllCombinations(t *testing.T) {
	results := generateAllSQL()

	// Build stable output (sorted by name), normalize paths
	var names []string
	for name := range results {
		names = append(names, name)
	}
	sort.Strings(names)
	var lines []string
	dataDir := testDataDir()
	for _, name := range names {
		sql := normalizeSQL(results[name])
		sql = strings.ReplaceAll(sql, dataDir, "$DATA_DIR")
		lines = append(lines, name+"\t"+sql)
	}
	output := strings.Join(lines, "\n") + "\n"

	golden := filepath.Join("testdata", "all_combinations.golden")

	if *update {
		_ = os.MkdirAll("testdata", 0755)
		if err := os.WriteFile(golden, []byte(output), 0644); err != nil {
			t.Fatalf("Failed to write golden file: %v", err)
		}
		t.Logf("Updated golden file: %s (%d combinations)", golden, len(results))
		return
	}

	expected, err := os.ReadFile(golden)
	if err != nil {
		t.Fatalf("Golden file not found. Run with -update to create it.\nPath: %s\nError: %v", golden, err)
	}

	if output != string(expected) {
		t.Fatalf("SQL output changed. Run with -update to accept.\nGolden: %s", golden)
	}

	// Optional: also execute against DuckDB
	if *execute {
		SetDuckDBPath(filepath.Join(testBinDir(), "duckdb"))
		engine := NewEngine("", testDataDir())
		for name, sql := range results {
			if strings.HasPrefix(sql, "ERROR:") {
				continue
			}
			t.Run(name, func(t *testing.T) {
				if _, err := engine.executeSQL(t.Context(), sql); err != nil {
					t.Fatalf("Execute failed:\nSQL: %s\nError: %v", sql, err)
				}
			})
		}
	}
}
