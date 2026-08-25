package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCORS_SameOriginAllowed(t *testing.T) {
	s := &server{allowedHosts: defaultAllowedHosts}

	// Request to the server's own host, with a same-origin Origin header
	// (browsers send Origin on same-origin fetch POSTs).
	req := httptest.NewRequest(http.MethodPost, "http://bgq.example.com/api/query", nil)
	req.Host = "bgq.example.com"
	req.Header.Set("Origin", "http://bgq.example.com")

	rr := httptest.NewRecorder()
	s.corsMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})).ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("same-origin request should be allowed, got %d", rr.Code)
	}
	if got := rr.Header().Get("Access-Control-Allow-Origin"); got != "http://bgq.example.com" {
		t.Fatalf("expected Access-Control-Allow-Origin to echo origin, got %q", got)
	}
}

func TestCORS_DisallowedOriginForbidden(t *testing.T) {
	s := &server{allowedHosts: defaultAllowedHosts}

	req := httptest.NewRequest(http.MethodPost, "http://bgq.example.com/api/query", nil)
	req.Host = "bgq.example.com"
	req.Header.Set("Origin", "http://evil-attacker.example")

	rr := httptest.NewRecorder()
	s.corsMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})).ServeHTTP(rr, req)

	if rr.Code != http.StatusForbidden {
		t.Fatalf("disallowed cross-origin should be forbidden, got %d", rr.Code)
	}
}

func TestCORS_AllowedCrossOriginOK(t *testing.T) {
	s := &server{allowedHosts: defaultAllowedHosts}

	req := httptest.NewRequest(http.MethodPost, "http://bgq.example.com/api/query", nil)
	req.Host = "bgq.example.com"
	req.Header.Set("Origin", "https://bgm.tv")

	rr := httptest.NewRecorder()
	s.corsMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})).ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("allowed cross-origin should be ok, got %d", rr.Code)
	}
}
