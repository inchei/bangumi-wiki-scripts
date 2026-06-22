#!/bin/sh
set -e

DATA_DIR="${DATA_DIR:-/data/bangumi_archive}"

if [ ! -f "${DATA_DIR}/subject.jsonlines" ]; then
  /download-archive.sh "$DATA_DIR"
fi

echo "=== Starting bgq server ==="
exec bgq serve --data-dir "${DATA_DIR}" --listen ":7860"
