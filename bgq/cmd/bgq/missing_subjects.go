package main

import (
	"fmt"
	"net/http"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"github.com/inchei/bangumi-query/internal/model"
	"github.com/inchei/bangumi-query/internal/query"
)

const delimClass = `[()\[\]{}（）<>《》「」『』【】+×·→/／、,，;；：&＆\\等]`

// infoboxPairPattern extracts all `|key= value` single-line pairs from an
// infobox template string. Group 1 = key, group 2 = value (up to newline or
// pipe). Multi-line brace values (`|key: { ... }`) are intentionally NOT
// supported — `bgq missing` only checks single-line staff fields.
// Anchored to start-of-line with (?im) so `^` matches each line, not just
// the start of the whole string.
const infoboxPairPattern = `(?im)^\|([^|=\n]+?)\s*=\s*([^\n\r|]*)`

func (s *server) handleCheckMissingStaff(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		writeJSON(w, http.StatusMethodNotAllowed, apiError{Error: "只支持GET请求"})
		return
	}

	if !allowedReferrer(r) {
		writeJSON(w, http.StatusForbidden, apiError{Error: "仅允许来自 bgm.tv 的请求"})
		return
	}

	if s.dbPath == "" {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "需要 --db 参数指向已 ingest 的数据库，请先运行 bgq ingest"})
		return
	}

	name := r.PathValue("name")
	typeStr := r.URL.Query().Get("type")
	posStr := r.URL.Query().Get("position")

	if name == "" || typeStr == "" {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "name 和 type 为必填参数"})
		return
	}

	typeCode, err := strconv.Atoi(typeStr)
	if err != nil || typeCode < 1 || typeCode > 6 {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "type 无效，可用值: 1(书籍) 2(动画) 3(音乐) 4(游戏) 6(三次元)"})
		return
	}

	allPositions := model.StaffPositions[typeCode]
	if len(allPositions) == 0 {
		writeJSON(w, http.StatusBadRequest, apiError{Error: fmt.Sprintf("条目类型 %d 没有职位定义", typeCode)})
		return
	}

	positions := allPositions
	if posStr != "" {
		posID, err := strconv.Atoi(posStr)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, apiError{Error: "position 必须为数字 ID"})
			return
		}
		posName, ok := allPositions[posID]
		if !ok {
			writeJSON(w, http.StatusBadRequest, apiError{Error: fmt.Sprintf("条目类型 %d 没有职位 ID %d", typeCode, posID)})
			return
		}
		positions = map[int]string{posID: posName}
	}

	sql := buildCheckSQL(typeCode, name, positions)

	engine := query.NewEngine(s.dbPath, s.dataDir)
	result, err := engine.ExecuteRaw(r.Context(), sql)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "查询失败: " + err.Error()})
		return
	}

	type subjectEntry struct {
		Name      string `json:"name"`
		Positions []int  `json:"positions"`
	}
	agg := make(map[int]subjectEntry)
	for _, row := range result.Rows {
		if len(row) < 3 {
			continue
		}
		sid, _ := strconv.Atoi(row[0])
		pid, _ := strconv.Atoi(row[2])
		entry := agg[sid]
		entry.Name = row[1]
		entry.Positions = append(entry.Positions, pid)
		agg[sid] = entry
	}

	writeJSON(w, http.StatusOK, agg)
}

func buildCheckSQL(typeCode int, personName string, positions map[int]string) string {
	cleanName := strings.ReplaceAll(strings.ReplaceAll(personName, "　", ""), " ", "")
	escapedName := regexp.QuoteMeta(cleanName)
	escapedNameSQL := strings.ReplaceAll(personName, "'", "''")
	snamePattern := strings.ReplaceAll(
		fmt.Sprintf(`(?i)(^|%s|\n)%s($|%s|\n)`, delimClass, escapedName, delimClass),
		"'", "''",
	)

	posIDs := sortedKeys(positions)
	hasSeries := typeCode == 1

	// Build positions_map VALUES list: (id, '职位名'), (id, '职位名'), ...
	var posValues strings.Builder
	for i, posID := range posIDs {
		if i > 0 {
			posValues.WriteString(",")
		}
		posNameSQL := strings.ReplaceAll(positions[posID], "'", "''")
		fmt.Fprintf(&posValues, "(%d, '%s')", posID, posNameSQL)
	}

	// infobox pair pattern (single-quoted SQL string; no single quotes in
	// the pattern itself, so no doubling needed).
	infoboxPatternSQL := strings.ReplaceAll(infoboxPairPattern, "'", "''")

	var sb strings.Builder

	// CTE 1 (optional): series_ids — only for book type (1).
	cteCount := 0
	if hasSeries {
		sb.WriteString(`WITH series_ids AS (
  SELECT DISTINCT subject_id AS id FROM subject_relations WHERE relation_type = 1002
),
`)
		cteCount++
	}

	// CTE: linked — pre-compute (subject_id, position) where this person is
	// already a registered staff member.
	fmt.Fprintf(&sb, `%slinked AS (
  SELECT sp.subject_id, sp.position
  FROM subject_persons sp
  JOIN persons p ON sp.person_id = p.person_id
  WHERE LOWER(REPLACE(REPLACE(TRIM(p.name), '　', ''), ' ', '')) = LOWER(REPLACE(REPLACE('%s', '　', ''), ' ', ''))
),
`, withPrefix(cteCount), escapedNameSQL)
	cteCount++

	// CTE: positions_map — (position_id, position_name) tuples for this type.
	fmt.Fprintf(&sb, `%spositions_map(id, name) AS (
  VALUES %s
),
`, withPrefix(cteCount), posValues.String())
	cteCount++

	// CTE: pairs — single-pass extraction of all `|key= value` pairs per
	// subject. list_zip aligns keys (group 1) with values (group 2); unnest
	// turns the list into one row per pair. kv[1]/kv[2] access unnamed
	// struct fields (list_zip produces unnamed structs in DuckDB 1.2).
	fmt.Fprintf(&sb, `%spairs AS (
  SELECT subject_id,
         LOWER(TRIM(REPLACE(kv[1], '　', ''))) AS k,
         kv[2] AS v
  FROM (
    SELECT s.id AS subject_id,
           UNNEST(LIST_ZIP(
             regexp_extract_all(s.infobox, '%s', 1),
             regexp_extract_all(s.infobox, '%s', 2)
           )) AS kv
    FROM subjects s
    WHERE s.type = %d
%s
  ) sub
)
`, withPrefix(cteCount), infoboxPatternSQL, infoboxPatternSQL, typeCode,
		indentSeriesFilter(hasSeries))

	// Final SELECT: subjects whose infobox value for a position key mentions
	// the person (with delimiter boundaries), but no linked staff entry
	// exists for that (subject, position).
	sb.WriteString(`SELECT s.id, s.name, pm.id
FROM subjects s
JOIN pairs ON pairs.subject_id = s.id
JOIN positions_map pm ON pm.name = pairs.k
WHERE regexp_matches(REPLACE(REPLACE(pairs.v, '　', ''), ' ', ''), '`)
	sb.WriteString(snamePattern)
	sb.WriteString(`')
  AND NOT EXISTS (SELECT 1 FROM linked l WHERE l.subject_id = s.id AND l.position = pm.id)
ORDER BY s.id, pm.id;`)

	return sb.String()
}

func withPrefix(cteCount int) string {
	if cteCount == 0 {
		return "WITH "
	}
	return ""
}

// seriesFilter returns the AND-clause that excludes series subjects (only
// applied for book type 1, where series subjects are aggregate entries that
// should not themselves be checked for missing staff).
func seriesFilter(hasSeries bool) string {
	if hasSeries {
		return "AND s.id NOT IN (SELECT id FROM series_ids)"
	}
	return ""
}

// indentSeriesFilter returns seriesFilter() indented for embedding inside the
// pairs subquery's WHERE clause (two-level indent: 4 + 4 spaces).
func indentSeriesFilter(hasSeries bool) string {
	s := seriesFilter(hasSeries)
	if s == "" {
		return ""
	}
	return "    " + s
}

var allowedHosts = []string{"bgm.tv", "bangumi.tv", "chii.in"}

func allowedReferrer(r *http.Request) bool {
	src := r.Header.Get("Origin")
	if src == "" {
		src = r.Header.Get("Referer")
	}
	if src == "" {
		return true // direct access (new tab, curl without referrer)
	}
	for _, h := range allowedHosts {
		if strings.HasSuffix(src, h) {
			return true
		}
	}
	return false
}

func sortedKeys(m map[int]string) []int {
	keys := make([]int, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Ints(keys)
	return keys
}
