import json
import os
import regex as re
import csv
from tqdm import tqdm
from collections import defaultdict
from datetime import datetime

# 条目类型映射（中文到数字的映射）
TYPE_CN_TO_NUM = {
    "书籍": 1,
    "动画": 2,
    "音乐": 3,
    "游戏": 4,
    "三次元": 6
}

# 关系类型定义（按条目类型区分）
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

# 按条目类型拆分职位定义
# 1: 书籍
BOOK_STAFF = {
    2001: "作者", 2002: "作画", 2003: "插图", 2004: "出版社", 2005: "连载杂志", 2006: "译者",
    2007: "原作", 2008: "客串", 2009: "人物原案", 2010: "脚本", 2011: "书系", 2012: "出品方",
    2013: "图书品牌"
}

# 2: 动画
ANIME_STAFF = {
    1: "原作", 2: "导演", 3: "脚本", 4: "分镜", 5: "演出", 6: "音乐", 7: "人物原案", 8: "人物设定",
    9: "构图", 10: "系列构成", 11: "美术监督", 13: "色彩设计", 14: "总作画监督", 15: "作画监督",
    16: "机械设定", 17: "摄影监督", 18: "监修", 19: "道具设计", 20: "原画", 21: "第二原画",
    22: "动画检查", 24: "制作助理", 25: "背景美术", 26: "色彩指定", 27: "数码绘图", 28: "剪辑",
    29: "原案", 30: "主题歌编曲", 31: "主题歌作曲", 32: "主题歌作词", 33: "主题歌演出", 34: "插入歌演出",
    35: "企画", 36: "企划制作人", 37: "制作管理", 38: "宣传", 39: "录音", 40: "录音助理",
    41: "系列监督", 42: "製作", 43: "设定", 44: "音响监督", 45: "音响", 46: "音效",
    47: "特效", 48: "配音监督", 49: "联合导演", 50: "背景设定", 51: "补间动画", 52: "执行制片人",
    53: "助理制片人", 54: "制片人", 55: "音乐助理", 56: "制作进行", 57: "演员监督", 58: "总制片人",
    59: "联合制片人", 60: "台词编辑", 61: "后期制片协调", 62: "制作助理", 63: "制作", 64: "制作协调",
    65: "音乐制作", 66: "特别鸣谢", 67: "动画制作", 69: "CG 导演", 70: "机械作画监督", 71: "美术设计",
    72: "副导演", 73: "OP・ED 分镜", 74: "总导演", 75: "3DCG", 76: "制作协力", 77: "动作作画监督",
    80: "监制", 81: "协力", 82: "摄影", 83: "制作进行协力", 84: "设定制作", 85: "音乐制作人",
    86: "3DCG 导演", 87: "动画制片人", 88: "特效作画监督", 89: "主演出", 90: "作画监督助理", 91: "演出助理",
    92: "主动画师", 93: "上色", 94: "上色检查", 95: "色彩检查", 96: "美术板", 97: "美术",
    98: "印象板", 99: "2D 设计", 100: "3D 设计", 101: "技术导演", 102: "特技导演", 103: "色彩脚本",
    104: "分镜协力", 105: "分镜抄写", 106: "副人物设定", 107: "客座人物设定", 108: "构图监修", 109: "构图作画监督",
    110: "总作画监督助理", 111: "道具作画监督", 112: "概念设计", 113: "服装设计", 114: "标题设计", 115: "设定协力",
    116: "音乐监督", 117: "选曲", 118: "插入歌作词", 119: "插入歌作曲", 120: "插入歌编曲", 121: "创意制片人",
    122: "副制片人", 123: "制作统括", 124: "现场制片人", 125: "文艺制作", 127: "企画协力", 128: "OP・ED 演出",
    129: "Bank 分镜演出", 130: "Live 分镜演出", 131: "剧中剧分镜演出", 132: "剧中剧人设", 133: "视觉导演", 134: "创意总监",
    135: "特摄效果", 136: "视觉效果", 137: "动作导演"
}

# 3: 音乐
MUSIC_STAFF = {
    3001: "艺术家", 3002: "制作人", 3003: "作曲", 3004: "厂牌", 3005: "原作", 3006: "作词",
    3007: "录音", 3008: "编曲", 3009: "插图", 3010: "脚本", 3011: "出版方", 3012: "母带制作",
    3013: "混音", 3014: "乐器", 3015: "声乐"
}

# 4: 游戏
GAME_STAFF = {
    1001: "开发", 1002: "发行", 1003: "游戏设计师", 1004: "剧本", 1005: "美工", 1006: "音乐",
    1007: "关卡设计", 1008: "人物设定", 1009: "主题歌作曲", 1010: "主题歌作词", 1011: "主题歌演出", 1012: "插入歌演出",
    1013: "原画", 1014: "动画制作", 1015: "原作", 1016: "导演", 1017: "动画监督", 1018: "制作总指挥",
    1019: "QC", 1020: "动画剧本", 1021: "程序", 1022: "协力", 1023: "CG 监修", 1024: "SD原画",
    1025: "背景", 1026: "监修", 1027: "系列构成", 1028: "企画", 1029: "机械设定", 1030: "音响监督",
    1031: "作画监督", 1032: "制作人", 1033: "海报"
}

# 6: 三次元
REAL_STAFF = {
    4001: "原作", 4002: "导演", 4003: "编剧", 4004: "音乐", 4005: "执行制片人", 4006: "共同执行制作",
    4007: "制片人/制作人", 4008: "监制", 4009: "副制作人/制作顾问", 4010: "故事", 4011: "编审", 4012: "剪辑",
    4013: "创意总监", 4014: "摄影", 4015: "主题歌演出", 4016: "主演", 4017: "配角", 4018: "制作",
    4019: "出品", 4020: "配音导演", 4021: "录音", 4022: "海报"
}

# 按类型整合职位信息
TYPE_STAFF_MAP = {
    1: BOOK_STAFF,
    2: ANIME_STAFF,
    3: MUSIC_STAFF,
    4: GAME_STAFF,
    6: REAL_STAFF
}


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
    """解析日期，支持多种格式"""
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


def load_staff_data(archive_dir):
    """加载人物关联数据（subject-persons.jsonlines）并显示进度条"""
    staff_file = os.path.join(archive_dir, "subject-persons.jsonlines")
    if not os.path.exists(staff_file):
        return None
    
    # 先统计文件总行数，用于进度条
    print("正在准备加载人物关联数据...")
    with open(staff_file, 'r', encoding='utf-8') as f:
        total_lines = sum(1 for _ in f)  # 计算总行数
    
    staff_data = defaultdict(list)  # key: subject_id, value: 该条目下的所有staff信息列表
    print("正在加载人物关联数据...")
    with open(staff_file, 'r', encoding='utf-8') as f:
        # 使用tqdm显示进度条，total为总行数
        for line in tqdm(f, total=total_lines, desc="加载进度"):
            try:
                data = json.loads(line.strip())
                subject_id = str(data['subject_id'])  # 统一转为字符串，避免ID类型不一致
                staff_data[subject_id].append(data)
            except (json.JSONDecodeError, KeyError, TypeError):
                continue  # 跳过格式错误的行
    print(f"人物关联数据加载完成，共处理 {total_lines} 条记录")
    return staff_data


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


def get_relation_count(subject_id, rel_cn, relations_data, subject_type):
    """统计指定条目的指定关系数量（按条目类型过滤关系）"""
    # 1. 根据条目类型获取对应关系表，避免跨类型统计
    type_relation_map = {
        1: BOOK_RELATIONS,    # 书籍
        2: ANIME_RELATIONS,   # 动画
        3: MUSIC_RELATIONS,   # 音乐
        4: GAME_RELATIONS,    # 游戏
        6: REAL_RELATIONS     # 三次元
    }
    # 非目标类型直接返回0
    if subject_type not in type_relation_map:
        return 0
    target_relation_map = type_relation_map[subject_type]
    
    # 2. 确认关系名在当前类型的关系表中存在
    rel_id = None
    for id, name in target_relation_map.items():
        if name == rel_cn:
            rel_id = id
            break
    if rel_id is None:
        return 0  # 非当前类型的关系，返回0
    
    # 3. 统计符合条件的关系数量
    subject_rels = relations_data.get(subject_id, [])
    count = 0
    for rel in subject_rels:
        if rel.get('relation_type') == rel_id:
            count += 1
    return count


def matches_condition(value, condition, data=None, relations_data=None, count_results=None):
    """检查条件匹配，记录count统计结果"""
    if not condition:
        return True

    # 处理{{count:中文关系名}}
    count_pattern = re.compile(r'\{\{count:\s*([^}]+?)\s*\}\}')
    count_match = count_pattern.search(condition)
    if count_match and relations_data and data and count_results is not None:
        rel_cn = count_match.group(1).strip()
        subject_id = int(data.get('id', 0))
        subject_type = int(data.get('type', 0))  # 获取当前条目的类型
        if subject_id == 0:
            print("警告：当前条目无ID，无法统计关系数量")
            rel_count = 0
        else:
            rel_count = get_relation_count(subject_id, rel_cn, relations_data, subject_type)
        count_key = f"count_{rel_cn}"
        count_results[count_key] = rel_count
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


def check_related_subject(related_data, original_data, related_conditions, match_mode):
    """检查关联条目条件，支持any/all模式"""
    if not related_conditions or not related_data:
        return True
    
    # 收集每个条件的匹配结果
    cond_results = []
    for field, condition in related_conditions:
        related_value = extract_field_value(related_data, field)
        original_ref_pattern = re.compile(r'^\{\{\{\s*(\w+)\s*\}\}\}$')
        original_ref_match = original_ref_pattern.match(condition)
        if original_ref_match and original_data is not None:
            ref_field = original_ref_match.group(1)
            ref_value = extract_field_value(original_data, ref_field)
            cond_results.append(related_value == ref_value)
            continue
        cond_results.append(matches_condition(related_value, condition, related_data))
    
    # 根据模式返回结果
    return any(cond_results) if match_mode == 'any' else all(cond_results)


def check_staff_conditions(subject_id, staff_data, staff_filters, subject_type):
    """检查人物筛选条件，支持any/all模式"""
    if not staff_filters or not staff_data:
        return True
        
    if subject_type not in TYPE_STAFF_MAP:
        return False  # 无对应staff，不满足条件
    
    # 根据条目类型获取对应的职位表
    staff_positions = TYPE_STAFF_MAP[subject_type]
    # 创建中文职位到ID的映射（仅针对当前类型）
    cn_to_position_id = {v: k for k, v in staff_positions.items()}
    
    subject_id_str = str(subject_id)
    subject_staffs = staff_data.get(subject_id_str, [])
    if not subject_staffs:
        return False  # 无对应staff，不满足条件
    
    # 逐个检查staff筛选条件（每个条件含：职位名、匹配模式any/all、条件列表）
    for pos_cn, match_mode, staff_conds in staff_filters:
        # 根据当前条目类型查找职位ID
        pos_id = cn_to_position_id.get(pos_cn)
        if pos_id is None:
            print(f"警告：类型{subject_type}中不存在职位'{pos_cn}'，跳过该条件")
            continue
            
        # 筛选当前职位的所有staff
        matched_staffs = [staff for staff in subject_staffs if staff.get('position') == pos_id]
        staff_count = len(matched_staffs)  # 统计该职位的人物数量
        
        # 处理数量统计条件
        count_cond = None
        normal_conds = []
        for field, cond in staff_conds:
            if field == 'count':
                count_cond = cond
            else:
                normal_conds.append((field, cond))
        
        # 数量条件判断
        if count_cond:
            processed_cond = count_cond
            count_pattern = re.compile(r'\{\{count:\s*([^}]+?)\s*\}\}')
            count_match = count_pattern.search(processed_cond)
            if count_match:
                target_pos_cn = count_match.group(1).strip()
                target_pos_id = cn_to_position_id.get(target_pos_cn)
                target_count = sum(1 for staff in subject_staffs if staff.get('position') == target_pos_id) if target_pos_id else 0
                processed_cond = count_pattern.sub(str(target_count), processed_cond)
            if not matches_condition(str(staff_count), processed_cond):
                return False
        
        # 多字段条件判断
        staff_match_results = []
        for staff in matched_staffs:
            cond_match = True
            for field, cond in normal_conds:
                staff_value = str(staff.get(field, '')).strip()
                if not matches_condition(staff_value, cond, staff):
                    cond_match = False
                    break
            staff_match_results.append(cond_match)
        
        # 根据匹配模式判断结果
        if match_mode == 'any' and not any(staff_match_results):
            return False  # 任意满足模式：无一个满足则不通过
        if match_mode == 'all' and not all(staff_match_results):
            return False  # 全部满足模式：有一个不满足则不通过
    
    return True


def get_user_filters():
    """获取用户筛选条件"""
    filters = []
    relation_filters = []  # 结构：(关系名, 条件列表, 是否否定, 匹配模式any/all)
    tag_filters = []  # 普通标签筛选，格式：(标签名, 是否排除)
    meta_tag_filters = []  # 元标签筛选，格式：(标签名, 是否排除)
    staff_filters = []  # 结构：(职位名, 匹配模式any/all, 条件列表)
    i = 1
    print("请添加筛选条件（输入空行结束添加）")
    print("格式说明：")
    print("- 条目类型（数字）：type:数字（例：type:2 表示动画）")
    print("- 条目类型（中文）：直接输入中文类型（例：动画 等效于 type:2）")
    print("- 普通字段：字段名:条件（例：出版社:角川、发售日:re:\\d{4}）")
    print("- 所有字段（全局匹配）：*:条件（例：*:re:完结$ 匹配任意字段值以“完结”结尾的条目）")
    print("- 数字比较：字段名:大于:值 或 字段名:小于:值（例：评分:大于:8、集数:小于:13）")
    print("- 日期比较：字段名:早于:日期 或 字段名:晚于:日期（例：发售日:晚于:2023-01-01）")
    print("- 字段引用自身：字段名:{{目标字段名}}（例：开始:{{发售日}}）")
    print("- 关系数量统计：字段名:比较符:{{count:中文关系名}}（例：册数:小于:{{count:单行本}}）")
    print("- 条目关联（单行any模式）：关系名:字段名:条件（例：单行本:发售日:re:\\d{4}，'其他'关系不可用）")
    print("- 条目关联（单行all模式）：relation:关系名:all:字段名:条件（例：relation:单行本:all:出版社:角川）")
    print("- 条目关联（多行any模式）：直接输入关系名（例：单行本，回车后输入条件，'其他'关系不可用）")
    print("- 条目关联（多行all模式）：relation:关系名:all（回车后输入条件，例：relation:其他:all）")
    print("- 条目关联（不含该关系）：relation:!关系名")
    print("- 普通标签筛选：tag:标签名 或 tag:!标签名（例：tag:轻小说、tag:!动画）")
    print("- 元标签筛选：meta_tag:标签名 或 meta_tag:!标签名（例：meta_tag:TV、meta_tag:!日本）")
    print("- 人物筛选（单行any模式）：staff:职位名:字段名:条件（例：staff:原画:appear_eps:re:.*）")
    print("- 人物筛选（单行all模式）：staff:职位名:all:字段名:条件（例：staff:脚本:all:person_id:100）")
    print("- 人物筛选（多行any模式）：staff:职位名（回车后输入条件）")
    print("- 人物筛选（多行all模式）：staff:职位名:all（回车后输入条件）")

    while True:
        condition_str = input(f"\n条件 {i} (输入空行结束)：").strip()
        if not condition_str:
            if i == 1:
                print("未添加任何筛选条件")
            else:
                print(f"已完成筛选条件添加，共设置 {i-1} 个条件")
            break

        # 处理中文类型筛选（直接输入"动画"等效于"type:2"）
        if condition_str in TYPE_CN_TO_NUM:
            type_num = TYPE_CN_TO_NUM[condition_str]
            filters.append(('type', str(type_num)))
            print(f"已添加类型筛选：type:{type_num}（{condition_str}）")
            i += 1
            continue

        # 处理staff筛选条件
        if condition_str.startswith('staff:'):
            parts = condition_str.split(':', 4)  # 支持 staff:职位:all:字段:条件 或 staff:职位:all
            if len(parts) < 2:
                print("格式错误：staff筛选需满足 staff:职位名 或 staff:职位名:all")
                continue
                
            _, pos_cn = parts[0], parts[1].strip()
            if not pos_cn:
                print("错误：职位名不能为空")
                continue
                
            # 解析模式（默认any，含:all则为all）
            match_mode = 'any'
            remaining_parts = []
            if len(parts) >= 3 and parts[2].strip() == 'all':
                match_mode = 'all'
                remaining_parts = parts[3:] if len(parts) >= 4 else []
            else:
                remaining_parts = parts[2:] if len(parts) >= 3 else []
            
            # 处理单行模式（staff:导演:all:name:新房昭之）
            if remaining_parts and ':' in ''.join(remaining_parts):
                if len(remaining_parts) < 2:
                    print("格式错误：单行模式需满足 staff:职位名:字段:条件 或 staff:职位名:all:字段:条件")
                    continue
                field, cond = remaining_parts[0].strip(), ':'.join(remaining_parts[1:]).strip()
                staff_filters.append((pos_cn, match_mode, [(field, cond)]))
                print(f"已添加人物筛选：{pos_cn}（{match_mode}模式），条件：{field}:{cond}")
                i += 1
                continue
            
            # 处理多行模式（staff:导演:all 后接多行条件）
            print(f"设置'{pos_cn}'的人物条件（格式：字段名:条件，空行结束），匹配模式：{match_mode}")
            staff_conds = []
            while True:
                related_cond = input("人物条件: ").strip()
                if not related_cond:
                    break
                if ':' not in related_cond:
                    print("格式错误：条件需包含冒号（字段名:条件），跳过")
                    continue
                field, cond = [p.strip() for p in related_cond.split(':', 1)]
                staff_conds.append((field, cond))
            
            if not staff_conds:
                print(f"已添加人物筛选：{pos_cn}（{match_mode}模式，无附加条件）")
            else:
                print(f"已添加人物筛选：{pos_cn}（{match_mode}模式），共{len(staff_conds)}个条件")
            staff_filters.append((pos_cn, match_mode, staff_conds))
            i += 1
            continue

        # 处理无relation:前缀的关系筛选（仅允许非"其他"关系）
        all_relations = [rel for rel_dict in [ANIME_RELATIONS, BOOK_RELATIONS, MUSIC_RELATIONS, GAME_RELATIONS, REAL_RELATIONS] for rel in rel_dict.values()]
        if condition_str in all_relations:
            rel_cn = condition_str
            # 禁止"其他"关系省略relation:
            if rel_cn == '其他':
                print("错误：关系'其他'不可省略relation:，请使用 relation:其他 格式")
                continue
            # 默认为any模式
            print(f"设置'{rel_cn}'的关联条件（格式：字段名:条件，空行结束），匹配模式：any")
            rel_conds = []
            while True:
                related_cond = input("关联条件: ").strip()
                if not related_cond:
                    break
                if ':' not in related_cond:
                    print("格式错误：条件需包含冒号（字段名:条件），跳过")
                    continue
                field, cond = [p.strip() for p in related_cond.split(':', 1)]
                rel_conds.append((field, cond))
            relation_filters.append((rel_cn, rel_conds, False, 'any'))
            i += 1
            continue

        # 处理带relation:前缀的筛选
        if condition_str.startswith('relation:'):
            parts = condition_str.split(':', 4)  # 拆分 relation:关系:all:字段:条件
            if len(parts) < 2:
                print("格式错误：relation筛选需满足 relation:关系名 或 relation:关系名:all 或 relation:!关系名")
                continue
                
            _, rel_part = parts[0], parts[1].strip()
            negate = False
            rel_cn = rel_part
            
            # 处理否定关系（relation:!关系名）
            if rel_part.startswith('!'):
                negate = True
                rel_cn = rel_part[1:].strip()
                if not rel_cn:
                    print("错误：关系名不能为空")
                    continue
                # 默认为any模式（否定模式下模式不影响结果）
                relation_filters.append((rel_cn, [], negate, 'any'))
                print(f"已添加关系筛选：不包含'{rel_cn}'")
                i += 1
                continue
            
            # 校验关系名合法性
            is_valid_rel = any(rel_cn in rel_dict.values() for rel_dict in [ANIME_RELATIONS, BOOK_RELATIONS, MUSIC_RELATIONS, GAME_RELATIONS, REAL_RELATIONS])
            if not is_valid_rel:
                print(f"错误：未找到关系名称 '{rel_cn}'")
                continue
            
            # 解析模式（默认any，含:all则为all）
            match_mode = 'any'
            remaining_parts = []
            if len(parts) >= 3 and parts[2].strip() == 'all':
                match_mode = 'all'
                remaining_parts = parts[3:] if len(parts) >= 4 else []
            else:
                remaining_parts = parts[2:] if len(parts) >= 3 else []
            
            # 处理单行模式（relation:单行本:all:发售日:re:\d{4}）
            rel_conds = []
            if remaining_parts and ':' in ''.join(remaining_parts):
                if len(remaining_parts) < 2:
                    print("格式错误：单行模式需满足 relation:关系名:字段:条件 或 relation:关系名:all:字段:条件")
                    continue
                field, cond = remaining_parts[0].strip(), ':'.join(remaining_parts[1:]).strip()
                rel_conds.append((field, cond))
                relation_filters.append((rel_cn, rel_conds, False, match_mode))
                print(f"已添加关系筛选：{rel_cn}（{match_mode}模式），条件：{field}:{cond}")
                i += 1
                continue
            
            # 处理多行模式（relation:单行本:all 后接多行条件）
            print(f"设置'{rel_cn}'的关联条件（格式：字段名:条件，空行结束），匹配模式：{match_mode}")
            while True:
                related_cond = input("关联条件: ").strip()
                if not related_cond:
                    break
                if ':' not in related_cond:
                    print("格式错误：条件需包含冒号（字段名:条件），跳过")
                    continue
                field, cond = [p.strip() for p in related_cond.split(':', 1)]
                rel_conds.append((field, cond))
            
            if not rel_conds:
                print(f"已添加关系筛选：{rel_cn}（{match_mode}模式，无附加条件）")
            else:
                print(f"已添加关系筛选：{rel_cn}（{match_mode}模式），共{len(rel_conds)}个条件")
            relation_filters.append((rel_cn, rel_conds, False, match_mode))
            i += 1
            continue

        # 处理普通字段/全局字段筛选
        if ':' not in condition_str:
            print(f"未识别的条件格式：'{condition_str}'，请检查是否为中文类型（支持：{', '.join(TYPE_CN_TO_NUM.keys())}）")
            continue
        key_part, value_part = [p.strip() for p in condition_str.split(':', 1)]
        filters.append((key_part, value_part))
        i += 1

    return filters, relation_filters, tag_filters, meta_tag_filters, staff_filters


def group_filters_by_field(filters):
    """按字段分组筛选条件"""
    grouped = defaultdict(list)
    for field, condition in filters:
        grouped[field].append(condition)
    return dict(grouped)


def collect_count_fields(filters):
    """从筛选条件中提取所有count字段"""
    count_fields = set()
    count_pattern = re.compile(r'\{\{count:\s*([^}]+?)\s*\}\}')
    for field, cond in filters:
        match = count_pattern.search(cond)
        if match:
            rel_cn = match.group(1).strip()
            count_field = f"count_{rel_cn}"
            count_fields.add(count_field)
    return sorted(count_fields)


def get_relevant_fields(filters, relation_filters, staff_filters):
    """提取所有与筛选相关的字段，包含staff字段"""
    relevant_fields = set()
    
    # 添加普通筛选字段（排除全局匹配符*）
    for field, _ in filters:
        if field != '*':
            relevant_fields.add(field)
    
    # 添加关系筛选中涉及的字段
    for _, related_conditions, _, _ in relation_filters:
        for field, _ in related_conditions:
            relevant_fields.add(field)
    
    # 添加staff筛选中涉及的字段
    for _, _, staff_conds in staff_filters:
        for field, _ in staff_conds:
            relevant_fields.add(field)
    
    # 处理全局匹配中实际匹配的字段引用
    for field, cond in filters:
        if field == '*':
            ref_pattern = re.compile(r'\{\{\s*(\w+)\s*\}\}')
            matches = ref_pattern.findall(cond)
            for match in matches:
                relevant_fields.add(match)
    
    return sorted(relevant_fields)


def write_csv_file(output_csv_file, results, relevant_fields, relation_filters, all_subjects, count_fields, 
                  tag_filters, meta_tag_filters, staff_filters, staff_data):
    """生成CSV文件"""
    related_fields = set()
    for rel_cn, related_conditions, _, _ in relation_filters:
        for field, _ in related_conditions:
            related_fields.add(field)
    related_fields = list(related_fields)

    # 按关系名统计最大关联条目数
    max_relations = defaultdict(int)
    for result in results:
        for rel_cn, related_ids in result['relations'].items():
            max_relations[rel_cn] = max(max_relations[rel_cn], len(related_ids) if isinstance(related_ids, list) else 0)

    # 构建表头
    headers = ['ID', 'URL', '类型(数字)', '类型(中文)'] + relevant_fields
    if count_fields:
        headers.extend(count_fields)
    
    # 添加标签列
    if tag_filters:
        headers.append("匹配的普通标签")
    if meta_tag_filters:
        headers.append("匹配的元标签")

    # 添加职位人数统计列
    staff_count_headers = [f"staff_{pos_cn}_count" for pos_cn, _, _ in staff_filters]
    headers.extend(staff_count_headers)

    # 添加模式说明列
    if relation_filters:
        headers.append("关系匹配模式说明")
    if staff_filters:
        headers.append("人物匹配模式说明")

    num_to_type_cn = {v: k for k, v in TYPE_CN_TO_NUM.items()}
    # 按关系名生成关联字段表头
    for rel_cn, related_conditions, negate, _ in relation_filters:
        prefix = "no_" if negate else ""
        rel_base = f"{prefix}{rel_cn}"
        max_cnt = max_relations[rel_cn]
        for idx in range(1, max_cnt + 1):
            for field in related_fields:
                headers.append(f"{rel_base}_{idx}_{field}")
        for idx in range(1, max_cnt + 1):
            headers.append(f"{rel_base}_{idx}_ID")

    # 添加staff相关列
    if staff_filters and staff_data:
        for pos_cn, _, staff_conds in staff_filters:
            fields = {field for field, _ in staff_conds if field != 'count'}
            if not fields:
                continue
                
            max_cnt = 0
            for result in results:
                sid = result['id']
                subject_type = result.get('type', 0)
                if subject_type not in TYPE_STAFF_MAP:
                    continue
                staff_positions = TYPE_STAFF_MAP[subject_type]
                cn_to_position_id = {v: k for k, v in staff_positions.items()}
                pos_id = cn_to_position_id.get(pos_cn)
                if pos_id is None:
                    continue
                subject_staffs = staff_data.get(sid, []) if staff_data else []
                count = sum(1 for staff in subject_staffs if staff.get('position') == pos_id)
                max_cnt = max(max_cnt, count)
            
            for field in fields:
                for idx in range(1, max_cnt + 1):
                    headers.append(f"staff_{pos_cn}_{idx}_{field}")
                    headers.append(f"staff_{pos_cn}_{idx}_person_id")

    # 写入CSV行数据
    with open(output_csv_file, 'w', encoding='utf-8-sig', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        for result in results:
            sid = result['id']
            subject_type = result.get('type', 0)
            type_cn = num_to_type_cn.get(subject_type, f"未知类型({subject_type})")
            
            row = [sid, result['url'], subject_type, type_cn]
            # 筛选相关字段值
            for field in relevant_fields:
                row.append(result['fields'].get(field, ''))
            # count字段值
            if count_fields:
                for count_field in count_fields:
                    row.append(result['counts'].get(count_field, 0))
            
            # 添加标签信息
            if tag_filters:
                subject_data = all_subjects.get(sid, {})
                tag_names = [tag['name'] for tag in subject_data.get('tags', [])]
                matched_tags = [tag for tag, negate in tag_filters 
                               if (not negate and tag in tag_names) or (negate and tag not in tag_names)]
                row.append(",".join(matched_tags))
            
            if meta_tag_filters:
                subject_data = all_subjects.get(sid, {})
                meta_tags = subject_data.get('meta_tags', [])
                matched_meta_tags = [tag for tag, negate in meta_tag_filters 
                                   if (not negate and tag in meta_tags) or (negate and tag not in meta_tags)]
                row.append(",".join(matched_meta_tags))

            # 添加职位人数统计
            if staff_filters and staff_data and subject_type in TYPE_STAFF_MAP:
                staff_positions = TYPE_STAFF_MAP[subject_type]
                cn_to_position_id = {v: k for k, v in staff_positions.items()}
                subject_staffs = staff_data.get(sid, []) if staff_data else []
                
                for pos_cn, _, _ in staff_filters:
                    pos_id = cn_to_position_id.get(pos_cn)
                    if pos_id is None:
                        row.append("N/A（职位不存在）")
                        continue
                    count = sum(1 for staff in subject_staffs if staff.get('position') == pos_id)
                    row.append(count)
            elif staff_filters:
                for _ in staff_filters:
                    row.append("N/A（无数据）")

            # 添加模式说明
            if relation_filters:
                rel_mode_desc = "; ".join([f"{rel_cn}:{mode}" for rel_cn, _, _, mode in relation_filters])
                row.append(rel_mode_desc)
            if staff_filters:
                staff_mode_desc = "; ".join([f"{pos_cn}:{mode}" for pos_cn, mode, _ in staff_filters])
                row.append(staff_mode_desc)

            # 按关系名写入关联数据
            for rel_cn, related_conditions, negate, _ in relation_filters:
                prefix = "no_" if negate else ""
                rel_base = f"{prefix}{rel_cn}"
                related_ids = result['relations'].get(rel_cn, [])
                max_cnt = max_relations[rel_cn]
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

            # 添加staff相关信息
            if staff_filters and staff_data and subject_type in TYPE_STAFF_MAP:
                staff_positions = TYPE_STAFF_MAP[subject_type]
                cn_to_position_id = {v: k for k, v in staff_positions.items()}
                subject_staffs = staff_data.get(sid, []) if staff_data else []
                
                for pos_cn, _, staff_conds in staff_filters:
                    fields = {field for field, _ in staff_conds if field != 'count'}
                    if not fields:
                        continue
                        
                    pos_id = cn_to_position_id.get(pos_cn)
                    if pos_id is None:
                        max_cnt = 0
                        for result_item in results:
                            st = result_item.get('type', 0)
                            if st not in TYPE_STAFF_MAP:
                                continue
                            sp = TYPE_STAFF_MAP[st]
                            cnp = {v: k for k, v in sp.items()}
                            if cnp.get(pos_cn) is not None:
                                max_cnt = 1
                                break
                        for field in fields:
                            for idx in range(1, max_cnt + 1):
                                row.append("N/A（职位不存在）")
                                row.append("")
                        continue
                        
                    matched_staffs = [staff for staff in subject_staffs if staff.get('position') == pos_id]
                    max_cnt = 0
                    for result_item in results:
                        st = result_item.get('type', 0)
                        if st != subject_type:
                            continue
                        ss = staff_data.get(result_item['id'], []) if staff_data else []
                        cnt = sum(1 for s in ss if s.get('position') == pos_id)
                        max_cnt = max(max_cnt, cnt)
                    
                    for field in fields:
                        for idx in range(1, max_cnt + 1):
                            staff = matched_staffs[idx-1] if (idx-1) < len(matched_staffs) else None
                            val = str(staff.get(field, '')) if staff else ""
                            row.append(val)
                            pid = str(staff.get('person_id', '')) if staff else ""
                            row.append(pid)

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
    for rel_cn, related_conditions, negate, _ in relation_filters:
        if not negate and related_conditions:
            return True
    return False


def check_tag_conditions(data, tag_filters):
    """检查普通标签条件"""
    if not tag_filters:
        return True
    
    tag_names = [tag['name'] for tag in data.get('tags', [])]
    
    for tag_name, negate in tag_filters:
        tag_exists = tag_name in tag_names
        if (negate and tag_exists) or (not negate and not tag_exists):
            return False
    
    return True


def check_meta_tag_conditions(data, meta_tag_filters):
    """检查元标签条件"""
    if not meta_tag_filters:
        return True
    
    meta_tags = data.get('meta_tags', [])
    
    for tag_name, negate in meta_tag_filters:
        tag_exists = tag_name in meta_tags
        if (negate and tag_exists) or (not negate and not tag_exists):
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
    filters, relation_filters, tag_filters, meta_tag_filters, staff_filters = get_user_filters()
    if not filters and not relation_filters and not tag_filters and not meta_tag_filters and not staff_filters:
        print("未设置任何筛选条件，程序退出")
        return

    # 提取相关字段
    relevant_fields = get_relevant_fields(filters, relation_filters, staff_filters)
    
    # 显示筛选条件
    grouped_filters = group_filters_by_field(filters)
    unique_fields = list(grouped_filters.keys())
    print("\n===== 筛选条件 =====")
    # 普通字段条件
    for i, (field, conds) in enumerate(grouped_filters.items(), 1):
        if field == '*':
            print(f"{i}. 所有字段:")
        else:
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
    for i, (rel_cn, rel_conds, negate, rel_mode) in enumerate(relation_filters, rel_idx):
        print(f"{i}. 关系: {'不包含' if negate else '包含'} {rel_cn}（{rel_mode}模式）")
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
        print(f"{i}. 普通标签: {'不包含' if negate else '包含'} '{tag}'")
    
    # 元标签条件
    meta_tag_idx = tag_idx + len(tag_filters)
    for i, (tag, negate) in enumerate(meta_tag_filters, meta_tag_idx):
        print(f"{i}. 元标签: {'不包含' if negate else '包含'} '{tag}'")
    
    # staff条件
    staff_idx = meta_tag_idx + len(meta_tag_filters)
    for i, (pos_cn, match_mode, staff_conds) in enumerate(staff_filters, staff_idx):
        mode_desc = "任意满足" if match_mode == 'any' else "全部满足"
        print(f"{i}. 人物筛选: 职位 '{pos_cn}'（{mode_desc}模式）")
        if staff_conds:
            print("   人物条件:")
            for j, (field, cond) in enumerate(staff_conds, 1):
                count_flag = "（数量统计）" if field == 'count' else ""
                if cond.startswith('re:'):
                    print(f"     条件 {j}: 字段 '{field}'{count_flag} 正则匹配 '{cond[3:]}'")
                elif cond.startswith(('大于:', '小于:', '早于:', '晚于:')):
                    op, val = cond.split(':', 1)
                    print(f"     条件 {j}: 字段 '{field}'{count_flag} {op} '{val.strip()}'")
                else:
                    print(f"     条件 {j}: 字段 '{field}'{count_flag} 包含文本 '{cond}'")
    
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

    # 加载staff数据
    staff_data = None
    if staff_filters:
        staff_data = load_staff_data(archive_dir)
        if not staff_data:
            print("错误：需人物筛选，但未找到 subject-persons.jsonlines 文件")
            return

    # 预加载控制
    need_preload = needs_full_load(relation_filters)
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

    # 提取count字段
    count_fields = collect_count_fields(filters)

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

                # 获取当前条目的类型
                subject_type = data.get('type', 0)
                try:
                    subject_type = int(subject_type)
                except (ValueError, TypeError):
                    subject_type = 0

                # 1. 标签检查
                if not check_tag_conditions(data, tag_filters):
                    continue
                if not check_meta_tag_conditions(data, meta_tag_filters):
                    continue

                # 2. 字段条件检查
                field_values = {}
                count_results = {}
                all_matched = True
                
                global_conditions = grouped_filters.get('*', [])
                normal_fields = [f for f in unique_fields if f != '*']

                # 普通字段检查
                for field in normal_fields:
                    val = extract_field_value(data, field)
                    field_values[field] = val
                    for cond in grouped_filters[field]:
                        if not matches_condition(val, cond, data, relations_data, count_results):
                            all_matched = False
                            break
                    if not all_matched:
                        break

                # 全局条件检查
                matched_global_fields = set()
                if all_matched and global_conditions:
                    global_matched = False
                    all_fields = []
                    exclude_fields = {'id', 'url', 'tags', 'meta_tags', 'relations', 'infobox', 'created_at', 'updated_at'}
                    all_fields.extend([f for f in data.keys() if f not in exclude_fields and isinstance(data[f], (str, int, float, bool))])
                    
                    infobox = data.get('infobox', '')
                    if infobox:
                        infobox_field_pattern = re.compile(r'\|(\w+)\s*[:=]\s*.*?(?:\s*\||\s*}}|\r\n|\n)', re.IGNORECASE)
                        all_fields.extend(infobox_field_pattern.findall(infobox))
                    
                    for field in all_fields:
                        val = extract_field_value(data, field)
                        for cond in global_conditions:
                            if matches_condition(val, cond, data, relations_data, count_results):
                                global_matched = True
                                matched_global_fields.add(field)
                                field_values[field] = val
                                break
                        if global_matched:
                            break
                    if not global_matched:
                        all_matched = False

                if not all_matched:
                    continue

                # 3. 关系条件检查
                relation_values = {}
                if relation_filters and all_matched:
                    subject_rels = relations_data.get(int(sid), []) if relations_data else []
                    # 按类型获取当前条目对应的关系表
                    type_relation_map = {
                        1: BOOK_RELATIONS,    # 书籍
                        2: ANIME_RELATIONS,   # 动画
                        3: MUSIC_RELATIONS,   # 音乐
                        4: GAME_RELATIONS,    # 游戏
                        6: REAL_RELATIONS     # 三次元
                    }
                    current_rel_map = type_relation_map.get(subject_type, {})
                    if not current_rel_map:
                        all_matched = False
                        continue
                    
                    for rel_cn, rel_conds, negate, rel_mode in relation_filters:
                        # 从当前类型关系表中匹配关系ID
                        rel_id = None
                        for id, name in current_rel_map.items():
                            if name == rel_cn:
                                rel_id = id
                                break
                        if rel_id is None:
                            # 当前类型无此关系，否定条件视为满足，否则不满足
                            if not negate:
                                all_matched = False
                            else:
                                relation_values[rel_cn] = []
                            break
                        
                        # 检查关联条目
                        related_ids = []
                        total_rel = len([r for r in subject_rels if r['relation_type'] == rel_id])
                        for rel in subject_rels:
                            if rel['relation_type'] != rel_id:
                                continue
                            related_sid = str(rel['related_subject_id'])
                            related_data = all_subjects.get(related_sid) if all_subjects else None
                            if related_data and check_related_subject(related_data, data, rel_conds, rel_mode):
                                related_ids.append(related_sid)
                        
                        # 按模式和否定逻辑判断
                        if negate:
                            if len(related_ids) > 0:
                                all_matched = False
                                break
                        else:
                            if rel_mode == 'any' and len(related_ids) == 0:
                                all_matched = False
                                break
                            if rel_mode == 'all' and len(related_ids) != total_rel:
                                all_matched = False
                                break
                        relation_values[rel_cn] = related_ids
                if not all_matched:
                    continue

                # 4. 人物条件检查
                if staff_filters and not check_staff_conditions(sid, staff_data, staff_filters, subject_type):
                    continue

                # 5. 保存结果
                url = f"https://bgm.tv/subject/{sid}"
                out_f.write(json.dumps(data, ensure_ascii=False) + "\n")
                results.append({
                    'id': sid, 'url': url, 'type': subject_type,
                    'fields': field_values, 'relations': relation_values, 'counts': count_results,
                    'tags': [tag['name'] for tag in data.get('tags', [])],
                    'meta_tags': data.get('meta_tags', [])
                })
                matched_cnt += 1

            except Exception as e:
                print(f"\n处理条目出错: {str(e)}")
                continue

    # 生成CSV
    if results:
        print("\n正在生成CSV文件...")
        write_csv_file(output_csv, results, relevant_fields, relation_filters, all_subjects, count_fields,
                      tag_filters, meta_tag_filters, staff_filters, staff_data)

    print(f"\n处理完成！共找到 {matched_cnt} 个符合条件的条目")
    print(f"原始数据保存至: {output_file}")
    print(f"表格数据保存至: {output_csv}")


if __name__ == "__main__":
    main()
