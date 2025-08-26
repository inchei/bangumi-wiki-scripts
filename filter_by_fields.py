import json
import os
import re
import csv
from tqdm import tqdm
from collections import defaultdict

# 关系类型定义（仅包含ID和中文名）
# 来源：https://github.com/bangumi/server/blob/7f04de44248033060610e7afe34c634d19afb7d6/pkg/vars/relations.go.json
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

    # 匹配infobox中的字段（如 |发售日: 2023-10-01 |）
    pattern = re.compile(
        fr'\|{re.escape(field_name)}\s*[:=]\s*(.*?)(?:\s*\||\s*}}|\s*{{|\s*$|\r\n|\n)',
        re.IGNORECASE
    )
    match = pattern.search(infobox)
    if match:
        value = match.group(1).strip()
        return value if value not in ('{', '}') else ""
    
    return ""


def matches_condition(value, condition, data=None):
    """检查条件匹配（新增：支持{{自身字段引用}}）
    Args:
        value: 当前字段值
        condition: 筛选条件（可能包含{{字段名}}）
        data: 当前条目完整数据（用于提取引用的字段值）
    """
    if not condition:
        return True

    # 1. 处理自身字段引用：{{目标字段名}}（仅普通筛选和关联条目自身筛选可用）
    self_ref_pattern = re.compile(r'^\{\{\s*(\w+)\s*\}\}$')  # 匹配 {{字段名}}（允许空格）
    self_ref_match = self_ref_pattern.match(condition)
    if self_ref_match and data is not None:
        ref_field = self_ref_match.group(1)  # 提取引用的字段名（如“发售日”）
        ref_value = extract_field_value(data, ref_field)  # 获取引用字段的值
        return value == ref_value  # 比较当前值与引用值是否相等

    # 2. 原有逻辑：正则匹配或文本包含
    if condition.startswith('re:'):
        regex_pattern = condition[3:]
        try:
            return re.search(regex_pattern, value) is not None
        except re.error:
            print(f"警告：正则表达式 '{regex_pattern}' 无效，视为普通文本匹配")
            return condition in value
    return condition in value


def check_related_subject(related_data, original_data, related_conditions):
    """检查关联条目条件（新增：支持{{{原条目字段引用}}}）
    Args:
        related_data: 关联条目的完整数据
        original_data: 原条目的完整数据（用于提取{{{字段名}}}引用）
        related_conditions: 关联筛选条件（如 [("name", "{{{name}}}")]）
    """
    if not related_conditions or not related_data:
        return True

    for field, condition in related_conditions:
        related_value = extract_field_value(related_data, field)  # 关联条目的当前字段值

        # 1. 处理原条目字段引用：{{{原字段名}}}（仅关联筛选可用）
        original_ref_pattern = re.compile(r'^\{\{\{\s*(\w+)\s*\}\}\}$')  # 匹配 {{{字段名}}}
        original_ref_match = original_ref_pattern.match(condition)
        if original_ref_match and original_data is not None:
            ref_field = original_ref_match.group(1)  # 提取原条目字段名（如“name”）
            ref_value = extract_field_value(original_data, ref_field)  # 获取原条目字段值
            if related_value != ref_value:
                return False
            continue

        # 2. 处理关联条目自身字段引用（{{字段名}}）或普通条件
        if not matches_condition(related_value, condition, related_data):
            return False

    return True


def get_user_filters():
    """获取用户筛选条件（更新格式说明，增加字段引用示例）"""
    filters = []
    relation_filters = []  # 格式：(rel_id, related_conditions, negate)
    tag_filters = []
    i = 1

    print("请添加筛选条件（输入空行结束添加）")
    print("格式说明：")
    print("- 普通字段：字段名:条件（例：出版社:角川、发售日:re:\\d{4}）")
    print("- 普通字段引用自身其他字段：字段名:{{目标字段名}}（例：开始:{{发售日}} 筛选开始与发售日相同的条目）")
    print("- 关系筛选（单个条件）：中文关系名:字段名:条件（例：单行本:发售日:re:\\d{4}）")
    print("- 关系筛选引用关联自身字段：中文关系名:字段名:{{关联字段名}}（例：单行本:作者:{{插画师}} 筛选单行本作者与自身插画师相同的条目）")
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

        # 处理 relation: 或 tag: 前缀
        if condition_str.startswith(('relation:', 'tag:')):
            key_part, value_part = [p.strip() for p in condition_str.split(':', 1)]

            # 处理 relation:中文关系名（多条件）
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

            # 处理 tag:标签名
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

        # 处理关系筛选（中文关系名: 或 中文关系名:字段:条件）
        parts = condition_str.split(':', 2)
        rel_cn_candidate = parts[0].strip()
        if rel_cn_candidate in cn_to_relation_id:
            rel_id = cn_to_relation_id[rel_cn_candidate]
            # 情况1：无关联条件（如“单行本:”）
            if len(parts) == 1 or (len(parts) >= 2 and not parts[1].strip()):
                relation_filters.append((rel_id, [], False))
                i += 1
                continue
            # 情况2：单个关联条件（如“单行本:name:{{{name}}}”）
            if len(parts) == 3:
                field, cond = [p.strip() for p in parts[1:]]
                relation_filters.append((rel_id, [(field, cond)], False))
                i += 1
                continue

        # 处理普通字段筛选（含自身引用，如“开始:{{发售日}}”）
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


def write_csv_file(output_csv_file, results, grouped_filters, relation_filters, all_subjects):
    """生成CSV文件（逻辑不变，保持原格式）"""
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

    # 构建表头
    headers = ['ID', 'URL'] + unique_fields
    id_to_cn = {v: k for k, v in cn_to_relation_id.items()}  # 反转关系映射（ID→中文名）
    for rel_id, related_conditions, negate in relation_filters:
        rel_cn = id_to_cn.get(rel_id, f"relation_{rel_id}")
        prefix = "no_" if negate else ""
        rel_base = f"{prefix}{rel_cn}"
        max_cnt = max_relations[rel_id]
        # 先加关联字段列（如“单行本_1_发售日”），再加关联ID列（如“单行本_1_ID”）
        for idx in range(1, max_cnt + 1):
            for field in related_fields:
                headers.append(f"{rel_base}_{idx}_{field}")
        for idx in range(1, max_cnt + 1):
            headers.append(f"{rel_base}_{idx}_ID")

    # 写入CSV
    with open(output_csv_file, 'w', encoding='utf-8-sig', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        for result in results:
            row = [result['id'], result['url']]
            # 普通字段值
            for field in unique_fields:
                row.append(result['fields'].get(field, ''))
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
    """检查文件覆盖（逻辑不变）"""
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
    """检查是否需要预加载所有subject数据（逻辑不变）"""
    for rel_id, related_conditions, negate in relation_filters:
        if not negate and related_conditions:
            return True
    return False


def check_tag_conditions(data, tag_filters):
    """检查标签条件（逻辑不变）"""
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
    id_to_cn = {v: k for k, v in cn_to_relation_id.items()}  # ID→中文名映射
    print("\n===== 筛选条件 =====")
    # 普通字段条件
    for i, (field, conds) in enumerate(grouped_filters.items(), 1):
        print(f"{i}. 字段: {field}")
        for j, cond in enumerate(conds, 1):
            if cond.startswith('re:'):
                print(f"   条件 {j}: 正则匹配 '{cond[3:]}'")
            elif re.match(r'^\{\{\s*\w+\s*\}\}$', cond):
                print(f"   条件 {j}: 等于自身字段 '{cond[2:-2].strip()}'")
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

    # 加载关系数据和预加载subject数据
    relations_data = load_relations(archive_dir)
    if relation_filters and not relations_data:
        print("错误：需关系筛选但未找到 subject-relations.jsonlines")
        return

    all_subjects = {}
    if needs_full_load(relation_filters):
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

    # 核心筛选逻辑
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

                # 1. 检查标签条件
                if not check_tag_conditions(data, tag_filters):
                    continue

                # 2. 检查普通字段条件（支持{{自身字段引用}}）
                field_values = {}
                all_matched = True
                for field in unique_fields:
                    val = extract_field_value(data, field)
                    field_values[field] = val
                    # 检查该字段的所有条件（含自身引用）
                    for cond in grouped_filters[field]:
                        if not matches_condition(val, cond, data):  # 传入当前条目数据用于引用解析
                            all_matched = False
                            break
                    if not all_matched:
                        break
                if not all_matched:
                    continue

                # 3. 检查关系条件（支持{{{原条目字段引用}}）
                relation_values = {}
                if relation_filters and all_matched:
                    subject_rels = relations_data.get(int(sid), []) if relations_data else []
                    for rel_id, rel_conds, negate in relation_filters:
                        matched = False
                        related_ids = []
                        # 遍历当前条目的所有关系
                        for rel in subject_rels:
                            if rel['relation_type'] != rel_id:
                                continue
                            # 处理“不包含”逻辑（只要有匹配关系就排除）
                            if negate:
                                matched = True
                                break
                            # 处理“包含”逻辑（检查关联条目条件）
                            related_sid = str(rel['related_subject_id'])
                            related_data = all_subjects.get(related_sid) if all_subjects else None
                            if related_data and check_related_subject(related_data, data, rel_conds):  # 传入原条目数据
                                related_ids.append(related_sid)
                                matched = True
                        # 检查是否满足关系条件
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

                # 4. 保存匹配结果
                url = f"https://bgm.tv/subject/{sid}"
                out_f.write(json.dumps(data, ensure_ascii=False) + "\n")
                results.append({
                    'id': sid, 'url': url, 'fields': field_values, 'relations': relation_values
                })
                matched_cnt += 1

            except Exception as e:
                print(f"\n处理条目出错: {str(e)}")
                continue

    # 生成CSV
    if results:
        print("\n正在生成CSV文件...")
        write_csv_file(output_csv, results, grouped_filters, relation_filters, all_subjects)

    print(f"\n处理完成！共找到 {matched_cnt} 个符合条件的条目")
    print(f"原始数据保存至: {output_file}")
    print(f"表格数据保存至: {output_csv}")


if __name__ == "__main__":
    main()
