package main

import (
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/inchei/bangumi-query/internal/aliases"
)

type personAliasEntry = aliases.Entry

type aliasData = aliases.Data

var aliasesReloadMu sync.RWMutex

func loadAliasesFile(path string) (*aliasData, error) {
	return aliases.Load(path)
}

func normalizeAlias(name string) string {
	return aliases.Normalize(name)
}

func (s *server) reloadAliasesIfStale() {
	if s.aliasesFile == "" {
		return
	}
	aliasesReloadMu.RLock()
	cur := s.aliases
	aliasesReloadMu.RUnlock()
	if cur == nil {
		return
	}
	fi, err := os.Stat(s.aliasesFile)
	if err != nil {
		return
	}
	if !fi.ModTime().After(cur.ModTime) {
		return
	}
	aliasesReloadMu.Lock()
	defer aliasesReloadMu.Unlock()
	if s.aliases == nil {
		return
	}
	if fi2, err := os.Stat(s.aliasesFile); err != nil || !fi2.ModTime().After(s.aliases.ModTime) {
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
	aliasesReloadMu.RLock()
	ad := s.aliases
	aliasesReloadMu.RUnlock()

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
	indices, ok := ad.Aliases[key]
	if !ok {
		writeJSON(w, http.StatusOK, []personAliasEntry{})
		return
	}

	result := make([]personAliasEntry, 0, len(indices))
	for _, idx := range indices {
		if idx >= 0 && idx < len(ad.Persons) {
			entry := ad.Persons[idx]
			if entry.Name != "" {
				result = append(result, entry)
			}
		}
	}

	writeJSON(w, http.StatusOK, result)
}
