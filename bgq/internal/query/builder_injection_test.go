package query

import (
	"strings"
	"testing"

	"github.com/inchei/bangumi-query/internal/config"
)

// TestBuildConditionNumericRejectsInjection verifies that numeric comparison
// values are validated as plain numeric literals, so SQL injection via
// gt/gte/lt/lte operators is rejected at SQL-generation time.
func TestBuildConditionNumericRejectsInjection(t *testing.T) {
	b := NewSQLBuilder(&config.Config{Target: "subject", Limit: 10}, "/tmp/data")

	for _, bad := range []string{
		"9.5 OR 1=1",
		"9.5) OR 1=1 --",
		"0; DROP TABLE subjects --",
		"x",
		"1e5' OR 1=1 --",
		"Inf",
		"NaN",
		"0x1p-2",
	} {
		if _, err := b.buildCondition("s.score", "gt", bad); err == nil {
			t.Errorf("expected error for value %q, got none", bad)
		}
	}

	// Valid numeric literals must still be accepted unchanged (trimmed).
	for _, ok := range []string{"0", "9.5", "-3", "+4", "1e3", "1.25E-2", " 42 ", ""} {
		want := "0"
		if ok != "" {
			want = strings.TrimSpace(ok)
		}
		got, err := safeNum(ok)
		if err != nil {
			t.Errorf("unexpected error for value %q: %v", ok, err)
			continue
		}
		if got != want {
			t.Errorf("safeNum(%q) = %q, want %q", ok, got, want)
		}
	}
}

// TestGlobalRegexQuoteEscaping verifies that regex operator values are escaped
// as SQL string literals (single quotes doubled) while preserving regex
// metacharacters, so apostrophes can't break the SQL and patterns stay real
// regexes.
func TestGlobalRegexQuoteEscaping(t *testing.T) {
	for _, build := range []func(*SQLBuilder) (string, error){
		func(b *SQLBuilder) (string, error) {
			return b.globalFilter(&config.GlobalFilter{Operator: "regex", Value: "o'brien"})
		},
		func(b *SQLBuilder) (string, error) {
			return b.globalFilterForAlias(&config.GlobalFilter{Operator: "regex", Value: "o'brien"}, "rs")
		},
		func(b *SQLBuilder) (string, error) {
			return b.globalFilterForNested(&config.GlobalFilter{Operator: "regex", Value: "o'brien"}, "p")
		},
	} {
		b := NewSQLBuilder(&config.Config{Target: "subject", Limit: 10}, "/tmp/data")
		sql, err := build(b)
		if err != nil {
			t.Fatal(err)
		}
		if !strings.Contains(sql, "'o''brien'") {
			t.Errorf("apostrophe not SQL-escaped: %s", sql)
		}
	}

	// Regex metacharacters must be preserved (not escaped as literals).
	b := NewSQLBuilder(&config.Config{Target: "subject", Limit: 10}, "/tmp/data")
	sql, err := b.globalFilter(&config.GlobalFilter{Operator: "regex", Value: "^O.Brien(猫)?$"})
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(sql, `'^O.Brien(猫)?$'`) {
		t.Errorf("regex metacharacters were escaped: %s", sql)
	}

	// career regex on person target: same escaping rules apply.
	bp := NewSQLBuilder(&config.Config{Target: "person", Limit: 10}, "/tmp/data")
	sql, err = bp.fieldFilter(&config.FieldFilter{Field: "career", Operator: "regex", Value: "a'b|c"}, "p")
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(sql, "'a''b|c'") {
		t.Errorf("career regex not escaped correctly: %s", sql)
	}
}

// TestRegexCastsNonVarchar verifies that regex comparisons cast the field
// expression to VARCHAR, since DuckDB's regexp_matches has no overload for
// numeric columns (e.g. s.score is DOUBLE).
func TestRegexCastsNonVarchar(t *testing.T) {
	b := NewSQLBuilder(&config.Config{Target: "subject", Limit: 10}, "/tmp/data")

	sql, err := b.buildCondition("s.score", "regex", "^9")
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(sql, "CAST(s.score AS VARCHAR)") {
		t.Errorf("regex on numeric field missing VARCHAR cast: %s", sql)
	}

	sql, err = b.buildCondition("s.score", "not_regex", "^9")
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(sql, "CAST(s.score AS VARCHAR)") {
		t.Errorf("not_regex on numeric field missing VARCHAR cast: %s", sql)
	}

	// Field-to-field regex compare casts both sides.
	sql, err = b.buildFieldCompare("score", "name", "", "regex", "s", "rs")
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(sql, "CAST(s.score AS VARCHAR)") || !strings.Contains(sql, "CAST(rs.name AS VARCHAR)") {
		t.Errorf("field-compare regex missing VARCHAR casts: %s", sql)
	}
}

// TestAssocIDOutputColumn verifies that "entity.id" output columns reference
// the entity's actual primary key column (persons/characters/episodes rename
// id to person_id/character_id/episode_id in both the CTEs and the ingested DB).
func TestAssocIDOutputColumn(t *testing.T) {
	cfg := &config.Config{
		Target:  "subject",
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"原作.id", "主角.id", "episode.id"}},
		Filters: []config.Filter{{Type: &config.TypeFilter{Value: 1}}},
	}
	b := NewSQLBuilder(cfg, "/tmp/data")
	sql, err := b.Build()
	if err != nil {
		t.Fatal(err)
	}
	for _, want := range []string{"p.person_id", "c.character_id", "e.episode_id"} {
		if !strings.Contains(sql, want) {
			t.Errorf("generated SQL missing %s:\n%s", want, sql)
		}
	}
	for _, bad := range []string{"SELECT p.id FROM", "SELECT c.id FROM", "SELECT e.id FROM"} {
		if strings.Contains(sql, bad) {
			t.Errorf("generated SQL still references nonexistent %s:\n%s", bad, sql)
		}
	}

	// Aggregation mode (field+) orders by the entity PK, not the main id column.
	cfgAll := &config.Config{
		Target:  "subject",
		Limit:   10,
		Output:  &config.Output{Format: "table", Columns: []string{"原作.name+"}},
		Filters: []config.Filter{{Type: &config.TypeFilter{Value: 1}}},
	}
	ba := NewSQLBuilder(cfgAll, "/tmp/data")
	sqlAll, err := ba.Build()
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(sqlAll, "ORDER BY p.person_id") {
		t.Errorf("aggregation ORDER BY uses wrong column:\n%s", sqlAll)
	}
}

// TestBuildSubjectCountValRejectsInjection verifies the person_character /
// character_person subject-count threshold is validated before interpolation.
func TestBuildSubjectCountValRejectsInjection(t *testing.T) {
	cfg := &config.Config{
		Target: "person",
		Limit:  10,
		Output: &config.Output{Format: "table"},
		Filters: []config.Filter{
			{PersonCharacter: &config.PersonCharacterFilter{
				Mode: "any", SubjectMode: "count",
				SubjectCountOp: "gte", SubjectCountVal: "1) OR 1=1 --",
				SubjectConditions: []config.Filter{
					{Field: &config.FieldFilter{Field: "name", Operator: "contains", Value: "test"}},
				},
			}},
		},
	}
	b := NewSQLBuilder(cfg, "/tmp/data")
	if _, err := b.Build(); err == nil {
		t.Fatal("expected error for injected subject_count_val, got none")
	}
}
