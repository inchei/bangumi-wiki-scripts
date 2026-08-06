# /// script
# requires-python = ">=3.9"
# dependencies = [
#   "opencc-cn-name",
# ]
# ///
"""查找没有简体中文名但可转换出简体中文名的人物/角色，输出 wikiBatch CSV。

读取 person.jsonlines 和 character.jsonlines，筛选出 infobox 中缺少简体中文名的条目，
使用 opencc-cn-name（jp→cn, tw→cn, hk→cn 人名专用管线）尝试转换其名称为简体中文，
若结果与原名称不同，输出 CSV 供 wikiBatch 批量添加简体中文名。

用法:
    uv run find_missing_cn_name.py
    uv run find_missing_cn_name.py bangumi_archive results
"""

import csv
import json
import os
import re
import sys

from opencc_cn_name import refined_to_cn

HAS_KANA = re.compile(r'[\u3040-\u30cd\u30cf-\u30ff\u31f0-\u31ff\u33a0-\u33ff]')
INFOBOX_CN = re.compile(r'\|\s*简体中文名\s*=\s*([^\n|]*)')


def scan_jsonlines(jsonlines_path):
    results = []
    with open(jsonlines_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                d = json.loads(line.strip())
            except json.JSONDecodeError:
                continue

            item_id = d.get('id')
            if item_id is None:
                continue

            infobox = d.get('infobox', '')
            if not infobox:
                continue

            m = INFOBOX_CN.search(infobox)
            if m and m.group(1).strip():
                continue

            name = d.get('name', '')
            if not name or HAS_KANA.search(name):
                continue

            result = refined_to_cn(name)

            if result != name:
                results.append((item_id, result))
    return results


def main():
    archive_dir = sys.argv[1] if len(sys.argv) > 1 else 'bangumi_archive'
    output_dir = sys.argv[2] if len(sys.argv) > 2 else 'results'
    os.makedirs(output_dir, exist_ok=True)

    for entity_type, label in [('person', '人物'), ('character', '角色')]:
        jsonlines_path = os.path.join(archive_dir, f'{entity_type}.jsonlines')
        if not os.path.exists(jsonlines_path):
            print(f'{jsonlines_path} 不存在，跳过', file=sys.stderr)
            continue

        results = scan_jsonlines(jsonlines_path)
        output_path = os.path.join(output_dir, f'missing-cn-name-{entity_type}.csv')
        with open(output_path, 'w', newline='') as out:
            w = csv.writer(out)
            w.writerow([f'{entity_type}_id', '简体中文名'])
            for item_id, cn_name in results:
                w.writerow([item_id, cn_name])

        print(f'{label}: {len(results)} → {output_path}', file=sys.stderr)


if __name__ == '__main__':
    main()
