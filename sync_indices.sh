#!/usr/bin/env bash
# 同步 index_filters/*.yaml 到 Bangumi 目录
# 用法: BANGUMI_TOKEN=xxx ./sync_indices.sh [--data-dir <dir>] [--bgq <path>]

set -euo pipefail

DATA_DIR="${DATA_DIR:-bangumi_archive}"
BGQ="${BGQ:-bgq/bin/bgq}"

# 解析参数
while [ $# -gt 0 ]; do
  case "$1" in
    --data-dir) DATA_DIR="$2"; shift 2 ;;
    --bgq) BGQ="$2"; shift 2 ;;
    *) echo "未知参数: $1"; exit 1 ;;
  esac
done

if [ -z "${BANGUMI_TOKEN:-}" ]; then
  echo "错误: 未设置 BANGUMI_TOKEN 环境变量"
  exit 1
fi

success=0
fail=0

for yaml_file in index_filters/*.yaml; do
  [ -f "$yaml_file" ] || continue

  name=$(basename "$yaml_file" .yaml)
  index_id=$(grep -m1 '^target_index:' "$yaml_file" | sed 's/target_index:\s*//' | tr -d ' ')

  if [ -z "$index_id" ] || [ "$index_id" = "0" ]; then
    echo "跳过 $name: 未设置 target_index"
    continue
  fi

  echo ""
  echo "========================================"
  echo "  同步目录: $name (index=$index_id)"
  echo "========================================"

  # 剥离顶层 target_index（仅 ^target_index:）再传给 bgq，避免 KnownFields 报错
  tmp_cfg=$(mktemp)
  grep -v '^target_index[[:space:]]*:' "$yaml_file" > "$tmp_cfg"

  # YAML 有 sort 时给 CSV 追加 order 列（行序号），否则不输出 order 列
  has_sort=""
  if grep -q '^sort:' "$tmp_cfg"; then
    has_sort="sort"
  fi

  # 输出 CSV（有 sort 时追加 order 列），交给 sync_index.py 同步
  emit_csv() {
    if [ "$1" = "sort" ]; then
      "$BGQ" query --config "$2" --data-dir "$DATA_DIR" --format csv \
        | awk 'NR==1{print $0",order"} NR>1{print $0","(NR-1)}'
    else
      "$BGQ" query --config "$2" --data-dir "$DATA_DIR" --format csv
    fi
  }

  set +e
  emit_csv "$has_sort" "$tmp_cfg" | uv run sync_index.py --index "$index_id"
  rc=${PIPESTATUS[0]:-0}
  py_rc=${PIPESTATUS[1]:-0}
  set -e
  rm -f "$tmp_cfg"
  # bgq 失败需视为同步失败，避免空 CSV 被当成功（pipefail 已设，此处双保险用 PIPESTATUS）
  if [ "$rc" -ne 0 ]; then
    echo "❌ $name 同步失败（bgq 退出码 $rc）" >&2
    fail=$((fail + 1))
  elif [ "$py_rc" -ne 0 ]; then
    echo "❌ $name 同步失败（sync 退出码 $py_rc）" >&2
    fail=$((fail + 1))
  else
    echo "✅ $name 同步完成"
    success=$((success + 1))
  fi
done

echo ""
echo "同步完成: $success 成功, $fail 失败"
[ "$fail" -eq 0 ] || exit 1
