#!/bin/sh
# 同步 index_filters/*.yaml 到 Bangumi 目录
# 用法: BANGUMI_TOKEN=xxx ./sync_indices.sh [--data-dir <dir>] [--bgq <path>]

set -e

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

if [ -z "$BANGUMI_TOKEN" ]; then
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

  if "$BGQ" query \
      --config "$yaml_file" \
      --data-dir "$DATA_DIR" \
      --format csv \
    | python3 sync_index.py --index "$index_id"; then
    echo "✅ $name 同步完成"
    success=$((success + 1))
  else
    echo "❌ $name 同步失败"
    fail=$((fail + 1))
  fi
done

echo ""
echo "同步完成: $success 成功, $fail 失败"
