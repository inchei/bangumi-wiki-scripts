package csvutil

import (
	"strings"
	"testing"
)

func TestParseTypes(t *testing.T) {
	cases := map[string]string{
		"id":           "subject",
		"person_id":    "person",
		"character_id": "character",
		"PERSON_ID":    "person",
	}
	for col, want := range cases {
		r := strings.NewReader(col + "\n1\n")
		et, rows, err := Parse(r)
		if err != nil {
			t.Fatalf("%s: %v", col, err)
		}
		if et != want {
			t.Fatalf("%s: got %s want %s", col, et, want)
		}
		if len(rows) != 1 || rows[0]["id"] != "1" {
			t.Fatalf("%s: rows=%v", col, rows)
		}
	}
}

func TestMissingIDColumn(t *testing.T) {
	r := strings.NewReader("foo,bar\n1,2\n")
	if _, _, err := Parse(r); err == nil {
		t.Fatal("should fail without id column")
	}
}

func TestEmptyRowsSkipped(t *testing.T) {
	r := strings.NewReader("id,v\n1,a\n\n2,b\n")
	et, rows, err := Parse(r)
	if err != nil || et != "subject" || len(rows) != 2 {
		t.Fatalf("et=%s rows=%d err=%v", et, len(rows), err)
	}
}

func TestQuotedValues(t *testing.T) {
	r := strings.NewReader("id,备注\n100,\"多\n行,含逗号\"\n")
	_, rows, err := Parse(r)
	if err != nil {
		t.Fatal(err)
	}
	if rows[0]["备注"] != "多\n行,含逗号" {
		t.Fatalf("quoted value: %q", rows[0]["备注"])
	}
}

func TestDuplicateColumnsRejected(t *testing.T) {
	r := strings.NewReader("id,价格,价格\n1,2,3\n")
	if _, _, err := Parse(r); err == nil {
		t.Fatal("duplicate columns should fail")
	}
}

func TestErrorLineReport(t *testing.T) {
	r := strings.NewReader("id\n1\n\"unterminated\n")
	if _, _, err := Parse(r); err == nil {
		t.Fatal("malformed CSV should fail")
	}
}

func TestParseSubjectOK(t *testing.T) {
	r := strings.NewReader("id,中文名\n100,foo\n")
	_, rows, err := Parse(r)
	if err != nil {
		t.Fatal(err)
	}
	if rows[0]["中文名"] != "foo" {
		t.Fatalf("rows: %v", rows)
	}
}
