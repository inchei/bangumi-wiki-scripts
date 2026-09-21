package config

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func write(t *testing.T, content string) string {
	t.Helper()
	path := filepath.Join(t.TempDir(), "wbt.toml")
	if err := os.WriteFile(path, []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
	return path
}

const valid = `
base_url = "https://wbt.example.com"
listen = ":8090"
db_path = "wbt.db"
session_secret = "s"
[bgm]
client_id = "id"
client_secret = "sec"
[[sources]]
name = "novel系列"
url = "https://example.com/a.csv"
cron = "0 4 * * *"
`

func TestLoadValid(t *testing.T) {
	cfg, err := Load(write(t, valid))
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Listen != ":8090" || cfg.DBPath != "wbt.db" {
		t.Fatalf("cfg: %+v", cfg)
	}
	if len(cfg.Sources) != 1 || cfg.Sources[0].Name != "novel系列" || cfg.Sources[0].URL != "https://example.com/a.csv" {
		t.Fatalf("sources: %+v", cfg.Sources)
	}
}

func TestBadCronFails(t *testing.T) {
	bad := strings.Replace(valid, "0 4 * * *", "4 o'clock", 1)
	if _, err := Load(write(t, bad)); err == nil {
		t.Fatal("bad cron should fail")
	}
}

func TestMissingBGMOptional(t *testing.T) {
	noBGM := `base_url = "https://x"
listen = ":8090"
db_path = "d.db"
`
	if cfg, err := Load(write(t, noBGM)); err != nil || cfg.BGM.ClientID != "" {
		t.Fatal("missing bgm credentials should be optional (OAuth disabled)")
	}
}

func TestEnvOverrides(t *testing.T) {
	t.Setenv("WBT_DB_PATH", "/tmp/env.db")
	content := strings.Replace(valid, `db_path = "wbt.db"`, "", 1)
	cfg, err := Load(write(t, content))
	if err != nil {
		t.Fatal(err)
	}
	if cfg.DBPath != "/tmp/env.db" {
		t.Fatalf("env override not applied: %s", cfg.DBPath)
	}
}
