package server

import (
	"io/fs"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strings"
	"testing"
	"testing/fstest"
	"time"

	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/config"
	"github.com/inchei/bangumi-wiki-scripts/wbt/internal/store"
)

func newTestServer(t *testing.T, sources []config.SourceConfig) (*httptest.Server, string) {
	t.Helper()
	st, err := store.Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = st.Close() })
	cfg := &config.Config{
		BaseURL: "http://127.0.0.1:8090",
		Listen:  ":0",
		DBPath:  "test.db",
		BGM:     config.BGMConfig{ClientID: "id", ClientSecret: "sec"},
		Sources: sources,
	}
	if err := st.ReconcileSources(map[string]store.SourceConfigEntry{
		"组A": {URL: "https://example.com/a.csv", CronSpec: "0 4 * * *"},
	}); err != nil {
		t.Fatal(err)
	}
	if _, _, err := st.UpsertItems(1, "subject", []map[string]string{
		{"id": "100", "tags": "foo"},
	}); err != nil {
		t.Fatal(err)
	}
	if err := st.UpsertUser(42, "tester"); err != nil {
		t.Fatal(err)
	}
	uploadID, err := st.CreateSource(&store.Source{Name: "补充角色中文名", Kind: "upload", EntityType: "character"})
	if err != nil {
		t.Fatal(err)
	}
	if _, _, err := st.UpsertItems(uploadID, "character", []map[string]string{
		{"id": "301", "中文名": "某角色"},
	}); err != nil {
		t.Fatal(err)
	}
	if err := st.CreateSession("tok", 42, time.Now().Add(time.Hour)); err != nil {
		t.Fatal(err)
	}

	mux := New(cfg2(cfg), st, testFS()).Handler()
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)
	return srv, "tok"
}

// testFS mimics the minimal embedded frontend (shell; login view is
// rendered by the frontend itself).
func testFS() fs.FS {
	return fstest.MapFS{
		"index.html": &fstest.MapFile{Data: []byte("<!DOCTYPE html>\n<html><body><div id=\"core-content\"></div></body></html>\n")},
	}
}

func cfg2(cfg *config.Config) *config.Config { return cfg }

func TestUnauthorizedBlocked(t *testing.T) {
	srv, _ := newTestServer(t, nil)
	for _, path := range []string{"/api/me", "/api/sources", "/api/work/next"} {
		resp, err := http.Get(srv.URL + path)
		if err != nil {
			t.Fatal(err)
		}
		_ = resp.Body.Close()
		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("%s: want 401, got %d", path, resp.StatusCode)
		}
	}
}

func TestWorkEndpointFlow(t *testing.T) {
	srv, token := newTestServer(t, nil)
	client := &http.Client{}

	do := func(method, path string, wantStatus int) string {
		req, _ := http.NewRequest(method, srv.URL+path, nil)
		req.AddCookie(&http.Cookie{Name: sessionCookieName, Value: token})
		resp, err := doClient(client, req)
		if err != nil {
			t.Fatal(err)
		}
		defer func() { _ = resp.Body.Close() }()
		body := readBody(resp)
		if resp.StatusCode != wantStatus {
			t.Fatalf("%s %s: status=%d body=%s", method, path, resp.StatusCode, body)
		}
		return body
	}

	me := do(http.MethodGet, "/api/me", http.StatusOK)
	if !strings.Contains(me, `"name":"tester"`) || strings.Contains(me, `"hasCookie":true`) {
		t.Fatalf("me: %s", me)
	}

	sources := do(http.MethodGet, "/api/sources", http.StatusOK)
	if !strings.Contains(sources, `"name":"组A"`) || !strings.Contains(sources, "pending") {
		t.Fatalf("sources: %s", sources)
	}
	if !strings.Contains(sources, `"name":"补充角色中文名"`) {
		t.Fatalf("upload sources must be listed too: %s", sources)
	}

	next := do(http.MethodGet, "/api/work/next?source_id=1", http.StatusOK)
	if !strings.Contains(next, `"csvId":"100"`) {
		t.Fatalf("next: %s", next)
	}

	errBody := do(http.MethodPost, "/api/items/xxxx/error", http.StatusBadRequest)
	if !strings.Contains(errBody, "条目 id 无效") {
		t.Fatalf("bad id: %s", errBody)
	}

	errRes := do(http.MethodPost, "/api/items/999/confirm", http.StatusConflict)
	if !strings.Contains(errRes, "已被他人处理") {
		t.Fatalf("missing item: %s", errRes)
	}
}

func TestOAuthDisabled(t *testing.T) {
	t.Helper()
	st, err := store.Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = st.Close() })
	cfg := &config.Config{
		BaseURL: "http://127.0.0.1:8090",
		Listen:  ":0",
		DBPath:  "test.db",
	}
	mux := New(cfg, st, testFS()).Handler()
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)

	resp, err := http.Get(srv.URL + "/api/auth/info")
	if err != nil {
		t.Fatal(err)
	}
	infoBody := readBody(resp)
	_ = resp.Body.Close()
	if !strings.Contains(infoBody, `"oauthEnabled":false`) {
		t.Fatalf("auth info: %s", infoBody)
	}
	entry, err := http.Get(srv.URL + "/auth/oauth")
	if err != nil {
		t.Fatal(err)
	}
	_ = entry.Body.Close()
	if entry.StatusCode != http.StatusNotFound {
		t.Fatalf("oauth entry when disabled: want 404, got %d", entry.StatusCode)
	}
}

func TestLoginPageAndTokenLogin(t *testing.T) {
	srv, _ := newTestServer(t, nil)
	client := &http.Client{}

	// unauthenticated requests should never reach the API
	resp, err := http.Get(srv.URL + "/")
	if err != nil {
		t.Fatal(err)
	}
	pageBody := readBody(resp)
	_ = resp.Body.Close()
	if resp.StatusCode != http.StatusOK || !strings.Contains(pageBody, `id="core-content"`) {
		t.Fatalf("root page: %d", resp.StatusCode)
	}
	login, err := http.Get(srv.URL + "/auth/login")
	if err != nil {
		t.Fatal(err)
	}
	_ = login.Body.Close()
	if login.StatusCode != http.StatusOK {
		t.Fatalf("login page: %d", login.StatusCode)
	}

	// invalid token is rejected
	req, _ := http.NewRequest(http.MethodPost, srv.URL+"/api/auth/token", strings.NewReader(`{"accessToken":"bad"}`))
	respTok, err := doClient(client, req)
	if err != nil {
		t.Fatal(err)
	}
	_ = respTok.Body.Close()
	if respTok.StatusCode != http.StatusUnauthorized {
		t.Fatalf("bad token: want 401, got %d", respTok.StatusCode)
	}

	// empty token is rejected
	empty, _ := http.NewRequest(http.MethodPost, srv.URL+"/api/auth/token", strings.NewReader(`{"accessToken":""}`))
	respEmpty, err := doClient(client, empty)
	if err != nil {
		t.Fatal(err)
	}
	_ = respEmpty.Body.Close()
	if respEmpty.StatusCode != http.StatusBadRequest {
		t.Fatalf("empty token: want 400, got %d", respEmpty.StatusCode)
	}
}

func readBody(resp *http.Response) string {
	buf := make([]byte, 4096)
	n, _ := resp.Body.Read(buf)
	return string(buf[:n])
}

func doClient(client *http.Client, req *http.Request) (*http.Response, error) {
	return client.Do(req)
}
