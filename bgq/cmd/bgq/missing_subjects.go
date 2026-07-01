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

type posDef struct {
	id       int
	name     string
	spattern string // SQL-escaped infobox extract regex
}

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

	// Pre-build per-position SQL parts
	posDefs := make([]posDef, len(posIDs))
	for i, posID := range posIDs {
		spattern := strings.ReplaceAll(
			fmt.Sprintf(`(?i)\|%s\s*[:=]\s*(\{(?:[^}]|\n)*\}|[^|}\n\r]*)`,
				regexp.QuoteMeta(positions[posID])),
			"'", "''",
		)
		posDefs[i] = posDef{posID, positions[posID], spattern}
	}

	var sb strings.Builder

	// CTEs
	cteCount := 0
	if hasSeries {
		sb.WriteString(`WITH series_ids AS (
  SELECT DISTINCT subject_id AS id FROM subject_relations WHERE relation_type = 1002
),
`)
		cteCount++
	}

	// linked CTE: pre-compute all (subject_id, position) where this person is already staff
	fmt.Fprintf(&sb, `%slinked AS (
  SELECT sp.subject_id, sp.position
  FROM subject_persons sp
  JOIN persons p ON sp.person_id = p.person_id
  WHERE LOWER(REPLACE(REPLACE(TRIM(p.name), '　', ''), ' ', '')) = LOWER(REPLACE(REPLACE('%s', '　', ''), ' ', ''))
),
`, withPrefix(cteCount), escapedNameSQL)
	cteCount++

	// base CTE: single scan, compute all match flags as boolean columns
	// Column aliases defined here are accessible in the outer UNION ALL.
	matchCols := buildMatchCols(posDefs, snamePattern)
	fmt.Fprintf(&sb, `%sbase AS (
  SELECT s.id, s.name%s
  FROM subjects s
  WHERE s.type = %d
    %s
)
`,
		withPrefix(cteCount),
		func() string {
			if len(matchCols) == 0 {
				return ""
			}
			return ",\n    " + strings.Join(matchCols, ",\n    ")
		}(),
		typeCode,
		seriesFilter(hasSeries))

	// UNION ALL from base — m_%d references the boolean column from base CTE
	for i, pd := range posDefs {
		if i > 0 {
			sb.WriteString("UNION ALL\n")
		}
		fmt.Fprintf(&sb, "SELECT id, name, %d FROM base WHERE m_%d AND id NOT IN (SELECT subject_id FROM linked WHERE position = %d)",
			pd.id, pd.id, pd.id)
		sb.WriteString("\n")
	}

	return sb.String()
}

func withPrefix(cteCount int) string {
	if cteCount == 0 {
		return "WITH "
	}
	return ""
}

func seriesFilter(hasSeries bool) string {
	if hasSeries {
		return "AND s.id NOT IN (SELECT id FROM series_ids)"
	}
	return ""
}

func buildMatchCols(posDefs []posDef, snamePattern string) []string {
	cols := make([]string, len(posDefs))
	for i, pd := range posDefs {
		cols[i] = fmt.Sprintf(
			"regexp_matches(REPLACE(REPLACE(regexp_extract(s.infobox, '%s', 1), '　', ''), ' ', ''), '%s') AS m_%d",
			pd.spattern, snamePattern, pd.id)
	}
	return cols
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
