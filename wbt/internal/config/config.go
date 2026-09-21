package config

import (
	"fmt"
	"os"

	"github.com/BurntSushi/toml"
	"github.com/robfig/cron/v3"
)

type BGMConfig struct {
	ClientID     string `toml:"client_id"`
	ClientSecret string `toml:"client_secret"`
}

type SourceConfig struct {
	Name string `toml:"name"`
	URL  string `toml:"url"`
	Cron string `toml:"cron"`
}

type Config struct {
	BaseURL string         `toml:"base_url"`
	Listen  string         `toml:"listen"`
	DBPath  string         `toml:"db_path"`
	BGM     BGMConfig      `toml:"bgm"`
	Sources []SourceConfig `toml:"sources"`
}

func Load(path string) (*Config, error) {
	cfg := &Config{}
	if _, err := toml.DecodeFile(path, cfg); err != nil {
		return nil, fmt.Errorf("解析配置文件 %s: %w", path, err)
	}

	if cfg.BaseURL == "" {
		cfg.BaseURL = os.Getenv("WBT_BASE_URL")
	}
	if cfg.Listen == "" {
		cfg.Listen = os.Getenv("WBT_LISTEN")
	}
	if cfg.Listen == "" {
		cfg.Listen = ":8090"
	}
	if cfg.DBPath == "" {
		cfg.DBPath = os.Getenv("WBT_DB_PATH")
	}
	if cfg.DBPath == "" {
		cfg.DBPath = "wbt.db"
	}
	if cfg.BGM.ClientID == "" {
		cfg.BGM.ClientID = os.Getenv("BGM_CLIENT_ID")
	}
	if cfg.BGM.ClientSecret == "" {
		cfg.BGM.ClientSecret = os.Getenv("BGM_CLIENT_SECRET")
	}
	// bgm OAuth credentials are optional: without them the OAuth login
	// entry is simply disabled and access-token login still works.
	if cfg.BaseURL == "" {
		return nil, fmt.Errorf("base_url 未配置")
	}

	parser := cron.NewParser(cron.Minute | cron.Hour | cron.Dom | cron.Month | cron.Dow)
	for i := range cfg.Sources {
		s := &cfg.Sources[i]
		if s.Name == "" {
			return nil, fmt.Errorf("sources[%d]: name 不能为空", i)
		}
		if s.URL == "" {
			return nil, fmt.Errorf("sources[%d] (%s): url 不能为空", i, s.Name)
		}
		if _, err := parser.Parse(s.Cron); err != nil {
			return nil, fmt.Errorf("sources[%d] (%s): cron 表达式 %q 无效: %w", i, s.Name, s.Cron, err)
		}
	}

	return cfg, nil
}
