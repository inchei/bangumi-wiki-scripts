# /// script
# requires-python = ">=3.9"
# ///
import argparse
import html
import json
import os
import re
import shutil
import subprocess
import unicodedata
from collections import defaultdict, Counter
from datetime import datetime

CHINESE_NUMBERS = {
    '零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
    '五': 5, '六': 6, '七': 7, '八': 8, '九': 9,
    '十': 10, '百': 100, '千': 1000, '万': 10000
}

CIRCLED_NUMBERS = {
    '①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5,
    '⑥': 6, '⑦': 7, '⑧': 8, '⑨': 9, '⑩': 10,
    '⑪': 11, '⑫': 12, '⑬': 13, '⑭': 14, '⑮': 15,
    '⑯': 16, '⑰': 17, '⑱': 18, '⑲': 19, '⑳': 20,
    '➀': 1, '➁': 2, '➂': 3, '➃': 4, '➄': 5,
    '➅': 6, '➆': 7, '➇': 8, '➈': 9, '➉': 10,
    '❶': 1, '❷': 2, '❸': 3, '❹': 4, '❺': 5,
    '❻': 6, '❼': 7, '❽': 8, '❾': 9, '❿': 10,
    '➊': 1, '➋': 2, '➌': 3, '➍': 4, '➎': 5,
    '➏': 6, '➐': 7, '➑': 8, '➒': 9, '➓': 10,
    '⓵': 1, '⓶': 2, '⓷': 3, '⓸': 4, '⓹': 5,
    '⓺': 6, '⓻': 7, '⓼': 8, '⓽': 9, '⓾': 10
}

ROMAN_NUMBERS = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100,
    'D': 500, 'M': 1000,
    'Ⅰ': 1, 'Ⅴ': 5, 'Ⅹ': 10, 'Ⅼ': 50, 'Ⅽ': 100,
    'Ⅾ': 500, 'Ⅿ': 1000
}

EXTRACTION_METHODS = {
    'bracket_digit': '括号中的阿拉伯数字',
    'bracket_chinese': '括号中的汉字数字',
    'bracket_roman': '括号中的罗马数字',
    'bracket_fullwidth': '括号中的全角数字',
    'bracket_circled': '括号中的圆圈数字',
    'space_digit': '空格+阿拉伯数字+空格',
    'space_chinese': '空格+汉字数字+空格',
    'space_roman': '空格+罗马数字+空格',
    'space_fullwidth': '空格+全角数字+空格',
    'space_circled': '空格+圆圈数字+空格',
    'end_digit': '阿拉伯数字结尾',
    'end_chinese': '汉字数字结尾',
    'end_roman': '罗马数字结尾',
    'end_fullwidth': '全角数字结尾',
    'end_circled': '圆圈数字结尾',
    'chinese_prefix': '汉字数字(第X)',
    'other_digit': '其他阿拉伯数字',
    'other_fullwidth': '其他全角数字',
    'other_circled': '其他圆圈数字'
}


def normalize_text(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'\s+', '', text)
    text = unicodedata.normalize('NFKC', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text


def get_common_prefix(strings):
    if not strings:
        return ""
    min_len = min(len(s) for s in strings)
    prefix = []
    for i in range(min_len):
        char = strings[0][i]
        if all(s[i] == char for s in strings):
            prefix.append(char)
        else:
            break
    return ''.join(prefix)


def load_subjects(file_path):
    subjects = {}
    if not os.path.exists(file_path):
        print(f"错误：条目文件 {file_path} 不存在")
        return None
    print(f"正在加载条目数据 {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        total = sum(1 for _ in f)
    count = 0
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line.strip())
                subject_id = data.get('id')
                if subject_id:
                    name = data.get('name', '')
                    data['normalized_name'] = normalize_text(name)
                    subjects[subject_id] = data
            except json.JSONDecodeError:
                continue
            count += 1
            if count % 50000 == 0:
                print(f"  已加载 {count}/{total} 条目")
    print(f"成功加载 {len(subjects)} 个条目")
    return subjects


def load_relations(file_path):
    relations = defaultdict(list)
    if not os.path.exists(file_path):
        print(f"错误：关系文件 {file_path} 不存在")
        return None
    print(f"正在加载关系数据 {file_path}...")
    count = 0
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line.strip())
                subject_id = data.get('subject_id')
                related_id = data.get('related_subject_id')
                relation_type = data.get('relation_type')
                order = data.get('order', 0)
                if subject_id and related_id and relation_type is not None:
                    relations[subject_id].append({
                        'related_id': related_id,
                        'relation_type': relation_type,
                        'order': order
                    })
            except json.JSONDecodeError:
                continue
            count += 1
            if count % 500000 == 0:
                print(f"  已加载 {count} 行")
    print(f"成功加载 {len(relations)} 组关系数据")
    return relations


def find_duckdb():
    duckdb_path = os.environ.get("DUCKDB_PATH")
    if duckdb_path:
        return duckdb_path
    for p in ("bin/duckdb", "bgq/bin/duckdb", "duckdb"):
        resolved = os.path.join(os.path.dirname(os.path.abspath(__file__)), p)
        if os.path.isfile(resolved) and os.access(resolved, os.X_OK):
            return resolved
        if shutil.which(p):
            return shutil.which(p)
    return "duckdb"


def load_subjects_from_db(db_path, duckdb_path):
    print(f"正在从 DuckDB 加载条目数据...")
    cmd = [duckdb_path, db_path, "-json", "-c",
           "SELECT id, name, type, series FROM subjects"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"DuckDB 错误: {result.stderr}")
        return None
    if not result.stdout.strip():
        print(f"DuckDB 返回空结果")
        return None
    try:
        rows = json.loads(result.stdout)
    except json.JSONDecodeError as e:
        print(f"解析 DuckDB 输出失败: {e}")
        return None
    subjects = {}
    for row in rows:
        subject_id = row['id']
        row['normalized_name'] = normalize_text(row.get('name', ''))
        subjects[subject_id] = row
    print(f"成功加载 {len(subjects)} 个条目")
    return subjects


def load_relations_from_db(db_path, duckdb_path):
    print(f"正在从 DuckDB 加载关系数据...")
    cmd = [duckdb_path, db_path, "-json", "-c",
           "SELECT subject_id, related_subject_id, relation_type, \"order\" FROM subject_relations WHERE relation_type = 1003"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"DuckDB 错误: {result.stderr}")
        return None
    if not result.stdout.strip():
        print(f"DuckDB 返回空结果 (stderr: {result.stderr})")
        return None
    try:
        rows = json.loads(result.stdout)
    except json.JSONDecodeError as e:
        print(f"解析 DuckDB 输出失败: {e}")
        print(f"stdout: {result.stdout[:500]}")
        print(f"stderr: {result.stderr[:500]}")
        return None
    relations = defaultdict(list)
    for row in rows:
        relations[row['subject_id']].append({
            'related_id': row['related_subject_id'],
            'relation_type': row['relation_type'],
            'order': row.get('order', 0)
        })
    print(f"成功加载 {len(relations)} 组关系数据")
    return relations


def convert_roman_to_arabic(roman):
    if not roman:
        return None
    if '.' in roman:
        parts = roman.split('.', 1)
        if len(parts) != 2:
            return None
        integer_part = convert_roman_to_arabic(parts[0])
        fractional_part = convert_roman_to_arabic(parts[1])
        if integer_part is None or fractional_part is None:
            return None
        return float(f"{integer_part}.{fractional_part}")
    roman = roman.upper()
    total = 0
    prev_value = 0
    for char in reversed(roman):
        value = ROMAN_NUMBERS.get(char, 0)
        if value < prev_value:
            total -= value
        else:
            total += value
        prev_value = value
    return total if total > 0 else None


def convert_chinese_to_arabic(chinese):
    if not chinese:
        return None
    chinese_clean = chinese.lstrip('第')
    if '.' in chinese_clean or '．' in chinese_clean:
        chinese_clean = chinese_clean.replace('．', '.')
        parts = chinese_clean.split('.', 1)
        if len(parts) != 2:
            return None
        integer_part = convert_chinese_to_arabic(parts[0])
        fractional_part = convert_chinese_to_arabic(parts[1])
        if integer_part is None or fractional_part is None:
            return None
        return float(f"{integer_part}.{fractional_part}")
    total = 0
    current = 0
    for char in chinese_clean:
        value = CHINESE_NUMBERS.get(char, None)
        if value is None:
            return None
        if value >= 10:
            if current == 0:
                current = 1
            total += current * value
            current = 0
        else:
            current += value
    total += current
    return total if total > 0 else None


def is_fullwidth_digit(char):
    return '０' <= char <= '９'


def fullwidth_to_halfwidth(text):
    result = []
    for char in text:
        if '０' <= char <= '９':
            result.append(chr(ord(char) - 0xfee0))
        else:
            result.append(char)
    return ''.join(result)


def extract_number_with_method(name, main_title, specific_method=None):
    if not name:
        return None, None, None
    processed_name = name
    if main_title:
        main_title_normalized = normalize_text(main_title)
        main_title_pattern = re.escape(main_title)
        processed_name = re.sub(main_title_pattern, '', processed_name, flags=re.IGNORECASE)
        if main_title_normalized:
            processed_name = re.sub(re.escape(main_title_normalized), '', processed_name, flags=re.IGNORECASE)
    if specific_method:
        return extract_with_specific_method(processed_name, specific_method)
    chinese_prefix_match = re.search(r'第[零一二三四五六七八九十百千\.．]+', processed_name)
    if chinese_prefix_match:
        content = chinese_prefix_match.group(0)
        num = convert_chinese_to_arabic(content)
        if num is not None:
            return num, content, 'chinese_prefix'
    bracket_patterns = [r'\((.*?)\)', r'（(.*?)）', r'\[(.*?)\]', r'【(.*?)】', r'\{(.*?)\}', r'｛(.*?)｝', r'〈(.*?)〉']
    for pattern in bracket_patterns:
        match = re.search(pattern, processed_name)
        if match:
            content = match.group(1).strip()
            if re.fullmatch(r'\d+(\.\d+)?', content):
                return float(content) if '.' in content else int(content), content, 'bracket_digit'
            chinese_match = re.fullmatch(r'[零一二三四五六七八九十百千\.．]+', content)
            if chinese_match:
                num = convert_chinese_to_arabic(content)
                if num is not None:
                    return num, content, 'bracket_chinese'
            roman_match = re.fullmatch(r'[IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+', content, re.IGNORECASE)
            if roman_match:
                num = convert_roman_to_arabic(content)
                if num is not None:
                    return num, content, 'bracket_roman'
            fullwidth_match = re.fullmatch(r'[０-９．]+', content)
            if fullwidth_match:
                halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
                if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
                    return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'bracket_fullwidth'
            for circled, num in CIRCLED_NUMBERS.items():
                if circled == content:
                    return num, content, 'bracket_circled'
    space_digit_match = re.search(r'\s+(\d+(\.\d+)?)\s+', processed_name)
    if space_digit_match:
        content = space_digit_match.group(1)
        return float(content) if '.' in content else int(content), content, 'space_digit'
    space_chinese_match = re.search(r'\s+([零一二三四五六七八九十百千\.．]+)\s+', processed_name)
    if space_chinese_match:
        content = space_chinese_match.group(1)
        num = convert_chinese_to_arabic(content)
        if num is not None:
            return num, content, 'space_chinese'
    space_roman_match = re.search(r'\s+([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\s+', processed_name, re.IGNORECASE)
    if space_roman_match:
        content = space_roman_match.group(1)
        num = convert_roman_to_arabic(content)
        if num is not None:
            return num, content, 'space_roman'
    space_fullwidth_match = re.search(r'\s+([０-９．]+)\s+', processed_name)
    if space_fullwidth_match:
        content = space_fullwidth_match.group(1)
        halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
        if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
            return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'space_fullwidth'
    for circled, num in CIRCLED_NUMBERS.items():
        space_circled_match = re.search(rf'\s+{re.escape(circled)}\s+', processed_name)
        if space_circled_match:
            return num, circled, 'space_circled'
    end_digit_match = re.fullmatch(r'\s*(\d+(\.\d+)?)\s*', processed_name)
    if end_digit_match:
        content = end_digit_match.group(1)
        return float(content) if '.' in content else int(content), content, 'end_digit'
    end_chinese_match = re.fullmatch(r'\s*([零一二三四五六七八九十百千\.．]+)\s*', processed_name)
    if end_chinese_match:
        content = end_chinese_match.group(1)
        num = convert_chinese_to_arabic(content)
        if num is not None:
            return num, content, 'end_chinese'
    end_roman_match = re.fullmatch(r'\s*([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\s*', processed_name, re.IGNORECASE)
    if end_roman_match:
        content = end_roman_match.group(1)
        num = convert_roman_to_arabic(content)
        if num is not None:
            return num, content, 'end_roman'
    end_fullwidth_match = re.fullmatch(r'\s*([０-９．]+)\s*', processed_name)
    if end_fullwidth_match:
        content = end_fullwidth_match.group(1)
        halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
        if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
            return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'end_fullwidth'
    for circled, num in CIRCLED_NUMBERS.items():
        if processed_name.endswith(circled):
            return num, circled, 'end_circled'
    other_digit_match = re.search(r'\d+(\.\d+)?', processed_name)
    if other_digit_match:
        content = other_digit_match.group(0)
        return float(content) if '.' in content else int(content), content, 'other_digit'
    other_fullwidth_match = re.search(r'[０-９．]+', processed_name)
    if other_fullwidth_match:
        content = other_fullwidth_match.group(0)
        halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
        if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
            return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'other_fullwidth'
    for circled, num in CIRCLED_NUMBERS.items():
        if circled in processed_name:
            return num, circled, 'other_circled'
    return None, None, None


def extract_with_specific_method(text, method):
    if method == 'chinese_prefix':
        chinese_prefix_match = re.search(r'第[零一二三四五六七八九十百千\.．]+', text)
        if chinese_prefix_match:
            content = chinese_prefix_match.group(0)
            num = convert_chinese_to_arabic(content)
            if num is not None:
                return num, content, 'chinese_prefix'
        return None, None, None
    if method == 'bracket_digit':
        bracket_patterns = [r'\((\d+(\.\d+)?)\)', r'（(\d+(\.\d+)?)\）', r'\[(\d+(\.\d+)?)\]',
                          r'【(\d+(\.\d+)?)\】', r'\{(\d+(\.\d+)?)\}', r'｛(\d+(\.\d+)?)\｝', r'〈(\d+(\.\d+)?)〉']
        for pattern in bracket_patterns:
            match = re.search(pattern, text)
            if match:
                content = match.group(1)
                return float(content) if '.' in content else int(content), content, 'bracket_digit'
    elif method == 'bracket_chinese':
        bracket_patterns = [r'\(([零一二三四五六七八九十百千\.．]+)\)', r'（([零一二三四五六七八九十百千\.．]+)\）',
                          r'\[([零一二三四五六七八九十百千\.．]+)\]', r'【([零一二三四五六七八九十百千\.．]+)\】',
                          r'\{([零一二三四五六七八九十百千\.．]+)\}', r'｛([零一二三四五六七八九十百千\.．]+)\｝', r'〈([零一二三四五六七八九十百千\.．]+)〉']
        for pattern in bracket_patterns:
            match = re.search(pattern, text)
            if match:
                content = match.group(1)
                num = convert_chinese_to_arabic(content)
                if num is not None:
                    return num, content, 'bracket_chinese'
    elif method == 'bracket_roman':
        bracket_patterns = [r'\(([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\)', r'（([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\）',
                          r'\[([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\]', r'【([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\】',
                          r'\{([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\}', r'｛([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\｝', r'〈([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)〉']
        for pattern in bracket_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                content = match.group(1)
                num = convert_roman_to_arabic(content)
                if num is not None:
                    return num, content, 'bracket_roman'
    elif method == 'bracket_fullwidth':
        bracket_patterns = [r'\(([０-９．]+)\)', r'（([０-９．]+)\）', r'\[([０-９．]+)\]',
                          r'【([０-９．]+)\】', r'\{([０-９．]+)\}', r'｛([０-９．]+)\｝', r'〈([０-９．]+)〉']
        for pattern in bracket_patterns:
            match = re.search(pattern, text)
            if match:
                content = match.group(1)
                halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
                if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
                    return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'bracket_fullwidth'
    elif method == 'bracket_circled':
        bracket_patterns = [r'\((.*?)\)', r'（(.*?)\）', r'\[(.*?)\]', r'【(.*?)\】', r'\{(.*?)\}', r'｛(.*?)\｝', r'〈(.*?)〉']
        for pattern in bracket_patterns:
            match = re.search(pattern, text)
            if match:
                content = match.group(1).strip()
                for circled, num in CIRCLED_NUMBERS.items():
                    if circled == content:
                        return num, content, 'bracket_circled'
    elif method == 'space_digit':
        match = re.search(r'\s+(\d+(\.\d+)?)\s+', text)
        if match:
            content = match.group(1)
            return float(content) if '.' in content else int(content), content, 'space_digit'
    elif method == 'space_chinese':
        match = re.search(r'\s+([零一二三四五六七八九十百千\.．]+)\s+', text)
        if match:
            content = match.group(1)
            num = convert_chinese_to_arabic(content)
            if num is not None:
                return num, content, 'space_chinese'
    elif method == 'space_roman':
        match = re.search(r'\s+([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\s+', text, re.IGNORECASE)
        if match:
            content = match.group(1)
            num = convert_roman_to_arabic(content)
            if num is not None:
                return num, content, 'space_roman'
    elif method == 'space_fullwidth':
        match = re.search(r'\s+([０-９．]+)\s+', text)
        if match:
            content = match.group(1)
            halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
            if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
                return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'space_fullwidth'
    elif method == 'space_circled':
        for circled, num in CIRCLED_NUMBERS.items():
            match = re.search(rf'\s+{re.escape(circled)}\s+', text)
            if match:
                return num, circled, 'space_circled'
    elif method == 'end_digit':
        match = re.fullmatch(r'\s*(\d+(\.\d+)?)\s*', text)
        if match:
            content = match.group(1)
            return float(content) if '.' in content else int(content), content, 'end_digit'
    elif method == 'end_chinese':
        match = re.fullmatch(r'\s*([零一二三四五六七八九十百千\.．]+)\s*', text)
        if match:
            content = match.group(1)
            num = convert_chinese_to_arabic(content)
            if num is not None:
                return num, content, 'end_chinese'
    elif method == 'end_roman':
        match = re.fullmatch(r'\s*([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\s*', text, re.IGNORECASE)
        if match:
            content = match.group(1)
            num = convert_roman_to_arabic(content)
            if num is not None:
                return num, content, 'end_roman'
    elif method == 'end_fullwidth':
        match = re.fullmatch(r'\s*([０-９．]+)\s*', text)
        if match:
            content = match.group(1)
            halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
            if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
                return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'end_fullwidth'
    elif method == 'end_circled':
        for circled, num in CIRCLED_NUMBERS.items():
            if text.endswith(circled):
                return num, circled, 'end_circled'
    elif method == 'other_digit':
        match = re.search(r'\d+(\.\d+)?', text)
        if match:
            content = match.group(0)
            return float(content) if '.' in content else int(content), content, 'other_digit'
    elif method == 'other_fullwidth':
        match = re.search(r'[０-９．]+', text)
        if match:
            content = match.group(0)
            halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
            if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
                return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'other_fullwidth'
    elif method == 'other_circled':
        for circled, num in CIRCLED_NUMBERS.items():
            if circled in text:
                return num, circled, 'other_circled'
    return None, None, None


def is_valid_number_sequence(numbers):
    if len(numbers) <= 1:
        return True
    return all(numbers[i] <= numbers[i+1] for i in range(len(numbers)-1))


def has_multiple_continuous_groups(numbers):
    if len(numbers) < 4:
        return False
    groups = []
    current_group = []
    for num in numbers:
        if not current_group:
            if num == 1 or num == 1.0:
                current_group.append(num)
        else:
            if num == current_group[-1] + 1 or (isinstance(num, float) and num == current_group[-1] + 1.0):
                current_group.append(num)
            else:
                if current_group and len(current_group) >= 1:
                    groups.append(current_group)
                    current_group = []
                if num == 1 or num == 1.0:
                    current_group.append(num)
    if current_group and len(current_group) >= 1:
        groups.append(current_group)
    return len(groups) >= 2


def check_single_volume_order(main_subjects, all_subjects, relations, single_volume_relation_type):
    problematic_series = []
    total = len(main_subjects)
    print(f"\n开始检查单行本排序（共 {total} 个主条目）...")
    for idx, main_id in enumerate(main_subjects, 1):
        if idx % 10000 == 0:
            print(f"  进度: {idx}/{total}")
        main_subject = all_subjects.get(main_id)
        if not main_subject:
            continue
        main_name = main_subject.get('name', f"ID:{main_id}")
        main_normalized = main_subject.get('normalized_name', '')
        modify_url = f"https://bgm.tv/subject/{main_id}/add_related/subject/book"
        related_items = [item for item in relations.get(main_id, [])
                        if item['relation_type'] == single_volume_relation_type]
        if not related_items:
            continue
        filtered_items = []
        for item in related_items:
            related_subject = all_subjects.get(item['related_id'])
            if not related_subject:
                continue
            related_name = related_subject.get('name', '')
            related_normalized = normalize_text(related_name)
            if main_normalized and main_normalized in related_normalized:
                filtered_items.append(item)
        if len(filtered_items) < 2:
            continue
        sorted_items = sorted(filtered_items, key=lambda x: (x['order'], x['related_id']))
        first_pass_results = []
        for item in sorted_items:
            related_subject = all_subjects.get(item['related_id'])
            if not related_subject:
                continue
            if related_subject.get('type') != 1:
                continue
            name = related_subject.get('name', '')
            num, original_num, method = extract_number_with_method(name, main_name)
            first_pass_results.append({
                'related_id': item['related_id'],
                'name': name,
                'num': num,
                'original_num': original_num,
                'method': method,
                'order': item['order']
            })
        methods = [item['method'] for item in first_pass_results if item['method'] is not None]
        if not methods:
            continue
        most_common_method = Counter(methods).most_common(1)[0][0]
        method_count = Counter(methods)[most_common_method]
        second_pass_results = []
        for item in first_pass_results:
            if item['method'] == most_common_method and item['num'] is not None:
                second_pass_results.append(item)
                continue
            num, original_num, method = extract_number_with_method(
                item['name'], main_name, specific_method=most_common_method
            )
            if num is not None:
                second_pass_results.append({
                    'related_id': item['related_id'],
                    'name': item['name'],
                    'num': num,
                    'original_num': original_num,
                    'method': method,
                    'order': item['order']
                })
            else:
                second_pass_results.append({
                    'related_id': item['related_id'],
                    'name': item['name'],
                    'num': None,
                    'original_num': None,
                    'method': None,
                    'order': item['order']
                })
        all_titles = [item['name'] for item in second_pass_results]
        common_prefix = get_common_prefix(all_titles)
        final_results = [item for item in second_pass_results if item['num'] is not None and item['num'] != 0]
        if len(final_results) < 2:
            continue
        volume_numbers = [item['num'] for item in final_results]
        volume_titles = [item['name'] for item in final_results]
        if has_multiple_continuous_groups(volume_numbers):
            continue
        if not is_valid_number_sequence(volume_numbers):
            bad = set()
            for i in range(len(volume_numbers) - 1):
                if volume_numbers[i] > volume_numbers[i + 1]:
                    bad.add(i)
                    bad.add(i + 1)
            problematic_series.append({
                'main_id': main_id,
                'main_name': main_name,
                'volume_titles': volume_titles,
                'bad_indices': bad,
                'most_common_method': EXTRACTION_METHODS.get(most_common_method, most_common_method),
                'method_count': method_count,
                'total_volumes': len(final_results),
                'common_prefix': common_prefix,
                'modify_url': modify_url
            })
    print(f"检查完成。共发现 {len(problematic_series)} 个异常系列。")
    return problematic_series


DARK_MODE = '''<style>
:root{color-scheme:light dark}
body{background:canvas;color:canvastext}a{color:linktext}table{border-collapse:collapse;width:100%}th,td{border:1px solid color-mix(in srgb,canvastext 25%,transparent);padding:8px;text-align:left;vertical-align:top}th{background:color-mix(in srgb,canvastext 12%,transparent)}tr:nth-child(even){background:color-mix(in srgb,canvastext 6%,transparent)}
</style>'''


def generate_html_report(problematic_series):
    lines = ['<!DOCTYPE html>',
             '<html lang="zh"><head><meta charset="utf-8">',
             '<meta name="viewport" content="width=device-width,initial-scale=1">',
             '<title>单行本卷序检查结果</title>',
             DARK_MODE,
             '</head><body>',
             '<div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap">',
             '<h1>单行本卷序检查结果</h1>',
             '</div>']
    if not problematic_series:
        lines.append('<p>所有符合条件的主条目的单行本均按正确顺序排列</p>')
        lines.append('</body></html>')
        return '\n'.join(lines)
    lines.append(f'<p>发现 <strong>{len(problematic_series)}</strong> 个排序异常的主条目</p>')
    lines.append('<table><thead><tr>'
                 '<th>主条目</th><th>提取方法</th><th>匹配数/总数</th>'
                 '<th>共同前缀</th><th>单行本标题（按当前顺序）</th><th>操作</th>'
                 '</tr></thead><tbody>')
    for s in problematic_series:
        main_link = f'<a href="https://bgm.tv/subject/{s["main_id"]}" target="_blank">{html.escape(s["main_name"])}</a>'
        bad = s.get('bad_indices', set())
        vols = ''.join(
            f'<li{" style=color:red;font-weight:bold" if i in bad else ""}>{html.escape(t)}</li>'
            for i, t in enumerate(s['volume_titles']))
        lines.append(f'<tr>'
                     f'<td>{main_link}</td>'
                     f'<td>{html.escape(s["most_common_method"])}</td>'
                     f'<td>{s["method_count"]}/{s["total_volumes"]}</td>'
                     f'<td>{html.escape(s["common_prefix"] or "-")}</td>'
                     f'<td><ol style="margin:0;padding-left:20px">{vols}</ol></td>'
                     f'<td><a href="{html.escape(s["modify_url"])}" target="_blank">编辑关联</a></td>'
                     f'</tr>')
    lines.append('</tbody></table>')
    lines.append(f'<p style="font-size:0.9em;color:color-mix(in srgb,canvastext 60%,transparent)">生成时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>')
    lines.append('</body></html>')
    return '\n'.join(lines)


def resolve_data_source(archive_dir, db_path):
    if db_path:
        return ('db', db_path)
    if archive_dir:
        subjects_file = os.path.join(archive_dir, "subject.jsonlines")
        relations_file = os.path.join(archive_dir, "subject-relations.jsonlines")
        if os.path.isfile(subjects_file) and os.path.isfile(relations_file):
            return ('jsonlines', archive_dir)
    for candidate in ('bgq/bangumi.db', 'bangumi.db'):
        if os.path.isfile(candidate):
            return ('db', candidate)
    for candidate in ('bangumi_archive', '.'):
        subjects_file = os.path.join(candidate, "subject.jsonlines")
        relations_file = os.path.join(candidate, "subject-relations.jsonlines")
        if os.path.isfile(subjects_file) and os.path.isfile(relations_file):
            return ('jsonlines', candidate)
    return ('jsonlines', archive_dir or 'bangumi_archive')


def main():
    parser = argparse.ArgumentParser(description='检查单行本卷序一致性')
    parser.add_argument('--archive-dir', default=None,
                        help='数据文件夹路径（默认自动查找）')
    parser.add_argument('--db', default=None,
                        help='DuckDB 数据库路径（默认自动查找 bgq/bangumi.db）')
    parser.add_argument('--output', default='_site/volume_order_report.html',
                        help='输出 HTML 文件路径（默认: _site/volume_order_report.html）')
    args = parser.parse_args()

    source_type, source_path = resolve_data_source(args.archive_dir, args.db)
    print(f"数据源: {source_type} ({source_path})")

    if source_type == 'db':
        duck = find_duckdb()
        all_subjects = load_subjects_from_db(source_path, duck)
        if not all_subjects:
            return
        main_subjects = [
            sid for sid, subject in all_subjects.items()
            if subject.get('series', False) and subject.get('type') == 1
        ]
        print(f"找到 {len(main_subjects)} 个符合条件的主条目 (series: true, type: 1)")
        if not main_subjects:
            print("没有找到符合条件的主条目，程序退出")
            return
        relations = load_relations_from_db(source_path, duck)
        if not relations:
            return
    else:
        subjects_file = os.path.join(source_path, "subject.jsonlines")
        relations_file = os.path.join(source_path, "subject-relations.jsonlines")

        all_subjects = load_subjects(subjects_file)
        if not all_subjects:
            return

        main_subjects = [
            sid for sid, subject in all_subjects.items()
            if subject.get('series', False) and subject.get('type') == 1
        ]
        print(f"找到 {len(main_subjects)} 个符合条件的主条目 (series: true, type: 1)")
        if not main_subjects:
            print("没有找到符合条件的主条目，程序退出")
            return

        relations = load_relations(relations_file)
        if not relations:
            return

    problematic_series = check_single_volume_order(
        main_subjects, all_subjects, relations, 1003
    )

    html_content = generate_html_report(problematic_series)

    os.makedirs(os.path.dirname(args.output) or '.', exist_ok=True)
    with open(args.output, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"结果已保存至 {args.output}")


if __name__ == "__main__":
    main()
