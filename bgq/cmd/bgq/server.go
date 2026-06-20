package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/inchei/bangumi-query/internal/config"
	"github.com/inchei/bangumi-query/internal/model"
	srv "github.com/inchei/bangumi-query/internal/server"
	"github.com/inchei/bangumi-query/internal/query"
	webui "github.com/inchei/bangumi-query/internal/server"
	"gopkg.in/yaml.v3"
)

type server struct {
	dataDir    string
	mu         sync.RWMutex
	queryCache map[string]*cachedQuery
}

type cachedQuery struct {
	Result    *query.QueryResult
	Timestamp time.Time
}

type apiQueryRequest struct {
	Target     string         `json:"target,omitempty"`
	Conditions []string       `json:"conditions,omitempty"`
	Filters    []config.Filter `json:"filters,omitempty"`
	Columns    []string       `json:"columns,omitempty"`
	Sort       []config.SortRule `json:"sort,omitempty"`
	Limit      int            `json:"limit,omitempty"`
	Format     string         `json:"format,omitempty"`
	YAML       string         `json:"yaml,omitempty"`
}

type apiError struct {
	Error   string `json:"error"`
	Message string `json:"message,omitempty"`
}

type apiSchemaFields struct {
	DirectFields  []string            `json:"direct_fields"`
	SubjectTypes  map[string]int      `json:"subject_types"`
	RelationTypes map[string][]string `json:"relation_types"` // type -> relation names
	StaffPosition map[string][]string `json:"staff_positions"` // type -> position names
}

func startServer(dataDir, listenAddr string) {
	// Resolve dataDir to absolute path
	absDataDir := dataDir
	if !strings.HasPrefix(dataDir, "/") {
		if cwd, err := os.Getwd(); err == nil {
			absDataDir = filepath.Join(cwd, dataDir)
		}
	}
	if info, err := os.Stat(absDataDir); err != nil || !info.IsDir() {
		fmt.Printf("⚠ 警告: 数据目录不存在: %s\n", absDataDir)
	}

	s := &server{
		dataDir:    dataDir,
		queryCache: make(map[string]*cachedQuery),
	}

	mux := http.NewServeMux()

	// API endpoints
	mux.HandleFunc("/api/query", s.handleQuery)
	mux.HandleFunc("/api/config/parse", s.handleConfigParse)
	mux.HandleFunc("/api/config/export", s.handleConfigExport)
	mux.HandleFunc("/api/schema/fields", s.handleSchemaFields)
	mux.HandleFunc("/api/schema/options", s.handleSchemaOptions)
	mux.HandleFunc("/api/schema/relations", s.handleSchemaRelations)
	mux.HandleFunc("/api/schema/positions", s.handleSchemaPositions)
	mux.HandleFunc("/api/schema/types", s.handleSchemaTypes)
	mux.HandleFunc("/api/stats", s.handleStats)
	mux.HandleFunc("/api/health", s.handleHealth)
	mux.HandleFunc("/api/debug", s.handleDebug)

	// Static files (frontend or placeholder)
	mux.Handle("/static/", srv.StaticHandler())
	mux.HandleFunc("/", s.handleStatic)

	// CORS middleware wrapper
	handler := corsMiddleware(mux)

	fmt.Printf("\n  Bangumi Query Web UI\n")
	fmt.Printf("  ────────────────────\n")
	fmt.Printf("  URL:      http://localhost%s\n", listenAddr)
	fmt.Printf("  DuckDB:   %s\n", query.GetDuckDBPath())
	fmt.Printf("  DataDir:  %s\n", absDataDir)
	fmt.Printf("\n  按 Ctrl+C 停止服务器\n\n")

	server := &http.Server{
		Addr:         listenAddr,
		Handler:      handler,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 5 * time.Minute, // queries can take time
		IdleTimeout:  60 * time.Second,
	}

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("服务器启动失败: %v", err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *server) handleQuery(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		writeJSON(w, http.StatusMethodNotAllowed, apiError{Error: "只支持POST请求"})
		return
	}

	var req apiQueryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "请求格式错误: " + err.Error()})
		return
	}

	var cfg *config.Config

	if req.YAML != "" {
		// Parse from YAML string
		var err error
		cfg, err = config.Load(req.YAML)
		if err != nil {
			// Try parsing as inline YAML
			cfg = &config.Config{DataDir: s.dataDir}
			if err := json.Unmarshal([]byte(req.YAML), cfg); err != nil {
				writeJSON(w, http.StatusBadRequest, apiError{Error: "YAML解析错误: " + err.Error()})
				return
			}
		}
	} else if len(req.Filters) > 0 {
		cfg = &config.Config{
			Target:  req.Target,
			DataDir: s.dataDir,
			Filters: req.Filters,
			Output:  &config.Output{Format: "json"},
			Sort:    req.Sort,
			Limit:   req.Limit,
		}
	} else if len(req.Conditions) > 0 {
		cfg = &config.Config{
			Target:  req.Target,
			DataDir: s.dataDir,
			Output:  &config.Output{Format: "json"},
			Sort:    req.Sort,
			Limit:   req.Limit,
		}
		for _, cond := range req.Conditions {
			filter, err := parseInteractiveCondition(cond)
			if err != nil {
				writeJSON(w, http.StatusBadRequest, apiError{
					Error:   "条件解析错误",
					Message: fmt.Sprintf("'%s': %v", cond, err),
				})
				return
			}
			cfg.Filters = append(cfg.Filters, filter)
		}
	} else {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "请提供 conditions、filters 或 yaml"})
		return
	}

	if cfg.Limit <= 0 {
		cfg.Limit = 1000
	}

	if len(req.Columns) > 0 {
		cfg.Output.Columns = req.Columns
	}
	if req.Format != "" {
		cfg.Output.Format = req.Format
	}

	// Execute query
	ctx := r.Context()
	engine := query.NewEngine("", s.dataDir)
	result, err := engine.Execute(ctx, cfg)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "查询执行失败: " + err.Error()})
		return
	}

	// Format response
	response := map[string]interface{}{
		"columns":    result.Columns,
		"rows":       result.Rows,
		"total_rows": result.TotalRows,
		"duration":   result.Duration.Round(time.Millisecond).String(),
	}

	if req.Format == "csv" {
		w.Header().Set("Content-Type", "text/csv; charset=utf-8")
		w.Header().Set("Content-Disposition", "attachment; filename=results.csv")
		if err := writeCSVToWriter(result, w); err != nil {
			log.Printf("写入CSV失败: %v", err)
		}
		return
	}

	writeJSON(w, http.StatusOK, response)
}

func (s *server) handleSchemaOptions(w http.ResponseWriter, r *http.Request) {
	typeCode := 0
	if t := r.URL.Query().Get("type"); t != "" {
		fmt.Sscanf(t, "%d", &typeCode)
	}

	resp := map[string]interface{}{
		"platforms":  model.PlatformsByType(typeCode),
		"relations":  model.RelationsByType(typeCode),
		"positions":  model.PositionsByType(typeCode),
		"meta_tags":  model.MetaTagsForType(typeCode),
		"types":      model.TypeCNToNum,
		"type_names": model.TypeNumToCN,
	}
	writeJSON(w, http.StatusOK, resp)
}

func (s *server) handleSchemaFields(w http.ResponseWriter, r *http.Request) {
	directFields := []string{
		"id", "type", "name", "name_cn", "platform", "summary",
		"nsfw", "score", "rank", "date", "series",
	}

	typeMap := make(map[string]int)
	for cn, num := range model.TypeCNToNum {
		typeMap[cn] = num
	}

	resp := apiSchemaFields{
		DirectFields:  directFields,
		SubjectTypes:  typeMap,
		RelationTypes: getRelationTypesBySubjectType(),
		StaffPosition: getStaffPositionsBySubjectType(),
	}

	writeJSON(w, http.StatusOK, resp)
}

func (s *server) handleSchemaRelations(w http.ResponseWriter, r *http.Request) {
	resp := getRelationTypesBySubjectType()
	writeJSON(w, http.StatusOK, resp)
}

func (s *server) handleSchemaPositions(w http.ResponseWriter, r *http.Request) {
	resp := getStaffPositionsBySubjectType()
	writeJSON(w, http.StatusOK, resp)
}

func (s *server) handleSchemaTypes(w http.ResponseWriter, r *http.Request) {
	resp := map[string]interface{}{
		"types": model.TypeCNToNum,
		"type_names": map[int]string{
			1: "书籍", 2: "动画", 3: "音乐", 4: "游戏", 6: "三次元",
		},
	}
	writeJSON(w, http.StatusOK, resp)
}

func (s *server) handleStats(w http.ResponseWriter, r *http.Request) {
	resp := map[string]interface{}{
		"data_dir": s.dataDir,
		"files":    s.listDataFiles(),
	}
	writeJSON(w, http.StatusOK, resp)
}

func (s *server) handleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

// handleConfigParse parses YAML (or JSON) config text and returns structured config.
func (s *server) handleConfigParse(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		writeJSON(w, http.StatusMethodNotAllowed, apiError{Error: "只支持POST请求"})
		return
	}

	var body struct {
		YAML string `json:"yaml"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "请求格式错误: " + err.Error()})
		return
	}
	if body.YAML == "" {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "yaml 字段不能为空"})
		return
	}

	// Try parsing as YAML
	cfg, err := config.ParseYAML([]byte(body.YAML))
	if err != nil {
		// Fallback: try as pure JSON
		cfg = &config.Config{}
		if err2 := json.Unmarshal([]byte(body.YAML), cfg); err2 != nil {
			writeJSON(w, http.StatusBadRequest, apiError{
				Error:   "YAML/JSON 解析失败",
				Message: fmt.Sprintf("YAML: %v\nJSON: %v", err, err2),
			})
			return
		}
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"filters":  cfg.Filters,
		"output":   cfg.Output,
		"sort":     cfg.Sort,
		"limit":    cfg.Limit,
		"data_dir": cfg.DataDir,
	})
}

// handleConfigExport accepts filters/output/sort/limit as JSON and returns proper YAML.
func (s *server) handleConfigExport(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		writeJSON(w, http.StatusMethodNotAllowed, apiError{Error: "只支持POST请求"})
		return
	}

	var body struct {
		Filters []config.Filter  `json:"filters"`
		Output  *config.Output   `json:"output"`
		Sort    []config.SortRule `json:"sort"`
		Limit   int              `json:"limit"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "请求格式错误: " + err.Error()})
		return
	}

	cfg := config.Config{
		Filters: body.Filters,
		Output:  body.Output,
		Sort:    body.Sort,
		Limit:   body.Limit,
	}

	out, err := yaml.Marshal(cfg)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "YAML序列化失败: " + err.Error()})
		return
	}

	w.Header().Set("Content-Type", "text/yaml; charset=utf-8")
	w.Write(out)
}

func (s *server) handleDebug(w http.ResponseWriter, r *http.Request) {
	absDataDir := s.dataDir
	if !strings.HasPrefix(s.dataDir, "/") {
		if cwd, err := os.Getwd(); err == nil {
			absDataDir = filepath.Join(cwd, s.dataDir)
		}
	}
	dataDirExists := false
	if info, err := os.Stat(absDataDir); err == nil && info.IsDir() {
		dataDirExists = true
	}

	files := s.listDataFiles()

	resp := map[string]interface{}{
		"duckdb_path":     query.GetDuckDBPath(),
		"duckdb_exists":   fileExists(query.GetDuckDBPath()),
		"data_dir":        absDataDir,
		"data_dir_exists": dataDirExists,
		"data_files":      files,
		"cwd":             getCWD(),
	}
	writeJSON(w, http.StatusOK, resp)
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

func getCWD() string {
	cwd, err := os.Getwd()
	if err != nil {
		return err.Error()
	}
	return cwd
}

func (s *server) handleStatic(w http.ResponseWriter, r *http.Request) {
	// Serve the embedded SPA
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write([]byte(webui.WebUIHTML))
}

func (s *server) listDataFiles() []map[string]string {
	var files []map[string]string
	entries, err := os.ReadDir(s.dataDir)
	if err != nil {
		return files
	}
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".jsonlines") {
			info, err := entry.Info()
			if err != nil {
				continue
			}
			files = append(files, map[string]string{
				"name": entry.Name(),
				"size": fmt.Sprintf("%.1f MB", float64(info.Size())/(1024*1024)),
			})
		}
	}
	return files
}

func getRelationTypesBySubjectType() map[string][]string {
	result := make(map[string][]string)
	for typeCode, relMap := range model.RelationTypes {
		typeName := model.TypeNumToCN[typeCode]
		var names []string
		for _, name := range relMap {
			names = append(names, name)
		}
		result[typeName] = names
	}
	return result
}

func getStaffPositionsBySubjectType() map[string][]string {
	result := make(map[string][]string)
	for typeCode, posMap := range model.StaffPositions {
		typeName := model.TypeNumToCN[typeCode]
		var names []string
		for _, name := range posMap {
			names = append(names, name)
		}
		result[typeName] = names
	}
	return result
}

// writeJSON writes a JSON response.
func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// writeCSVToWriter writes query results as CSV to an io.Writer.
func writeCSVToWriter(r *query.QueryResult, w http.ResponseWriter) error {
	w.Write([]byte{0xEF, 0xBB, 0xBF})
	header := strings.Join(r.Columns, ",") + "\n"
	w.Write([]byte(header))
	for _, row := range r.Rows {
		escaped := make([]string, len(row))
		for i, val := range row {
			if strings.ContainsAny(val, ",\"\n") {
				escaped[i] = `"` + strings.ReplaceAll(val, `"`, `""`) + `"`
			} else {
				escaped[i] = val
			}
		}
		w.Write([]byte(strings.Join(escaped, ",") + "\n"))
	}
	return nil
}
