#!/usr/bin/env bash
# Split an oversized CSV into row-aware parts that fit wikiBatch's localStorage quota.
#
# GNU split -l is NOT safe here: CSV cells may contain newlines inside quoted
# fields. This script parses with python3's csv module and rotates parts only
# on row boundaries, keeping the header row in every part.
#
# Usage:
#   split_csv.sh INPUT.csv [--out-dir DIR] [--prefix NAME] [--max-chars N] [--max-rows N] [--threshold N]
#
# Defaults:
#   --out-dir    <input-stem>_parts (next to the input file)
#   --prefix     <input-stem>
#   --max-chars  1000000  (~1.8 MB localStorage per part, safely below the ~5 MB quota;
#                         localStorage counts UTF-16 code units, so chars -- not bytes -- matter)
#   --max-rows   0 (no row cap)
#   --threshold  0 (always split; when > 0, files with total chars <= threshold are skipped)
#
# Output: <prefix>-p00.csv, <prefix>-p01.csv, ... ; stale <prefix>-p*.csv files
# in the output dir are removed first. A single row larger than --max-chars
# gets a part of its own (with a stderr warning).
set -euo pipefail

usage() {
    sed -n '2,/^set -euo/p' "$0" | sed '$d; s/^# \?//'
    exit "${1:-0}"
}

INPUT=""
OUT_DIR=""
PREFIX=""
MAX_CHARS=1000000
MAX_ROWS=0
THRESHOLD=0

while [ $# -gt 0 ]; do
    case "$1" in
        --out-dir) OUT_DIR="$2"; shift 2 ;;
        --prefix) PREFIX="$2"; shift 2 ;;
        --max-chars) MAX_CHARS="$2"; shift 2 ;;
        --max-rows) MAX_ROWS="$2"; shift 2 ;;
        --threshold) THRESHOLD="$2"; shift 2 ;;
        -h|--help) usage 0 ;;
        -*) echo "未知參數: $1" >&2; usage 1 ;;
        *) if [ -n "$INPUT" ]; then echo "多餘的位置參數: $1" >&2; usage 1; fi
           INPUT="$1"; shift ;;
    esac
done

[ -z "$INPUT" ] && { echo "缺少 INPUT.csv" >&2; usage 1; }
[ -f "$INPUT" ] || { echo "文件不存在: $INPUT" >&2; exit 1; }
command -v python3 >/dev/null || { echo "需要 python3" >&2; exit 1; }
case "$MAX_CHARS" in ''|*[!0-9]*) echo "--max-chars 必須為正整數" >&2; exit 1 ;; esac
case "$MAX_ROWS" in ''|*[!0-9]*) echo "--max-rows 必須為非負整數" >&2; exit 1 ;; esac
case "$THRESHOLD" in ''|*[!0-9]*) echo "--threshold 必須為非負整數" >&2; exit 1 ;; esac

STEM="$(basename "$INPUT" .csv)"
OUT_DIR="${OUT_DIR:-$(dirname "$INPUT")/${STEM}_parts}"
PREFIX="${PREFIX:-$STEM}"

mkdir -p "$OUT_DIR"
rm -f "$OUT_DIR"/"$PREFIX"-p*.csv

python3 - "$INPUT" "$OUT_DIR" "$PREFIX" "$MAX_CHARS" "$MAX_ROWS" "$THRESHOLD" <<'PYEOF'
import csv
import os
import sys

src, out_dir, prefix, max_chars, max_rows, threshold = (
    sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
)


def new_part(i):
    path = os.path.join(out_dir, f"{prefix}-p{i:02d}.csv")
    fh = open(path, "w", encoding="utf-8", newline="")
    writer = csv.writer(fh)
    return path, fh, writer


with open(src, encoding="utf-8", newline="") as fh:
    reader = csv.reader(fh)
    try:
        header = next(reader)
    except StopIteration:
        print("error: 空 CSV", file=sys.stderr)
        sys.exit(1)
    if threshold:
        total_chars = sum(sum(len(c) for c in row) for row in reader)
        if total_chars <= threshold:
            print(f"skip: {total_chars} 字符 <= --threshold {threshold}")
            sys.exit(0)

with open(src, encoding="utf-8", newline="") as fh:
    reader = csv.reader(fh)
    try:
        header = next(reader)
    except StopIteration:
        print("error: 空 CSV", file=sys.stderr)
        sys.exit(1)
    parts = []
    path, fh_out, writer = new_part(0)
    writer.writerow(header)
    parts.append([path, 0])
    size = 0
    rows_in_part = 0
    total = 0
    for row in reader:
        cost = sum(len(c) for c in row)
        if rows_in_part > 0 and (size + cost > max_chars or (max_rows and rows_in_part >= max_rows)):
            fh_out.close()
            path, fh_out, writer = new_part(len(parts))
            writer.writerow(header)
            parts.append([path, 0])
            size = 0
            rows_in_part = 0
            if cost > max_chars:
                print(f"warn: 單行 {cost} 字符超過 --max-chars，獨佔一個 part", file=sys.stderr)
        writer.writerow(row)
        size += cost
        rows_in_part += 1
        parts[-1][1] += 1
        total += 1
    fh_out.close()

print(f"rows: {total} -> {len(parts)} parts")
for path, n in parts:
    with open(path, encoding="utf-8") as fh:
        chars = len(fh.read())
    print(f"  {os.path.basename(path)}  rows={n}  ~{chars * 2 / 1048576:.2f} MB localStorage")
PYEOF
