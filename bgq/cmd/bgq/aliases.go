package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

type personAliasEntry struct {
	Name string `json:"name"`
	ID   int    `json:"id"`
}

type aliasData struct {
	persons []personAliasEntry
	aliases map[string][]int
	modTime time.Time
}

var aliasesReloadMu sync.Mutex

func loadAliasesFile(path string) (*aliasData, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("打开 aliases 文件失败: %w", err)
	}
	defer func() { _ = f.Close() }()

	fi, err := f.Stat()
	if err != nil {
		return nil, fmt.Errorf("获取 aliases 文件状态失败: %w", err)
	}

	var raw []any
	if err := json.NewDecoder(f).Decode(&raw); err != nil {
		return nil, fmt.Errorf("解析 aliases JSON 失败: %w", err)
	}

	if len(raw) != 2 {
		return nil, fmt.Errorf("aliases 数据格式错误: 需要 [persons, aliases] 两个元素")
	}

	personsRaw, ok := raw[0].([]any)
	if !ok {
		return nil, fmt.Errorf("aliases 数据格式错误: persons 应为数组")
	}

	persons := make([]personAliasEntry, len(personsRaw))
	for i, p := range personsRaw {
		arr, ok := p.([]any)
		if !ok || len(arr) < 2 {
			continue
		}
		name, _ := arr[0].(string)
		id, _ := arr[1].(float64)
		persons[i] = personAliasEntry{Name: name, ID: int(id)}
	}

	aliasesRaw, ok := raw[1].(map[string]any)
	if !ok {
		return nil, fmt.Errorf("aliases 数据格式错误: aliases 应为对象")
	}

	aliases := make(map[string][]int, len(aliasesRaw))
	for alias, indicesRaw := range aliasesRaw {
		switch v := indicesRaw.(type) {
		case []any:
			for _, idx := range v {
				if f, ok := idx.(float64); ok {
					aliases[alias] = append(aliases[alias], int(f))
				}
			}
		case float64:
			aliases[alias] = []int{int(v)}
		}
	}

	log.Printf("已加载 %d 个别名，映射到 %d 个人物", len(aliases), len(persons))
	return &aliasData{persons: persons, aliases: aliases, modTime: fi.ModTime()}, nil
}

func normalizeAlias(name string) string {
	var buf strings.Builder
	for _, r := range name {
		switch {
		case r == ' ' || r == '\t' || r == '\n' || r == '\r' || r == '-':
			continue
		case r >= 0xFF66 && r <= 0xFF9D:
			buf.WriteRune(r - 0xFBE0)
		case r >= 0xFF21 && r <= 0xFF5A:
			buf.WriteRune(r - 0xFEE0)
		case r >= 0x30A1 && r <= 0x30F6:
			buf.WriteRune(r - 0x60)
		default:
			buf.WriteRune(r)
		}
	}
	return strings.ToLower(buf.String())
}

func (s *server) reloadAliasesIfStale() {
	if s.aliasesFile == "" || s.aliases == nil {
		return
	}
	fi, err := os.Stat(s.aliasesFile)
	if err != nil {
		return
	}
	if !fi.ModTime().After(s.aliases.modTime) {
		return
	}
	aliasesReloadMu.Lock()
	defer aliasesReloadMu.Unlock()
	// double-check after acquiring lock
	if fi, err := os.Stat(s.aliasesFile); err != nil || !fi.ModTime().After(s.aliases.modTime) {
		return
	}
	ad, err := loadAliasesFile(s.aliasesFile)
	if err != nil {
		log.Printf("⚠ 热加载别名文件失败: %v", err)
		return
	}
	s.aliases = ad
}

func (s *server) handleAliases(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		writeJSON(w, http.StatusMethodNotAllowed, apiError{Error: "只支持GET请求"})
		return
	}

	s.reloadAliasesIfStale()
	aliasesReloadMu.Lock()
	ad := s.aliases
	aliasesReloadMu.Unlock()

	if ad == nil {
		writeJSON(w, http.StatusServiceUnavailable, apiError{Error: "别名数据未加载，请使用 --aliases-file 参数指定 person_alias.json 文件"})
		return
	}

	alias := r.PathValue("alias")
	if alias == "" {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "alias 为必填参数"})
		return
	}

	key := normalizeAlias(alias)
	indices, ok := ad.aliases[key]
	if !ok {
		writeJSON(w, http.StatusOK, []personAliasEntry{})
		return
	}

	result := make([]personAliasEntry, 0, len(indices))
	for _, idx := range indices {
		if idx >= 0 && idx < len(ad.persons) {
			entry := ad.persons[idx]
			if entry.Name != "" {
				result = append(result, entry)
			}
		}
	}

	writeJSON(w, http.StatusOK, result)
}
