import json
import os
import re
import csv
from tqdm import tqdm
from collections import defaultdict

# 关系类型定义（仅包含ID和中文名）
# 来源：https://github.com/bangumi/server/blob/7f04de44248033060610e7afe34c634d19afb7d6/pkg/vars/relations.go.json

# 动画（anime）关系类型
ANIME_RELATIONS = {
    1: "改编",
    2: "前传",
    3: "续集",
    4: "总集篇",
    5: "全集",
    6: "番外篇",
    7: "角色出演",
    8: "相同世界观",
    9: "不同世界观",
    10: "不同演绎",
    11: "衍生",
    12: "主线故事",
    14: "联动",
    99: "其他",
}

# 书籍（book）关系类型
BOOK_RELATIONS = {
    1: "改编",
    1002: "系列",
    1003: "单行本",
    1004: "画集",
    1005: "前传",
    1006: "续集",
    1007: "番外篇",
    1008: "主线故事",
    1010: "不同版本",
    1011: "角色出演",
    1012: "相同世界观",
    1013: "不同世界观",
    1014: "联动",
    1015: "不同演绎",
    1099: "其他",
}

# 音乐（music）关系类型
MUSIC_RELATIONS = {
    3001: "原声集",
    3002: "角色歌",
    3003: "片头曲",
    3004: "片尾曲",
    3005: "插入歌",
    3006: "印象曲",
    3007: "广播剧",
    3099: "其他",
}

# 游戏（game）关系类型
GAME_RELATIONS = {
    1: "改编",
    4002: "前传",
    4003: "续集",
    4006: "外传",
    4007: "角色出演",
    4008: "相同世界观",
    4009: "不同世界观",
    4010: "不同演绎",
    4012: "主线故事",
    4014: "联动",
    4015: "扩展包",
    4016: "不同版本",
    4017: "主版本",
    4018: "合集",
    4019: "收录作品",
    4099: "其他",
}

# 现实（real）关系类型
REAL_RELATIONS = {
    1: "改编",
    2: "前传",
    3: "续集",
    4: "总集篇",
    5: "全集",
    6: "番外篇",
    7: "角色出演",
    8: "相同世界观",
    9: "不同世界观",
    10: "不同演绎",
    11: "衍生",
    12: "主线故事",
    14: "联动",
    99: "其他",
}

# 整合所有关系类型，建立中文名称到数字的映射
cn_to_relation_id = {}
for rel_dict in [ANIME_RELATIONS, BOOK_RELATIONS, MUSIC_RELATIONS, GAME_RELATIONS, REAL_RELATIONS]:
    for rel_id, rel_cn in rel_dict.items():
        if rel_cn not in cn_to_relation_id:
            cn_to_relation_id[rel_cn] = rel_id


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
    """提取字段值"""
    if field_name in data:
        value = data[field_name]
        if isinstance(value, bool):
            return "true" if value else "false"
        return str(value)
    
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
        if not value or value in ('{', '}'):
            return ""
        return value
    
    return ""


def matches_condition(value, condition):
    """检查条件匹配"""
    if not condition:
        return True
    if condition.startswith('re:'):
        regex_pattern = condition[3:]
        try:
            return re.search(regex_pattern, value) is not None
        except re.error:
            print(f"警告：正则表达式 '{regex_pattern}' 无效，将视为普通文本匹配")
            return condition in value
    return condition in value


def get_user_filters():
    """获取用户筛选条件"""
    filters = []
    relation_filters = []  # 格式：(rel_id, related_conditions, negate)
    tag_filters = []
    i = 1

    print("请添加筛选条件（输入空行结束添加）")
    print("格式说明：")
    print("- 普通字段：字段名:条件（例如：出版社:角川、发售日:re:\\d{4}、id:12345）")
    print("- 关系筛选（无关联条件）：中文关系名:（例如：单行本:）")
    print("- 关系筛选（单个条件）：中文关系名:字段名:条件（例如：单行本:发售日:re:\\d{4}）")
    print("- 关系筛选（多个条件）：relation:中文关系名（回车后输入条件，空行结束）")
    print("- 标签筛选：tag:标签名 或 tag:!标签名（例如：tag:轻小说、tag:!动画）")

    while True:
        print(f"\n条件 {i} (输入空行结束)：")
        condition_str = input("请输入筛选条件: ").strip()

        if not condition_str:
            if i == 1:
                print("未添加任何筛选条件")
            else:
                print(f"已完成筛选条件添加，共设置 {i-1} 个条件")
            break

        # 先处理特殊前缀（relation: 或 tag:）
        if condition_str.startswith(('relation:', 'tag:')):
            key_part, value_part = [p.strip() for p in condition_str.split(':', 1)]

            # 处理relation:中文关系名
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

            # 处理标签筛选
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

        # 检查是否是关系筛选格式（中文关系名: 或 中文关系名:字段:条件）
        parts = condition_str.split(':', 2)
        rel_cn_candidate = parts[0].strip()
        is_relation = rel_cn_candidate in cn_to_relation_id
        
        if is_relation:
            # 情况1：中文关系名:（无关联条件）
            if len(parts) == 1 or (len(parts) >= 2 and not parts[1].strip()):
                rel_id = cn_to_relation_id.get(rel_cn_candidate)
                relation_filters.append((rel_id, [], False))
                i += 1
                continue
            # 情况2：中文关系名:字段:条件（单个条件）
            if len(parts) == 3:
                field, cond = [p.strip() for p in parts[1:]]
                rel_id = cn_to_relation_id.get(rel_cn_candidate)
                relation_filters.append((rel_id, [(field, cond)], False))
                i += 1
                continue

        # 视为普通字段筛选
        if ':' not in condition_str:
            print("格式错误：条件需包含冒号（字段名:条件）")
            continue
        key_part, value_part = [p.strip() for p in condition_str.split(':', 1)]
        field_name = key_part
        condition = value_part
        filters.append((field_name, condition))
        i += 1

    return filters, relation_filters, tag_filters


def group_filters_by_field(filters):
    """按字段分组筛选条件"""
    grouped = {}
    for field, condition in filters:
        if field not in grouped:
            grouped[field] = []
        grouped[field].append(condition)
    return grouped


def write_csv_file(output_csv_file, results, grouped_filters, relation_filters, all_subjects):
    """生成CSV文件（先列所有关联条目字段，再列所有关联条目ID）"""
    unique_fields = list(grouped_filters.keys())
    
    # 收集所有需要展示的关联条目字段（如“发售日”）
    related_fields = set()
    for rel_id, related_conditions, _ in relation_filters:
        for field, _ in related_conditions:
            related_fields.add(field)
    related_fields = list(related_fields)  # 转为列表（如['发售日']）

    # 统计每种关系类型的最大关联条目数（用于动态生成表头）
    max_relations = defaultdict(int)
    for result in results:
        for rel_id_str, related_ids in result['relations'].items():
            rel_id = int(rel_id_str)
            current_count = len(related_ids) if isinstance(related_ids, list) else 0
            if current_count > max_relations[rel_id]:
                max_relations[rel_id] = current_count

    # 生成表头
    headers = ['ID', 'URL']
    headers.extend(unique_fields)  # 添加普通字段

    # 构建ID到中文名的映射
    id_to_cn = {}
    for rel_dict in [ANIME_RELATIONS, BOOK_RELATIONS, MUSIC_RELATIONS, GAME_RELATIONS, REAL_RELATIONS]:
        for rel_id, rel_cn in rel_dict.items():
            if rel_id not in id_to_cn:
                id_to_cn[rel_id] = rel_cn

    # ------------------------------
    # 核心修改1：调整表头顺序
    # 先按序号列出所有关联条目的字段（如单行本_1_发售日, 单行本_2_发售日...）
    # 再按序号列出所有关联条目的ID（如单行本_1_ID, 单行本_2_ID...）
    # ------------------------------
    for rel_id, related_conditions, negate in relation_filters:
        rel_cn = id_to_cn.get(rel_id, f"relation_{rel_id}")
        prefix = "no_" if negate else ""
        rel_header_base = f"{prefix}{rel_cn}"
        max_count = max_relations.get(rel_id, 0)
        
        # 第一部分：关联条目的字段（按序号）
        for idx in range(1, max_count + 1):
            for field in related_fields:
                headers.append(f"{rel_header_base}_{idx}_{field}")
        
        # 第二部分：关联条目的ID（按序号）
        for idx in range(1, max_count + 1):
            headers.append(f"{rel_header_base}_{idx}_ID")

    # 写入数据
    with open(output_csv_file, 'w', encoding='utf-8', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)

        for result in results:
            row = [result['id'], result['url']]
            
            # 添加普通字段值
            for field in unique_fields:
                row.append(result['fields'].get(field, ''))
            
            # ------------------------------
            # 核心修改2：调整数据行顺序（与表头对应）
            # 先写所有关联条目的字段值，再写所有关联条目的ID
            # ------------------------------
            for rel_id, related_conditions, negate in relation_filters:
                rel_cn = id_to_cn.get(rel_id, f"relation_{rel_id}")
                prefix = "no_" if negate else ""
                rel_header_base = f"{prefix}{rel_cn}"
                related_ids = result['relations'].get(str(rel_id), [])
                if not isinstance(related_ids, list):
                    related_ids = []
                max_count = max_relations.get(rel_id, 0)
                
                # 第一部分：写入关联条目的字段值（按序号）
                for idx in range(1, max_count + 1):
                    related_id = related_ids[idx - 1] if idx - 1 < len(related_ids) else None
                    for field in related_fields:
                        if related_id and all_subjects and related_id in all_subjects:
                            related_data = all_subjects[related_id]
                            value = extract_field_value(related_data, field)
                            row.append(value)
                        else:
                            row.append("")  # 空值占位
                
                # 第二部分：写入关联条目的ID（按序号）
                for idx in range(1, max_count + 1):
                    related_id = related_ids[idx - 1] if idx - 1 < len(related_ids) else None
                    row.append(related_id if related_id else "")

            writer.writerow(row)


def check_files_overwrite(output_file, output_csv_file):
    """检查文件覆盖"""
    existing_files = []
    if os.path.exists(output_file):
        existing_files.append(output_file)
    if os.path.exists(output_csv_file):
        existing_files.append(output_csv_file)
    
    if existing_files:
        print("\n警告: 以下文件已存在:")
        for file in existing_files:
            print(f"  - {file}")
        
        choice = input("\n是否覆盖这些文件? (y/n): ").strip().lower()
        if choice != 'y':
            print("操作已取消")
            return False
    return True


def check_related_subject(subject_data, relations_data, related_subject_id, related_conditions):
    """检查关联条目条件"""
    if not related_conditions:
        return True

    related_data = relations_data.get(str(related_subject_id))
    if not related_data:
        return False
    
    for field, condition in related_conditions:
        value = extract_field_value(related_data, field)
        if not matches_condition(value, condition):
            return False
    return True


def needs_full_load(relation_filters):
    """检查是否需要预加载数据"""
    for rel_id, related_conditions, negate in relation_filters:
        if not negate and related_conditions:
            return True
    return False


def check_tag_conditions(data, tag_filters):
    """检查标签条件"""
    if not tag_filters:
        return True
    
    tags = data.get('tags', [])
    tag_names = [tag['name'] for tag in tags]
    
    for tag_name, negate in tag_filters:
        if negate:
            if tag_name in tag_names:
                return False
        else:
            if tag_name not in tag_names:
                return False
    return True


def main():
    default_archive = "bangumi_archive"
    archive_dir = input(f"请输入bangumi_archive文件夹路径（默认: {default_archive}）: ").strip() or default_archive
    if not os.path.isdir(archive_dir):
        print(f"错误：文件夹 {archive_dir} 不存在或不是有效的目录")
        return

    default_input_file = "subject.jsonlines"
    input_file = input(f"请输入要筛选的JSONLines文件名（默认: {default_archive}/{default_input_file}）: ").strip() or os.path.join(default_archive, default_input_file)
    if not os.path.exists(input_file):
        print(f"错误：文件 {input_file} 不存在")
        return

    filters, relation_filters, tag_filters = get_user_filters()
    if not filters and not relation_filters and not tag_filters:
        print("未设置任何筛选条件，程序退出")
        return

    grouped_filters = group_filters_by_field(filters)
    unique_fields = list(grouped_filters.keys())

    # 显示筛选条件
    print("\n===== 筛选条件 =====")
    # 普通字段
    for i, field in enumerate(unique_fields, 1):
        conditions = grouped_filters[field]
        print(f"{i}. 字段: {field}")
        for j, condition in enumerate(conditions, 1):
            cond_type = "正则匹配" if condition.startswith('re:') else "文本包含"
            cond_display = condition[3:] if condition.startswith('re:') else condition
            print(f"   条件 {j}: ({cond_type}) {cond_display}")
    # 关系条件
    id_to_cn = {}
    for rel_dict in [ANIME_RELATIONS, BOOK_RELATIONS, MUSIC_RELATIONS, GAME_RELATIONS, REAL_RELATIONS]:
        for rel_id, rel_cn in rel_dict.items():
            if rel_id not in id_to_cn:
                id_to_cn[rel_id] = rel_cn

    rel_start = len(unique_fields) + 1
    for i, (rel_id, related_conditions, negate) in enumerate(relation_filters, rel_start):
        rel_cn = id_to_cn.get(rel_id, f"relation_{rel_id}")
        print(f"{i}. 关系类型: {'不包含' if negate else '包含'} {rel_cn}（ID: {rel_id}）")
        if related_conditions:
            print("   关联条目条件:")
            for j, (field, condition) in enumerate(related_conditions, 1):
                cond_type = "正则匹配" if condition.startswith('re:') else "文本包含"
                cond_display = condition[3:] if condition.startswith('re:') else condition
                print(f"     条件 {j}: 字段 '{field}' ({cond_type}) {cond_display}")
    # 标签条件
    tag_start = rel_start + len(relation_filters)
    for i, (tag_name, negate) in enumerate(tag_filters, tag_start):
        print(f"{i}. TAG: {'不包含' if negate else '包含'} '{tag_name}'")
    print("====================\n")

    # 输出文件设置
    default_output = "filtered_results"
    output_name = input(f"请输入结果输出文件名（默认: {default_output}）: ").strip() or default_output
    output_file = f"{output_name}.jsonlines"
    output_csv_file = f"{output_name}.csv"
    if not check_files_overwrite(output_file, output_csv_file):
        return

    # 加载关系数据
    relations_data = load_relations(archive_dir)
    if relation_filters and relations_data is None:
        print("错误：需要筛选关系但未找到 subject-relations.jsonlines 文件（应在bangumi_archive文件夹下）")
        return

    # 预加载subject数据（如需）
    need_full_load_flag = needs_full_load(relation_filters)
    all_subjects = {}
    original_subject_file = os.path.join(archive_dir, "subject.jsonlines")
    if need_full_load_flag:
        if not os.path.exists(original_subject_file):
            print(f"错误：需要预加载subject数据，但未找到 {original_subject_file}")
            return
            
        print("\n正在预加载原始subject数据...")
        with open(original_subject_file, 'r', encoding='utf-8') as f:
            total_lines = sum(1 for _ in f)
        
        with open(original_subject_file, 'r', encoding='utf-8') as f:
            for line in tqdm(f, total=total_lines, desc="加载进度"):
                try:
                    data = json.loads(line.strip())
                    subject_id = data.get('id')
                    if subject_id:
                        all_subjects[str(subject_id)] = data
                except json.JSONDecodeError:
                    continue

    # 处理筛选
    results = []
    matched_count = 0
    print(f"\n开始处理 {input_file} ...")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        total_lines = sum(1 for _ in f)
    
    with open(output_file, 'w', encoding='utf-8') as out_f, \
         open(input_file, 'r', encoding='utf-8') as in_f:
        
        for line in tqdm(in_f, total=total_lines, desc="处理进度"):
            try:
                data = json.loads(line.strip())
                subject_id = str(data.get('id'))
                if not subject_id:
                    continue

                # 检查标签条件
                if not check_tag_conditions(data, tag_filters):
                    continue

                # 检查普通字段条件
                field_values = {}
                all_matched = True

                for field in unique_fields:
                    value = extract_field_value(data, field)
                    field_values[field] = value

                    field_conditions = grouped_filters[field]
                    field_matched = True

                    for condition in field_conditions:
                        if not matches_condition(value, condition):
                            field_matched = False
                            break
       
                    if not field_matched:
                        all_matched = False
                        break

                if not all_matched:
                    continue

                # 检查关系条件
                relation_values = {}
                if relation_filters:
                    subject_relations = relations_data.get(int(subject_id), []) if relations_data else []
                    
                    for rel_id, related_conditions, negate in relation_filters:
                        matched = False
                        related_ids = []
                        
                        for rel in subject_relations:
                            if rel['relation_type'] == rel_id:
                                if not negate:
                                    if need_full_load_flag:
                                        if check_related_subject(data, all_subjects, rel['related_subject_id'], related_conditions):
                                            related_ids.append(str(rel['related_subject_id']))
                                            matched = True
                                    else:
                                        related_ids.append(str(rel['related_subject_id']))
                                        matched = True
                                elif negate:
                                    matched = True
                                    break
                        
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

                if all_matched:
                    url = f"https://bgm.tv/subject/{subject_id}"
                    
                    out_f.write(json.dumps(data, ensure_ascii=False) + "\n")
                    
                    results.append({
                        'id': subject_id,
                        'url': url,
                        'fields': field_values,
                        'relations': relation_values
                    })
                    matched_count += 1

            except Exception as e:
                print(f"\n处理条目时出错: {str(e)}")
                continue

    # 生成CSV
    if results:
        print("\n正在生成CSV文件...")
        write_csv_file(output_csv_file, results, grouped_filters, relation_filters, all_subjects)

    print(f"\n处理完成，共找到 {matched_count} 个符合条件的条目")
    print(f"原始数据已保存至 {output_file}")
    print(f"表格数据已保存至 {output_csv_file}")


if __name__ == "__main__":
    main()
