package server

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

const (
	authorizeURL = "https://bgm.tv/oauth/authorize"
	tokenURL     = "https://bgm.tv/oauth/access_token"
	meURL        = "https://api.bgm.tv/v0/me"
)

type OAuthStates struct {
	mu     sync.Mutex
	values map[string]time.Time
}

func NewOAuthStates() *OAuthStates {
	return &OAuthStates{values: make(map[string]time.Time)}
}

func (s *OAuthStates) New() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	state := hex.EncodeToString(b)
	s.mu.Lock()
	defer s.mu.Unlock()
	s.values[state] = time.Now().Add(10 * time.Minute)
	return state, nil
}

func (s *OAuthStates) Take(state string) bool {
	if state == "" {
		return false
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	exp, ok := s.values[state]
	if !ok {
		return false
	}
	delete(s.values, state)
	return time.Now().Before(exp)
}

type TokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
}

type MeResponse struct {
	ID       int64  `json:"id"`
	Nickname string `json:"nickname"`
}

// HandleLogin serves the SPA shell; the app renders the login view
// itself when the session check fails.
func (s *Server) HandleLogin(w http.ResponseWriter, r *http.Request) {
	if _, _, _, ok := s.sessions.Current(r); ok {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}
	s.serveIndex(w, r)
}

// oauthEnabled reports whether bgm OAuth credentials are configured.
func (s *Server) oauthEnabled() bool {
	return s.cfg.BGM.ClientID != "" && s.cfg.BGM.ClientSecret != ""
}

// oauthEnabledGuard disables the OAuth entry when credentials are absent.
func (s *Server) oauthEnabledGuard(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !s.oauthEnabled() {
			writeError(w, http.StatusNotFound, "OAuth 登录未启用：请在 wbt.toml 配置 bgm.client_id / bgm.client_secret")
			return
		}
		next(w, r)
	}
}

// handleAuthInfo exposes whether OAuth login is available (public).
func (s *Server) handleAuthInfo(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{"oauthEnabled": s.oauthEnabled()})
}

// HandleOAuthStart starts the authorization code flow.
func (s *Server) HandleOAuthStart(w http.ResponseWriter, r *http.Request) {
	state, err := s.oauthStates.New()
	if err != nil {
		http.Error(w, "生成 state 失败", http.StatusInternalServerError)
		return
	}
	q := url.Values{
		"client_id":     {s.cfg.BGM.ClientID},
		"response_type": {"code"},
		"redirect_uri":  {s.redirectURI()},
		"state":         {state},
	}
	http.Redirect(w, r, authorizeURL+"?"+q.Encode(), http.StatusFound)
}

// HandleTokenLogin confirms identity with a user-provided access token.
// The token is used only to read the user id from /v0/me and never stored.
func (s *Server) HandleTokenLogin(w http.ResponseWriter, r *http.Request) {
	var req struct {
		AccessToken string `json:"accessToken"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "请求体无效")
		return
	}
	token := strings.TrimSpace(req.AccessToken)
	if token == "" {
		writeError(w, http.StatusBadRequest, "请填写 access token")
		return
	}
	me, err := s.fetchMe(token)
	_ = token
	if err != nil {
		writeError(w, http.StatusUnauthorized, "access token 无效或已过期: "+err.Error())
		return
	}
	if err := s.store.UpsertUser(me.ID, me.Nickname); err != nil {
		writeError(w, http.StatusInternalServerError, "保存用户失败")
		return
	}
	if err := s.sessions.Start(w, me.ID); err != nil {
		writeError(w, http.StatusInternalServerError, "创建会话失败")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"status": "ok", "id": me.ID, "name": me.Nickname})
}

// HandleCallback exchanges the code for a token, reads the user id
// from /v0/me, then discards the token immediately.
func (s *Server) HandleCallback(w http.ResponseWriter, r *http.Request) {
	if e := r.URL.Query().Get("error"); e != "" {
		http.Error(w, "授权失败: "+e, http.StatusBadRequest)
		return
	}
	state := r.URL.Query().Get("state")
	if !s.oauthStates.Take(state) {
		http.Error(w, "state 无效或已过期，请重新登录", http.StatusBadRequest)
		return
	}
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "缺少授权码", http.StatusBadRequest)
		return
	}

	token, err := s.exchangeToken(code)
	if err != nil {
		http.Error(w, "换取 access token 失败: "+err.Error(), http.StatusBadGateway)
		return
	}

	me, err := s.fetchMe(token.AccessToken)
	// The token is only used to confirm identity and is never stored.
	_ = token

	if err != nil {
		http.Error(w, "获取用户信息失败: "+err.Error(), http.StatusBadGateway)
		return
	}

	if err := s.store.UpsertUser(me.ID, me.Nickname); err != nil {
		http.Error(w, "保存用户失败", http.StatusInternalServerError)
		return
	}
	if err := s.sessions.Start(w, me.ID); err != nil {
		http.Error(w, "创建会话失败", http.StatusInternalServerError)
		return
	}
	http.Redirect(w, r, "/", http.StatusFound)
}

func (s *Server) HandleLogout(w http.ResponseWriter, r *http.Request) {
	s.sessions.End(w, r)
	http.Redirect(w, r, "/", http.StatusFound)
}

func (s *Server) redirectURI() string {
	return strings.TrimSuffix(s.cfg.BaseURL, "/") + "/auth/callback"
}

func (s *Server) exchangeToken(code string) (*TokenResponse, error) {
	q := url.Values{
		"client_id":     {s.cfg.BGM.ClientID},
		"client_secret": {s.cfg.BGM.ClientSecret},
		"grant_type":    {"authorization_code"},
		"code":          {code},
		"redirect_uri":  {s.redirectURI()},
	}
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, tokenURL, strings.NewReader(q.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	resp, err := s.bgm.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() { _ = resp.Body.Close() }()
	var tr TokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tr); err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK || tr.AccessToken == "" {
		return nil, fmt.Errorf("HTTP %d", resp.StatusCode)
	}
	return &tr, nil
}

func (s *Server) fetchMe(accessToken string) (*MeResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, meURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("User-Agent", "inchei/wiki-batch-together (https://github.com/inchei/bangumi-wiki-scripts)")
	resp, err := s.bgm.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP %d", resp.StatusCode)
	}
	var me MeResponse
	if err := json.NewDecoder(resp.Body).Decode(&me); err != nil {
		return nil, err
	}
	if me.ID == 0 {
		return nil, fmt.Errorf("响应中缺少用户 id")
	}
	return &me, nil
}
