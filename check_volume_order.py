import json
import os
import re
import unicodedata
from collections import defaultdict, Counter
from tqdm import tqdm

# 汉字数字到阿拉伯数字的映射
CHINESE_NUMBERS = {
    '零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
    '五': 5, '六': 6, '七': 7, '八': 8, '九': 9,
    '十': 10, '百': 100, '千': 1000, '万': 10000
}

# 圆圈数字到阿拉伯数字的映射
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

# 罗马数字到阿拉伯数字的映射
ROMAN_NUMBERS = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100,
    'D': 500, 'M': 1000,
    'Ⅰ': 1, 'Ⅴ': 5, 'Ⅹ': 10, 'Ⅼ': 50, 'Ⅽ': 100,
    'Ⅾ': 500, 'Ⅿ': 1000
}

# 提取方式的标识常量
EXTRACTION_METHODS = {
    # 括号中的数字
    'bracket_digit': '括号中的阿拉伯数字',
    'bracket_chinese': '括号中的汉字数字',
    'bracket_roman': '括号中的罗马数字',
    'bracket_fullwidth': '括号中的全角数字',
    'bracket_circled': '括号中的圆圈数字',
    
    # 空格+数字+空格
    'space_digit': '空格+阿拉伯数字+空格',
    'space_chinese': '空格+汉字数字+空格',
    'space_roman': '空格+罗马数字+空格',
    'space_fullwidth': '空格+全角数字+空格',
    'space_circled': '空格+圆圈数字+空格',
    
    # 数字结尾
    'end_digit': '阿拉伯数字结尾',
    'end_chinese': '汉字数字结尾',
    'end_roman': '罗马数字结尾',
    'end_fullwidth': '全角数字结尾',
    'end_circled': '圆圈数字结尾',
    
    # 汉字"第X"类型（无需考虑括号和空格）
    'chinese_prefix': '汉字数字(第X)',
    
    # 其他类型
    'other_digit': '其他阿拉伯数字',
    'other_fullwidth': '其他全角数字',
    'other_circled': '其他圆圈数字'
}

def normalize_text(text):
    """归一化文本，去除特殊字符和空格，用于标题匹配"""
    if not text:
        return ""
    # 转换为小写
    text = text.lower()
    # 去除所有空格
    text = re.sub(r'\s+', '', text)
    # 转换为NFKC标准形式（统一全角半角等）
    text = unicodedata.normalize('NFKC', text)
    # 去除标点符号
    text = re.sub(r'[^\w\s]', '', text)
    return text

def get_common_prefix(strings):
    """从字符串列表中获取共同的前缀并trim()"""
    if not strings:
        return ""
    
    # 找出最短字符串的长度
    min_len = min(len(s) for s in strings)
    prefix = []
    
    # 逐字符比较
    for i in range(min_len):
        char = strings[0][i]
        if all(s[i] == char for s in strings):
            prefix.append(char)
        else:
            break
    
    # 合并并trim()
    common = ''.join(prefix).strip()
    return common

def load_subjects(file_path):
    """加载条目数据，返回id到条目的映射"""
    subjects = {}
    if not os.path.exists(file_path):
        print(f"错误：条目文件 {file_path} 不存在")
        return None
    
    print(f"正在加载条目数据 {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        total = sum(1 for _ in f)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in tqdm(f, total=total, desc="加载进度"):
            try:
                data = json.loads(line.strip())
                subject_id = data.get('id')
                if subject_id:
                    # 存储原始标题和归一化标题
                    name = data.get('name', '')
                    data['normalized_name'] = normalize_text(name)
                    subjects[subject_id] = data
            except json.JSONDecodeError:
                continue
    
    print(f"成功加载 {len(subjects)} 个条目")
    return subjects

def load_relations(file_path):
    """加载关系数据，返回主条目id到关联条目的映射"""
    relations = defaultdict(list)
    if not os.path.exists(file_path):
        print(f"错误：关系文件 {file_path} 不存在")
        return None
    
    print(f"正在加载关系数据 {file_path}...")
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
    
    print(f"成功加载 {len(relations)} 组关系数据")
    return relations

def convert_roman_to_arabic(roman):
    """将罗马数字转换为阿拉伯数字，支持小数"""
    if not roman:
        return None
    
    # 检查是否包含小数点
    if '.' in roman:
        parts = roman.split('.', 1)
        if len(parts) != 2:
            return None
        integer_part = convert_roman_to_arabic(parts[0])
        fractional_part = convert_roman_to_arabic(parts[1])
        if integer_part is None or fractional_part is None:
            return None
        return float(f"{integer_part}.{fractional_part}")
    
    # 处理小写罗马数字
    roman = roman.upper()
    total = 0
    prev_value = 0
    
    # 从右向左解析
    for char in reversed(roman):
        value = ROMAN_NUMBERS.get(char, 0)
        if value < prev_value:
            total -= value
        else:
            total += value
        prev_value = value
    
    return total if total > 0 else None

def convert_chinese_to_arabic(chinese):
    """将汉字数字转换为阿拉伯数字，支持小数和"第x"格式"""
    if not chinese:
        return None
    
    # 移除可能的"第"前缀
    chinese_clean = chinese.lstrip('第')
    
    # 检查是否包含小数点（点或．）
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
        
        if value >= 10:  # 十、百、千、万
            if current == 0:
                current = 1
            total += current * value
            current = 0
        else:  # 零到九
            current += value
    
    total += current
    return total if total > 0 else None

def is_fullwidth_digit(char):
    """判断是否为全角数字"""
    return '０' <= char <= '９'

def fullwidth_to_halfwidth(text):
    """将全角数字转换为半角数字"""
    result = []
    for char in text:
        if '０' <= char <= '９':
            result.append(chr(ord(char) - 0xfee0))
        else:
            result.append(char)
    return ''.join(result)

def extract_number_with_method(name, main_title, specific_method=None):
    """
    从名称中提取数字，返回数字、原始表示和提取方法
    第X类型无需考虑括号和空格
    """
    if not name:
        return None, None, None
    
    # 先从单行本标题中移除主标题部分
    processed_name = name
    if main_title:
        # 构建主标题的多种可能形式用于匹配移除
        main_title_normalized = normalize_text(main_title)
        main_title_pattern = re.escape(main_title)
        # 尝试移除原始主标题
        processed_name = re.sub(main_title_pattern, '', processed_name, flags=re.IGNORECASE)
        # 尝试移除归一化后的主标题（处理各种变体）
        if main_title_normalized:
            processed_name = re.sub(re.escape(main_title_normalized), '', processed_name, flags=re.IGNORECASE)
    
    # 先处理"第X"类型（无需考虑括号和空格）
    # 匹配"第"开头的汉字数字
    chinese_prefix_match = re.search(r'第[零一二三四五六七八九十百千\.．]+', processed_name)
    if chinese_prefix_match:
        content = chinese_prefix_match.group(0)
        num = convert_chinese_to_arabic(content)
        if num is not None:
            return num, content, 'chinese_prefix'
    
    # 如果指定了提取方法，只使用该方法
    if specific_method:
        return extract_with_specific_method(processed_name, specific_method)
    
    # 未指定方法时，按优先级尝试所有方法
    # 1. 括号中的数字
    bracket_patterns = [r'\((.*?)\)', r'（(.*?)）', r'\[(.*?)\]', r'【(.*?)】', r'\{(.*?)\}', r'｛(.*?)｝']
    for pattern in bracket_patterns:
        match = re.search(pattern, processed_name)
        if match:
            content = match.group(1).strip()
            # 检查是否为阿拉伯数字（支持小数）
            if re.fullmatch(r'\d+(\.\d+)?', content):
                return float(content) if '.' in content else int(content), content, 'bracket_digit'
            # 检查是否为普通汉字数字（支持小数）
            chinese_match = re.fullmatch(r'[零一二三四五六七八九十百千\.．]+', content)
            if chinese_match:
                num = convert_chinese_to_arabic(content)
                if num is not None:
                    return num, content, 'bracket_chinese'
            # 检查是否为罗马数字（支持小数）
            roman_match = re.fullmatch(r'[IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+', content, re.IGNORECASE)
            if roman_match:
                num = convert_roman_to_arabic(content)
                if num is not None:
                    return num, content, 'bracket_roman'
            # 检查是否为全角数字（支持小数）
            fullwidth_match = re.fullmatch(r'[０-９．]+', content)
            if fullwidth_match:
                halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
                if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
                    return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'bracket_fullwidth'
            # 检查是否为圆圈数字
            for circled, num in CIRCLED_NUMBERS.items():
                if circled == content:
                    return num, content, 'bracket_circled'
    
    # 2. 空格+数字+空格
    # 阿拉伯数字（支持小数）
    space_digit_match = re.search(r'\s+(\d+(\.\d+)?)\s+', processed_name)
    if space_digit_match:
        content = space_digit_match.group(1)
        return float(content) if '.' in content else int(content), content, 'space_digit'
    
    # 普通汉字数字（支持小数）
    space_chinese_match = re.search(r'\s+([零一二三四五六七八九十百千\.．]+)\s+', processed_name)
    if space_chinese_match:
        content = space_chinese_match.group(1)
        num = convert_chinese_to_arabic(content)
        if num is not None:
            return num, content, 'space_chinese'
    
    # 罗马数字（支持小数）
    space_roman_match = re.search(r'\s+([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\s+', processed_name, re.IGNORECASE)
    if space_roman_match:
        content = space_roman_match.group(1)
        num = convert_roman_to_arabic(content)
        if num is not None:
            return num, content, 'space_roman'
    
    # 全角数字（支持小数）
    space_fullwidth_match = re.search(r'\s+([０-９．]+)\s+', processed_name)
    if space_fullwidth_match:
        content = space_fullwidth_match.group(1)
        halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
        if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
            return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'space_fullwidth'
    
    # 圆圈数字
    for circled, num in CIRCLED_NUMBERS.items():
        space_circled_match = re.search(rf'\s+{re.escape(circled)}\s+', processed_name)
        if space_circled_match:
            return num, circled, 'space_circled'
    
    # 3. 数字结尾
    # 阿拉伯数字（支持小数）
    end_digit_match = re.search(r'(\d+(\.\d+)?)$', processed_name)
    if end_digit_match:
        content = end_digit_match.group(1)
        return float(content) if '.' in content else int(content), content, 'end_digit'
    
    # 普通汉字数字（支持小数）结尾
    end_chinese_match = re.search(r'([零一二三四五六七八九十百千\.．]+)$', processed_name)
    if end_chinese_match:
        content = end_chinese_match.group(1)
        num = convert_chinese_to_arabic(content)
        if num is not None:
            return num, content, 'end_chinese'
    
    # 罗马数字（支持小数）结尾
    end_roman_match = re.search(r'([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)$', processed_name, re.IGNORECASE)
    if end_roman_match:
        content = end_roman_match.group(1)
        num = convert_roman_to_arabic(content)
        if num is not None:
            return num, content, 'end_roman'
    
    # 全角数字（支持小数）结尾
    end_fullwidth_match = re.search(r'([０-９．]+)$', processed_name)
    if end_fullwidth_match:
        content = end_fullwidth_match.group(1)
        halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
        if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
            return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'end_fullwidth'
    
    # 圆圈数字结尾
    for circled, num in CIRCLED_NUMBERS.items():
        if processed_name.endswith(circled):
            return num, circled, 'end_circled'
    
    # 4. 其他类型
    # 其他阿拉伯数字
    other_digit_match = re.search(r'\d+(\.\d+)?', processed_name)
    if other_digit_match:
        content = other_digit_match.group(0)
        return float(content) if '.' in content else int(content), content, 'other_digit'
    
    # 其他全角数字
    other_fullwidth_match = re.search(r'[０-９．]+', processed_name)
    if other_fullwidth_match:
        content = other_fullwidth_match.group(0)
        halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
        if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
            return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'other_fullwidth'
    
    # 其他圆圈数字
    for circled, num in CIRCLED_NUMBERS.items():
        if circled in processed_name:
            return num, circled, 'other_circled'
    
    return None, None, None

def extract_with_specific_method(text, method):
    """使用特定方法提取数字"""
    # 先处理"第X"类型（无需考虑括号和空格）
    if method == 'chinese_prefix':
        chinese_prefix_match = re.search(r'第[零一二三四五六七八九十百千\.．]+', text)
        if chinese_prefix_match:
            content = chinese_prefix_match.group(0)
            num = convert_chinese_to_arabic(content)
            if num is not None:
                return num, content, 'chinese_prefix'
        return None, None, None
    
    # 括号中的数字
    if method == 'bracket_digit':
        bracket_patterns = [r'\((\d+(\.\d+)?)\)', r'（(\d+(\.\d+)?)\）', r'\[(\d+(\.\d+)?)\]', 
                          r'【(\d+(\.\d+)?)\】', r'\{(\d+(\.\d+)?)\}', r'｛(\d+(\.\d+)?)\｝']
        for pattern in bracket_patterns:
            match = re.search(pattern, text)
            if match:
                content = match.group(1)
                return float(content) if '.' in content else int(content), content, 'bracket_digit'
    
    elif method == 'bracket_chinese':
        bracket_patterns = [r'\(([零一二三四五六七八九十百千\.．]+)\)', r'（([零一二三四五六七八九十百千\.．]+)\）', 
                          r'\[([零一二三四五六七八九十百千\.．]+)\]', r'【([零一二三四五六七八九十百千\.．]+)\】', 
                          r'\{([零一二三四五六七八九十百千\.．]+)\}', r'｛([零一二三四五六七八九十百千\.．]+)\｝']
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
                          r'\{([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\}', r'｛([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)\｝']
        for pattern in bracket_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                content = match.group(1)
                num = convert_roman_to_arabic(content)
                if num is not None:
                    return num, content, 'bracket_roman'
    
    elif method == 'bracket_fullwidth':
        bracket_patterns = [r'\(([０-９．]+)\)', r'（([０-９．]+)\）', r'\[([０-９．]+)\]', 
                          r'【([０-９．]+)\】', r'\{([０-９．]+)\}', r'｛([０-９．]+)\｝']
        for pattern in bracket_patterns:
            match = re.search(pattern, text)
            if match:
                content = match.group(1)
                halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
                if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
                    return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'bracket_fullwidth'
    
    elif method == 'bracket_circled':
        bracket_patterns = [r'\((.*?)\)', r'（(.*?)\）', r'\[(.*?)\]', r'【(.*?)\】', r'\{(.*?)\}', r'｛(.*?)\｝']
        for pattern in bracket_patterns:
            match = re.search(pattern, text)
            if match:
                content = match.group(1).strip()
                for circled, num in CIRCLED_NUMBERS.items():
                    if circled == content:
                        return num, content, 'bracket_circled'
    
    # 空格+数字+空格
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
    
    # 数字结尾
    elif method == 'end_digit':
        match = re.search(r'(\d+(\.\d+)?)$', text)
        if match:
            content = match.group(1)
            return float(content) if '.' in content else int(content), content, 'end_digit'
    
    elif method == 'end_chinese':
        match = re.search(r'([零一二三四五六七八九十百千\.．]+)$', text)
        if match:
            content = match.group(1)
            num = convert_chinese_to_arabic(content)
            if num is not None:
                return num, content, 'end_chinese'
    
    elif method == 'end_roman':
        match = re.search(r'([IVXLCDMⅠⅤⅩⅬⅭⅮⅯ\.]+)$', text, re.IGNORECASE)
        if match:
            content = match.group(1)
            num = convert_roman_to_arabic(content)
            if num is not None:
                return num, content, 'end_roman'
    
    elif method == 'end_fullwidth':
        match = re.search(r'([０-９．]+)$', text)
        if match:
            content = match.group(1)
            halfwidth = fullwidth_to_halfwidth(content).replace('．', '.')
            if re.fullmatch(r'\d+(\.\d+)?', halfwidth):
                return float(halfwidth) if '.' in halfwidth else int(halfwidth), content, 'end_fullwidth'
    
    elif method == 'end_circled':
        for circled, num in CIRCLED_NUMBERS.items():
            if text.endswith(circled):
                return num, circled, 'end_circled'
    
    # 其他类型
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
    """检查数字序列是否有效（非严格递增），支持小数"""
    if len(numbers) <= 1:
        return True
    return all(numbers[i] <= numbers[i+1] for i in range(len(numbers)-1))

def has_multiple_continuous_groups(numbers):
    """
    检查数字序列是否包含至少两组连续数字，且每组都从1开始
    支持小数
    """
    if len(numbers) < 4:  # 至少需要4个数字才可能形成两组有效序列
        return False
    
    groups = []
    current_group = []
    
    for num in numbers:
        if not current_group:
            # 新组必须从1开始（支持1.0等小数形式）
            if num == 1 or num == 1.0:
                current_group.append(num)
        else:
            # 检查是否连续（支持小数）
            if num == current_group[-1] + 1 or (isinstance(num, float) and num == current_group[-1] + 1.0):
                current_group.append(num)
            else:
                # 结束当前组并开始新组（新组必须从1开始）
                if current_group and len(current_group) >= 1:
                    groups.append(current_group)
                    current_group = []
                if num == 1 or num == 1.0:
                    current_group.append(num)
    
    # 添加最后一个组
    if current_group and len(current_group) >= 1:
        groups.append(current_group)
    
    # 至少有两组，且每组都从1开始
    return len(groups) >= 2

def check_single_volume_order(main_subjects, all_subjects, relations, single_volume_relation_type):
    """检查单行本排序是否正确"""
    problematic_series = []
    
    print("\n开始检查单行本排序...")
    for main_id in tqdm(main_subjects, desc="检查进度"):
        main_subject = all_subjects.get(main_id)
        if not main_subject:
            continue
            
        main_name = main_subject.get('name', f"ID:{main_id}")
        main_normalized = main_subject.get('normalized_name', '')
        modify_url = f"https://bgm.tv/subject/{main_id}/add_related/subject/book"
        
        # 获取该主条目的所有单行本关联
        related_items = [item for item in relations.get(main_id, []) 
                        if item['relation_type'] == single_volume_relation_type]
        
        if not related_items:
            continue
        
        # 筛选出包含主条目标题的单行本
        filtered_items = []
        for item in related_items:
            related_subject = all_subjects.get(item['related_id'])
            if not related_subject:
                continue
                
            # 检查单行本标题是否包含主条目标题
            related_name = related_subject.get('name', '')
            related_normalized = normalize_text(related_name)
            
            if main_normalized and main_normalized in related_normalized:
                filtered_items.append(item)
        
        # 如果没有符合条件的单行本，跳过
        if len(filtered_items) < 2:
            continue
        
        # 按照order排序，order相同则按related_id排序
        sorted_items = sorted(filtered_items, key=lambda x: (x['order'], x['related_id']))
        
        # 第一次提取：获取所有单行本的数字和提取方法
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
        
        # 统计最常用的提取方法
        methods = [item['method'] for item in first_pass_results if item['method'] is not None]
        if not methods:  # 没有可用的提取方法
            continue
            
        most_common_method = Counter(methods).most_common(1)[0][0]
        method_count = Counter(methods)[most_common_method]
        
        # 第二次提取：使用最常用的方法重新提取所有单行本
        second_pass_results = []
        for item in first_pass_results:
            # 如果已经是最常用方法且提取成功，直接保留
            if item['method'] == most_common_method and item['num'] is not None:
                second_pass_results.append(item)
                continue
                
            # 否则使用最常用方法重新提取
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
                # 暂时保留提取失败的项目，后续可能通过共同前缀处理
                second_pass_results.append({
                    'related_id': item['related_id'],
                    'name': item['name'],
                    'num': None,
                    'original_num': None,
                    'method': None,
                    'order': item['order']
                })
        
        # 提取所有标题，用于查找共同前缀
        all_titles = [item['name'] for item in second_pass_results]
        common_prefix = get_common_prefix(all_titles)
        
        # 处理提取失败但符合共同前缀规则的单行本
        final_results = []
        for item in second_pass_results:
            if item['num'] is not None:
                final_results.append(item)
                continue
                
            # 检查是否符合共同前缀规则
            if common_prefix:
                # 分割标题并比较第一个部分
                title_parts = item['name'].split(' ', 1)
                first_part = title_parts[0].strip() if title_parts else ''
                
                if first_part == common_prefix:
                    # 将数字算作1
                    final_results.append({
                        'related_id': item['related_id'],
                        'name': item['name'],
                        'num': 1,
                        'original_num': '1（共同前缀推断）',
                        'method': 'inferred_from_prefix',
                        'order': item['order']
                    })
        
        # 过滤后至少需要2个有效单行本
        if len(final_results) < 2:
            continue
        
        # 准备最终结果数据
        volume_numbers = [item['num'] for item in final_results]
        volume_titles = [item['name'] for item in final_results]
        
        # 检查是否包含多组从1开始的连续数字（如果是则跳过）
        if has_multiple_continuous_groups(volume_numbers):
            continue
        
        # 检查数字是否按从小到大排序
        if not is_valid_number_sequence(volume_numbers):           
            problematic_series.append({
                'main_id': main_id,
                'main_name': main_name,
                'volume_titles': volume_titles,
                'most_common_method': EXTRACTION_METHODS.get(most_common_method, most_common_method),
                'method_count': method_count,
                'total_volumes': len(final_results),
                'common_prefix': common_prefix,
                'modify_url': modify_url
            })
    
    return problematic_series

def main():
    # 配置路径
    default_archive = "bangumi_archive"
    archive_dir = input(f"请输入数据文件夹路径（默认: {default_archive}）: ").strip() or default_archive
    
    subjects_file = os.path.join(archive_dir, "subject.jsonlines")
    relations_file = os.path.join(archive_dir, "subject-relations.jsonlines")
    
    # 加载所有条目数据
    all_subjects = load_subjects(subjects_file)
    if not all_subjects:
        return
    
    # 筛选出 series: true 且 type: 1 的主条目
    main_subjects = [
        sid for sid, subject in all_subjects.items()
        if subject.get('series', False) and subject.get('type') == 1
    ]
    
    print(f"找到 {len(main_subjects)} 个符合条件的主条目 (series: true, type: 1)")
    
    if not main_subjects:
        print("没有找到符合条件的主条目，程序退出")
        return
    
    # 加载关系数据
    relations = load_relations(relations_file)
    if not relations:
        return
    
    # 单行本的关系类型（根据定义是1003）
    single_volume_relation_type = 1003
    
    # 检查排序
    problematic_series = check_single_volume_order(
        main_subjects, all_subjects, relations, single_volume_relation_type
    )
    
    # 简化命令行输出
    print("\n===== 检查结果 =====")
    if not problematic_series:
        print("所有符合条件的主条目的单行本均按正确顺序排列")
    else:
        print(f"发现 {len(problematic_series)} 个排序异常的主条目，详情已保存至文件")
    
    # 保存结果到文件
    output_file = "problematic_series.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(problematic_series, f, ensure_ascii=False, indent=2)
    
    print(f"结果已保存至 {output_file}")

if __name__ == "__main__":
    main()
