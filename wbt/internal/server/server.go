package server

import (
	"context"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/bgmapi"
	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/config"
	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/store"
)

const (
	lockTTL        = time.Minute
	lockExtendRate = 30 * time.Second
)

type Server struct {
	cfg         *config.Config
	store       *store.Store
	bgm         *bgmapi.Client
	sessions    *SessionManager
	oauthStates *OAuthStates
	staticFS    fs.FS
}

func New(cfg *config.Config, st *store.Store, staticFS fs.FS) *Server {
	return &Server{
		cfg:         cfg,
		store:       st,
		bgm:         bgmapi.NewClient(),
		sessions:    NewSessionManager(st),
		oauthStates: NewOAuthStates(),
		staticFS:    staticFS,
	}
}

func NewWithEmbeddedFrontend(cfg *config.Config, st *store.Store) *Server {
	sub, err := fs.Sub(StaticFS, "dist")
	if err != nil {
		panic(err)
	}
	return New(cfg, st, sub)
}

// Setup builds the HTTP server and its download scheduler.
func Setup(cfg *config.Config, st *store.Store) (*http.Server, *Scheduler) {
	srv := NewWithEmbeddedFrontend(cfg, st)
	scheduler := NewScheduler(st)
	return &http.Server{
		Addr:         cfg.Listen,
		Handler:      srv.Handler(),
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 5 * time.Minute,
		IdleTimeout:  60 * time.Second,
	}, scheduler
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /auth/login", s.HandleLogin)
	mux.HandleFunc("GET /auth/oauth", s.oauthEnabledGuard(s.HandleOAuthStart))
	mux.HandleFunc("GET /auth/callback", s.HandleCallback)
	mux.HandleFunc("POST /auth/logout", s.HandleLogout)
	mux.HandleFunc("POST /api/auth/token", s.HandleTokenLogin)
	mux.HandleFunc("GET /api/auth/info", s.handleAuthInfo)

	mux.HandleFunc("GET /api/me", s.authRequired(s.handleMe))
	mux.HandleFunc("POST /api/credentials", s.authRequired(s.handleSaveCredentials))

	mux.HandleFunc("GET /api/sources", s.authRequired(s.handleListSources))
	mux.HandleFunc("GET /api/work/next", s.authRequired(s.handleWorkNext))
	mux.HandleFunc("POST /api/items/{id}/confirm", s.authRequired(s.handleItemConfirm))
	mux.HandleFunc("POST /api/items/{id}/error", s.authRequired(s.handleItemError))
	mux.HandleFunc("POST /api/items/{id}/lock/extend", s.authRequired(s.handleLockExtend))
	mux.HandleFunc("POST /api/items/{id}/release", s.authRequired(s.handleItemRelease))

	mux.HandleFunc("GET /api/proxy/wiki/{path...}", s.authRequired(s.handleProxyWikiData))
	mux.HandleFunc("POST /api/proxy/submit/{type}/{id}", s.authRequired(s.handleProxySubmit))

	mux.HandleFunc("GET /", s.handleIndex)
	mux.Handle("GET /assets/", http.StripPrefix("/assets/", http.FileServerFS(s.staticFS)))

	return securityHeaders(mux)
}

func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("X-Content-Type-Options", "nosniff")
		h.Set("X-Frame-Options", "DENY")
		h.Set("Referrer-Policy", "same-origin")
		next.ServeHTTP(w, r)
	})
}

func (s *Server) authRequired(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, _, _, ok := s.sessions.Current(r)
		if !ok {
			writeJSON(w, http.StatusUnauthorized, map[string]any{"error": "未登录"})
			return
		}
		next(w, r.WithContext(withUserID(r.Context(), userID)))
	}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

type ctxKey int

const userIDKey ctxKey = 1

func withUserID(ctx context.Context, id int64) context.Context {
	return context.WithValue(ctx, userIDKey, id)
}

func userIDFrom(ctx context.Context) int64 {
	id, _ := ctx.Value(userIDKey).(int64)
	return id
}

func (s *Server) handleMe(w http.ResponseWriter, r *http.Request) {
	userID := userIDFrom(r.Context())
	u, err := s.store.GetUser(userID)
	if err != nil || u == nil {
		writeError(w, http.StatusInternalServerError, "获取用户信息失败")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"id":           u.ID,
		"name":         u.Name,
		"hasCookie":    u.BgmCookie != "",
		"lockExtendMs": int(lockExtendRate.Milliseconds()),
	})
}

func (s *Server) handleSaveCredentials(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Cookie string `json:"cookie"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "请求体无效")
		return
	}
	cookie := strings.TrimSpace(req.Cookie)
	if cookie == "" {
		writeError(w, http.StatusBadRequest, "cookie 不能为空")
		return
	}
	userID := userIDFrom(r.Context())

	formhash, err := s.bgm.ValidateCookie(cookie)
	if err != nil {
		writeError(w, http.StatusBadRequest, "cookie 验证失败: "+err.Error())
		return
	}
	if err := s.store.SetUserCookie(userID, cookie); err != nil {
		writeError(w, http.StatusInternalServerError, "保存 cookie 失败")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok", "formhash": formhash})
}

func (s *Server) handleListSources(w http.ResponseWriter, r *http.Request) {
	srcs, err := s.store.ListAllSources()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "查询来源失败")
		return
	}
	errorCount, err := s.store.CountErrorItems()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "查询错误条目失败")
		return
	}

	type sourceInfo struct {
		ID         int64  `json:"id"`
		Name       string `json:"name"`
		EntityType string `json:"entityType"`
		Pending    int    `json:"pending"`
	}
	out := make([]sourceInfo, 0, len(srcs))
	for _, src := range srcs {
		pending, err := s.store.CountByStatus(src.ID, "pending")
		if err != nil {
			writeError(w, http.StatusInternalServerError, "统计条目失败")
			return
		}
		out = append(out, sourceInfo{ID: src.ID, Name: src.Name, EntityType: src.EntityType, Pending: pending})
	}
	writeJSON(w, http.StatusOK, map[string]any{"sources": out, "errorCount": errorCount})
}

func (s *Server) handleWorkNext(w http.ResponseWriter, r *http.Request) {
	userID := userIDFrom(r.Context())
	q := r.URL.Query()

	var sourceID int64
	var src *store.Source
	status := "pending"
	switch {
	case q.Get("scope") == "error":
		status = "error"
	case q.Get("source_id") != "":
		if _, err := fmt.Sscanf(q.Get("source_id"), "%d", &sourceID); err != nil {
			writeError(w, http.StatusBadRequest, "source_id 无效")
			return
		}
		gotSrc, err := s.store.GetSource(sourceID)
		if err != nil || gotSrc == nil {
			writeError(w, http.StatusNotFound, "工作組不存在")
			return
		}
		src = gotSrc
	}

	var after int64
	if v := q.Get("after"); v != "" {
		if _, err := fmt.Sscanf(v, "%d", &after); err != nil {
			writeError(w, http.StatusBadRequest, "after 无效")
			return
		}
	} else {
		// resume from the position remembered for this user in this workgroup;
		// processed items are gone, so the search naturally moves forward
		stored, gerr := s.store.GetProgress(userID, sourceID)
		if gerr != nil {
			writeError(w, http.StatusInternalServerError, "读取审核进度失败")
			return
		}
		after = stored
	}

	item, err := s.store.AcquireNext(sourceID, status, userID, lockTTL, after)
	if err != nil {
		log.Printf("[wbt] 领取条目失败: %v", err)
		writeError(w, http.StatusInternalServerError, "领取条目失败")
		return
	}
	if item == nil {
		writeJSON(w, http.StatusOK, map[string]any{"done": true})
		return
	}
	total := int64(0)
	if src != nil {
		total = src.Total
	} else {
		// global error workgroup denominator
		if ec, gerr := s.store.CountErrorItems(); gerr == nil {
			total = int64(ec)
		}
	}
	remaining, rerr := s.store.CountUnclaimed(sourceID)
	if rerr != nil {
		log.Printf("[wbt] 统计剩余失败: %v", rerr)
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"done":         false,
		"item":         itemJSON(item),
		"total":        total,
		"remaining":    remaining,
		"lockExtendMs": int(lockExtendRate.Milliseconds()),
	})
}

func itemJSON(item *store.Item) map[string]any {
	var row map[string]string
	_ = json.Unmarshal([]byte(item.RowJSON), &row)
	return map[string]any{
		"id":         item.ID,
		"csvId":      item.CsvID,
		"entityType": item.EntityType,
		"row":        row,
		"sourceId":   item.SourceID,
	}
}

func (s *Server) handleItemConfirm(w http.ResponseWriter, r *http.Request) {
	itemID, ok := parseItemID(w, r)
	if !ok {
		return
	}
	ok, err := s.store.ConfirmItem(itemID, userIDFrom(r.Context()))
	if err != nil {
		writeError(w, http.StatusInternalServerError, "确认失败")
		return
	}
	if !ok {
		writeError(w, http.StatusConflict, "该条目已被他人处理")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}

func (s *Server) handleItemError(w http.ResponseWriter, r *http.Request) {
	itemID, ok := parseItemID(w, r)
	if !ok {
		return
	}
	ok, err := s.store.MarkError(itemID, userIDFrom(r.Context()))
	if err != nil {
		writeError(w, http.StatusInternalServerError, "标记失败")
		return
	}
	if !ok {
		writeError(w, http.StatusConflict, "该条目已被他人处理")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "error"})
}

func (s *Server) handleLockExtend(w http.ResponseWriter, r *http.Request) {
	itemID, ok := parseItemID(w, r)
	if !ok {
		return
	}
	if err := s.store.ExtendLock(itemID, userIDFrom(r.Context()), lockTTL); err != nil {
		writeError(w, http.StatusConflict, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "extended"})
}

// handleItemRelease drops the caller's own soft lock (used on skip).
func (s *Server) handleItemRelease(w http.ResponseWriter, r *http.Request) {
	itemID, ok := parseItemID(w, r)
	if !ok {
		return
	}
	if err := s.store.ReleaseLock(itemID, userIDFrom(r.Context())); err != nil {
		writeError(w, http.StatusConflict, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "released"})
}

func parseItemID(w http.ResponseWriter, r *http.Request) (int64, bool) {
	var id int64
	if _, err := fmt.Sscanf(r.PathValue("id"), "%d", &id); err != nil || id <= 0 {
		writeError(w, http.StatusBadRequest, "条目 id 无效")
		return 0, false
	}
	return id, true
}

// handleProxyWikiData proxies reads of next.bgm.tv/p1/wiki/...
// e.g. /api/proxy/wiki/subjects/123 or /api/proxy/wiki/subjects/123/history-summary
func (s *Server) handleProxyWikiData(w http.ResponseWriter, r *http.Request) {
	path := r.PathValue("path")
	data, err := s.bgm.FetchWikiData("/p1/wiki/" + path)
	if err != nil {
		log.Printf("[wbt] wiki 读取失败 (%s): %v", path, err)
		writeError(w, http.StatusBadGateway, "获取条目信息失败")
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	_, _ = w.Write(data)
}

type submitRequest struct {
	CommitMessage string            `json:"commitMessage"`
	Form          map[string]string `json:"form"`
}

// handleProxySubmit performs the legacy bgm.tv edit POST on behalf of
// the user, with the user's stored cookie and a freshly fetched formhash.
func (s *Server) handleProxySubmit(w http.ResponseWriter, r *http.Request) {
	userID := userIDFrom(r.Context())
	u, err := s.store.GetUser(userID)
	if err != nil || u == nil {
		writeError(w, http.StatusInternalServerError, "获取用户信息失败")
		return
	}
	if u.BgmCookie == "" {
		writeError(w, http.StatusBadRequest, "尚未配置 bgm.tv cookie，请在设置中配置")
		return
	}

	var req submitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "请求体无效")
		return
	}

	entityType := r.PathValue("type")
	itemID := r.PathValue("id")
	postURL := legacyEditURL(entityType, itemID)
	if postURL == "" {
		writeError(w, http.StatusBadRequest, "不支持的实体类型")
		return
	}

	formhash, err := s.bgm.ValidateCookie(u.BgmCookie)
	if err != nil {
		writeError(w, http.StatusBadRequest, "获取 formhash 失败（cookie 可能已失效）: "+err.Error())
		return
	}

	form := url.Values{}
	for k, v := range req.Form {
		form.Set(k, v)
	}
	form.Set("editSummary", req.CommitMessage)

	if err := s.bgm.SubmitLegacyEdit(u.BgmCookie, formhash, postURL, form); err != nil {
		log.Printf("[wbt] 提交编辑失败 (user=%d %s/%s): %v", userID, entityType, itemID, err)
		writeError(w, http.StatusBadGateway, "提交失败: "+err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func legacyEditURL(entityType, id string) string {
	switch entityType {
	case "subject":
		return bgmapi.LegacyBase + "/subject/" + id + "/new_revision"
	case "person":
		return bgmapi.LegacyBase + "/person/" + id + "/edit"
	case "character":
		return bgmapi.LegacyBase + "/character/" + id + "/edit"
	default:
		return ""
	}
}

func (s *Server) handleIndex(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	// serve the SPA shell even when not logged in; the frontend renders
	// the login view itself when the /api/me auth check fails.
	s.serveIndex(w, r)
}

func (s *Server) serveIndex(w http.ResponseWriter, _ *http.Request) {
	data, err := fs.ReadFile(s.staticFS, "index.html")
	if err != nil {
		http.Error(w, "前端资源未构建，请先运行 go generate ./internal/server/", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = w.Write(data)
}
