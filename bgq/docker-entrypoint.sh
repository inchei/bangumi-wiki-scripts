#!/bin/sh
set -e

DATA_DIR="${DATA_DIR:-/data/bangumi_archive}"
PORT="${PORT:-7860}"

if [ ! -f "${DATA_DIR}/subject.jsonlines" ]; then
  /download-archive.sh "$DATA_DIR"
fi

ALIAS_FILE="/data/person_alias.json"
if [ ! -f "${ALIAS_FILE}" ]; then
  echo "=== Generating person aliases ==="
  cd /data && uv run /person_alias.py
fi

set -- bgq serve --data-dir "${DATA_DIR}" --listen ":${PORT}" --aliases-file "${ALIAS_FILE}"
if [ -n "${DB_PATH}" ]; then
  if [ ! -f "${DB_PATH}" ]; then
    echo "=== Building database ==="
    bgq ingest --data-dir "${DATA_DIR}" --db "${DB_PATH}"
  fi
  set -- "$@" --db "${DB_PATH}"
fi

if [ -n "${ALLOWED_ORIGINS}" ]; then
  set -- "$@" --allowed-origins "${ALLOWED_ORIGINS}"
fi

echo "=== Starting bgq server ==="
exec "$@"
