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

# 日文中两种写法均可出现的等价字符 → 统一到常用写法（用于识别变体字造成的重复人物）
NORMALIZE_MAP = str.maketrans({
    '\u9ad9': '\u9ad8',  # 髙 → 高
    '\u51a8': '\u5bcc',  # 冨 → 富
    '\ufa11': '\u5d0e',  # 﨑 → 崎
    '\u5d5c': '\u5d0e',  # 嵜 → 崎
    '\u90de': '\u90ce',  # 郞 → 郎
    '\u6801': '\u67f3',  # 栁 → 柳
    '\u4ff1': '\u5036',  # 俱 → 倶
    '\u59ec': '\u59eb',  # 姬 → 姫
    '\u5154': '\u514e',  # 兔 → 兎
    '\u820d': '\u820e',  # 舍 → 舎
    '\u885e': '\u885b',  # 衞 → 衛
    '\u615c': '\u614e',  # 愼 → 慎
    '\u9089': '\u8fba',  # 邉 → 辺
    '\u908a': '\u8fba',  # 邊 → 辺
    '\u6ff5': '\u6d5c',  # 濵 → 浜
    '\u6ff1': '\u6d5c',  # 濱 → 浜
    '\u5d8b': '\u5cf6',  # 嶋 → 島
    '\u6fa4': '\u6ca2',  # 澤 → 沢
    '\u5ee3': '\u5e83',  # 廣 → 広
    '\u703e': '\u702c',  # 瀨 → 瀬
    '\u9f4a': '\u6589',  # 齊 → 斉
    '\u9f52': '\u6592',  # 齋 → 斎
    '\u6afb': '\u685c',  # 櫻 → 桜
    '\u95dc': '\u95a2',  # 關 → 関
    '\u9ed1': '\u9ed2',  # 黑 → 黒
    '\u5fb7': '\u5fb3',  # 德 → 徳
    '\u9f8d': '\u7adc',  # 龍 → 竜
    '\u8207': '\u4e0e',  # 與 → 与
    '\u9435': '\u9244',  # 鐵 → 鉄
    '\u5dbd': '\u5cb3',  # 嶽 → 岳
    '\u7adc': '\u4e26',  # 竝 → 並
})


def extract_cn_name(infobox: str) -> str | None:
    m = INFOBOX_CN_PATTERN.search(infobox)
    if m:
        val = m.group(1).strip()
        return val if val else None
    return None


def normalize_name(s: str) -> str:
    return s.translate(NORMALIZE_MAP)


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
                name_norm = normalize_name(name)
                name_cn_norm = normalize_name(name_cn)
                key = (name_norm, name_cn_norm)
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
