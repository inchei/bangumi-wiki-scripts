import json
import os
import re
import requests
from collections import defaultdict
from datetime import datetime

# 配置
WHITE_LIST = ['9784801921436']
# 从环境变量判断是否为自动化模式（默认手动模式）
AUTO_MODE = os.getenv("AUTO_MODE", "false").lower() == "true"
DEFAULT_INPUT = "bangumi_archive/subject.jsonlines"
DEFAULT_OUTPUT = "duplicate_check_results.txt"

# 尝试导入可选库
try:
    from tqdm import tqdm
    has_tqdm = True
except ImportError:
    has_tqdm = False

try:
    from bs4 import BeautifulSoup
    has_bs4 = True
except ImportError:
    has_bs4 = False
    print("错误：需安装beautifulsoup4库（pip install beautifulsoup4）")


def get_report_page_links() -> list:
    """获取汇报帖链接（自动化模式用环境变量，手动模式用交互输入）"""
    if AUTO_MODE:
        # 自动化模式：从环境变量读取
        report_pages = os.getenv("REPORT_PAGES", "").strip()
        if not report_pages:
            print("自动化模式：未配置汇报帖链接（环境变量 REPORT_PAGES）")
            return []
        links = [link.strip() for link in report_pages.split(',') if link.strip()]
        print(f"自动化模式：已加载 {len(links)} 个汇报帖链接")
        return links
    else:
        # 手动模式：交互式输入
        print("\n请输入汇报帖链接（每行一个，空行结束）：")
        links = []
        i = 1
        while True:
            link = input(f"汇报帖 {i}：").strip()
            if not link:
                print(f"已完成输入，共 {i-1} 个汇报帖链接")
                break
            links.append(link)
            i += 1
        return links


def extract_japanese_isbns(infobox: str) -> list:
    """提取日本ISBN-13（9784开头），记录是否来自版本信息"""
    isbns = []
    patterns = [
        (r'ISBN\s*[:=]\s*(\d[\d-]*\d)', False),
        (r'\[ISBN\s*\|\s*(\d[\d-]*\d)\]', True)
    ]
    
    for pattern, is_version in patterns:
        for match in re.findall(pattern, infobox, re.IGNORECASE):
            isbn = match.replace('-', '').replace(' ', '').strip()
            if isbn.startswith('9784') and len(isbn) == 13:
                if not any(item['isbn'] == isbn for item in isbns):
                    isbns.append({'isbn': isbn, 'is_version': is_version})
    
    return isbns


def extract_subject_links(html_content: str) -> set:
    """从汇报页面提取subject链接"""
    links = set()
    if not has_bs4:
        return links
        
    soup = BeautifulSoup(html_content, 'html.parser')
    link_pattern = re.compile(r'https?://bgm\.tv/subject/(\d+)')
    
    for elem in soup.select('.message'):
        for a_tag in elem.find_all('a', href=True):
            match = link_pattern.match(a_tag['href'])
            if match:
                links.add(f"https://bgm.tv/subject/{match.group(1)}")
        
        for match in link_pattern.finditer(elem.get_text()):
            links.add(f"https://bgm.tv/subject/{match.group(1)}")
    
    return links


def fetch_and_extract_report_links(report_links: list) -> set:
    """获取所有汇报页面并提取链接"""
    all_reported_links = set()
    if not report_links or not has_bs4:
        return all_reported_links
    
    print("\n正在获取汇报页面链接...")
    iterable = tqdm(report_links, desc="处理页面") if has_tqdm else report_links
    
    for link in iterable:
        try:
            response = requests.get(link, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
            }, timeout=15)
            response.raise_for_status()
            all_reported_links.update(extract_subject_links(response.text))
        except Exception as e:
            if not has_tqdm:
                print(f"获取 {link} 失败: {str(e)}")
    
    print(f"共提取到 {len(all_reported_links)} 个已汇报链接")
    return all_reported_links


def normalize_title(title: str) -> str:
    """标准化标题，处理符号差异"""
    title = title.replace('？', '?').replace('！', '!').replace('，', ',').replace('。', '.')
    title = title.replace('；', ';').replace('：', ':').replace('（', '(').replace('）', ')')
    title = title.replace('【', '[').replace('】', ']').replace('“', '"').replace('”', '"')
    title = title.replace('＠', '@').replace('＃', '#').replace('＄', '$')
    title = title.replace('％', '%').replace('＾', '^').replace('＆', '&').replace('＊', '*')
    title = title.replace('－', '-').replace('＿', '_').replace('＋', '+').replace('＝', '=')
    title = title.replace('｛', '{').replace('｝', '}').replace('｜', '|').replace('＼', '\\')
    title = title.replace('＜', '<').replace('＞', '>').replace('？', '?').replace('／', '/')
    title = title.replace('～', '~').replace('〜', '~')
    
    return re.sub(r'[\s\?\!,\.\;\:\(\)\[\]\"\'<>~@#\$%\^&\*\-_\+=\{\}\|\\/]', '', title)


def has_only_numeric_differences(titles: list) -> bool:
    """检查标题是否仅数字差异"""
    if len(titles) < 2:
        return False
    normalized = [re.sub(r'\d+', '', t) for t in titles]
    return all(t == normalized[0] for t in normalized) and any(re.search(r'\d+', t) for t in titles)


def classify_duplicate_group(entries: list) -> str:
    """分类重复条目组"""
    if any(entry.get('series', False) for entry in entries):
        return "疑似系列误填"
    
    titles = [e['name'] for e in entries]
    normalized_titles = [normalize_title(t) for t in titles]
    
    if all(t == normalized_titles[0] for t in normalized_titles):
        return "疑似重复条目"
    if has_only_numeric_differences(titles):
        return "疑似同系列单行本误填"
    return "疑似不同作品误填"


def find_duplicate_isbns(jsonlines_file: str, reported_links: set) -> dict:
    """查找重复ISBN并分类"""
    isbn_map = defaultdict(list)
    if not os.path.exists(jsonlines_file):
        print(f"错误：文件 {jsonlines_file} 不存在")
        return {}
    
    total_lines = sum(1 for _ in open(jsonlines_file, 'r', encoding='utf-8')) if os.path.exists(jsonlines_file) else 0
    print(f"\n正在分析 {jsonlines_file}（共 {total_lines} 行）...")
    
    total_books = 0
    whitelisted = 0
    multi_isbn = 0
    
    with open(jsonlines_file, 'r', encoding='utf-8') as f:
        iterator = tqdm(f, total=total_lines, desc="分析进度") if has_tqdm and total_lines else f
        
        for line_num, line in enumerate(iterator, 1):
            try:
                data = json.loads(line.strip())
                subject_id = data.get('id')
                if not subject_id:
                    continue
                
                name = data.get('name', f"未知名称 (ID: {subject_id})")
                is_series = data.get('series', False)
                isbns = extract_japanese_isbns(data.get('infobox', ''))
                
                if isbns:
                    if len(isbns) > 1:
                        multi_isbn += 1
                    
                    for info in isbns:
                        isbn = info['isbn']
                        if isbn in WHITE_LIST:
                            whitelisted += 1
                            continue
                        
                        total_books += 1
                        url = f"https://bgm.tv/subject/{subject_id}"
                        reported = url in reported_links
                        
                        if not any(e['id'] == subject_id for e in isbn_map[isbn]):
                            isbn_map[isbn].append({
                                "id": subject_id,
                                "url": url,
                                "name": name,
                                "series": is_series,
                                "reported": reported,
                                "is_version": info['is_version']
                            })
            
            except Exception as e:
                if not has_tqdm:
                    print(f"处理第 {line_num} 行出错: {str(e)}")
    
    print(f"发现 {total_books} 个日本ISBN，{multi_isbn} 个多ISBN条目")
    if whitelisted:
        print(f"已跳过 {whitelisted} 个白名单ISBN")
    
    filtered = {}
    for isbn, entries in isbn_map.items():
        if len(entries) >= 2:
            filtered[isbn] = {
                "all": entries,
                "reported": [e for e in entries if e['reported']],
                "unreported": [e for e in entries if not e['reported']],
                "category": classify_duplicate_group(entries)
            }
    
    return filtered


def main():
    if not has_bs4:
        return
        
    print(f"当前白名单: {', '.join(WHITE_LIST) if WHITE_LIST else '无'}")
    
    # 获取汇报帖链接（自动/手动模式分别处理）
    report_links = get_report_page_links()
    reported_links = fetch_and_extract_report_links(report_links)
    
    # 路径处理（自动模式用默认路径，手动模式允许输入）
    if AUTO_MODE:
        input_file = DEFAULT_INPUT
        output_file = DEFAULT_OUTPUT
        print(f"\n使用默认路径:")
        print(f"输入文件: {input_file}")
        print(f"输出文件: {output_file}")
    else:
        input_file = input("\nJSONLines文件路径（默认subject.jsonlines）: ").strip() or "subject.jsonlines"
        output_file = input("结果输出路径（默认duplicate_check_results.txt）: ").strip() or "duplicate_check_results.txt"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("重复ISBN检查结果\n==================\n")
        f.write(f"检查时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        if WHITE_LIST:
            f.write(f"白名单: {', '.join(WHITE_LIST)}\n")
        if report_links:
            f.write(f"汇报帖链接: {', '.join(report_links)}\n\n")
        else:
            f.write("\n")
    
    duplicates = find_duplicate_isbns(input_file, reported_links)
    
    if not duplicates:
        msg = "未发现符合条件的重复ISBN"
        print(msg)
        with open(output_file, 'a') as f:
            f.write(msg + '\n')
        return
    
    stats = defaultdict(int)
    for data in duplicates.values():
        stats[data["category"]] += 1
    
    total_isbns = len(duplicates)
    total_entries = sum(len(d["all"]) for d in duplicates.values())
    total_reported = sum(len(d["reported"]) for d in duplicates.values())
    total_unreported = sum(len(d["unreported"]) for d in duplicates.values())
    
    print("\n===== 结果总结 =====")
    print(f"1. 重复ISBN: {total_isbns} 个")
    print(f"2. 重复条目总数: {total_entries} 个")
    print(f"3. 已汇报: {total_reported} 个")
    print(f"4. 未汇报: {total_unreported} 个")
    print("\n分类统计:")
    for cat, cnt in stats.items():
        print(f"   - {cat}: {cnt} 组")
    
    with open(output_file, 'a', encoding='utf-8') as f:
        f.write("\n===== 未汇报的重复条目 ====\n\n")
        unreported = defaultdict(list)
        for isbn, d in duplicates.items():
            if d["unreported"]:
                unreported[d["category"]].append((isbn, d))
        
        for cat, groups in unreported.items():
            f.write(f"【{cat}】({len(groups)}组)\n{'-'*40}\n")
            for i, (isbn, d) in enumerate(groups, 1):
                f.write(f"ISBN {i}: {isbn}\n")
                for e in d["unreported"]:
                    tags = f"（版本）" if e["is_version"] else ""
                    tags += f"（系列）" if e["series"] else ""
                    f.write(f"{e['url']} - {e['name']}{tags}\n")
                f.write('\n')
        
        f.write("\n===== 已汇报的重复条目 ====\n\n")
        reported = defaultdict(list)
        for isbn, d in duplicates.items():
            if d["reported"]:
                reported[d["category"]].append((isbn, d))
        
        for cat, groups in reported.items():
            f.write(f"【{cat}】({len(groups)}组)\n{'-'*40}\n")
            for i, (isbn, d) in enumerate(groups, 1):
                f.write(f"ISBN {i}: {isbn}\n")
                for e in d["reported"]:
                    tags = f"（版本）" if e["is_version"] else ""
                    tags += f"（系列）" if e["series"] else ""
                    f.write(f"{e['url']} - {e['name']}{tags}\n")
                f.write('\n')
        
        f.write("\n===== 最终统计 =====\n")
        f.write(f"重复ISBN: {total_isbns} 个\n")
        f.write(f"总重复条目: {total_entries} 个\n")
        f.write(f"未汇报: {total_unreported} 个\n")
        f.write(f"已汇报: {total_reported} 个\n\n")
        f.write("分类统计:\n")
        for cat, cnt in stats.items():
            f.write(f"   - {cat}: {cnt} 组\n")
    
    print(f"\n结果已保存至 {output_file}")


if __name__ == "__main__":
    main()
    
