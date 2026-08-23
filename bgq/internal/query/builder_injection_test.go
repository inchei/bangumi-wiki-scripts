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
