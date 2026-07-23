#!/usr/bin/env python3
"""查找所有简体中文名同名的人物，输出 CSV。

用法:
    python3 find_dup_person_name.py > dup_persons.csv
    python3 find_dup_person_name.py | python3 sync_index.py --index <目录ID>

输出列:
    person_id  — 人物 ID（sync_index.py 自动识别为人物类型）
    order      — 同名组序号（同名人物获得同一序号）
"""

import csv
import json
import re
import sys

INFOBOX_CN_PATTERN = re.compile(r'\|\s*简体中文名\s*=\s*([^\n|]*)')


def extract_cn_name(infobox: str) -> str | None:
    m = INFOBOX_CN_PATTERN.search(infobox)
    if m:
        val = m.group(1).strip()
        return val if val else None
    return None


def main():
    person_file = sys.argv[1] if len(sys.argv) > 1 else "bangumi_archive/person.jsonlines"

    name_groups: dict[tuple[str, str], list[tuple[int, str]]] = {}

    with open(person_file, 'r', encoding='utf-8') as f:
        for ln, line in enumerate(f, 1):
            try:
                obj = json.loads(line.strip())
                person_id = obj.get('id')
                if person_id is None:
                    continue
                infobox = obj.get('infobox', '')
                if not infobox:
                    continue
                name_cn = extract_cn_name(infobox)
                if not name_cn:
                    continue
                name = obj.get('name', '')
                key = (name, name_cn)
                name_groups.setdefault(key, []).append((person_id, name))
            except json.JSONDecodeError:
                print(f"警告: 第 {ln} 行 JSON 解析失败", file=sys.stderr)
                continue

    dup_groups = {k: v for k, v in name_groups.items() if len(v) >= 2}

    sorted_keys = sorted(dup_groups.keys())

    writer = csv.writer(sys.stdout)
    writer.writerow(['person_id', 'order'])
    for order, key in enumerate(sorted_keys, 1):
        for person_id, _ in dup_groups[key]:
            writer.writerow([person_id, order])

    stats = f"共 {sum(len(v) for v in dup_groups.values())} 个人物，{len(dup_groups)} 个同名组"
    print(stats, file=sys.stderr)


if __name__ == "__main__":
    main()
