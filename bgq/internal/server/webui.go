package server

import "embed"

//go:generate sh -c "cd ../../frontend && pnpm build && rm -rf ../internal/server/dist && cp -r dist ../internal/server/dist"

//go:embed dist/*
var StaticFS embed.FS
