# /// script
# requires-python = ">=3.9"
# dependencies = [
#   "opencc",
# ]
# ///
"""查找没有简体中文名但可转换出简体中文名的人物/角色，输出 wikiBatch CSV。

读取 person.jsonlines 和 character.jsonlines，筛选出 infobox 中缺少简体中文名的条目，
使用 OpenCC（jp→cn, tw→cn, hk→cn）尝试转换其名称为简体中文，
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

HAS_KANA = re.compile(r'[\u3040-\u309f\u30a0-\u30ff]')
INFOBOX_CN = re.compile(r'\|\s*简体中文名\s*=\s*([^\n|]*)')

# Characters that should be mapped to their standard Chinese forms directly
# (either as jp2t bypass or for chars t2s doesn't simplify)
VARIANT_MAP = str.maketrans({
    '\u6238': '\u6237',  # 戸 → 户
    '\u820e': '\u820d',  # 舎 → 舍
    '\u5d8b': '\u5c9b',  # 嶋 → 岛
    '\u51a8': '\u5bcc',  # 冨 → 富
    '\ufa11': '\u5d0e',  # 﨑 → 崎
    '\u9ad9': '\u9ad8',  # 髙 → 高
})


def expand_iteration_mark(s):
    return re.sub(
        '\u3005',
        lambda m: s[m.start() - 1] if m.start() > 0 else '',
        s,
    )


def apply_variant_map(s):
    return s.translate(VARIANT_MAP)


def scan_jsonlines(jsonlines_path, opencc_converters):
    cc_jp2t, cc_t2s, cc_tw2s, cc_hk2s, cc_t2jp = opencc_converters
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

            expanded = expand_iteration_mark(name)

            # jp2t (Japanese shinjitai → kyujitai) → t2s (→ simplified)
            # Per-character: only accept if kyujitai is valid traditional Chinese (t2s simplifies it)
            chars = []
            for c in expanded:
                jp_c = cc_jp2t.convert(c)
                if jp_c != c and cc_t2s.convert(jp_c) != jp_c:
                    chars.append(cc_t2s.convert(jp_c))
                else:
                    chars.append(c)
            result = ''.join(chars)
            # Then t2s the whole string so chars unchanged by jp2t still get simplified
            if result != expanded:
                result = cc_t2s.convert(result)

            # Direct variant mapping for chars jp2t doesn't handle
            if result == expanded:
                result = apply_variant_map(result)

            # t2s/tw2s/hk2s without any Japanese step
            if result == expanded:
                result = cc_t2s.convert(expanded)
            if result == expanded:
                result = cc_tw2s.convert(expanded)
            if result == expanded:
                result = cc_hk2s.convert(expanded)

            # t2jp (traditional → Japanese shinjitai) → t2s as last resort
            if result == expanded:
                jp_new = cc_t2jp.convert(expanded)
                if jp_new != expanded and cc_t2s.convert(jp_new) != jp_new:
                    result = cc_t2s.convert(jp_new)

            # Apply variant map again in case OpenCC output still has variants
            result = apply_variant_map(result)

            if result != name:
                results.append((item_id, result))
    return results


def main():
    import opencc

    cc_jp2t = opencc.OpenCC('jp2t')
    cc_t2s = opencc.OpenCC('t2s')
    cc_tw2s = opencc.OpenCC('tw2s')
    cc_hk2s = opencc.OpenCC('hk2s')
    cc_t2jp = opencc.OpenCC('t2jp')
    converters = (cc_jp2t, cc_t2s, cc_tw2s, cc_hk2s, cc_t2jp)

    archive_dir = sys.argv[1] if len(sys.argv) > 1 else 'bangumi_archive'
    output_dir = sys.argv[2] if len(sys.argv) > 2 else 'results'
    os.makedirs(output_dir, exist_ok=True)

    for entity_type, label in [('person', '人物'), ('character', '角色')]:
        jsonlines_path = os.path.join(archive_dir, f'{entity_type}.jsonlines')
        if not os.path.exists(jsonlines_path):
            print(f'{jsonlines_path} 不存在，跳过', file=sys.stderr)
            continue

        results = scan_jsonlines(jsonlines_path, converters)
        output_path = os.path.join(output_dir, f'missing-cn-name-{entity_type}.csv')
        with open(output_path, 'w', newline='') as out:
            w = csv.writer(out)
            w.writerow([f'{entity_type}_id', '简体中文名'])
            for item_id, cn_name in results:
                w.writerow([item_id, cn_name])

        print(f'{label}: {len(results)} → {output_path}', file=sys.stderr)


if __name__ == '__main__':
    main()
