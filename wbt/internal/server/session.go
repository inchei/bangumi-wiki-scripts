package server

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"
)

type SessionManager struct {
	store SessionStore
}

type SessionStore interface {
	CreateSession(token string, userID int64, expiresAt time.Time) error
	GetSessionUser(token string) (userID int64, name string, bgmCookie string, err error)
	DeleteSession(token string) error
}

const sessionCookieName = "wbt_session"
const sessionTTL = 30 * 24 * time.Hour

func NewSessionManager(store SessionStore) *SessionManager {
	return &SessionManager{store: store}
}

func randomToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func (m *SessionManager) Start(w http.ResponseWriter, userID int64) error {
	token, err := randomToken()
	if err != nil {
		return err
	}
	if err := m.store.CreateSession(token, userID, time.Now().Add(sessionTTL)); err != nil {
		return err
	}
	http.SetCookie(w, &http.Cookie{
		Name:     sessionCookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   int(sessionTTL.Seconds()),
	})
	return nil
}

func (m *SessionManager) Current(r *http.Request) (userID int64, name string, bgmCookie string, ok bool) {
	c, err := r.Cookie(sessionCookieName)
	if err != nil || c.Value == "" {
		return 0, "", "", false
	}
	id, name, cookie, err := m.store.GetSessionUser(c.Value)
	if err != nil || id == 0 {
		return 0, "", "", false
	}
	return id, name, cookie, true
}

func (m *SessionManager) End(w http.ResponseWriter, r *http.Request) {
	if c, err := r.Cookie(sessionCookieName); err == nil && c.Value != "" {
		_ = m.store.DeleteSession(c.Value)
	}
	http.SetCookie(w, &http.Cookie{
		Name:     sessionCookieName,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
	})
}
