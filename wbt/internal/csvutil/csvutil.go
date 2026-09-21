package csvutil

import (
	"encoding/csv"
	"fmt"
	"io"
	"regexp"
	"strings"
)

var idHeaderRe = regexp.MustCompile(`(?i)^(person_id|character_id|id)$`)

func EntityTypeForHeader(header string) string {
	switch {
	case strings.EqualFold(header, "person_id"):
		return "person"
	case strings.EqualFold(header, "character_id"):
		return "character"
	default:
		return "subject"
	}
}

// Parse reads CSV content with PapaParse-compatible semantics
// (trim all values, skip empty lines) and returns the entity type
// inferred from the id column name plus one map per row with the
// id under key "id".
func Parse(r io.Reader) (entityType string, rows []map[string]string, err error) {
	cr := csv.NewReader(r)
	cr.FieldsPerRecord = -1
	cr.TrimLeadingSpace = true

	header, err := cr.Read()
	if err != nil {
		return "", nil, fmt.Errorf("CSV 为空或格式错误: %w", err)
	}
	for i, h := range header {
		header[i] = strings.TrimSpace(h)
	}
	if len(header) == 0 {
		return "", nil, fmt.Errorf("CSV 文件为空或格式错误")
	}

	idIdx := -1
	for i, h := range header {
		if idHeaderRe.MatchString(h) {
			idIdx = i
			break
		}
	}
	if idIdx < 0 {
		return "", nil, fmt.Errorf(`CSV 必须包含"id"、"person_id"或"character_id"列`)
	}
	entityType = EntityTypeForHeader(header[idIdx])

	seen := make(map[string]bool, len(header))
	for i, h := range header {
		if i != idIdx && seen[h] {
			return "", nil, fmt.Errorf("CSV 存在重复列: %s", h)
		}
		seen[h] = true
	}

	line := 1
	for {
		record, rerr := cr.Read()
		if rerr == io.EOF {
			break
		}
		if rerr != nil {
			return "", nil, fmt.Errorf("第%d行: %w", line+1, rerr)
		}
		line++

		if idIdx >= len(record) {
			continue
		}
		id := strings.TrimSpace(record[idIdx])
		if id == "" {
			continue
		}

		row := make(map[string]string, len(header))
		row["id"] = id
		for i, h := range header {
			if i == idIdx || i >= len(record) {
				continue
			}
			row[h] = strings.TrimSpace(record[i])
		}
		rows = append(rows, row)
	}

	if len(rows) == 0 {
		return "", nil, fmt.Errorf("未找到有效的数据行")
	}
	return entityType, rows, nil
}
