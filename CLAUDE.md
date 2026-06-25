# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a monorepo for [Bangumi](https://bgm.tv) wiki automation:

1. **`bgq/`** — Go CLI + Web UI for high-performance subject filtering via DuckDB SQL
2. **`wikiBatch/`** — Tampermonkey userscript for batch wiki editing on next.bgm.tv
3. **Root** — Python scripts for duplicate ISBN detection, archive download, CI automation
4. **`filters/`** — YAML filter configs executed by bgq in CI, results uploaded to GitHub Releases

bgq CSV output feeds directly into wikiBatch for batch editing.

## Build & Development Commands

### Backend (Go)

```bash
cd bgq

# Build (requires frontend dist: cd frontend && pnpm build, then cp -r frontend/dist internal/server/dist)
go build -o bin/bgq ./cmd/bgq/
go test ./internal/query/ -v               # Run tests (~1s, snapshot-based, no DuckDB needed)
go test ./internal/query/ -update          # Regenerate golden file after intentional SQL changes
go test ./internal/query/ -execute         # Also execute SQL against DuckDB (slower, needs DuckDB)
go test ./internal/query/ -run TestAllCombinations -v  # Single test

gofmt -w .                                 # Format
go vet ./...                               # Static analysis
golangci-lint run ./...                    # Lint
# After modifying Go code, run all three above before committing

./bin/bgq query --config query.yaml --data-dir ./bangumi_archive
./bin/bgq serve --data-dir ./bangumi_archive --listen :8080
./bin/bgq serve --dev                      # Hot reload (Air)
```

### Frontend (Svelte)

```bash
cd bgq/frontend

pnpm install                               # Install deps
pnpm dev                                   # Dev server (hot reload)
pnpm build                                 # Build (output embedded in Go binary)

pnpm lint                                  # ESLint (JS/Svelte)
pnpm lint:css                              # Stylelint (CSS/Svelte styles)
pnpm lint:css:fix                          # Stylelint auto-fix
pnpm format                                # Prettier format
pnpm format:check                          # Check formatting (CI)
# After modifying frontend code, run pnpm lint && pnpm lint:css && pnpm format:check before committing
# Pre-commit hook (.husky/pre-commit) runs automatically:
#   - Go files: gofmt + go vet + go test (builder tests only)
#   - Frontend files: lint-staged (ESLint + Stylelint + Prettier)
```

### DuckDB CLI (runtime dependency)

```bash
curl -L https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip -o duckdb.zip
unzip duckdb.zip -d bgq/bin/
```

Path resolution: `DUCKDB_PATH` env → `bin/duckdb` (relative to executable) → `PATH`.

## Architecture (`bgq/`)

```
bgq/
├── cmd/
│   ├── bgq/
│   │   ├── main.go           # CLI entry + subcommands (query, serve, ingest, interactive, version)
│   │   ├── interactive.go    # Interactive REPL mode
│   │   ├── server.go         # HTTP server + API handlers
│   │   └── dev.go            # Air hot-reload dev mode
│   └── gen-model/
│       ├── main.go           # Code generator (platforms, relations, staff, meta tags)
│       └── templates/        # Go + JS templates for code generation
├── internal/
│   ├── model/            # Bangumi domain constants
│   │   ├── model.go          # Go structs matching JSONLines schema
│   │   ├── helpers.go        # Lookup helpers (PlatformsByType, RelationsByType, etc.)
│   │   ├── generate.go       # go generate directive
│   │   ├── platform.go       # Platform codes (auto-generated)
│   │   ├── relation_data.go  # Relation type maps (auto-generated)
│   │   ├── staff_data.go     # Staff position maps (auto-generated)
│   │   └── metatags.go       # Meta tag lists per subject type (auto-generated)
│   ├── config/           # YAML/JSON config parsing + filter types
│   │   └── config.go
│   ├── query/            # SQL generation + DuckDB execution
│   │   ├── builder.go        # Config → DuckDB SQL (shared logic)
│   │   ├── builder_generic.go # Generic filter SQL generation
│   │   ├── builder_target.go  # Target-specific SQL (subject/person/character/episode)
│   │   └── engine.go         # DuckDB subprocess wrapper
│   └── server/           # Embedded SPA
│       ├── webui.go          # //go:embed dist/* (static files)
│       └── dist/             # Frontend build output (copied from frontend/dist)
├── frontend/             # Svelte SPA source
│   ├── src/
│   │   ├── main.js           # Entry point
│   │   ├── App.svelte        # Root component
│   │   ├── api.js            # Backend API calls (query only)
│   │   ├── schema-data.js    # Auto-generated schema constants (go generate)
│   │   ├── stores.js         # Global state (filters, conditions)
│   │   ├── yaml.js           # YAML parse/generate (js-yaml)
│   │   └── components/
│   │       ├── FilterTree.svelte      # Recursive filter tree
│   │       ├── ConditionRow.svelte    # Single condition row
│   │       ├── AwesompleteInput.svelte # Autocomplete input
│   │       ├── ResultTable.svelte     # Query results table
│   │       ├── QuerySettings.svelte   # Output columns, limit, sort
│   │       ├── YamlEditor.svelte      # YAML import/export
│   │       └── conditions/
│   │           └── RelationCondition.svelte  # Reusable relation-like condition
│   ├── eslint.config.js
│   ├── .stylelintrc.json
│   ├── .prettierrc
│   ├── .prettierignore
│   ├── vite.config.js
│   └── package.json
├── Dockerfile
├── docker-entrypoint.sh
└── go.mod
```

### Data Flow

1. YAML config or interactive conditions → `config.Config` struct
2. `query.SQLBuilder` translates config into DuckDB SQL
3. `query.Engine` invokes DuckDB CLI subprocess (`-csv` mode)
4. CSV output parsed → `QueryResult` → terminal table / CSV / JSON / API response

### Query Targets

Four query targets supported via `config.Config.Target`:
- `subject` (default) — query subjects (条目)
- `person` — query persons (人物)
- `character` — query characters (角色)
- `episode` — query episodes (剧集)

### Key Design Decisions

- **DuckDB is an external CLI, not embedded.** Avoids CGo. Path resolved from `DUCKDB_PATH`, `bin/duckdb`, or `PATH`.
- **Data source flexibility.** JSONLines via `read_json_auto()` CTEs, or pre-built DuckDB database (`bgq ingest`).
- **Infobox fields are wiki-text.** `|key: value` template string, extracted via `regexp_extract()`.
- **Chinese field names as primary keys.** Relations and positions referenced by Chinese names (e.g., `单行本`, `原作`), resolved to numeric IDs via maps in `internal/model/`.
- **Schema data auto-generated to frontend.** `go generate` in `internal/model/` produces `schema-data.js` (platforms, relations, positions, meta tags) from bangumi/common YAML + archive data. Frontend imports these constants directly — no runtime API calls for schema.
- **Frontend embedded in Go binary.** `pnpm build` outputs to `frontend/dist/`, which is copied to `internal/server/dist/` and embedded via `//go:embed dist/*`.

### Filter Types (exactly-one union pattern)

Each `config.Filter` holds exactly one non-nil pointer field:
- `Type` — subject type (书籍/动画/音乐/游戏/三次元)
- `Field` — direct JSON or infobox field with operator (eq/contains/regex/gt/gte/lt/lte/before/after)
- `Global` — full-text search across infobox
- `Tag` / `MetaTag` — tag filtering with optional negation (requires explicit `operator`)
- `Relation` — related-subject filtering with nested conditions (any/all/none/count)
- `Staff` — person/staff filtering by position (any/all/none/count)
- `Character` — character filtering (any/all/none/count)
- `PersonCharacter` / `CharacterPerson` — person-character association filtering (any/all/none/count)
- `Episode` — episode-level filtering (any/all/count)
- `Logic` — combine child filters with AND/OR

Nested conditions (relation/staff/episode) support the same filter types recursively.
Sub-filter modes: `any` (exists), `all` (universal), `none` (negation), `count` (threshold with `count_op`/`count_val`).

### Web Server API

`bgq serve` exposes:
- `POST /api/query` — accepts `filters` (JSON), `yaml` (string), or `conditions` (legacy string array)
- `GET /api/health` — health check
- `GET /api/debug` — DuckDB/data diagnostics
- `/` — embedded SPA; static files (images, CSS) served from embedded `dist/`

## Filters (`filters/`)

YAML filter configs executed in CI. Each produces a CSV with an `id` column, usable as wikiBatch input.

| Filter | Description |
|--------|-------------|
| 小说系列关联漫画单行本 | Novel series with manga-format volumes |
| 漫画系列关联小说单行本 | Manga series with novel-format volumes |
| 标题有序号而标记为系列 | Numbered titles incorrectly marked as series |
| 非系列关联单行本 | Non-series subjects linked to volumes |
| 写了ISBN的系列 | Series with ISBN (9784-prefix only) |
| 连载结束无已完结标签 | Has serialization end date but missing 已完结 meta tag |
| 有序号的单行本未关联系列 | Numbered volumes not linked to a series |
| 小说缺小说标签 | Novel platform without 小说 meta tag (no series relation) |
| 漫画缺漫画标签 | Manga platform without 漫画 meta tag (no series relation) |
| 未填写作者 | Has 原作 staff but infobox 作者 field empty |

Run all filters: see `README.md` for the batch command.

## CI (`.github/workflows/bangumi_duplicate_check.yml`)

Weekly Tuesday cron, 3 jobs:
1. **check_and_filter** — download archive, duplicate ISBN check, person alias, run filters, commit results, create tag
2. **build_binaries** — cross-compile bgq for linux/amd64, darwin/arm64, darwin/amd64, windows/amd64 + bundle DuckDB CLI
3. **release** — collect artifacts, publish GitHub Release with binaries + alias + CSV results

Go version: read from `bgq/go.mod` via `go-version-file` (do not hardcode).

## Key Files

- `bgq/internal/config/config.go` — Filter type definitions + YAML/JSON parsing
- `bgq/internal/query/builder.go` — SQL generation (shared logic)
- `bgq/internal/query/builder_generic.go` — Generic filter SQL generation
- `bgq/internal/query/builder_target.go` — Target-specific SQL (subject/person/character/episode)
- `bgq/internal/query/engine.go` — DuckDB subprocess, CSV parsing
- `bgq/internal/model/helpers.go` — Lookup helpers (PlatformsByType, RelationsByType, etc.)
- `bgq/cmd/gen-model/main.go` — Code generator for schema constants (run via `go generate`)
- `bgq/cmd/bgq/main.go` — CLI dispatch + ingest logic
- `bgq/cmd/bgq/interactive.go` — Interactive REPL (shared parser with web API)
- `bgq/cmd/bgq/server.go` — HTTP server + API handlers
- `bgq/internal/server/webui.go` — Embedded static files via `//go:embed dist/*`
- `bgq/frontend/src/schema-data.js` — Auto-generated schema constants (platforms, relations, positions, meta tags)
- `bgq/frontend/src/stores.js` — Frontend global state (filters, conditions, logic tree)
- `wikiBatch/` — Batch wiki editor userscript (separate project, see its own README)

## Docker

```bash
cd bgq
docker build -t bgq .
docker run -p 7860:7860 -v bgq-data:/data bgq
```

Dockerfile builds frontend and Go binary in separate stages. Entrypoint auto-downloads archive data on first run. `DATA_DIR` env var defaults to `/data/bangumi_archive`.
