#!/bin/bash
# 本地测试云端版
set -e
cd "$(dirname "$0")"

echo "=== 1. 导出最新 HTML ==="
cd .. && ./bin/bgq export-deploy --output deploy/index.html && cd deploy

echo ""
echo "=== 2. 下载 DuckDB-WASM 文件（约 60MB）==="
CDN="https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.0/dist"
for f in duckdb-mvp.wasm duckdb-eh.wasm duckdb-browser-mvp.worker.js duckdb-browser-eh.worker.js; do
  if [ ! -f "$f" ]; then
    curl -fsSL "${CDN}/${f}" -o "$f" && echo "  ✓ $f" || echo "  ✗ $f"
  else
    echo "  · $f (已存在)"
  fi
done

echo ""
echo "=== 3. 准备数据库 ==="
if [ -f bangumi_web.db ] && [ "$(wc -c < bangumi_web.db)" -gt 1000000 ]; then
  echo "  ✓ 已有 ($(du -h bangumi_web.db | cut -f1))"
elif [ -f /tmp/bangumi_web.db ]; then
  cp /tmp/bangumi_web.db bangumi_web.db
  echo "  ✓ 已复制 /tmp/bangumi_web.db ($(du -h bangumi_web.db | cut -f1))"
else
  echo "  构建数据库（需要 ../bangumi_archive 数据）..."
  bash ./build-db.sh ./bangumi_web.db
fi

echo ""
echo "=== 4. 启动 http://localhost:8000 ==="
python3 -m http.server 8000
