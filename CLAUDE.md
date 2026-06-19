# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a monorepo for [Bangumi](https://bgm.tv) wiki automation. It has two parts:

1. **Root** — Python scripts for duplicate ISBN detection, field filtering, and CI automation
2. **`bgq/`** — A high-performance Go CLI that generates DuckDB SQL from YAML/JSON filter configs and executes queries against Bangumi Archive data (40–55× faster than Python equivalents)

## Build & Development Commands

```bash
# Build the bgq CLI (from repo root)
cd bgq && go build -o bin/bgq ./cmd/bgq/

# Build the generate-deploy helper (optional)
cd bgq && go build -o bin/generate-deploy ./cmd/generate-deploy/

# Run tests (standalone — no DuckDB or data needed)
cd bgq && go test ./internal/query/ -v

# Run a single test
cd bgq && go test ./internal/query/ -run TestBuildSQL -v

# Download DuckDB CLI (required for runtime)
curl -L https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip -o duckdb.zip
unzip duckdb.zip -d bgq/bin/

# Run a query
./bgq/bin/bgq query --config query.yaml
# or with verbose SQL output
./bgq/bin/bgq query --config query.yaml --verbose

# Start web server
./bgq/bin/bgq serve --data-dir ./bangumi_archive --listen :8080
```

## Architecture (`bgq/`)

```
cmd/bgq/         CLI entry point + subcommands (query, serve, ingest, interactive)
internal/
  config/        YAML/JSON config parsing, filter types, validation
  model/         Bangumi domain constants: subject types, relations, staff positions, platforms, meta tags
  query/         SQL builder (config → DuckDB SQL) + DuckDB execution engine (CLI wrapper)
  server/        Embedded SPA web UI (HTML string constant)
```

### Data Flow

1. YAML config or interactive conditions → `config.Config` struct
2. `query.SQLBuilder` translates config into a single DuckDB SQL query
3. `query.Engine` writes SQL to a temp file and invokes the DuckDB CLI binary (`-csv` mode)
4. Results parsed from CSV output → `QueryResult` → terminal table / CSV file / JSON / API response

### Key Design Decisions

- **DuckDB is an external CLI, not embedded.** The Go code invokes the `duckdb` binary as a subprocess (avoids CGo). Path is resolved from `DUCKDB_PATH` env var, `bin/duckdb`, or `PATH`.
- **Data source flexibility.** Queries read JSONLines files via DuckDB `read_json_auto()` CTEs at query time, OR use a pre-built persistent DuckDB database (created via `bgq ingest`). The SQL builder handles both paths.
- **Infobox fields are wiki-text.** Subject infobox data is a `|key: value` wiki-template string stored in a single column. SQL extracts values via `regexp_extract(s.infobox, '(?i)\|FieldName\s*[:=]\s*([^|}\n]*)', 1)`.
- **Chinese field names as primary keys.** Relation types and staff positions are referenced by their Chinese names (e.g., `单行本`, `原作`), resolved to numeric IDs at query build time via maps in `internal/model/`.

### Filter Types (exactly-one union pattern)

Each `config.Filter` holds exactly one non-nil pointer field:
- `Type` — subject type (书籍/动画/音乐/游戏/三次元)
- `Field` — direct JSON field or infobox field with operator (eq/contains/regex/gt/gte/lt/lte/before/after)
- `Global` — full-text search across infobox
- `Tag` / `MetaTag` — tag filtering with optional negation
- `Relation` — related-subject filtering with nested conditions and any/all/none modes
- `Staff` — person/staff filtering by position with nested field conditions
- `Episode` — episode-level filtering
- `Count` — count of relations or episodes

Nested conditions (relation/staff/episode) support the same filter types, enabling recursive subqueries with correlated `EXISTS` / `LEFT JOIN` patterns.

### YAML Parsing

Custom `UnmarshalYAML` on `Filter` supports shorthand forms:
```yaml
- type: 2                     # shorthand: direct value
- field: { field: score, operator: gt, value: 8 }  # full form
- tag: "轻小说"                # shorthand
- meta_tag: "漫画"             # shorthand (also aliased as 公共标签)
```

### Web Server

`bgq serve` starts an HTTP server with:
- Embedded SPA frontend (self-contained HTML/CSS/JS in `internal/server/webui.go`)
- `/api/query` — POST endpoint accepting conditions, filters, or YAML
- `/api/schema/*` — schema introspection endpoints for the UI
- CORS middleware, streaming CSV output

## Key Files

- `bgq/internal/config/config.go` — All filter type definitions + YAML/JSON parsing with custom unmarshaling
- `bgq/internal/query/builder.go` — SQL generation (WHERE clauses, CTEs, infobox extraction, date normalization, numeric extraction)
- `bgq/internal/query/engine.go` — DuckDB subprocess management, CSV parsing, output formatting
- `bgq/cmd/bgq/main.go` — CLI dispatch, argument parsing, ingest SQL
- `bgq/cmd/bgq/interactive.go` — Interactive mode + condition parser (shared with web API)
- `bgq/cmd/bgq/server.go` — HTTP server, API handlers, schema endpoints
- `bgq/internal/model/model.go` — Go structs matching Bangumi JSONLines schema
- `bgq/internal/model/relation_data.go` / `staff_data.go` — Auto-generated relation/position maps (~hundreds of entries)
- `bgq/internal/model/metatags.go` — Meta tag lists per subject type (auto-generated from archive data)

## Python Scripts (Root)

- `download_bangumi_archive.py` — Downloads latest Bangumi Archive from GitHub releases
- `find_duplicate_isbns.py` — Finds duplicate ISBNs (9784-prefix = Japan), outputs to `duplicate_check_results.txt`
- `filter_by_fields.py` — Interactive field-based filtering (the predecessor of `bgq`)
- `check_volume_order.py` — Checks volume ordering consistency
- `person_alias.py` — Person alias data processing

CI: `.github/workflows/bangumi_duplicate_check.yml` — Weekly Tuesday cron job that runs duplicate ISBN check and auto-commits results.

## Docker Deployment

```
cd bgq
docker build -t bgq .
docker run -p 7860:7860 -v $(pwd)/bangumi_archive:/data bgq
```

Entrypoint script downloads archive data if not present, then starts the web server.
