import json
import os
import re
import unicodedata
from typing import List, Dict, Tuple

def str_display_width(s: str) -> int:
    """计算字符串的显示宽度，CJK字符计为2，其他计为1"""
    width = 0
    for c in s:
        if unicodedata.east_asian_width(c) in ('F', 'W', 'A'):
            width += 2
        else:
            width += 1
    return width

def truncate_by_display_width(s: str, max_width: int) -> str:
    """根据显示宽度截断字符串"""
    current_width = 0
    result = []
    for c in s:
        char_width = 2 if unicodedata.east_asian_width(c) in ('F', 'W', 'A') else 1
        if current_width + char_width > max_width:
            result.append('...')
            break
        result.append(c)
        current_width += char_width
    return ''.join(result)

def pad_by_display_width(s: str, target_width: int) -> str:
    """根据显示宽度填充空格使字符串达到目标宽度"""
    current_width = str_display_width(s)
    if current_width >= target_width:
        return s
    return s + ' ' * (target_width - current_width)

def extract_field_value(data: Dict, field_name: str) -> str:
    """
    从数据中提取字段值
    先尝试从顶级字段获取，再尝试从infobox中提取
    """
    # 先检查是否为顶级字段
    if field_name in data:
        return str(data[field_name])
    
    # 检查infobox中的字段
    infobox = data.get('infobox', '')
    if not infobox:
        return ""
    
    # 尝试从infobox中提取（支持中文冒号和英文冒号）
    pattern = re.compile(fr'{field_name}\s*[:=]\s*(.*?)(\r\n|\n|}}|{{|$)', re.IGNORECASE)
    match = pattern.search(infobox)
    if match:
        return match.group(1).strip()
    
    return ""

def matches_condition(value: str, condition: str) -> bool:
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

def get_user_filters() -> List[Tuple[str, str]]:
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
        condition = input("请输入筛选条件: ").strip()
        
        if not condition:
            print("筛选条件不能为空，请重新输入")
            continue
            
        filters.append((field_name, condition))
        i += 1
        
    return filters

def group_filters_by_field(filters: List[Tuple[str, str]]) -> Dict[str, List[str]]:
    """将筛选条件按字段分组，相同字段的条件放在一起"""
    grouped = {}
    for field, condition in filters:
        if field not in grouped:
            grouped[field] = []
        grouped[field].append(condition)
    return grouped

def calculate_column_widths(grouped_filters: Dict[str, List[str]], 
                           input_file: str, 
                           sample_size: int = 100) -> Dict[str, int]:
    """自动计算每个字段的最佳显示宽度"""
    # 初始宽度为字段名称的宽度
    widths = {field: str_display_width(field) for field in grouped_filters.keys()}
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            # 采样一定数量的记录来计算宽度
            for i, line in enumerate(f):
                if i >= sample_size:
                    break
                    
                try:
                    data = json.loads(line.strip())
                    for field in grouped_filters.keys():
                        value = extract_field_value(data, field)
                        value_width = str_display_width(value)
                        # 更新宽度（取最大值，但不超过80）
                        if value_width > widths[field] and value_width <= 80:
                            widths[field] = value_width
                except:
                    continue
    except Exception as e:
        print(f"计算列宽时出错: {str(e)}")
    
    # 确保最小宽度
    for field in widths:
        if widths[field] < 10:  # 最小宽度10
            widths[field] = 10
        elif widths[field] > 80:  # 最大宽度80
            widths[field] = 80
            
    return widths

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
        # 明确提示同一字段的条件关系
        if len(conditions) > 1:
            print(f"   （以上 {len(conditions)} 个条件为且关系，需同时满足）")
    print("====================\n")
    print("不同字段之间的条件关系为且关系，需同时满足所有字段的条件\n")
    
    # 获取文件路径
    default_input = "subject.jsonlines"
    default_output = "filtered_results.jsonlines"
    
    input_file = input(f"请输入JSONLines文件路径（默认: {default_input}）: ").strip() or default_input
    output_file = input(f"请输入结果输出文件路径（默认: {default_output}）: ").strip() or default_output
    
    # 检查输入文件
    if not os.path.exists(input_file):
        print(f"错误：文件 {input_file} 不存在")
        return
    
    # 自动计算列宽（基于唯一字段）
    print("正在分析文件以自动计算列宽...")
    col_widths = calculate_column_widths(grouped_filters, input_file)
    
    # 准备表格配置
    id_width = 8
    url_width = 40
    
    # 打印表头（只显示唯一字段）
    header_parts = [pad_by_display_width("ID", id_width)]
    header_parts.extend([pad_by_display_width(field, col_widths[field]) for field in unique_fields])
    header_parts.append("链接")
    print(" | ".join(header_parts))
    
    # 打印分隔线
    total_width = id_width + sum(col_widths.values()) + url_width + (len(unique_fields) + 1) * 3
    print('-' * total_width)
    
    # 处理文件
    count = 0
    with open(input_file, 'r', encoding='utf-8') as f, \
         open(output_file, 'w', encoding='utf-8') as out_f:
        
        for line_num, line in enumerate(f, 1):
            try:
                data = json.loads(line.strip())
                subject_id = data.get('id')
                if not subject_id:
                    continue
                
                # 提取所有字段值并检查所有条件
                field_values = {}
                all_matched = True
                
                for field in unique_fields:
                    value = extract_field_value(data, field)
                    field_values[field] = value
                    
                    # 检查该字段的所有条件（且关系：需要满足所有条件）
                    field_conditions = grouped_filters[field]
                    field_matched = True
                    
                    for condition in field_conditions:
                        if not matches_condition(value, condition):
                            field_matched = False
                            break
                            
                    if not field_matched:
                        all_matched = False
                        break
                
                # 如果所有字段都满足其所有条件（且关系）
                if all_matched:
                    url = f"https://bgm.tv/subject/{subject_id}"
                    
                    # 准备输出数据
                    output_data = {
                        "id": subject_id,
                        "url": url,
                        "fields": field_values,
                        "name": data.get('name', ''),
                        "name_cn": data.get('name_cn', '')
                    }
                    out_f.write(json.dumps(output_data, ensure_ascii=False) + '\n')
                    
                    # 准备表格行（只显示唯一字段）
                    row_parts = [pad_by_display_width(str(subject_id), id_width)]
                    for field in unique_fields:
                        value = field_values[field]
                        truncated = truncate_by_display_width(value, col_widths[field])
                        row_parts.append(pad_by_display_width(truncated, col_widths[field]))
                    row_parts.append(truncate_by_display_width(url, url_width))
                    
                    # 打印行
                    print(" | ".join(row_parts))
                    count += 1
                
            except json.JSONDecodeError:
                print(f"警告：第 {line_num} 行不是有效的JSON格式，已跳过")
            except Exception as e:
                print(f"处理第 {line_num} 行时出错: {str(e)}")
    
    # 打印结束信息
    print('-' * total_width)
    print(f"\n处理完成，共找到 {count} 个符合所有条件的条目")
    print(f"结果已保存至 {output_file}")

if __name__ == "__main__":
    main()
    