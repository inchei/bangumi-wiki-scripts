//go:build ignore

package main

import (
	"os"
	"strings"

	"github.com/inchei/bangumi-query/internal/server"
)

func main() {
	html := server.WebUIHTML

	// Replace API-dependent DB_URL with GitHub Pages-appropriate default
	// The HTML auto-detects backend mode, so it works both locally and on Pages
	// For Pages deployment, we just ensure the DB_URL points to GitHub Releases
	html = strings.Replace(html,
		`const DB_URL=''`,
		`const DB_URL='https://github.com/inchei/bangumi-wiki-scripts/releases/latest/download/bangumi_web.db'`,
		1)

	os.WriteFile("../../deploy/index.html", []byte(html), 0644)
}
