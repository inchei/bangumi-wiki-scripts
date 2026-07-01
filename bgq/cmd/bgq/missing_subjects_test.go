package main

import (
	"strings"
	"testing"

	"github.com/inchei/bangumi-query/internal/model"
)

func TestBuildCheckSQL_BookExcludesSeries(t *testing.T) {
	positions := map[int]string{1: "作者"}
	sql := buildCheckSQL(1, "川原砾", positions)

	if !strings.Contains(sql, "series_ids") {
		t.Error("book type (1) should include series_ids CTE")
	}
	if !strings.Contains(sql, "relation_type = 1002") {
		t.Error("series_ids should filter relation_type = 1002")
	}
	if !strings.Contains(sql, "s.type = 1") {
		t.Error("should filter subjects.type = 1")
	}
}

func TestBuildCheckSQL_AnimeNoSeriesFilter(t *testing.T) {
	positions := map[int]string{1: "原作"}
	sql := buildCheckSQL(2, "川原砾", positions)

	if strings.Contains(sql, "series_ids") {
		t.Error("anime type (2) should NOT include series_ids CTE")
	}
	if !strings.Contains(sql, "s.type = 2") {
		t.Error("should filter subjects.type = 2")
	}
}

func TestBuildCheckSQL_MultiplePositions(t *testing.T) {
	positions := map[int]string{1: "原作", 46: "系列构成"}
	sql := buildCheckSQL(2, "川原砾", positions)

	// Should have UNION ALL for each position
	count := strings.Count(sql, "UNION ALL")
	if count != 1 {
		t.Errorf("2 positions should have 1 UNION ALL, got %d", count)
	}

	if !strings.Contains(sql, "position = 1") && !strings.Contains(sql, "position = 46") {
		t.Error("should reference both position IDs")
	}
}

func TestBuildCheckSQL_GameType(t *testing.T) {
	positions := make(map[int]string)
	for id, name := range model.StaffPositions[4] {
		positions[id] = name
	}
	sql := buildCheckSQL(4, "虚淵玄", positions)

	if !strings.Contains(sql, "s.type = 4") {
		t.Error("should filter subjects.type = 4")
	}
	if strings.Contains(sql, "series_ids") {
		t.Error("game type (4) should NOT include series_ids CTE")
	}
}

func TestBuildCheckSQL_ContainsLinkedCTE(t *testing.T) {
	positions := map[int]string{1: "原作"}
	sql := buildCheckSQL(2, "川原砾", positions)

	if !strings.Contains(sql, "linked AS") {
		t.Error("should include linked CTE for existing staff check")
	}
	if !strings.Contains(sql, "subject_persons sp") {
		t.Error("linked CTE should join subject_persons")
	}
	if !strings.Contains(sql, "persons p") {
		t.Error("linked CTE should join persons")
	}
}

func TestBuildCheckSQL_NameEscaping(t *testing.T) {
	positions := map[int]string{1: "作者"}
	sql := buildCheckSQL(1, "O'Brien", positions)

	if !strings.Contains(sql, "O''Brien") {
		t.Error("should escape single quotes in name")
	}
}

func TestBuildCheckSQL_InfoboxMatchColumns(t *testing.T) {
	positions := map[int]string{1: "作者", 2: "出版社"}
	sql := buildCheckSQL(1, "川原砾", positions)

	if !strings.Contains(sql, "m_1") {
		t.Error("should create match column m_1 for position ID 1")
	}
	if !strings.Contains(sql, "m_2") {
		t.Error("should create match column m_2 for position ID 2")
	}
}

func TestBuildCheckSQL_SinglePositionNoUnion(t *testing.T) {
	positions := map[int]string{5: "插图"}
	sql := buildCheckSQL(1, "川原砾", positions)

	if strings.Contains(sql, "UNION ALL") {
		t.Error("single position should not have UNION ALL")
	}
}
