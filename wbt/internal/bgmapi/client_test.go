package bgmapi

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
)

func TestSubmitLegacyEditRedirectSuccess(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/new_revision" {
			http.Redirect(w, r, "/done", http.StatusFound)
			return
		}
		w.WriteHeader(http.StatusOK)
	}))
	t.Cleanup(srv.Close)

	form := url.Values{"subject_infobox": {"x"}}
	if err := NewClient().SubmitLegacyEdit("chii_auth=a", "fh", srv.URL+"/new_revision", form); err != nil {
		t.Fatalf("redirect should be success, got: %v", err)
	}
}

func TestSubmitLegacyEditStayFailure(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// stays on the form page: no redirect
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("form page"))
	}))
	t.Cleanup(srv.Close)

	form := url.Values{}
	err := NewClient().SubmitLegacyEdit("chii_auth=a", "fh", srv.URL+"/new_revision", form)
	if err == nil {
		t.Fatal("stay-on-page should be failure")
	}
}

func TestSubmitLegacyEditRedirectSameURLFailure(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// redirect back to the POST url itself: treated as failure
		http.Redirect(w, r, r.URL.Path, http.StatusFound)
	}))
	t.Cleanup(srv.Close)

	form := url.Values{}
	err := NewClient().SubmitLegacyEdit("chii_auth=a", "fh", srv.URL+"/new_revision", form)
	if err == nil {
		t.Fatal("redirect to same path should be failure")
	}
}
