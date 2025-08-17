import json
import os
import re
import csv
from tqdm import tqdm
from collections import defaultdict

def load_relations(input_file_dir):
    """加载关系数据"""
    relations_file = os.path.join(input_file_dir, "subject-relations.jsonlines")
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
    """
    从数据中提取字段值
    先尝试从顶级字段获取，再尝试从infobox中提取
    """
    # 先检查是否为顶级字段
    if field_name in data:
        value = data[field_name]
        # 处理布尔值
        if isinstance(value, bool):
            return "true" if value else "false"
        return str(value)
    
    # 检查infobox中的字段
    infobox = data.get('infobox', '')
    if not infobox:
        return ""

    # 确保不会匹配到空值或相邻字段
    pattern = re.compile(
        fr'\|{re.escape(field_name)}\s*[:=]\s*(.*?)(?:\s*\||\s*}}|\s*{{|\s*$|\r\n|\n)',
        re.IGNORECASE
    )
    match = pattern.search(infobox)
    if match:
        value = match.group(1).strip()
        # 过滤掉空值和大括号
        if not value or value in ('{', '}'):
            return ""
        return value
    
    return ""

def matches_condition(value, condition):
    """检查值是否满足条件（支持普通文本包含和正则表达式）"""
    # 检查是否为正则表达式（以re:开头）
    if condition.startswith('re:'):
        regex_pattern = condition[3:]
        try:
            return re.search(regex_pattern, value) is not None
        except re.error:
            print(f"警告：正则表达式 '{regex_pattern}' 无效，将视为普通文本匹配")
            return condition in value
    # 普通文本包含
    return condition in value

def get_user_filters():
    """获取用户定义的筛选条件，输入空字段名称结束添加"""
    filters = []
    relation_filters = []
    i = 1

    print("请添加筛选条件（输入空的字段名称结束添加）")
    print("提示：如果需要筛选条目关系，字段名称请以 'relation:' 开头")
    print("      在关系类型前加!表示没有该关系，例如 relation:!1002")

    while True:
        print(f"\n设置第 {i} 个筛选条件:")
        field_name = input(f"请输入字段名称 (例如: 出版社、name 或 relation:1002): ").strip()

        # 如果字段名称为空，结束添加
        if not field_name:
            if i == 1:  # 还没有添加任何条件
                print("未添加任何筛选条件")
            else:
                print(f"已完成筛选条件添加，共设置 {i-1} 个条件")
            break

        # 关系筛选条件
        if field_name.startswith('relation:'):
            relation_part = field_name.split(':')[1]
            negate = False
            
            # 检查是否是否定条件
            if relation_part.startswith('!'):
                negate = True
                try:
                    relation_type = int(relation_part[1:])
                except ValueError:
                    print("错误：关系类型必须是数字 (例如 relation:!1002)")
                    continue
            else:
                try:
                    relation_type = int(relation_part)
                except ValueError:
                    print("错误：关系类型必须是数字 (例如 relation:1002)")
                    continue
            
            print("提示：关系代码对应关系请参考 https://github.com/bangumi/server/blob/736b2e02d7f1165955ef30f3b12b29e2ba204bd6/pol/db/const.py#L139")
            
            related_conditions = []
            if not negate:
                print("是否需要对关联条目设置筛选条件？(y/n)")
                choice = input().strip().lower()
                
                if choice == 'y':
                    print("设置关联条目的筛选条件:")
                    while True:
                        related_field = input("请输入关联条目的字段名称 (留空结束): ").strip()
                        if not related_field:
                            break
                        
                        print("条件格式说明:")
                        print("- 普通文本: 直接输入要包含的文本 (例如: 、)")
                        print("- 正则表达式: 以 re: 开头 (例如: re:\\d{4}-\\d{2}-\\d{2})")
                        condition = input("请输入筛选条件: ")
                        
                        if not condition:
                            print("筛选条件不能为空，跳过此条件")
                            continue
                        
                        related_conditions.append((related_field, condition))
            
            relation_filters.append((relation_type, related_conditions, negate))
            i += 1
            continue

        print("条件格式说明:")
        print("- 普通文本: 直接输入要包含的文本 (例如: 、)")
        print("- 正则表达式: 以 re: 开头 (例如: re:\\d{4}-\\d{2}-\\d{2})")
        condition = input("请输入筛选条件: ")

        if not condition:
            print("筛选条件不能为空，请重新输入")
            continue

        filters.append((field_name, condition))
        i += 1

    return filters, relation_filters

def group_filters_by_field(filters):
    """将筛选条件按字段分组，相同字段的条件放在一起"""
    grouped = {}
    for field, condition in filters:
        if field not in grouped:
            grouped[field] = []
        grouped[field].append(condition)
    return grouped

def write_csv_file(output_csv_file, results, grouped_filters, relation_filters):
    """将结果写入CSV文件"""
    unique_fields = list(grouped_filters.keys())
    relation_headers = []

    # 为关系筛选添加表头
    for rel_type, _, negate in relation_filters:
        prefix = "no_" if negate else ""
        relation_headers.append(f"{prefix}relation_{rel_type}")

    with open(output_csv_file, 'w', encoding='utf-8', newline='') as csvfile:
        writer = csv.writer(csvfile)

        # 写入表头
        headers = ['ID', 'URL']
        headers.extend(unique_fields)
        headers.extend(relation_headers)
        writer.writerow(headers)

        # 写入数据行
        for result in results:
            row = [result['id'], result['url']]
            
            # 添加普通字段
            for field in unique_fields:
                row.append(result['fields'].get(field, ''))
            
            # 添加关系字段
            for rel_type, _, negate in relation_filters:
                if negate:
                    # 对于否定关系，显示"无"表示满足条件
                    row.append("无" if str(rel_type) not in result['relations'] else "有")
                else:
                    row.append(result['relations'].get(str(rel_type), '无'))
            
            writer.writerow(row)

def check_file_overwrite(file_path):
    """检查文件是否存在，如果存在则询问用户是否覆盖"""
    if os.path.exists(file_path):
        print(f"警告: 文件 '{file_path}' 已存在")
        choice = input("是否覆盖? (y/n): ").strip().lower()
        if choice != 'y':
            print("操作已取消")
            return False
    return True

def check_related_subject(subject_data, relations_data, related_subject_id, related_conditions):
    """检查关联条目是否满足条件"""
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

def main():
    # 获取用户定义的筛选条件
    filters, relation_filters = get_user_filters()
    if not filters and not relation_filters:
        print("未设置任何筛选条件，程序退出")
        return

    # 将筛选条件按字段分组
    grouped_filters = group_filters_by_field(filters)
    unique_fields = list(grouped_filters.keys())

    # 显示用户设置的筛选条件（分组显示）
    print("\n===== 筛选条件 =====")
    
    # 普通字段条件
    for i, field in enumerate(unique_fields, 1):
        conditions = grouped_filters[field]
        print(f"{i}. 字段: {field}")
        for j, condition in enumerate(conditions, 1):
            cond_type = "正则匹配" if condition.startswith('re:') else "文本包含"
            cond_display = condition[3:] if condition.startswith('re:') else condition
            print(f"   条件 {j}: ({cond_type}) {cond_display}")
        if len(conditions) > 1:
            print(f"   （以上 {len(conditions)} 个条件为且关系，需同时满足）")
    
    # 关系条件
    for i, (rel_type, related_conditions, negate) in enumerate(relation_filters, len(unique_fields)+1):
        print(f"{i}. 关系类型: {'不包含' if negate else '包含'} {rel_type}")
        if not negate and related_conditions:
            print("   关联条目需满足以下条件:")
            for j, (field, condition) in enumerate(related_conditions, 1):
                cond_type = "正则匹配" if condition.startswith('re:') else "文本包含"
                cond_display = condition[3:] if condition.startswith('re:') else condition
                print(f"     条件 {j}: 字段 '{field}' ({cond_type}) {cond_display}")
    
    print("====================\n")
    print("不同字段之间的条件关系为且关系，需同时满足所有字段的条件\n")

    # 获取文件路径
    default_input = "bangumi_archive/subject.jsonlines"
    default_output = "filtered_results"

    input_file = input(f"请输入JSONLines文件路径（默认: {default_input}）: ").strip() or default_input
    output_name = input(f"请输入结果输出文件名（默认: {default_output}）: ").strip() or default_output

    output_file = f"{output_name}.jsonlines"
    output_csv_file = f"{output_name}.csv"

    # 检查输入文件
    if not os.path.exists(input_file):
        print(f"错误：文件 {input_file} 不存在")
        return

    # 检查输出文件是否已存在
    if not check_file_overwrite(output_file) or not check_file_overwrite(output_csv_file):
        return

    # 加载关系数据
    input_file_dir = os.path.dirname(input_file)
    relations_data = load_relations(input_file_dir)
    
    # 如果设置了关系筛选但没有找到关系数据文件
    if relation_filters and relations_data is None:
        print("错误：需要筛选关系但未找到 subject-relations.jsonlines 文件")
        return
    
    # 预加载所有subject数据到内存
    print("正在预加载subject数据...")
    all_subjects = {}
    with open(input_file, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line.strip())
                subject_id = data.get('id')
                if subject_id:
                    all_subjects[str(subject_id)] = data
            except json.JSONDecodeError:
                continue

    # 处理文件
    results = []
    total_lines = len(all_subjects)
    matched_count = 0

    print(f"开始处理 {total_lines} 条数据...")

    with open(output_file, 'w', encoding='utf-8') as out_f:
        for subject_id, data in tqdm(all_subjects.items(), total=total_lines, desc="处理进度"):
            try:
                # 检查所有普通条件
                field_values = {}
                all_matched = True

                for field in unique_fields:
                    value = extract_field_value(data, field)
                    field_values[field] = value

                    # 检查该字段的所有条件
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
                    subject_relations = relations_data.get(int(subject_id), [])
                    
                    for rel_type, related_conditions, negate in relation_filters:
                        matched = False
                        related_ids = []
                        
                        # 查找该类型的所有关系
                        for rel in subject_relations:
                            if rel['relation_type'] == rel_type:
                                # 检查关联条目是否满足条件
                                if not negate and check_related_subject(data, all_subjects, rel['related_subject_id'], related_conditions):
                                    related_ids.append(str(rel['related_subject_id']))
                                    matched = True
                                elif negate:
                                    # 对于否定条件，只要找到任何该类型的关系就不匹配
                                    matched = True
                                    break
                        
                        if negate:
                            # 对于否定条件，matched=True表示有该关系，不符合要求
                            if matched:
                                all_matched = False
                                break
                            relation_values[str(rel_type)] = "无"
                        else:
                            if not matched:
                                all_matched = False
                                break
                            relation_values[str(rel_type)] = ", ".join(related_ids) if related_ids else "无"

                if all_matched:
                    url = f"https://bgm.tv/subject/{subject_id}"
                    
                    # 写入原始行
                    out_f.write(json.dumps(data, ensure_ascii=False) + "\n")
                    
                    # 保存结果
                    results.append({
                        'id': subject_id,
                        'url': url,
                        'fields': field_values,
                        'relations': relation_values
                    })
                    matched_count += 1

            except Exception as e:
                print(f"\n处理条目 {subject_id} 时出错: {str(e)}")
                continue

    # 写入CSV文件
    if results:
        print("正在生成CSV文件...")
        write_csv_file(output_csv_file, results, grouped_filters, relation_filters)

    print(f"\n处理完成，共找到 {matched_count} 个符合所有条件的条目")
    print(f"原始数据已保存至 {output_file}")
    print(f"表格数据已保存至 {output_csv_file}")

if __name__ == "__main__":
    main()