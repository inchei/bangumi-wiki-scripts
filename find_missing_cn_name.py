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
    uv run find_missing_cn_name.py bangumi_archive results --whitelist whitelist.txt
"""

import argparse
import csv
import json
import os
import re
import sys

from opencc_cn_name import refined_to_cn

HAS_KANA = re.compile(r'[\u3040-\u30cd\u30cf-\u30ff\u31f0-\u31ff\u33a0-\u33ff]')
INFOBOX_CN = re.compile(r'\|\s*简体中文名\s*=\s*([^\n|]*)')


def load_whitelist(paths):
    """从白名单文件加载 ID 集合（每行一个 ID，`#` 开头为注释）。"""
    ids = set()
    for path in paths:
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                try:
                    ids.add(int(line))
                except ValueError:
                    continue
    return ids


def scan_jsonlines(jsonlines_path, exclude_ids=None):
    results = []
    exclude_ids = exclude_ids or set()
    with open(jsonlines_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                d = json.loads(line.strip())
            except json.JSONDecodeError:
                continue

            item_id = d.get('id')
            if item_id is None or item_id in exclude_ids:
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
    parser = argparse.ArgumentParser(
        description='查找没有简体中文名但可转换出简体中文名的人物/角色，输出 wikiBatch CSV。'
    )
    parser.add_argument('archive_dir', nargs='?', default='bangumi_archive', help='数据目录（默认 bangumi_archive）')
    parser.add_argument('output_dir', nargs='?', default='results', help='输出目录（默认 results）')
    parser.add_argument(
        '--whitelist',
        action='append',
        default=[],
        metavar='FILE',
        help='白名单文件，每行一个 ID（# 开头为注释），可多次指定；名单内 ID 的人物被排除',
    )
    args = parser.parse_args()

    archive_dir = args.archive_dir
    output_dir = args.output_dir
    os.makedirs(output_dir, exist_ok=True)

    exclude_ids = load_whitelist(args.whitelist)
    print(f'已加载白名单 {len(exclude_ids)} 个 ID', file=sys.stderr)

    for entity_type, label in [('person', '人物'), ('character', '角色')]:
        jsonlines_path = os.path.join(archive_dir, f'{entity_type}.jsonlines')
        if not os.path.exists(jsonlines_path):
            print(f'{jsonlines_path} 不存在，跳过', file=sys.stderr)
            continue

        results = scan_jsonlines(jsonlines_path, exclude_ids if entity_type == 'person' else None)
        output_path = os.path.join(output_dir, f'missing-cn-name-{entity_type}.csv')
        with open(output_path, 'w', newline='') as out:
            w = csv.writer(out)
            w.writerow([f'{entity_type}_id', '简体中文名'])
            for item_id, cn_name in results:
                w.writerow([item_id, cn_name])

        print(f'{label}: {len(results)} → {output_path}', file=sys.stderr)


if __name__ == '__main__':
    main()
