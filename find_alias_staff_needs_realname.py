# /// script
# requires-python = ">=3.9"
# dependencies = []
# ///
"""扫描条目職位欄：關聯人物本名缺失但別名出現時，在別名後加上 [本名]。

邏輯：
    對每個 subject 的每條 subject-persons 關聯 (person_id, position)，
    取該 type + position 對應的中文職位名作为 infobox key；
    若該行值中沒有出現人物本名，
    則檢查該人物別名是否出現；若出現，將命中 token 改寫為 `別名[本名]`。
    若命中的別名本身包含本名（如 月刊Asuka 之於 ASUKA），則跳過該別名。

輸出：`id,infobox` 兩列 CSV（infobox 為改寫後的全文，僅命中行被修改，
其餘行、前綴空格、換行格式原樣保留）。

注意：wikiBatch 的 CSV 列名即 infobox 字段名（`id,導演,脚本,...`），
本腳本輸出的是全文 `infobox` 列，供審查或二次加工後餵給 wikiBatch。

用法：
    uv run find_alias_staff_needs_realname.py
    uv run find_alias_staff_needs_realname.py --archive-dir bangumi_archive --output results/alias-annotate.csv
    uv run find_alias_staff_needs_realname.py --stats-only
    uv run find_alias_staff_needs_realname.py --limit 2000 --output /tmp/opencode/alias-sample.csv
"""

import argparse
import csv
import json
import os
import re
import sys
import unicodedata
from collections import Counter, defaultdict

KATA_TO_HIRA = str.maketrans({chr(c): chr(c - 0x60) for c in range(0x30A1, 0x30F7)})


def _norm(s):
    s = unicodedata.normalize('NFKC', s)
    return re.sub(r'[\s-]', '', s).translate(KATA_TO_HIRA).lower()


DELIM_CHARS = '()[]{}（）<>《》「」『』【】+×·→/／、,，;；：&＆\\等'
LINE_RE = re.compile(r'^\|([^|=\n]+?)\s*=\s*([^\n\r|]*)')

_SPLIT_CACHE = {}


def split_re_for(skip):
    key = frozenset(skip)
    pat = _SPLIT_CACHE.get(key)
    if pat is None:
        chars = ''.join(c for c in DELIM_CHARS if c not in key)
        pat = re.compile('([' + re.escape(chars) + '])')
        _SPLIT_CACHE[key] = pat
    return pat

VAR_TO_TYPE = {'book': 1, 'anime': 2, 'music': 3, 'game': 4, 'real': 6}


def load_staff_positions(go_path):
    with open(go_path, encoding='utf-8') as f:
        text = f.read()
    staff = {}
    for var, block in re.findall(r'var (\w+)StaffPositions = map\[int\]string\{(.*?)\n\}', text, re.S):
        t = VAR_TO_TYPE.get(var)
        if t is None:
            continue
        m = {}
        for pid, name in re.findall(r'^\s*(\d+):\s*"([^"]+)"', block, re.M):
            m[int(pid)] = name
        staff[t] = m
    if not staff:
        raise ValueError(f'未從 {go_path} 解析到職位表')
    return staff


def load_aliases(path):
    with open(path, encoding='utf-8') as f:
        persons, aliases = json.load(f)
    id_to_canon = {}
    for entry in persons:
        name, pid = entry[0], entry[1]
        if name and pid is not None:
            id_to_canon[pid] = name
    id_to_aliases = defaultdict(set)
    for norm_alias, indices in aliases.items():
        for idx in indices:
            if 0 <= idx < len(persons):
                pid = persons[idx][1]
                if pid in id_to_canon:
                    id_to_aliases[pid].add(norm_alias)
    return id_to_canon, id_to_aliases


def load_links(path):
    links = defaultdict(list)
    with open(path, encoding='utf-8') as f:
        for line in f:
            try:
                d = json.loads(line)
            except json.JSONDecodeError:
                continue
            sid, pid, pos = d.get('subject_id'), d.get('person_id'), d.get('position')
            if sid is not None and pid is not None and pos is not None:
                links[sid].append((pid, pos))
    return links


def annotate_value(value, canon, alias_set):
    skip = {c for c in canon if c in DELIM_CHARS}
    for a in alias_set:
        for c in a:
            if c in DELIM_CHARS:
                skip.add(c)
    skip |= {unicodedata.normalize('NFKC', c) for c in list(skip)}
    split_re = split_re_for(skip)
    canon_n = _norm(canon)
    segs = split_re.split(value)
    for i in range(0, len(segs), 2):
        if segs[i] and _norm(segs[i]) == canon_n:
            return None
    patched = False
    for i in range(0, len(segs), 2):
        tok = segs[i]
        if not tok:
            continue
        nt = _norm(tok)
        if not nt or nt not in alias_set:
            continue
        if canon_n and canon_n in nt:
            continue
        stripped = tok.strip()
        if not stripped:
            continue
        leading = tok[:len(tok) - len(tok.lstrip())]
        trailing = tok[len(tok.rstrip()):]
        segs[i] = leading + stripped + f'[{canon}]' + trailing
        patched = True
    if not patched:
        return None
    return ''.join(segs)


def process_subject(sid, stype, infobox, links, staff, id_to_canon, id_to_aliases, stats):
    pos_map = staff.get(stype)
    if not pos_map or not links:
        return None
    by_pos = defaultdict(list)
    for pid, pos in links:
        if pos in pos_map and pid in id_to_canon and pid in id_to_aliases:
            by_pos[pos].append(pid)
    if not by_pos:
        return None
    lines = infobox.split('\n')
    key_to_idx = {}
    for i, line in enumerate(lines):
        m = LINE_RE.match(line)
        if m:
            key_to_idx.setdefault(m.group(1).strip(), i)
    patched_any = False
    for pos, pids in by_pos.items():
        idx = key_to_idx.get(pos_map[pos])
        if idx is None:
            continue
        m = LINE_RE.match(lines[idx])
        vs, ve = m.span(2)
        value = m.group(2)
        if not value.strip() or value.strip() == '{':
            continue
        for pid in pids:
            canon = id_to_canon[pid]
            new_value = annotate_value(value, canon, id_to_aliases[pid])
            if new_value is None:
                continue
            stats['hits'] += 1
            stats['pos_counter'][pos_map[pos]] += 1
            value = new_value
            lines[idx] = lines[idx][:vs] + value + lines[idx][ve:]
            ve = vs + len(value)
            patched_any = True
    if not patched_any:
        return None
    return '\n'.join(lines)


def find_file(candidates):
    for p in candidates:
        if p and os.path.isfile(p):
            return p
    return None


def main():
    ap = argparse.ArgumentParser(description='關聯職位本名缺失但別名出現時，在別名後加 [本名]，輸出 id,infobox CSV。')
    ap.add_argument('--archive-dir', default='bangumi_archive', help='數據目錄（默認 bangumi_archive）')
    ap.add_argument('--aliases-file', default=None, help='別名文件（默認自動查找 person_alias.json）')
    ap.add_argument('--staff-go', default=None, help='職位表 Go 源文件（默認 bgq/internal/model/staff_data.go）')
    ap.add_argument('--output', default='results/alias-annotate.csv', help='輸出 CSV 路徑（默認 results/alias-annotate.csv）')
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
    print(f'職位表: {sum(len(m) for m in staff.values())} 個職位', file=sys.stderr)
    id_to_canon, id_to_aliases = load_aliases(aliases_file)
    print(f'別名: {len(id_to_canon)} 人物，{sum(len(s) for s in id_to_aliases.values())} 條人物-別名映射', file=sys.stderr)

    links = load_links(os.path.join(args.archive_dir, 'subject-persons.jsonlines'))
    print(f'關聯: {sum(len(v) for v in links.values())} 條，覆蓋 {len(links)} 個條目', file=sys.stderr)

    stats = {'hits': 0, 'pos_counter': Counter(), 'scanned': 0, 'patched': 0, 'type_counter': Counter()}
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
            if sid not in links:
                continue
            new_infobox = process_subject(
                sid, d.get('type'), d.get('infobox') or '', links[sid],
                staff, id_to_canon, id_to_aliases, stats,
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
    print(f'掃描 {stats["scanned"]} 條目，命中 {stats["patched"]} 條目，共 {stats["hits"]} 處標註', file=sys.stderr)
    print(f'按類型: {dict(stats["type_counter"])}', file=sys.stderr)
    print(f'按職位 Top15: {stats["pos_counter"].most_common(15)}', file=sys.stderr)
    if not args.stats_only:
        print(f'結果 → {args.output}', file=sys.stderr)


if __name__ == '__main__':
    main()
