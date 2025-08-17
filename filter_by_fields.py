import json
import os
import re
import csv
from tqdm import tqdm

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
    i = 1

    print("请添加筛选条件（输入空的字段名称结束添加）")

    while True:
        print(f"\n设置第 {i} 个筛选条件:")
        field_name = input(f"请输入字段名称 (例如: 出版社、name): ").strip()

        # 如果字段名称为空，结束添加
        if not field_name:
            if i == 1:  # 还没有添加任何条件
                print("未添加任何筛选条件")
            else:
                print(f"已完成筛选条件添加，共设置 {i-1} 个条件")
            break

        print("条件格式说明:")
        print("- 普通文本: 直接输入要包含的文本 (例如: 、)")
        print("- 正则表达式: 以 re: 开头 (例如: re:\\d{4}-\\d{2}-\\d{2})")
        condition = input("请输入筛选条件: ")

        if not condition:
            print("筛选条件不能为空，请重新输入")
            continue

        filters.append((field_name, condition))
        i += 1

    return filters

def group_filters_by_field(filters):
    """将筛选条件按字段分组，相同字段的条件放在一起"""
    grouped = {}
    for field, condition in filters:
        if field not in grouped:
            grouped[field] = []
        grouped[field].append(condition)
    return grouped

def write_csv_file(output_csv_file, results, grouped_filters):
    """将结果写入CSV文件"""
    unique_fields = list(grouped_filters.keys())

    with open(output_csv_file, 'w', encoding='utf-8', newline='') as csvfile:
        writer = csv.writer(csvfile)

        # 写入表头
        headers = ['ID', 'URL']
        headers.extend(unique_fields)
        writer.writerow(headers)

        # 写入数据行
        for result in results:
            row = [result['id'], result['url']]
            for field in unique_fields:
                row.append(result['fields'].get(field, ''))
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

def main():
    # 获取用户定义的筛选条件
    filters = get_user_filters()
    if not filters:
        print("未设置任何筛选条件，程序退出")
        return

    # 将筛选条件按字段分组
    grouped_filters = group_filters_by_field(filters)
    unique_fields = list(grouped_filters.keys())

    # 显示用户设置的筛选条件（分组显示）
    print("\n===== 筛选条件 =====")
    for i, field in enumerate(unique_fields, 1):
        conditions = grouped_filters[field]
        print(f"{i}. 字段: {field}")
        for j, condition in enumerate(conditions, 1):
            cond_type = "正则匹配" if condition.startswith('re:') else "文本包含"
            cond_display = condition[3:] if condition.startswith('re:') else condition
            print(f"   条件 {j}: ({cond_type}) {cond_display}")
        if len(conditions) > 1:
            print(f"   （以上 {len(conditions)} 个条件为且关系，需同时满足）")
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

    # 处理文件
    results = []
    total_lines = 0
    matched_count = 0

    # 计算总行数
    print("正在计算文件总行数...")
    with open(input_file, 'r', encoding='utf-8') as f:
        total_lines = sum(1 for _ in f)

    print(f"开始处理 {total_lines} 行数据...")

    with open(input_file, 'r', encoding='utf-8') as f, \
         open(output_file, 'w', encoding='utf-8') as out_f:

        for line in tqdm(f, total=total_lines, desc="处理进度"):
            try:
                data = json.loads(line.strip())
                subject_id = data.get('id')
                if not subject_id:
                    continue

                # 检查所有条件
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

                if all_matched:
                    url = f"https://bgm.tv/subject/{subject_id}"
                    
                    # 写入原始行
                    out_f.write(line)
                    
                    # 保存结果
                    results.append({
                        'id': subject_id,
                        'url': url,
                        'fields': field_values
                    })
                    matched_count += 1

            except json.JSONDecodeError:
                continue
            except Exception as e:
                print(f"\n处理行时出错: {str(e)}")
                continue

    # 写入CSV文件
    if results:
        print("正在生成CSV文件...")
        write_csv_file(output_csv_file, results, grouped_filters)

    print(f"\n处理完成，共找到 {matched_count} 个符合所有条件的条目")
    print(f"原始数据已保存至 {output_file}")
    print(f"表格数据已保存至 {output_csv_file}")

if __name__ == "__main__":
    main()