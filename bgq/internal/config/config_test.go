package config

import (
	"strings"
	"testing"
)

func TestValidateFilterTreeLimits(t *testing.T) {
	mkField := func(name string) Filter {
		return Filter{Field: &FieldFilter{Field: name, Operator: "contains", Value: "x"}}
	}

	t.Run("over total count", func(t *testing.T) {
		items := make([]Filter, 0, maxFilterCount+1)
		for i := 0; i < maxFilterCount+1; i++ {
			items = append(items, mkField("name"))
		}
		cfg := &Config{Filters: []Filter{{Logic: &LogicFilter{Op: "and", Items: items}}}}
		err := cfg.Validate()
		if err == nil || !strings.Contains(err.Error(), "超过上限") {
			t.Fatalf("expected count limit error, got %v", err)
		}
	})

	t.Run("within total count", func(t *testing.T) {
		// The outer Logic node counts too, so keep 499 items + 1 wrapper = 500.
		items := make([]Filter, 0, maxFilterCount-1)
		for i := 0; i < maxFilterCount-1; i++ {
			items = append(items, mkField("name"))
		}
		cfg := &Config{Filters: []Filter{{Logic: &LogicFilter{Op: "and", Items: items}}}}
		if err := cfg.Validate(); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
	})

	t.Run("over nesting depth", func(t *testing.T) {
		inner := mkField("name")
		for i := 0; i < maxFilterDepth; i++ {
			inner = Filter{Logic: &LogicFilter{Op: "and", Items: []Filter{inner}}}
		}
		cfg := &Config{Filters: []Filter{inner}}
		err := cfg.Validate()
		if err == nil || !strings.Contains(err.Error(), "深度") {
			t.Fatalf("expected depth limit error, got %v", err)
		}
	})
}
