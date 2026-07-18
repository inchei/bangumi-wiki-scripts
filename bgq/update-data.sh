#!/bin/sh
set -e
DATA_DIR="${DATA_DIR:-/data/bangumi_archive}"

echo "=== Updating archive ==="
/download-archive.sh "$DATA_DIR"

DB_PATH="${DB_PATH:-}"
if [ -n "${DB_PATH}" ]; then
  echo "=== Rebuilding database ==="
  TMP="${DB_PATH}.tmp"
  bgq ingest --data-dir "${DATA_DIR}" --db "$TMP"
  mv "$TMP" "$DB_PATH"
fi

echo "=== Regenerating aliases ==="
cd /data && uv run /person_alias.py

echo "=== Update complete ==="
