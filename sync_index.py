#!/usr/bin/env python3
"""将 CSV 同步到 Bangumi 目录（使用 next.bgm.tv 私有 API）。

用法:
    bgq query --config x.yaml --format csv | python sync_index.py --index 12345
    python sync_index.py --index 12345 --csv results.csv

列规则:
    - id 列自动识别：person_id → person, character_id → character, id → subject
    - 若存在 index_desc 列，用其值作为条目描述
    - 否则，非 ID 列以 "列名：值" 拼接为描述
    - 行序即目录排序（除非指定 --ignore-order）

环境变量:
    BANGUMI_TOKEN  Bangumi API access token (必需)
"""

import argparse
import csv
import io
import json
import os
import sys
import time
from urllib.error import HTTPError
from urllib.request import Request, urlopen

API_BASE = "https://next.bgm.tv/p1"

# 列名 → (cat, id列名)
ID_COL_MAP = {
    "person_id": (2, "person_id"),
    "character_id": (1, "character_id"),
}


def detect_id_column(columns: list[str]) -> tuple[int, str]:
    """从列名推断类型和 ID 列。返回 (cat, id_col)。"""
    for col, (cat, id_col) in ID_COL_MAP.items():
        if col in columns:
            return cat, id_col
    return 0, "id"


def api(method: str, path: str, token: str, body: dict | None = None) -> tuple[int, str]:
    url = f"{API_BASE}{path}"
    data = json.dumps(body).encode() if body else None
    req = Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "bangumi-wiki-scripts/sync_index",
        },
    )
    try:
        with urlopen(req) as resp:
            return resp.status, resp.read().decode()
    except HTTPError as e:
        return e.code, e.read().decode()


def api_call(method: str, path: str, token: str, body: dict | None = None) -> tuple[int, str]:
    """带 429 限流重试。"""
    status, resp_body = api(method, path, token, body)
    if status == 429:
        wait = int(resp_body) if resp_body.isdigit() else 2
        print(f"  限流，等待 {wait}s ...", file=sys.stderr)
        time.sleep(wait)
        return api(method, path, token, body)
    return status, resp_body


def get_existing(index_id: int, cat: int, token: str) -> dict[int, dict]:
    """获取目录现有条目，返回 {sid: {id(记录ID), order, comment}}。"""
    existing = {}
    offset = 0
    while True:
        status, body = api_call(
            "GET",
            f"/indexes/{index_id}/related?cat={cat}&limit=100&offset={offset}",
            token,
        )
        if status != 200:
            print(f"获取目录条目失败: {status} {body}", file=sys.stderr)
            sys.exit(1)
        data = json.loads(body)
        for item in data.get("data", []):
            existing[item["sid"]] = {
                "id": item["id"],
                "order": item.get("order", 0),
                "comment": item.get("comment", ""),
            }
        if len(data.get("data", [])) < 100:
            break
        offset += 100
    return existing


def build_desc(row: dict, columns: list[str], id_col: str, has_index_desc: bool) -> str:
    if has_index_desc:
        return row.get("index_desc", "")
    parts = []
    for col in columns:
        if col == id_col or col.endswith("_id") or col == "index_desc":
            continue
        val = row.get(col, "").strip()
        if val:
            parts.append(f"{col}：{val}")
    return "\n".join(parts)


def sync(
    index_id: int,
    cat: int,
    id_col: str,
    token: str,
    columns: list[str],
    rows: list[dict],
    dry_run: bool,
    ignore_order: bool = False,
):
    has_index_desc = "index_desc" in columns

    result_ids = []
    result_map = {}
    for i, row in enumerate(rows):
        sid = int(row[id_col])
        result_ids.append(sid)
        result_map[sid] = {
            "order": i + 1,
            "desc": build_desc(row, columns, id_col, has_index_desc),
        }

    print(f"筛选结果: {len(result_ids)} 条")

    existing = get_existing(index_id, cat, token)
    print(f"目录现有: {len(existing)} 条")

    result_set = set(result_ids)
    to_add = [s for s in result_ids if s not in existing]
    to_update = [s for s in result_ids if s in existing]
    to_remove_sid = [s for s in existing if s not in result_set]

    print(f"添加: {len(to_add)}, 更新: {len(to_update)}, 移除: {len(to_remove_sid)}")

    if dry_run:
        print("[dry-run] 不执行")
        return

    ok = fail = 0

    for sid in to_add:
        info = result_map[sid]
        body = {"cat": cat, "sid": sid, "order": info["order"], "comment": info["desc"]}
        if ignore_order:
            body["order"] = 0
        status, resp_body = api_call(
            "PUT",
            f"/indexes/{index_id}/related",
            token,
            body,
        )
        if status == 200:
            ok += 1
        else:
            print(f"  添加 {sid} 失败: {status} {resp_body}", file=sys.stderr)
            fail += 1

    for sid in to_update:
        info = result_map[sid]
        record_id = existing[sid]["id"]
        body = {"order": info["order"], "comment": info["desc"]}
        if ignore_order:
            body["order"] = existing[sid]["order"]
        status, resp_body = api_call(
            "PATCH",
            f"/indexes/{index_id}/related/{record_id}",
            token,
            body,
        )
        if status == 200:
            ok += 1
        else:
            print(f"  更新 {sid} 失败: {status} {resp_body}", file=sys.stderr)
            fail += 1

    for sid in to_remove_sid:
        record_id = existing[sid]["id"]
        status, body = api_call(
            "DELETE",
            f"/indexes/{index_id}/related/{record_id}",
            token,
        )
        if status == 200:
            ok += 1
        else:
            print(f"  移除 {sid} 失败: {status} {body}", file=sys.stderr)
            fail += 1

    print(f"完成: {ok} 成功, {fail} 失败")


def main():
    parser = argparse.ArgumentParser(description="将 CSV 同步到 Bangumi 目录")
    parser.add_argument("--index", type=int, required=True, help="Bangumi 目录 ID")
    parser.add_argument("--csv", help="CSV 文件路径（不指定则从 stdin 读取）")
    parser.add_argument("--dry-run", action="store_true", help="仅预览，不执行")
    parser.add_argument("--ignore-order", action="store_true", help="忽略 CSV 顺序，不修改目录条目顺序")
    args = parser.parse_args()

    token = os.environ.get("BANGUMI_TOKEN", "")
    if not token and not args.dry_run:
        print("错误: 未设置 BANGUMI_TOKEN 环境变量", file=sys.stderr)
        sys.exit(1)

    if args.csv:
        with open(args.csv, encoding="utf-8-sig") as f:
            content = f.read()
    else:
        content = sys.stdin.buffer.read().decode("utf-8-sig")

    reader = csv.DictReader(io.StringIO(content))
    columns = reader.fieldnames or []
    rows = list(reader)

    if not rows:
        print("CSV 为空，跳过")
        return

    cat, id_col = detect_id_column(columns)
    if id_col not in columns:
        print(f"错误: CSV 缺少 ID 列（尝试: {id_col}）", file=sys.stderr)
        sys.exit(1)

    type_names = {0: "subject", 1: "character", 2: "person", 3: "episode"}
    print(f"类型: {type_names.get(cat, cat)} (cat={cat}, id={id_col})")
    print(f"列: {columns}")
    print(f"行数: {len(rows)}")

    sync(args.index, cat, id_col, token, columns, rows, args.dry_run, args.ignore_order)


if __name__ == "__main__":
    main()
