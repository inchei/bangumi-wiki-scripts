# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**IMPORTANT: NEVER commit changes unless the user explicitly asks you to. The pre-commit hook auto-bumps version numbers and builds dist files, so committing has permanent side effects. Always ask before committing.**

## Repository Overview

This is a monorepo for [Bangumi](https://bgm.tv) wiki automation:

1. **`bgq/`** — Go CLI + Web UI for high-performance subject filtering via DuckDB SQL
2. **`wikiBatch/`** — Tampermonkey userscript for batch wiki editing on next.bgm.tv
3. **`wikiPersonAlias/`** — Tampermonkey userscript for person alias lookup via IndexedDB (provides `window.personAliasQuery` / `window.personAliasQueryAll`)
4. **`wikiMissingPositions/`** — Tampermonkey userscript for pre-creating persons and one-click completion of missing staff/episode associations
5. **Root** — Python scripts for duplicate ISBN detection, archive download, CI automation
6. **`filters/`** — YAML filter configs executed by bgq in CI, results uploaded to GitHub Releases

bgq CSV output feeds directly into wikiBatch for batch editing.

**Important: `wikiBatch` and `wikiMissingPositions` are completely separate Tampermonkey userscripts with different purposes, different codebases, and different build systems. Never confuse them or search one when the other is referenced.**

## Build & Development Commands

### Backend (Go)

```bash
cd bgq

# Build (requires frontend dist: cd frontend && pnpm build, then cp -r frontend/dist internal/server/dist)
go build -o bin/bgq ./cmd/bgq/
go test ./internal/query/ -v -execute      # Run tests (snapshot + DuckDB execution)
go test ./internal/query/ -update -execute # Regenerate golden file + verify with DuckDB
go test ./internal/query/ -run TestAllCombinations -v  # Single test
go test ./cmd/bgq/ -run TestBuildCheckSQL -v           # Missing subjects SQL tests

gofmt -w .                                 # Format
go vet ./...                               # Static analysis
golangci-lint run ./...                    # Lint
# After modifying Go code, run all three above before committing

./bin/bgq query --config query.yaml --data-dir ./bangumi_archive
./bin/bgq serve --data-dir ./bangumi_archive --listen :8080
./bin/bgq serve --data-dir ./bangumi_archive --db bangumi.db --aliases-file person_alias.json
./bin/bgq serve --dev                      # Hot reload (Air)
./bin/bgq missing subjects "川原砾" --type 1
./bin/bgq missing episodes "川原砾"
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
# Pre-commit hook (.husky/pre-commit) runs automatically:
#   - Go files: gofmt + go vet + golangci-lint + go test
#   - wikiMissingPositions: bump version (header.js) → eslint + stylelint + prettier + build (auto-adds dist/)
#   - wikiPersonAlias: bump version → eslint + prettier
#   - wikiBatch: bump version (header.js) → eslint + stylelint + typecheck + build (auto-adds dist/)
#   - Frontend (bgq): lint-staged (ESLint + Stylelint + Prettier)
# Setup: git config core.hooksPath .husky (run once after clone)
```

### DuckDB CLI (runtime dependency)

```bash
curl -L https://github.com/duckdb/duckdb/releases/download/v1.5.4/duckdb_cli-linux-amd64.zip -o duckdb.zip
unzip duckdb.zip -d bgq/bin/
```

Path resolution: `DUCKDB_PATH` env → `bin/duckdb` (relative to executable) → `PATH`.

## Architecture (`bgq/`)

```
bgq/
├── cmd/
│   ├── bgq/
│   │   ├── main.go                   # CLI entry + subcommands (query, serve, ingest, interactive, missing, version)
│   │   ├── interactive.go            # Interactive REPL mode
│   │   ├── missing.go                # `missing` CLI subcommand dispatcher
│   │   ├── missing_subjects.go       # Missing subjects (staff) check logic + HTTP handler
│   │   ├── missing_subjects_test.go  # Tests for buildCheckSQL SQL generation
│   │   ├── missing_episodes.go       # Missing episodes (staff) check logic + HTTP handler
│   │   ├── missing_episodes_test.go  # Tests for expandAppearEps, epLabel, resolveOverlaps, etc.
│   │   ├── aliases.go                # Person alias lookup endpoint (/api/aliases/{alias})
│   │   ├── server.go                 # HTTP server + API handlers
│   │   └── dev.go                    # Air hot-reload dev mode
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
- `GET /api/persons/{name}/missing-subjects?type=<type>&position=<pos>` — find subjects missing a person's staff entry for given positions
- `GET /api/persons/{name}/missing-episodes` — find episodes whose description mentions a person but lack a corresponding staff entry
- `GET /api/aliases/{alias}` — returns `[{name, id}, ...]` array of all persons with the given alias (requires `--aliases-file` at startup; serves as backend for `wikiPersonAlias` userscript and `wikiMissingPositions`)
- `/` — embedded SPA; static files (images, CSS) served from embedded `dist/`

## Filters (`filters/`)

YAML filter configs executed in CI. Each produces a CSV with an `id` column, usable as wikiBatch input.

| Filter | Description |
|--------|-------------|
| novel-series-manga-volumes | Novel series with manga-format volumes |
| manga-series-novel-volumes | Manga series with novel-format volumes |
| numbered-title-marked-series | Numbered titles incorrectly marked as series |
| non-series-linked-volumes | Non-series subjects linked to volumes |
| series-with-isbn | Series with ISBN (9784-prefix only) |
| serialization-ended-no-complete-tag | Has serialization end date but missing 已完结 meta tag |
| numbered-volumes-no-series | Numbered volumes not linked to a series |
| novel-missing-novel-tag | Novel platform without 小说 meta tag (no series relation) |
| manga-missing-manga-tag | Manga platform without 漫画 meta tag (no series relation) |
| missing-author | Has 作者 staff but infobox 作者 field empty |

Run all filters: see `README.md` for the batch command.

## CI

Two separate workflows:

1. **`bangumi_data.yml`** — Weekly Tuesday cron. Downloads archive, runs duplicate ISBN check, generates person alias, executes filters. Uploads results to `data-latest` Release.
2. **`bgq_build.yml`** — Triggered on push to `bgq/**`. Cross-compiles bgq for linux/amd64, darwin/arm64, darwin/amd64, windows/amd64 + bundles DuckDB CLI. Publishes to `latest` Release.

Go version: read from `bgq/go.mod` via `go-version-file` (do not hardcode).

## Commit Conventions

Use conventional commits without scope parentheses.
Examples: `feat: add new feature`, `fix: resolve bug`, `docs: update readme`.

## Key Files

- `bgq/internal/config/config.go` — Filter type definitions + YAML/JSON parsing
- `bgq/internal/query/builder.go` — SQL generation (shared logic)
- `bgq/internal/query/builder_generic.go` — Generic filter SQL generation
- `bgq/internal/query/builder_target.go` — Target-specific SQL (subject/person/character/episode)
- `bgq/internal/query/engine.go` — DuckDB subprocess, CSV parsing
- `bgq/internal/model/helpers.go` — Lookup helpers (PlatformsByType, RelationsByType, etc.)
- `bgq/cmd/gen-model/main.go` — Code generator for schema constants (run via `go generate`)
- `bgq/cmd/bgq/main.go` — CLI dispatch + ingest logic
- `bgq/cmd/bgq/missing.go` — `missing` CLI subcommand dispatcher (subjects, episodes)
- `bgq/cmd/bgq/missing_subjects.go` — Missing subjects (staff) check: `buildCheckSQL` + HTTP handler
- `bgq/cmd/bgq/missing_subjects_test.go` — Tests for `buildCheckSQL` SQL generation
- `bgq/cmd/bgq/missing_episodes.go` — Missing episodes check: `handleMissingEpisodes` + position matching + episode label helpers
- `bgq/cmd/bgq/missing_episodes_test.go` — Tests for `expandAppearEps`, `epLabel`, `resolveOverlaps`, `buildEpPositionTable`
- `bgq/cmd/bgq/aliases.go` — Person alias lookup handler: `handleAliases`, `normalizeAlias`, `loadAliasesFile`
- `bgq/cmd/bgq/interactive.go` — Interactive REPL (shared parser with web API)
- `bgq/cmd/bgq/server.go` — HTTP server + API handlers (including aliases loading from `--aliases-file`)
- `bgq/internal/server/webui.go` — Embedded static files via `//go:embed dist/*`
- `bgq/frontend/src/schema-data.js` — Auto-generated schema constants (platforms, relations, positions, meta tags)
- `bgq/frontend/src/stores.js` — Frontend global state (filters, conditions, logic tree)
- `wikiMissingPositions/` — Pre-create person / one-click completion userscript
- `wikiPersonAlias/` — Person alias IndexedDB lookup userscript (provides `window.personAliasQuery/QueryAll`)
- `wikiBatch/` — Batch wiki editor userscript (completely separate from wikiMissingPositions)

## Person Alias System

`person_alias.py` generates `person_alias.json` (uploaded to GitHub Releases `data-latest`), which maps normalized aliases to person indices (one-to-many since the multi-result update). This data is consumed by:

1. **`wikiPersonAlias.user.js`** — Tampermonkey userscript that loads the `.json.gz` file into IndexedDB and exposes `window.personAliasQuery(name)` (single result, with GM.notification on multi-match) and `window.personAliasQueryAll(name)` (full array).
2. **`GET /api/aliases/{alias}`** (bgq) — Server-side endpoint that loads `person_alias.json` via `--aliases-file`. Auto-detects `../person_alias.json` and `./person_alias.json`. Hot-reloads on file change (checks mtime per request). Clients (wikiMissingPositions, wikiEpStaffRelate) query this **API first**, falling back to `window.personAlias*`.

Normalization: strip spaces/hyphens, narrow kana→hiragana (U+FF66-U+FF9D), fullwidth letters→halfwidth (U+FF21-U+FF5A), fullwidth katakana→hiragana (U+30A1-U+30F6), lowercase. Identical across Python/Go/JS.

`person_alias.py` uses PEP 723 inline script metadata — run via `uv run person_alias.py` (no venv setup needed).

## Docker

```bash
cd bgq
docker compose up -d --build
```

Build context is the repo root (configured via `docker-compose.yml`), so `person_alias.py` can be copied without duplication. `.dockerignore` at repo root excludes large files (`bangumi_archive`, `node_modules`, `*.db`, etc.).

Dockerfile builds frontend and Go binary in separate stages. Entrypoint auto-downloads archive data and generates `person_alias.json` (via `uv run`) on first run. Volume is `/data` (persists both archive and aliases JSON). `DATA_DIR` env var defaults to `/data/bangumi_archive`.
