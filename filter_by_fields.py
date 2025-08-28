import json
import os
import regex as re
import csv
from tqdm import tqdm
from collections import defaultdict
from datetime import datetime

# 关系类型定义（仅包含ID和中文名）
ANIME_RELATIONS = {
    1: "改编", 2: "前传", 3: "续集", 4: "总集篇", 5: "全集", 6: "番外篇", 7: "角色出演",
    8: "相同世界观", 9: "不同世界观", 10: "不同演绎", 11: "衍生", 12: "主线故事", 14: "联动", 99: "其他",
}
BOOK_RELATIONS = {
    1: "改编", 1002: "系列", 1003: "单行本", 1004: "画集", 1005: "前传", 1006: "续集",
    1007: "番外篇", 1008: "主线故事", 1010: "不同版本", 1011: "角色出演", 1012: "相同世界观",
    1013: "不同世界观", 1014: "联动", 1015: "不同演绎", 1099: "其他",
}
MUSIC_RELATIONS = {3001: "原声集", 3002: "角色歌", 3003: "片头曲", 3004: "片尾曲", 3005: "插入歌", 3006: "印象曲", 3007: "广播剧", 3099: "其他"}
GAME_RELATIONS = {
    1: "改编", 4002: "前传", 4003: "续集", 4006: "外传", 4007: "角色出演", 4008: "相同世界观",
    4009: "不同世界观", 4010: "不同演绎", 4012: "主线故事", 4014: "联动", 4015: "扩展包",
    4016: "不同版本", 4017: "主版本", 4018: "合集", 4019: "收录作品", 4099: "其他",
}
REAL_RELATIONS = {
    1: "改编", 2: "前传", 3: "续集", 4: "总集篇", 5: "全集", 6: "番外篇", 7: "角色出演",
    8: "相同世界观", 9: "不同世界观", 10: "不同演绎", 11: "衍生", 12: "主线故事", 14: "联动", 99: "其他",
}

# 整合所有关系类型，建立中文名称到数字的映射
cn_to_relation_id = {}
for rel_dict in [ANIME_RELATIONS, BOOK_RELATIONS, MUSIC_RELATIONS, GAME_RELATIONS, REAL_RELATIONS]:
    for rel_id, rel_cn in rel_dict.items():
        if rel_cn not in cn_to_relation_id:
            cn_to_relation_id[rel_cn] = rel_id


def parse_number(value):
    """从字符串中提取数字"""
    if not value:
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        pass
    match = re.search(r'^\d+', str(value))
    if match:
        return float(match.group())
    return None


def parse_date(value):
    """解析日期，支持YYYY-MM-DD和X年X月X日格式"""
    if not value:
        return None
    value = str(value).strip()
    # 尝试YYYY-MM-DD
    try:
        return datetime.strptime(value, '%Y-%m-%d')
    except ValueError:
        pass
    # 尝试X年X月X日
    date_pattern = re.compile(r'^(\d+)年(\d+)月(\d+)日$')
    match = date_pattern.match(value)
    if match:
        try:
            year, month, day = map(int, match.groups())
            return datetime(year, month, day)
        except ValueError:
            pass
    # 尝试年月/年
    year_month_pattern = re.compile(r'^(\d+)年(\d+)月$')
    year_pattern = re.compile(r'^(\d+)年$')
    match = year_month_pattern.match(value)
    if match:
        try:
            year, month = map(int, match.groups())
            return datetime(year, month, 1)
        except ValueError:
            pass
    match = year_pattern.match(value)
    if match:
        try:
            year = int(match.group(1))
            return datetime(year, 1, 1)
        except ValueError:
            pass
    return None


def load_relations(archive_dir):
    """加载关系数据"""
    relations_file = os.path.join(archive_dir, "subject-relations.jsonlines")
    if not os.path.exists(relations_file):
        return None
    relations = defaultdict(list)
    with open(relations_file, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line.strip())
                subject_id = data['subject_id']
                relations[subject_id].append(data)
            except (json.JSONDecodeError, KeyError):
                continue
    return relations


def extract_field_value(data, field_name):
    """提取字段值（支持infobox和直接字段）"""
    if field_name in data:
        value = data[field_name]
        if isinstance(value, bool):
            return "true" if value else "false"
        return str(value).strip()
    infobox = data.get('infobox', '')
    if not infobox:
        return ""
    pattern = re.compile(
        fr'\|{re.escape(field_name)}\s*[:=]\s*(.*?)(?:\s*\||\s*}}|\s*{{|\s*$|\r\n|\n)',
        re.IGNORECASE
    )
    match = pattern.search(infobox)
    if match:
        value = match.group(1).strip()
        return value if value not in ('{', '}') else ""
    return ""


def get_relation_count(subject_id, rel_cn, relations_data, cn_to_relation_id):
    """统计指定条目的指定关系数量（支持中文关系名）"""
    rel_id = cn_to_relation_id.get(rel_cn)
    if rel_id is None:
        print(f"警告：关系名'{rel_cn}'不存在，统计数量为0")
        return 0
    subject_rels = relations_data.get(subject_id, [])
    count = 0
    for rel in subject_rels:
        if rel.get('relation_type') == rel_id:
            count += 1
    return count


def matches_condition(value, condition, data=None, relations_data=None, count_results=None):
    """检查条件匹配，同时记录count统计结果（用于CSV显示）"""
    if not condition:
        return True

    # 处理{{count:中文关系名}}，记录统计结果到count_results
    count_pattern = re.compile(r'\{\{count:\s*([^}]+?)\s*\}\}')
    count_match = count_pattern.search(condition)
    if count_match and relations_data and data and count_results is not None:
        rel_cn = count_match.group(1).strip()
        subject_id = int(data.get('id', 0))
        if subject_id == 0:
            print("警告：当前条目无ID，无法统计关系数量")
            rel_count = 0
        else:
            rel_count = get_relation_count(subject_id, rel_cn, relations_data, cn_to_relation_id)
        # 记录count结果（键：count_关系名，值：统计数量）
        count_key = f"count_{rel_cn}"
        count_results[count_key] = rel_count
        # 替换条件中的{{count}}为实际数量
        condition = count_pattern.sub(str(rel_count), condition)

    # 处理自身字段引用
    self_ref_pattern = re.compile(r'^\{\{\s*(\w+)\s*\}\}$')
    self_ref_match = self_ref_pattern.match(condition)
    if self_ref_match and data is not None:
        ref_field = self_ref_match.group(1)
        ref_value = extract_field_value(data, ref_field)
        return value == ref_value

    # 处理比较运算符
    if condition.startswith(('大于:', '小于:', '早于:', '晚于:')):
        op, target = condition.split(':', 1)
        target = target.strip()
        if op in ['大于', '小于']:
            value_num = parse_number(value)
            target_num = parse_number(target)
            if value_num is None or target_num is None:
                return False
            return value_num > target_num if op == '大于' else value_num < target_num
        else:
            value_date = parse_date(value)
            target_date = parse_date(target)
            if value_date is None or target_date is None:
                return False
            return value_date > target_date if op == '晚于' else value_date < target_date

    # 正则/文本匹配
    if condition.startswith('re:'):
        regex_pattern = condition[3:]
        try:
            return re.search(regex_pattern, value) is not None
        except re.error:
            print(f"警告：正则表达式 '{regex_pattern}' 无效，视为普通文本匹配")
            return condition in value
    return condition in value


def check_related_subject(related_data, original_data, related_conditions):
    """检查关联条目条件"""
    if not related_conditions or not related_data:
        return True
    for field, condition in related_conditions:
        related_value = extract_field_value(related_data, field)
        original_ref_pattern = re.compile(r'^\{\{\{\s*(\w+)\s*\}\}\}$')
        original_ref_match = original_ref_pattern.match(condition)
        if original_ref_match and original_data is not None:
            ref_field = original_ref_match.group(1)
            ref_value = extract_field_value(original_data, ref_field)
            if related_value != ref_value:
                return False
            continue
        if not matches_condition(related_value, condition, related_data):
            return False
    return True


def get_user_filters():
    """获取用户筛选条件"""
    filters = []
    relation_filters = []
    tag_filters = []
    i = 1
    print("请添加筛选条件（输入空行结束添加）")
    print("格式说明：")
    print("- 普通字段：字段名:条件（例：出版社:角川、发售日:re:\\d{4}）")
    print("- 数字比较：字段名:大于:值 或 字段名:小于:值（例：评分:大于:8、集数:小于:13）")
    print("- 日期比较：字段名:早于:日期 或 字段名:晚于:日期（例：发售日:晚于:2023-01-01）")
    print("- 字段引用自身：字段名:{{目标字段名}}（例：开始:{{发售日}}）")
    print("- 关系数量统计：字段名:比较符:{{count:中文关系名}}（例：册数:小于:{{count:单行本}}）")
    print("- 关系筛选（单个条件）：中文关系名:字段名:条件（例：单行本:发售日:re:\\d{4}）")
    print("- 关系筛选（多个条件）：relation:中文关系名（回车后输入条件，空行结束)")
    print("- 关系筛选（不含该关系）：relation:!中文关系名")
    print("- 标签筛选：tag:标签名 或 tag:!标签名（例：tag:轻小说、tag:!动画）")

    while True:
        condition_str = input(f"\n条件 {i} (输入空行结束)：").strip()
        if not condition_str:
            if i == 1:
                print("未添加任何筛选条件")
            else:
                print(f"已完成筛选条件添加，共设置 {i-1} 个条件")
            break

        if condition_str.startswith(('relation:', 'tag:')):
            key_part, value_part = [p.strip() for p in condition_str.split(':', 1)]
            if key_part == 'relation':
                negate = False
                rel_cn = value_part
                if rel_cn.startswith('!'):
                    negate = True
                    rel_cn = rel_cn[1:].strip()
                rel_id = cn_to_relation_id.get(rel_cn)
                if rel_id is None:
                    print(f"错误：未找到关系名称 '{rel_cn}'")
                    continue
                print(f"设置'{rel_cn}'的关联条件（格式：字段名:条件，空行结束）:")
                related_conditions = []
                while True:
                    related_cond = input("关联条件: ").strip()
                    if not related_cond:
                        break
                    if ':' not in related_cond:
                        print("格式错误：关联条件需包含冒号（字段名:条件），跳过")
                        continue
                    field, cond = [p.strip() for p in related_cond.split(':', 1)]
                    related_conditions.append((field, cond))
                relation_filters.append((rel_id, related_conditions, negate))
                i += 1
                continue
            if key_part == 'tag':
                tag_part = value_part
                negate = False
                if tag_part.startswith('!'):
                    negate = True
                    tag_name = tag_part[1:].strip()
                else:
                    tag_name = tag_part.strip()
                if not tag_name:
                    print("错误：TAG名称不能为空")
                    continue
                tag_filters.append((tag_name, negate))
                i += 1
                continue

        # 处理关系筛选（中文关系名:字段:条件）
        parts = condition_str.split(':', 2)
        rel_cn_candidate = parts[0].strip()
        if rel_cn_candidate in cn_to_relation_id:
            rel_id = cn_to_relation_id[rel_cn_candidate]
            if len(parts) == 1 or (len(parts) >= 2 and not parts[1].strip()):
                relation_filters.append((rel_id, [], False))
                i += 1
                continue
            if len(parts) == 3:
                field, cond = [p.strip() for p in parts[1:]]
                relation_filters.append((rel_id, [(field, cond)], False))
                i += 1
                continue

        # 处理普通字段筛选
        if ':' not in condition_str:
            print("格式错误：条件需包含冒号（字段名:条件）")
            continue
        key_part, value_part = [p.strip() for p in condition_str.split(':', 1)]
        filters.append((key_part, value_part))
        i += 1

    return filters, relation_filters, tag_filters


def group_filters_by_field(filters):
    """按字段分组筛选条件"""
    grouped = defaultdict(list)
    for field, condition in filters:
        grouped[field].append(condition)
    return dict(grouped)


def collect_count_fields(filters):
    """从筛选条件中提取所有count字段（用于CSV表头）"""
    count_fields = set()
    count_pattern = re.compile(r'\{\{count:\s*([^}]+?)\s*\}\}')
    for field, cond in filters:
        match = count_pattern.search(cond)
        if match:
            rel_cn = match.group(1).strip()
            count_field = f"count_{rel_cn}"  # 列名格式：count_关系名（如count_单行本）
            count_fields.add(count_field)
    return sorted(count_fields)  # 排序保证表头顺序固定


def write_csv_file(output_csv_file, results, grouped_filters, relation_filters, all_subjects, count_fields):
    """生成CSV文件（新增count字段列）"""
    unique_fields = list(grouped_filters.keys())
    related_fields = set()
    for rel_id, related_conditions, _ in relation_filters:
        for field, _ in related_conditions:
            related_fields.add(field)
    related_fields = list(related_fields)

    # 统计每种关系的最大关联条目数
    max_relations = defaultdict(int)
    for result in results:
        for rel_id_str, related_ids in result['relations'].items():
            rel_id = int(rel_id_str)
            max_relations[rel_id] = max(max_relations[rel_id], len(related_ids) if isinstance(related_ids, list) else 0)

    # 构建表头：ID → URL → 普通字段 → count字段 → 关联字段 → 关联ID
    headers = ['ID', 'URL'] + unique_fields
    if count_fields:  # 新增count字段列
        headers.extend(count_fields)
    id_to_cn = {v: k for k, v in cn_to_relation_id.items()}
    for rel_id, related_conditions, negate in relation_filters:
        rel_cn = id_to_cn.get(rel_id, f"relation_{rel_id}")
        prefix = "no_" if negate else ""
        rel_base = f"{prefix}{rel_cn}"
        max_cnt = max_relations[rel_id]
        # 关联字段列
        for idx in range(1, max_cnt + 1):
            for field in related_fields:
                headers.append(f"{rel_base}_{idx}_{field}")
        # 关联ID列
        for idx in range(1, max_cnt + 1):
            headers.append(f"{rel_base}_{idx}_ID")

    # 写入CSV行数据
    with open(output_csv_file, 'w', encoding='utf-8-sig', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        for result in results:
            row = [result['id'], result['url']]
            # 普通字段值
            for field in unique_fields:
                row.append(result['fields'].get(field, ''))
            # 新增：count字段值（从result['counts']中获取）
            if count_fields:
                for count_field in count_fields:
                    row.append(result['counts'].get(count_field, 0))  # 无数据时填0
            # 关联字段值 + 关联ID
            for rel_id, related_conditions, negate in relation_filters:
                rel_cn = id_to_cn.get(rel_id, f"relation_{rel_id}")
                prefix = "no_" if negate else ""
                rel_base = f"{prefix}{rel_cn}"
                related_ids = result['relations'].get(str(rel_id), [])
                max_cnt = max_relations[rel_id]
                # 关联字段值
                for idx in range(1, max_cnt + 1):
                    rid = related_ids[idx-1] if (idx-1) < len(related_ids) else None
                    for field in related_fields:
                        val = extract_field_value(all_subjects[rid], field) if (rid and all_subjects and rid in all_subjects) else ""
                        row.append(val)
                # 关联ID
                for idx in range(1, max_cnt + 1):
                    rid = related_ids[idx-1] if (idx-1) < len(related_ids) else ""
                    row.append(rid)
            writer.writerow(row)


def check_files_overwrite(output_file, output_csv_file):
    """检查文件覆盖"""
    existing = [f for f in [output_file, output_csv_file] if os.path.exists(f)]
    if existing:
        print("\n警告: 以下文件已存在:")
        for f in existing:
            print(f"  - {f}")
        if input("\n是否覆盖? (y/n): ").strip().lower() != 'y':
            print("操作已取消")
            return False
    return True


def needs_full_load(relation_filters):
    """检查是否需要预加载所有subject数据"""
    for rel_id, related_conditions, negate in relation_filters:
        if not negate and related_conditions:
            return True
    return False


def check_tag_conditions(data, tag_filters):
    """检查标签条件"""
    if not tag_filters:
        return True
    tag_names = [tag['name'] for tag in data.get('tags', [])]
    for tag_name, negate in tag_filters:
        if (negate and tag_name in tag_names) or (not negate and tag_name not in tag_names):
            return False
    return True


def main():
    # 输入路径配置
    default_archive = "bangumi_archive"
    archive_dir = input(f"请输入bangumi_archive文件夹路径（默认: {default_archive}）: ").strip() or default_archive
    if not os.path.isdir(archive_dir):
        print(f"错误：文件夹 {archive_dir} 不存在")
        return

    default_input = os.path.join(archive_dir, "subject.jsonlines")
    input_file = input(f"请输入要筛选的JSONLines文件名（默认: {default_input}）: ").strip() or default_input
    if not os.path.exists(input_file):
        print(f"错误：文件 {input_file} 不存在")
        return

    # 获取筛选条件
    filters, relation_filters, tag_filters = get_user_filters()
    if not filters and not relation_filters and not tag_filters:
        print("未设置任何筛选条件，程序退出")
        return

    # 显示筛选条件
    grouped_filters = group_filters_by_field(filters)
    unique_fields = list(grouped_filters.keys())
    id_to_cn = {v: k for k, v in cn_to_relation_id.items()}
    print("\n===== 筛选条件 =====")
    # 普通字段条件
    for i, (field, conds) in enumerate(grouped_filters.items(), 1):
        print(f"{i}. 字段: {field}")
        for j, cond in enumerate(conds, 1):
            if cond.startswith('re:'):
                print(f"   条件 {j}: 正则匹配 '{cond[3:]}'")
            elif cond.startswith(('大于:', '小于:', '早于:', '晚于:')):
                op, val = cond.split(':', 1)
                print(f"   条件 {j}: {op} '{val.strip()}'")
            elif re.match(r'^\{\{\s*\w+\s*\}\}$', cond):
                print(f"   条件 {j}: 等于自身字段 '{cond[2:-2].strip()}'")
            elif re.search(r'\{\{count:\s*[^}]+\s*\}\}', cond):
                print(f"   条件 {j}: 关联数量比较 '{cond}'")
            else:
                print(f"   条件 {j}: 包含文本 '{cond}'")
    # 关系条件
    rel_idx = len(unique_fields) + 1
    for i, (rel_id, rel_conds, negate) in enumerate(relation_filters, rel_idx):
        rel_cn = id_to_cn.get(rel_id, f"relation_{rel_id}")
        print(f"{i}. 关系: {'不包含' if negate else '包含'} {rel_cn}（ID: {rel_id}）")
        if rel_conds:
            print("   关联条目条件:")
            for j, (field, cond) in enumerate(rel_conds, 1):
                if cond.startswith('re:'):
                    print(f"     条件 {j}: 字段 '{field}' 正则匹配 '{cond[3:]}'")
                elif cond.startswith(('大于:', '小于:', '早于:', '晚于:')):
                    op, val = cond.split(':', 1)
                    print(f"     条件 {j}: 字段 '{field}' {op} '{val.strip()}'")
                elif re.match(r'^\{\{\{\s*\w+\s*\}\}\}$', cond):
                    print(f"     条件 {j}: 字段 '{field}' 等于原条目字段 '{cond[3:-3].strip()}'")
                elif re.match(r'^\{\{\s*\w+\s*\}\}$', cond):
                    print(f"     条件 {j}: 字段 '{field}' 等于自身字段 '{cond[2:-2].strip()}'")
                else:
                    print(f"     条件 {j}: 字段 '{field}' 包含文本 '{cond}'")
    # 标签条件
    tag_idx = rel_idx + len(relation_filters)
    for i, (tag, negate) in enumerate(tag_filters, tag_idx):
        print(f"{i}. 标签: {'不包含' if negate else '包含'} '{tag}'")
    print("====================\n")

    # 输出文件配置
    default_output = "filtered_results"
    output_name = input(f"请输入结果输出文件名（默认: {default_output}）: ").strip() or default_output
    output_file = f"{output_name}.jsonlines"
    output_csv = f"{output_name}.csv"
    if not check_files_overwrite(output_file, output_csv):
        return

    # 加载关系数据
    relations_data = load_relations(archive_dir)
    has_count_condition = any(
        re.search(r'\{\{count:\s*[^}]+\s*\}\}', cond) 
        for field_conds in grouped_filters.values() 
        for cond in field_conds
    ) if grouped_filters else False
    if (relation_filters or has_count_condition) and not relations_data:
        print("错误：需关系筛选或count统计，但未找到 subject-relations.jsonlines 文件")
        return

    # 预加载控制（手动+自动）
    preload_manual = input("\n是否手动开启所有subject数据预加载？（y/n，默认n，需查看关联条目字段时选y）: ").strip().lower()
    need_preload = needs_full_load(relation_filters) or (preload_manual == 'y')
    all_subjects = {}
    if need_preload:
        original_subject_path = os.path.join(archive_dir, "subject.jsonlines")
        if not os.path.exists(original_subject_path):
            print(f"错误：需预加载数据但未找到 {original_subject_path}")
            return
        print("\n正在预加载所有subject数据...")
        with open(original_subject_path, 'r', encoding='utf-8') as f:
            total = sum(1 for _ in f)
        with open(original_subject_path, 'r', encoding='utf-8') as f:
            for line in tqdm(f, total=total, desc="加载进度"):
                try:
                    data = json.loads(line.strip())
                    sid = str(data.get('id'))
                    if sid:
                        all_subjects[sid] = data
                except json.JSONDecodeError:
                    continue

    # 提取所有count字段（用于CSV表头）
    count_fields = collect_count_fields(filters)

    # 核心筛选逻辑（记录count结果）
    results = []
    matched_cnt = 0
    print(f"\n开始处理 {input_file} ...")
    with open(input_file, 'r', encoding='utf-8') as f:
        total_lines = sum(1 for _ in f)

    with open(output_file, 'w', encoding='utf-8') as out_f, open(input_file, 'r', encoding='utf-8') as in_f:
        for line in tqdm(in_f, total=total_lines, desc="处理进度"):
            try:
                data = json.loads(line.strip())
                sid = str(data.get('id'))
                if not sid:
                    continue

                # 1. 标签检查
                if not check_tag_conditions(data, tag_filters):
                    continue

                # 2. 普通字段检查（记录count结果）
                field_values = {}
                count_results = {}  # 存储当前条目的所有count统计结果
                all_matched = True
                for field in unique_fields:
                    val = extract_field_value(data, field)
                    field_values[field] = val
                    # 传入count_results，记录统计结果
                    for cond in grouped_filters[field]:
                        if not matches_condition(val, cond, data, relations_data, count_results):
                            all_matched = False
                            break
                    if not all_matched:
                        break
                if not all_matched:
                    continue

                # 3. 关系条件检查
                relation_values = {}
                if relation_filters and all_matched:
                    subject_rels = relations_data.get(int(sid), []) if relations_data else []
                    for rel_id, rel_conds, negate in relation_filters:
                        matched = False
                        related_ids = []
                        for rel in subject_rels:
                            if rel['relation_type'] != rel_id:
                                continue
                            if negate:
                                matched = True
                                break
                            related_sid = str(rel['related_subject_id'])
                            related_data = all_subjects.get(related_sid) if all_subjects else None
                            if related_data and check_related_subject(related_data, data, rel_conds):
                                related_ids.append(related_sid)
                                matched = True
                        if negate:
                            if matched:
                                all_matched = False
                                break
                            relation_values[str(rel_id)] = []
                        else:
                            if not matched:
                                all_matched = False
                                break
                            relation_values[str(rel_id)] = related_ids
                if not all_matched:
                    continue

                # 4. 保存结果（新增count_results）
                url = f"https://bgm.tv/subject/{sid}"
                out_f.write(json.dumps(data, ensure_ascii=False) + "\n")
                results.append({
                    'id': sid, 'url': url, 'fields': field_values, 
                    'relations': relation_values, 'counts': count_results  # 新增counts字段
                })
                matched_cnt += 1

            except Exception as e:
                print(f"\n处理条目出错: {str(e)}")
                continue

    # 生成CSV（传入count_fields）
    if results:
        print("\n正在生成CSV文件...")
        write_csv_file(output_csv, results, grouped_filters, relation_filters, all_subjects, count_fields)

    print(f"\n处理完成！共找到 {matched_cnt} 个符合条件的条目")
    print(f"原始数据保存至: {output_file}")
    print(f"表格数据保存至: {output_csv}")


if __name__ == "__main__":
    main()
