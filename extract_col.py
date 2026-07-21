#!/usr/bin/env python3
"""
Extract entries matching a key pattern from a semicolon-separated column into a new column.

Usage:
    python3 extract_col.py <csv_file> <src_col> <extract_key> [--new-col NAME] [--out FILE] [--fail FILE]

Examples:
    # Extract 音响制作担当 from 音响 column, output to bangumi_results_extracted.csv
    python3 extract_col.py bangumi_results.csv 音响 音响制作担当

    # Rename new column: extract key 辅佐 as column 演出助手
    python3 extract_col.py bangumi_results.csv 制作人员 辅佐 --new-col 演出助手

    # Custom output and failure files
    python3 extract_col.py data.csv col1 制作 --out result.csv --fail errors.csv

Logic:
    For each cell in <src_col>, find patterns like:
        ；<extract_key>：value   (standard format with ； separator)
        （<extract_key>：value） (parenthetical format)
        <extract_key>：value     (at start, no prefix)
    Remove the matched portion from the original cell, and place value into the new column.
"""

import argparse
import csv
import re
import sys
from pathlib import Path


def extract_key_from_cell(cell: str, key: str):
    m_paren = re.search(r'[（(]' + re.escape(key) + r'[：:](.+?)[）)]', cell)
    if m_paren:
        value = m_paren.group(1).strip()
        new_cell = re.sub(r'[（(]' + re.escape(key) + r'[：:].+?[）)]', '', cell).strip()
        return new_cell, value

    m = re.search(r'(?:；|^)' + re.escape(key) + r'[：:](.+?)(?:；|$)', cell)
    if m:
        value = m.group(1).strip()
        new_cell = re.sub(r'；?' + re.escape(key) + r'[：:].+?(?=；|$)', '', cell).strip()
        return new_cell, value

    m_nocolon = re.search(r'(?:^|[、；])([^、；（）()]*?)[（(]' + re.escape(key) + r'[）)]', cell)
    if m_nocolon:
        name = m_nocolon.group(1).strip()
        new_cell = re.sub(r'[、；]?' + re.escape(name) + r'[（(]' + re.escape(key) + r'[）)]', '', cell).strip()
        new_cell = re.sub(r'^[、；]+|[、；]+$', '', new_cell).strip()
        new_cell = re.sub(r'([、；])\s*[、；]', r'\1', new_cell).strip()
        return new_cell, name

    return None, 'key not found'


def detect_dialect(path: str):
    with open(path, encoding='utf-8-sig') as f:
        sample = f.read(8192)
    try:
        return csv.Sniffer().sniff(sample)
    except csv.Error:
        return csv.excel()


def main():
    parser = argparse.ArgumentParser(description='Extract key:value from semicolon-separated column')
    parser.add_argument('csv_file', help='Input CSV file')
    parser.add_argument('src_col', help='Source column name')
    parser.add_argument('extract_key', help='Key to extract (e.g. 音响制作担当)')
    parser.add_argument('--new-col', help='New column name (default: same as extract_key, e.g. --new-col 演出助手)')
    parser.add_argument('--out', help='Output CSV file (default: <input>_extracted.csv)')
    parser.add_argument('--fail', help='Failure output file (default: <input>_failed.csv)')
    args = parser.parse_args()

    new_col = args.new_col or args.extract_key
    stem = Path(args.csv_file).stem
    ext = Path(args.csv_file).suffix
    out_file = args.out or f'{stem}_extracted{ext}'
    fail_file = args.fail or f'{stem}_failed{ext}'

    dialect = detect_dialect(args.csv_file)

    with open(args.csv_file, encoding='utf-8-sig') as f:
        reader = csv.DictReader(f, dialect=dialect)
        rows = list(reader)
        fieldnames = reader.fieldnames or []

    if args.src_col not in fieldnames:
        print(f'Error: column "{args.src_col}" not found in {args.csv_file}', file=sys.stderr)
        print(f'Available columns: {fieldnames}', file=sys.stderr)
        sys.exit(1)

    if new_col in fieldnames:
        print(f'Error: column "{new_col}" already exists in {args.csv_file}', file=sys.stderr)
        sys.exit(1)

    new_rows = []
    failed_rows = []

    for row in rows:
        cell = row.get(args.src_col, '') or ''
        if not cell:
            new_rows.append(row)
            continue

        result = extract_key_from_cell(cell, args.extract_key)

        if result[0] is not None:
            new_cell, value = result
            row[args.src_col] = new_cell
            row[new_col] = value
            new_rows.append(row)
        else:
            failed_rows.append(row)

    out_fn = fieldnames + [new_col]
    clean = [{k: r.get(k, '') for k in out_fn} for r in new_rows]
    with open(out_file, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=out_fn, dialect=dialect)
        w.writeheader()
        w.writerows(clean)
    print(f'OK: {len(new_rows)} rows → {out_file}')

    if failed_rows:
        clean_fail = [{k: r.get(k, '') for k in fieldnames} for r in failed_rows]
        with open(fail_file, 'w', encoding='utf-8-sig', newline='') as f:
            w = csv.DictWriter(f, fieldnames=fieldnames, dialect=dialect)
            w.writeheader()
            w.writerows(clean_fail)
        print(f'FAILED: {len(failed_rows)} rows → {fail_file}')
    else:
        print('No failures')


if __name__ == '__main__':
    main()
