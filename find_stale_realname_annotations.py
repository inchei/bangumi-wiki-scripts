# /// script
# requires-python = ">=3.9"
# dependencies = []
# ///
"""清除條目改名後殘餘的 [本名] 標註。

背景：人物改名後（如 齋藤 → 齊藤），條目職位行可能殘留 `齊藤[齋藤]`，
此時方括號已無意義，應去掉括號只留 `齊藤`。

邏輯：
    對每個 subject 職位行中的 `X[Y]`，僅當 X 與 Y 指向同一人物、
    且 X 是該人物現本名時，才刪掉 `[Y]` 只留 X。
    其他情況（合法的 別名[本名]、角色[聲優]、公司歸屬註記、
    Y 與人物無關的括號等）一律保留。

輸出：`id,infobox` 兩列 CSV（infobox 為改寫後的全文）。

用法：
    uv run find_stale_realname_annotations.py --stats-only
    uv run find_stale_realname_annotations.py --output results/stale-realname-annotations.csv
    uv run find_stale_realname_annotations.py --limit 2000 --output /tmp/opencode/stale-sample.csv
"""

import argparse
import csv
import json
import os
import re
import sys
from collections import Counter, defaultdict

from find_alias_staff_needs_realname import (
    _norm,
    load_aliases,
    load_staff_positions,
)

LINE_RE = re.compile(r'^\|([^|=\n]+?)\s*=\s*([^\n\r|]*)')
BRACKET_PAIRS = {'[': ']', '［': '］'}
BRACKET_RE = re.compile(r'[\[［]([^\[\]［］\n\r]+)[\]］]')
X_RUN_RE = re.compile(r'([^\[\]［］、，,／/；;；：:()（）{}<>《》「」『』【】+×→＆&\\等|]+?)\s*$')


def strip_stale_brackets(value, canon_norm_to_pids, id_to_aliases, stats):
    matches = list(BRACKET_RE.finditer(value))
    if not matches:
        return None
    spans = []
    for m in matches:
        if BRACKET_PAIRS.get(value[m.start()]) != value[m.end() - 1]:
            continue
        y = m.group(1).strip()
        if not y:
            continue
        y_n = _norm(y)
        if not y_n:
            continue
        xm = X_RUN_RE.search(value[:m.start()])
        if not xm:
            continue
        x = xm.group(1).strip()
        if not x:
            continue
        x_n = _norm(x)
        pids = canon_norm_to_pids.get(x_n, ())
        if not pids:
            continue
        if x_n != y_n and not any(
            y_n in id_to_aliases.get(pid, ())
            for pid in pids
        ):
            continue
        spans.append((m.start(), m.end()))
        stats['stripped'] += 1
        stats['pos_counter'][stats['cur_pos']] += 1
    if not spans:
        return None
    parts = []
    prev = 0
    for s, e in spans:
        parts.append(value[prev:s])
        prev = e
    parts.append(value[prev:])
    return ''.join(parts)


def process_subject(sid, stype, infobox, staff, canon_norm_to_pids, id_to_aliases, stats):
    pos_map = staff.get(stype)
    if not pos_map:
        return None
    lines = infobox.split('\n')
    key_to_idx = {}
    for i, line in enumerate(lines):
        m = LINE_RE.match(line)
        if m:
            key_to_idx.setdefault(m.group(1).strip(), i)
    wanted = set(pos_map.values())
    patched_any = False
    for key, idx in key_to_idx.items():
        if key not in wanted:
            continue
        m = LINE_RE.match(lines[idx])
        vs, ve = m.span(2)
        value = m.group(2)
        if not value.strip() or value.strip() == '{':
            continue
        stats['cur_pos'] = key
        new_value = strip_stale_brackets(value, canon_norm_to_pids, id_to_aliases, stats)
        if new_value is None:
            continue
        lines[idx] = lines[idx][:vs] + new_value + lines[idx][ve:]
        patched_any = True
    stats['cur_pos'] = ''
    if not patched_any:
        return None
    return '\n'.join(lines)


def find_file(candidates):
    for p in candidates:
        if p and os.path.isfile(p):
            return p
    return None


def main():
    ap = argparse.ArgumentParser(description='清除改名殘餘的 [本名] 標註，輸出 id,infobox CSV。')
    ap.add_argument('--archive-dir', default='bangumi_archive', help='數據目錄（默認 bangumi_archive）')
    ap.add_argument('--aliases-file', default=None, help='別名文件（默認自動查找 person_alias.json）')
    ap.add_argument('--staff-go', default=None, help='職位表 Go 源文件（默認 bgq/internal/model/staff_data.go）')
    ap.add_argument('--output', default='results/stale-realname-annotations.csv', help='輸出 CSV 路徑')
    ap.add_argument('--limit', type=int, default=0, help='僅處理前 N 個條目（試跑用，0 = 全量）')
    ap.add_argument('--stats-only', action='store_true', help='僅輸出統計，不寫 CSV')
    args = ap.parse_args()

    base = os.path.dirname(os.path.abspath(__file__))
    staff_go = args.staff_go or os.path.join(base, 'bgq', 'internal', 'model', 'staff_data.go')
    if not os.path.isfile(staff_go):
        print(f'職位表文件不存在: {staff_go}', file=sys.stderr)
        sys.exit(1)
    aliases_file = args.aliases_file or find_file([
        os.path.join(base, 'person_alias.json'),
        os.path.join(base, 'bgq', '..', 'person_alias.json'),
        'person_alias.json',
    ])
    if not aliases_file:
        print('未找到 person_alias.json，請先運行 uv run person_alias.py', file=sys.stderr)
        sys.exit(1)

    staff = load_staff_positions(staff_go)
    id_to_canon, id_to_aliases = load_aliases(aliases_file)
    canon_norm_to_pids = defaultdict(list)
    for pid, canon in id_to_canon.items():
        canon_norm_to_pids[_norm(canon)].append(pid)
    print(f'人物: {len(id_to_canon)}', file=sys.stderr)

    stats = {'scanned': 0, 'patched': 0, 'stripped': 0,
             'pos_counter': Counter(), 'type_counter': Counter(), 'cur_pos': ''}
    out_f = None
    writer = None
    if not args.stats_only:
        out_dir = os.path.dirname(args.output)
        if out_dir:
            os.makedirs(out_dir, exist_ok=True)
        out_f = open(args.output, 'w', encoding='utf-8', newline='')
        writer = csv.writer(out_f)
        writer.writerow(['id', 'infobox'])

    subj_path = os.path.join(args.archive_dir, 'subject.jsonlines')
    with open(subj_path, encoding='utf-8') as f:
        for line in f:
            try:
                d = json.loads(line)
            except json.JSONDecodeError:
                continue
            sid = d.get('id')
            if sid is None:
                continue
            stats['scanned'] += 1
            if args.limit and stats['scanned'] > args.limit:
                break
            new_infobox = process_subject(
                sid, d.get('type'), d.get('infobox') or '', staff,
                canon_norm_to_pids, id_to_aliases, stats,
            )
            if new_infobox is not None:
                stats['patched'] += 1
                stats['type_counter'][d.get('type')] += 1
                if writer:
                    writer.writerow([sid, new_infobox])
            if stats['scanned'] % 100000 == 0:
                print(f'  進度 {stats["scanned"]}，已命中 {stats["patched"]}', file=sys.stderr)

    if out_f:
        out_f.close()
    print(f'掃描 {stats["scanned"]} 條目，命中 {stats["patched"]} 條目，共去掉 {stats["stripped"]} 處標註', file=sys.stderr)
    print(f'按類型: {dict(stats["type_counter"])}', file=sys.stderr)
    print(f'按職位 Top15: {stats["pos_counter"].most_common(15)}', file=sys.stderr)
    if not args.stats_only:
        print(f'結果 → {args.output}', file=sys.stderr)


if __name__ == '__main__':
    main()
