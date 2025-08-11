import json
import os
import re
import requests
from collections import defaultdict
from requests.exceptions import RequestException

# 白名单设置 - 忽略这些ISBN的重复检查
WHITE_LIST = ['9784801921436']  # 可根据需要添加更多ISBN

# 尝试导入所需库
try:
    from tqdm import tqdm
    has_tqdm = True
except ImportError:
    has_tqdm = False
    print("提示：安装tqdm库可获得更好的进度显示（pip install tqdm）")

try:
    from bs4 import BeautifulSoup
    has_bs4 = True
except ImportError:
    has_bs4 = False
    print("错误：需要安装beautifulsoup4库来解析汇报页面（pip install beautifulsoup4）")

# 设置超时时间（秒）
REQUEST_TIMEOUT = 15

# 模拟浏览器的请求头
DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
    'Connection': 'keep-alive'
}

def extract_japanese_isbn(infobox: str) -> str:
    """从infobox中提取以9784开头的ISBN（日本书籍）"""
    patterns = [
        r'ISBN\s*[:=]\s*(\d[\d-]*\d)',  # 标准ISBN格式
        r'ISBN-13\s*[:=]\s*(\d[\d-]*\d)',  # ISBN-13
        r'国际标准书号\s*[:=]\s*(\d[\d-]*\d)'  # 中文名称
    ]
    
    for pattern in patterns:
        match = re.search(pattern, infobox, re.IGNORECASE)
        if match:
            # 移除连字符，统一格式
            isbn = match.group(1).replace('-', '').strip()
            # 检查是否为9784开头（日本ISBN）
            if isbn.startswith('9784'):
                return isbn
    
    return None

def get_report_page_links() -> list:
    """获取用户输入的汇报页面链接列表，输入空则结束"""
    print("\n请输入汇报页面的链接（每行一个，输入空行结束）：")
    print("脚本将检查找到的重复条目是否已在这些页面中被汇报")
    
    report_links = []
    i = 1
    
    while True:
        link = input(f"汇报页面 {i}: ").strip()
        if not link:
            if i == 1:
                print("未输入任何汇报页面，将输出所有重复条目")
            else:
                print(f"已完成汇报页面输入，共 {i-1} 个页面")
            break
        
        # 简单验证链接格式
        if not re.match(r'^https?://', link):
            print("警告：链接格式似乎不正确（应为http或https开头），但仍会被记录")
        
        report_links.append(link)
        i += 1
    
    return report_links

def extract_subject_links(html_content: str) -> set:
    """从HTML内容中提取所有汇报的subject链接"""
    links = set()
    
    if not has_bs4:
        return links
        
    # 使用BeautifulSoup解析HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 只在class为message的元素中查找
    message_elements = soup.select('.message')
    
    # 链接匹配模式
    link_pattern = re.compile(r'https?://bgm\.tv/subject/(\d+)')
    
    for elem in message_elements:
        # 查找所有链接
        for a_tag in elem.find_all('a', href=True):
            href = a_tag['href']
            match = link_pattern.match(href)
            if match:
                # 标准化链接格式
                subject_id = match.group(1)
                standard_link = f"https://bgm.tv/subject/{subject_id}"
                links.add(standard_link)
        
        # 同时检查文本中可能存在的未加链接标签的URL
        text = elem.get_text()
        for match in link_pattern.finditer(text):
            subject_id = match.group(1)
            standard_link = f"https://bgm.tv/subject/{subject_id}"
            links.add(standard_link)
    
    return links

def fetch_and_extract_report_links(report_links: list) -> set:
    """获取所有汇报页面并提取其中包含的subject链接"""
    all_reported_links = set()
    
    if not report_links:
        return all_reported_links
    
    if not has_bs4:
        print("无法提取汇报链接，因为缺少beautifulsoup4库")
        return all_reported_links
    
    print("\n正在获取汇报页面并提取链接（这可能需要一些时间）...")
    
    # 为获取页面添加进度条
    if has_tqdm:
        iterable = tqdm(report_links, desc="处理汇报页面")
    else:
        iterable = report_links
        print(f"共需处理 {len(report_links)} 个页面...")
    
    for link in iterable:
        try:
            if not has_tqdm:
                print(f"正在处理: {link}")
            response = requests.get(link, headers=DEFAULT_HEADERS, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()
            
            # 从页面提取链接
            page_links = extract_subject_links(response.text)
            all_reported_links.update(page_links)
            
            if not has_tqdm:
                print(f"从 {link} 提取到 {len(page_links)} 个链接")
                
        except RequestException as e:
            if not has_tqdm:
                print(f"获取 {link} 失败: {str(e)}")
            # 尝试一次重试
            try:
                if not has_tqdm:
                    print(f"尝试重试获取 {link}...")
                response = requests.get(link, headers=DEFAULT_HEADERS, timeout=REQUEST_TIMEOUT)
                page_links = extract_subject_links(response.text)
                all_reported_links.update(page_links)
                if not has_tqdm:
                    print(f"重试成功，从 {link} 提取到 {len(page_links)} 个链接")
            except:
                if not has_tqdm:
                    print(f"重试 {link} 仍然失败")
    
    print(f"\n汇报页面处理完成，共提取到 {len(all_reported_links)} 个已汇报的链接")
    return all_reported_links

def count_lines_in_file(file_path: str) -> int:
    """计算文件的总行数，用于进度条"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return sum(1 for _ in f)
    except Exception as e:
        print(f"计算文件行数时出错: {str(e)}")
        return 0

def normalize_title(title: str) -> str:
    """标准化标题，移除符号和空格差异，处理更多全角半角符号"""
    # 替换全角符号为半角
    title = title.replace('？', '?').replace('！', '!').replace('，', ',').replace('。', '.')
    title = title.replace('；', ';').replace('：', ':').replace('（', '(').replace('）', ')')
    title = title.replace('【', '[').replace('】', ']').replace('“', '"').replace('”', '"')
    title = title.replace('～', '~').replace('＠', '@').replace('＃', '#').replace('＄', '$')
    title = title.replace('％', '%').replace('＾', '^').replace('＆', '&').replace('＊', '*')
    title = title.replace('－', '-').replace('＿', '_').replace('＋', '+').replace('＝', '=')
    title = title.replace('｛', '{').replace('｝', '}').replace('｜', '|').replace('＼', '\\')
    title = title.replace('＜', '<').replace('＞', '>').replace('？', '?').replace('／', '/')
    
    # 移除所有空格和符号
    return re.sub(r'[\s\?\!,\.\;\:\(\)\[\]\"\'<>~@#\$%\^&\*\-_\+=\{\}\|\\/]', '', title)

def has_only_numeric_differences(titles: list) -> bool:
    """检查标题之间是否只有数字差异（且确实存在数字差异）"""
    if len(titles) < 2:
        return False
        
    # 移除所有数字后比较
    normalized = [re.sub(r'\d+', '', title) for title in titles]
    all_same_after_removal = all(t == normalized[0] for t in normalized)
    
    # 检查是否存在数字差异（即原始标题中至少有一个包含数字）
    has_numbers = any(re.search(r'\d+', title) for title in titles)
    
    # 只有当移除数字后相同且存在数字时，才认为是只有数字差异
    return all_same_after_removal and has_numbers

def classify_duplicate_group(entries: list) -> str:
    """根据条目特征对重复ISBN组进行分类"""
    # 检查是否有系列条目
    has_series = any(entry.get('series', False) for entry in entries)
    if has_series:
        return "疑似系列误填"
    
    # 提取所有标题
    titles = [entry['name'] for entry in entries]
    normalized_titles = [normalize_title(title) for title in titles]
    
    # 先检查是否只有符号/空格差异（包括标题完全相同的情况）
    if all(t == normalized_titles[0] for t in normalized_titles):
        return "疑似重复条目"
    
    # 再检查是否只有数字差异
    if has_only_numeric_differences(titles):
        return "疑似同系列单行本误填"
    
    # 其他情况
    return "疑似不同作品误填"

def find_duplicate_isbns(jsonlines_file: str, reported_links: set, min_occurrences: int = 2) -> dict:
    """
    查找具有相同ISBN的日本书籍条目（ISBN以9784开头）
    并检查这些条目是否已在汇报页面中出现
    """
    isbn_map = defaultdict(list)
    
    if not os.path.exists(jsonlines_file):
        print(f"错误：文件 {jsonlines_file} 不存在")
        return {}
    
    # 计算文件总行数，用于进度条
    total_lines = count_lines_in_file(jsonlines_file)
    print(f"\n正在分析 {jsonlines_file} 中的日本书籍ISBN信息...")
    
    total_japanese_books = 0
    whitelisted_count = 0
    
    with open(jsonlines_file, 'r', encoding='utf-8') as f:
        # 设置进度条
        if has_tqdm and total_lines > 0:
            file_iterator = tqdm(f, total=total_lines, desc="分析进度")
        else:
            file_iterator = f
            if total_lines > 0:
                print(f"共需分析 {total_lines} 行数据...")
        
        for line_num, line in enumerate(file_iterator, 1):
            try:
                data = json.loads(line.strip())
                
                subject_id = data.get('id')
                if not subject_id:
                    continue
                
                # 获取名称（优先中文名称）
                name = data.get('name_cn', '') or data.get('name', f"未知名称 (ID: {subject_id})")
                
                # 获取series字段
                is_series = data.get('series', False)
                
                # 提取日本ISBN（9784开头）
                infobox = data.get('infobox', '')
                isbn = extract_japanese_isbn(infobox)
                
                if isbn:
                    # 检查是否在白名单中
                    if isbn in WHITE_LIST:
                        whitelisted_count += 1
                        continue  # 跳过白名单中的ISBN
                        
                    total_japanese_books += 1
                    # 构建URL
                    url = f"https://bgm.tv/subject/{subject_id}"
                    
                    # 检查是否已在汇报链接集合中（O(1)时间复杂度）
                    reported = url in reported_links
                    
                    isbn_map[isbn].append({
                        "id": subject_id,
                        "url": url,
                        "name": name,
                        "series": is_series,
                        "reported": reported
                    })
                
            except json.JSONDecodeError:
                if not has_tqdm:
                    print(f"警告：第 {line_num} 行不是有效的JSON格式，已跳过")
            except Exception as e:
                if not has_tqdm:
                    print(f"处理第 {line_num} 行时出错: {str(e)}")
    
    print(f"共发现 {total_japanese_books} 本ISBN以9784开头的日本书籍")
    if whitelisted_count > 0:
        print(f"已跳过 {whitelisted_count} 本白名单中的ISBN条目")
    
    # 过滤出出现次数不少于min_occurrences的ISBN并进行分类
    filtered = {}
    for isbn, entries in isbn_map.items():
        if len(entries) >= min_occurrences:
            # 分类该组重复条目
            category = classify_duplicate_group(entries)
            
            # 分离已汇报和未汇报的条目
            reported_entries = [e for e in entries if e['reported']]
            unreported_entries = [e for e in entries if not e['reported']]
            
            filtered[isbn] = {
                "all_entries": entries,
                "reported_entries": reported_entries,
                "unreported_entries": unreported_entries,
                "category": category
            }
    
    return filtered

def main():
    if not has_bs4:
        print("请先安装beautifulsoup4库：pip install beautifulsoup4")
        return
        
    # 显示当前白名单
    print(f"\n当前白名单中的ISBN: {', '.join(WHITE_LIST) if WHITE_LIST else '无'}")
        
    # 获取用户输入的汇报页面链接
    report_links = get_report_page_links()
    
    # 获取并提取所有汇报页面中的链接（一次性处理）
    reported_links = fetch_and_extract_report_links(report_links)
    
    # 获取文件路径
    default_input = "subject.jsonlines"
    input_file = input(f"\n请输入JSONLines文件路径（默认: {default_input}）: ").strip() or default_input
    
    # 获取输出文件路径
    default_output = "duplicate_check_results.txt"
    output_file = input(f"请输入结果输出文件路径（默认: {default_output}）: ").strip() or default_output
    
    # 清空输出文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("重复ISBN检查结果\n")
        f.write("==================\n")
        if WHITE_LIST:
            f.write(f"白名单ISBN: {', '.join(WHITE_LIST)}\n\n")
        else:
            f.write("\n")
    
    # 查找重复的日本ISBN并检查是否已汇报
    duplicates = find_duplicate_isbns(input_file, reported_links)
    
    if not duplicates:
        message = "未发现符合条件的重复ISBN条目"
        print(message)
        with open(output_file, 'a', encoding='utf-8') as f:
            f.write(message + '\n')
        return
    
    # 按类别分组统计
    category_stats = defaultdict(int)
    for isbn_data in duplicates.values():
        category_stats[isbn_data["category"]] += 1
    
    # 计算统计数据
    total_duplicate_isbns = len(duplicates)
    total_duplicate_entries = sum(len(data["all_entries"]) for data in duplicates.values())
    total_reported = sum(len(data["reported_entries"]) for data in duplicates.values())
    total_unreported = sum(len(data["unreported_entries"]) for data in duplicates.values())
    
    # 控制台输出统计信息
    print("\n===== 筛选结果总结 =====")
    print(f"1. 共发现 {total_duplicate_isbns} 个重复的ISBN")
    print(f"2. 这些ISBN对应的重复条目总数为 {total_duplicate_entries} 个")
    print(f"3. 其中已在汇报页面中出现的条目: {total_reported} 个")
    print(f"4. 尚未汇报的条目: {total_unreported} 个")
    print("\n分类统计:")
    for category, count in category_stats.items():
        print(f"   - {category}: {count} 组")
    print("========================")
    
    # 写入文件：先按分类写未汇报的条目
    with open(output_file, 'a', encoding='utf-8') as f:
        f.write("===== 未汇报的重复条目 =====" + '\n\n')
        
        # 按分类组织输出
        categorized_unreported = defaultdict(list)
        for isbn, data in duplicates.items():
            if data["unreported_entries"]:
                categorized_unreported[data["category"]].append((isbn, data))
        
        for category, groups in categorized_unreported.items():
            f.write(f"【{category}】({len(groups)}组)\n")
            f.write("----------------------------------------\n")
            
            for i, (isbn, data) in enumerate(groups, 1):
                f.write(f"ISBN {i}: {isbn}\n")
                for entry in data["unreported_entries"]:
                    # 如果是系列，添加标注
                    series_tag = "（系列）" if entry["series"] else ""
                    f.write(f"{entry['url']}{series_tag}\n")
                f.write('\n')
        
        # 再按分类写已汇报的条目
        f.write("\n===== 已汇报的重复条目 =====" + '\n\n')
        
        categorized_reported = defaultdict(list)
        for isbn, data in duplicates.items():
            if data["reported_entries"]:
                categorized_reported[data["category"]].append((isbn, data))
        
        for category, groups in categorized_reported.items():
            f.write(f"【{category}】({len(groups)}组)\n")
            f.write("----------------------------------------\n")
            
            for i, (isbn, data) in enumerate(groups, 1):
                f.write(f"ISBN {i}: {isbn}\n")
                for entry in data["reported_entries"]:
                    # 如果是系列，添加标注
                    series_tag = "（系列）" if entry["series"] else ""
                    f.write(f"{entry['url']}{series_tag}\n")
                f.write('\n')
        
        # 最终统计
        f.write("\n===== 最终统计 =====" + '\n')
        f.write(f"重复的ISBN数量: {total_duplicate_isbns} 个" + '\n')
        f.write(f"总重复条目数量: {total_duplicate_entries} 个" + '\n')
        f.write(f"未汇报的条目数量: {total_unreported} 个" + '\n')
        f.write(f"已汇报的条目数量: {total_reported} 个" + '\n\n')
        
        f.write("分类统计:\n")
        for category, count in category_stats.items():
            f.write(f"   - {category}: {count} 组\n")
    
    print(f"\n结果已保存至 {output_file}")
    print(f"文件中包含 {total_unreported} 个未汇报条目和 {total_reported} 个已汇报条目")

if __name__ == "__main__":
    main()
    