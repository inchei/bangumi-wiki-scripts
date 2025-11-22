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

# 按类型整合职位信息
TYPE_STAFF_MAP = {
    1: {2001: "作者", 2002: "作画", 2003: "插图", 2004: "出版社", 2005: "连载杂志", 2006: "译者",
        2007: "原作", 2008: "客串", 2009: "人物原案", 2010: "脚本", 2011: "书系", 2012: "出品方", 2013: "图书品牌"},
    2: {1: "原作", 2: "导演", 3: "脚本", 4: "分镜", 5: "演出", 6: "音乐", 7: "人物原案", 8: "人物设定",
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
        135: "特摄效果", 136: "视觉效果", 137: "动作导演"},
    3: {3001: "艺术家", 3002: "制作人", 3003: "作曲", 3004: "厂牌", 3005: "原作", 3006: "作词",
        3007: "录音", 3008: "编曲", 3009: "插图", 3010: "脚本", 3011: "出版方", 3012: "母带制作",
        3013: "混音", 3014: "乐器", 3015: "声乐"},
    4: {1001: "开发", 1002: "发行", 1003: "游戏设计师", 1004: "剧本", 1005: "美工", 1006: "音乐",
        1007: "关卡设计", 1008: "人物设定", 1009: "主题歌作曲", 1010: "主题歌作词", 1011: "主题歌演出", 1012: "插入歌演出",
        1013: "原画", 1014: "动画制作", 1015: "原作", 1016: "导演", 1017: "动画监督", 1018: "制作总指挥",
        1019: "QC", 1020: "动画剧本", 1021: "程序", 1022: "协力", 1023: "CG 监修", 1024: "SD原画",
        1025: "背景", 1026: "监修", 1027: "系列构成", 1028: "企画", 1029: "机械设定", 1030: "音响监督",
        1031: "作画监督", 1032: "制作人", 1033: "海报"},
    6: {4001: "原作", 4002: "导演", 4003: "编剧", 4004: "音乐", 4005: "执行制片人", 4006: "共同执行制作",
        4007: "制片人/制作人", 4008: "监制", 4009: "副制作人/制作顾问", 4010: "故事", 4011: "编审", 4012: "剪辑",
        4013: "创意总监", 4014: "摄影", 4015: "主题歌演出", 4016: "主演", 4017: "配角", 4018: "制作",
        4019: "出品", 4020: "配音导演", 4021: "录音", 4022: "海报"}
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
            except (json.JSONDecodeError, KeyError) as e:
                print(f"加载关系数据出错: {e}")
                continue
    return relations


def load_staff_data(archive_dir):
    """加载人物关联数据"""
    staff_file = os.path.join(archive_dir, "subject-persons.jsonlines")
    if not os.path.exists(staff_file):
        return None

    staff_data = defaultdict(list)
    with open(staff_file, 'r', encoding='utf-8') as f:
        total_lines = sum(1 for _ in f)

    print("正在加载人物关联数据...")
    with open(staff_file, 'r', encoding='utf-8') as f:
        for line in tqdm(f, total=total_lines, desc="加载进度"):
            try:
                data = json.loads(line.strip())
                subject_id = str(data['subject_id'])
                staff_data[subject_id].append(data)
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                print(f"加载人物数据出错: {e}")
                continue
    print(f"人物关联数据加载完成，共处理 {total_lines} 条记录")
    return staff_data


def load_episode_data(archive_dir):
    """加载剧集数据"""
    episode_file = os.path.join(archive_dir, "episode.jsonlines")
    if not os.path.exists(episode_file):
        return None

    episode_data = defaultdict(list)
    with open(episode_file, 'r', encoding='utf-8') as f:
        total_lines = sum(1 for _ in f)

    print("正在加载剧集数据...")
    with open(episode_file, 'r', encoding='utf-8') as f:
        for line in tqdm(f, total=total_lines, desc="剧集加载进度"):
            try:
                data = json.loads(line.strip())
                subject_id = str(data['subject_id'])
                episode_data[subject_id].append(data)
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                print(f"加载剧集数据出错: {e}")
                continue
    print(f"剧集数据加载完成，共处理 {total_lines} 条记录")
    return episode_data


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
    """统计指定条目的指定关系数量"""
    if not relations_data:
        return 0

    try:
        subject_id = int(subject_id)
    except (ValueError, TypeError):
        return 0

    type_relation_map = {
        1: BOOK_RELATIONS, 2: ANIME_RELATIONS, 3: MUSIC_RELATIONS, 4: GAME_RELATIONS, 6: REAL_RELATIONS
    }
    if subject_type not in type_relation_map:
        return 0
    target_relation_map = type_relation_map[subject_type]

    rel_id = None
    for id, name in target_relation_map.items():
        if name == rel_cn:
            rel_id = id
            break
    if rel_id is None:
        return 0

    subject_rels = relations_data.get(subject_id, [])
    return sum(1 for rel in subject_rels if rel.get('relation_type') == rel_id)


def get_episode_count(subject_id, episode_data):
    """获取指定条目的剧集数量"""
    if not episode_data:
        return 0

    subject_id_str = str(subject_id)
    return len(episode_data.get(subject_id_str, []))


def matches_condition(value, condition, data=None, relations_data=None, episode_data=None, count_results=None):
    """检查条件匹配，记录count统计结果"""
    if not condition:
        return True

    # 处理{{count:中文关系名}}和{{count:ep}}
    count_pattern = re.compile(r'\{\{count:\s*([^}]+?)\s*\}\}')
    count_match = count_pattern.search(condition)
    if count_match and count_results is not None:
        count_type = count_match.group(1).strip()
        current_count = 0

        # 处理剧集数量统计
        if count_type == 'ep':
            if data:
                subject_id = data.get('id')
                current_count = get_episode_count(subject_id, episode_data)
            count_key = "count_ep"
            count_results[count_key] = current_count
            condition = count_pattern.sub(str(current_count), condition)

        # 处理关系数量统计
        elif relations_data and data:
            subject_id = data.get('id')
            subject_type = data.get('type', 0)
            try:
                subject_type = int(subject_type)
            except (ValueError, TypeError):
                subject_type = 0

            current_count = get_relation_count(subject_id, count_type, relations_data, subject_type)
            count_key = f"count_{count_type}"
            count_results[count_key] = current_count
            condition = count_pattern.sub(str(current_count), condition)

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
            return condition in value
    return condition in value


def check_related_subject(related_data, original_data, related_conditions, match_mode):
    """检查关联条目条件"""
    if not related_conditions or not related_data:
        return True

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

    return any(cond_results) if match_mode == 'any' else all(cond_results)


def check_staff_conditions(subject_id, staff_data, staff_filters, subject_type):
    """检查人物筛选条件"""
    if not staff_filters or not staff_data:
        return True

    if subject_type not in TYPE_STAFF_MAP:
        return False

    staff_positions = TYPE_STAFF_MAP[subject_type]
    cn_to_position_id = {v: k for k, v in staff_positions.items()}

    subject_id_str = str(subject_id)
    subject_staffs = staff_data.get(subject_id_str, [])
    if not subject_staffs:
        return False

    for pos_cn, match_mode, staff_conds in staff_filters:
        pos_id = cn_to_position_id.get(pos_cn)
        if pos_id is None:
            continue

        matched_staffs = [staff for staff in subject_staffs if staff.get('position') == pos_id]
        staff_count = len(matched_staffs)

        count_cond = None
        normal_conds = []
        for field, cond in staff_conds:
            if field == 'count':
                count_cond = cond
            else:
                normal_conds.append((field, cond))

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

        staff_match_results = []
        for staff in matched_staffs:
            cond_match = True
            for field, cond in normal_conds:
                staff_value = str(staff.get(field, '')).strip()
                if not matches_condition(staff_value, cond, staff):
                    cond_match = False
                    break
            staff_match_results.append(cond_match)

        if match_mode == 'any' and not any(staff_match_results):
            return False
        if match_mode == 'all' and not all(staff_match_results):
            return False

    return True


def check_episode_conditions(subject_id, episode_data, ep_filters):
    """检查剧集筛选条件"""
    if not ep_filters or not episode_data:
        return True

    subject_id_str = str(subject_id)
    subject_eps = episode_data.get(subject_id_str, [])
    if not subject_eps:
        return False

    for match_mode, ep_conds in ep_filters:
        count_cond = None
        normal_conds = []
        for field, cond in ep_conds:
            if field == 'count':
                count_cond = cond
            else:
                normal_conds.append((field, cond))

        ep_count = len(subject_eps)
        if count_cond and not matches_condition(str(ep_count), count_cond):
            return False

        ep_match_results = []
        for ep in subject_eps:
            cond_match = True
            for field, cond in normal_conds:
                ep_value = str(ep.get(field, '')).strip()
                if not matches_condition(ep_value, cond, ep):
                    cond_match = False
                    break
            ep_match_results.append(cond_match)

        if match_mode == 'any' and not any(ep_match_results):
            return False
        if match_mode == 'all' and not all(ep_match_results):
            return False

    return True


def get_user_filters():
    """获取用户筛选条件"""
    filters = []
    relation_filters = []
    tag_filters = []
    meta_tag_filters = []
    staff_filters = []
    ep_filters = []
    i = 1
    print("请添加筛选条件（输入空行结束添加）")
    print("格式说明：")
    print("- 条目类型（数字）：type:数字（例：type:2 表示动画）")
    print("- 条目类型（中文）：直接输入中文类型（例：动画 等效于 type:2）")
    print("- 普通字段：字段名:条件（例：出版社:角川、发售日:re:\\d{4}）")
    print("- 所有字段（全局匹配）：*:条件（例：*:re:完结$）")
    print("- 数字比较：字段名:大于:值 或 字段名:小于:值（例：评分:大于:8）")
    print("- 日期比较：字段名:早于:日期 或 字段名:晚于:日期（例：发售日:晚于:2023-01-01）")
    print("- 字段引用自身：字段名:{{目标字段名}}（例：开始:{{发售日}}）")
    print("- 数量统计：字段名:比较符:{{count:类型}}（支持关系名或ep，例：集数:等于:{{count:ep}}）")
    print("- 条目关联：关系名:字段名:条件（例：单行本:发售日:re:\\d{4}）")
    print("- 人物筛选：staff:职位名:字段名:条件（例：staff:原画:appear_eps:re:.*）")
    print("- 剧集筛选：ep:字段名:条件（例：ep:name:re:第\d+话）")

    while True:
        condition_str = input(f"\n条件 {i} (输入空行结束)：").strip()
        if not condition_str:
            if i == 1:
                print("未添加任何筛选条件")
            else:
                print(f"已完成筛选条件添加，共设置 {i-1} 个条件")
            break

        # 处理中文类型筛选
        if condition_str in TYPE_CN_TO_NUM:
            type_num = TYPE_CN_TO_NUM[condition_str]
            filters.append(('type', str(type_num)))
            print(f"已添加类型筛选：type:{type_num}（{condition_str}）")
            i += 1
            continue

        # 处理ep筛选条件
        if condition_str.startswith('ep:'):
            parts = condition_str.split(':', 3)  # 最多分割为3次，确保字段名和条件正确拆分
            if len(parts) < 3:  # 至少需要 ep:字段名:条件（3个部分）
                print("格式错误：剧集筛选单行模式需满足 ep:字段名:条件 或 ep:all:字段名:条件")
                continue

            # 解析匹配模式（默认any，指定all则为all模式）
            if parts[1].strip() == 'all':
                match_mode = 'all'
                if len(parts) < 4:  # ep:all:字段名:条件 需4个部分
                    print("格式错误：ep:all模式需满足 ep:all:字段名:条件")
                    continue
                field = parts[2].strip()
                cond = parts[3].strip()
            else:
                match_mode = 'any'
                field = parts[1].strip()
                cond = parts[2].strip()

            # 验证字段名和条件不为空
            if not field or not cond:
                print("格式错误：字段名和条件不能为空")
                continue

            # 添加单行筛选条件
            ep_filters.append((match_mode, [(field, cond)]))
            print(f"已添加剧集单行筛选：{match_mode}模式，条件：{field}:{cond}")
            i += 1
            continue

        # 处理staff筛选条件
        if condition_str.startswith('staff:'):
            parts = condition_str.split(':', 4)
            if len(parts) < 2:
                print("格式错误：staff筛选需满足 staff:职位名 或 staff:职位名:all")
                continue

            _, pos_cn = parts[0], parts[1].strip()
            if not pos_cn:
                print("错误：职位名不能为空")
                continue

            match_mode = 'any'
            remaining_parts = []
            if len(parts) >= 3 and parts[2].strip() == 'all':
                match_mode = 'all'
                remaining_parts = parts[3:] if len(parts) >= 4 else []
            else:
                remaining_parts = parts[2:] if len(parts) >= 3 else []

            if remaining_parts and ':' in ''.join(remaining_parts):
                if len(remaining_parts) < 2:
                    print("格式错误：单行模式需满足 staff:职位名:字段:条件 或 staff:职位名:all:字段:条件")
                    continue
                field, cond = remaining_parts[0].strip(), ':'.join(remaining_parts[1:]).strip()
                staff_filters.append((pos_cn, match_mode, [(field, cond)]))
                print(f"已添加人物筛选：{pos_cn}（{match_mode}模式），条件：{field}:{cond}")
                i += 1
                continue

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

            staff_filters.append((pos_cn, match_mode, staff_conds))
            i += 1
            continue

        # 处理无relation:前缀的关系筛选
        all_relations = [rel for rel_dict in [ANIME_RELATIONS, BOOK_RELATIONS, MUSIC_RELATIONS, GAME_RELATIONS, REAL_RELATIONS] for rel in rel_dict.values()]
        if condition_str in all_relations:
            rel_cn = condition_str
            if rel_cn == '其他':
                print("错误：关系'其他'不可省略relation:，请使用 relation:其他 格式")
                continue
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
            parts = condition_str.split(':', 4)
            if len(parts) < 2:
                print("格式错误：relation筛选需满足 relation:关系名 或 relation:关系名:all 或 relation:!关系名")
                continue

            _, rel_part = parts[0], parts[1].strip()
            negate = False
            rel_cn = rel_part

            if rel_part.startswith('!'):
                negate = True
                rel_cn = rel_part[1:].strip()
                if not rel_cn:
                    print("错误：关系名不能为空")
                    continue
                relation_filters.append((rel_cn, [], negate, 'any'))
                print(f"已添加关系筛选：不包含'{rel_cn}'")
                i += 1
                continue

            is_valid_rel = any(rel_cn in rel_dict.values() for rel_dict in [ANIME_RELATIONS, BOOK_RELATIONS, MUSIC_RELATIONS, GAME_RELATIONS, REAL_RELATIONS])
            if not is_valid_rel:
                print(f"错误：未找到关系名称 '{rel_cn}'")
                continue

            match_mode = 'any'
            remaining_parts = []
            if len(parts) >= 3 and parts[2].strip() == 'all':
                match_mode = 'all'
                remaining_parts = parts[3:] if len(parts) >= 4 else []
            else:
                remaining_parts = parts[2:] if len(parts) >= 3 else []

            if remaining_parts and ':' in ''.join(remaining_parts):
                if len(remaining_parts) < 2:
                    print("格式错误：单行模式需满足 relation:关系名:字段:条件 或 relation:关系名:all:字段:条件")
                    continue
                field, cond = remaining_parts[0].strip(), ':'.join(remaining_parts[1:]).strip()
                rel_conds = [(field, cond)]
                relation_filters.append((rel_cn, rel_conds, False, match_mode))
                print(f"已添加关系筛选：{rel_cn}（{match_mode}模式），条件：{field}:{cond}")
                i += 1
                continue

            print(f"设置'{rel_cn}'的关联条件（格式：字段名:条件，空行结束），匹配模式：{match_mode}")
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

            relation_filters.append((rel_cn, rel_conds, False, match_mode))
            i += 1
            continue

        # 优先处理单行关系筛选
        all_valid_rels = set()
        for rel_dict in [ANIME_RELATIONS, BOOK_RELATIONS, MUSIC_RELATIONS, GAME_RELATIONS, REAL_RELATIONS]:
            all_valid_rels.update(rel_dict.values())
        if condition_str.count(':') >= 2:
            rel_cn_candidate = condition_str.split(':', 1)[0].strip()
            if rel_cn_candidate in all_valid_rels and rel_cn_candidate != '其他':
                rel_part, rest = condition_str.split(':', 1)
                field, cond = [p.strip() for p in rest.split(':', 1)]
                rel_cn = rel_part.strip()
                relation_filters.append((rel_cn, [(field, cond)], False, 'any'))
                print(f"已添加单行关系筛选：{rel_cn}（any模式），条件：{field}:{cond}")
                i += 1
                continue


        # 处理普通字段/全局字段筛选
        if ':' not in condition_str:
            print(f"未识别的条件格式：'{condition_str}'，请检查是否为中文类型（支持：{', '.join(TYPE_CN_TO_NUM.keys())}）")
            continue
        key_part, value_part = [p.strip() for p in condition_str.split(':', 1)]
        filters.append((key_part, value_part))
        i += 1

    return filters, relation_filters, tag_filters, meta_tag_filters, staff_filters, ep_filters


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
            count_type = match.group(1).strip()
            count_field = f"count_{count_type}"
            count_fields.add(count_field)
    return sorted(count_fields)


def get_relevant_fields(filters, relation_filters, staff_filters, ep_filters):
    """提取所有与筛选相关的字段"""
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

    # 添加剧集筛选中涉及的字段
    for _, ep_conds in ep_filters:
        for field, _ in ep_conds:
            if field != 'count':
                relevant_fields.add(field)

    # 处理全局匹配中实际匹配的字段引用
    for field, cond in filters:
        if field == '*':
            ref_pattern = re.compile(r'\{\{\s*(\w+)\s*\}\}')
            matches = ref_pattern.findall(cond)
            for match in matches:
                relevant_fields.add(match)

    return sorted(relevant_fields)


def write_main_csv(output_csv_file, results, relevant_fields, count_fields, relation_filters):
    """生成精简的主CSV文件，只包含必要字段"""
    # 构建表头：ID, URL, 参与筛选的字段, count结果, 关系外键
    headers = ['ID', 'URL'] + relevant_fields
    if count_fields:
        headers.extend(count_fields)

    # 添加关系外键列
    for rel_cn, _, _, _ in relation_filters:
        headers.append(f"relation_{rel_cn}_ids")  # 存储该关系的所有关联条目ID，用逗号分隔

    with open(output_csv_file, 'w', encoding='utf-8-sig', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)

        for result in results:
            row = [result['id'], result['url']]

            # 添加筛选相关字段值
            for field in relevant_fields:
                row.append(result['fields'].get(field, ''))

            # 添加count结果
            if count_fields:
                for count_field in count_fields:
                    row.append(result['counts'].get(count_field, 0))

            # 添加关系外键（用逗号分隔多个ID）
            for rel_cn, _, _, _ in relation_filters:
                related_ids = result['relations'].get(rel_cn, [])
                row.append(','.join(related_ids))

            writer.writerow(row)


def write_relation_csv(base_output_name, results, relation_filters, all_subjects):
    """生成关系数据CSV，包含满足条件的关联条目的筛选字段"""
    if not relation_filters or not all_subjects:
        return

    # 收集所有关系筛选中使用的字段
    relation_fields = defaultdict(set)
    for rel_cn, related_conditions, _, _ in relation_filters:
        for field, _ in related_conditions:
            relation_fields[rel_cn].add(field)

    # 为每种关系生成独立的CSV
    for rel_cn, related_conditions, _, _ in relation_filters:
        rel_fields = list(relation_fields[rel_cn])
        if not rel_fields:
            continue

        # 输出文件名：基础名 + _relation_关系名.csv
        rel_output = f"{base_output_name}_relation_{rel_cn}.csv"

        # 表头：源条目ID, 关联条目ID, 关联条目的筛选字段
        headers = ['source_id', 'related_id'] + rel_fields

        with open(rel_output, 'w', encoding='utf-8-sig', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(headers)

            # 收集数据
            for result in results:
                source_id = result['id']
                related_ids = result['relations'].get(rel_cn, [])

                for rid in related_ids:
                    related_data = all_subjects.get(rid)
                    if not related_data:
                        continue

                    row = [source_id, rid]
                    # 添加关联条目的筛选字段值
                    for field in rel_fields:
                        row.append(extract_field_value(related_data, field))

                    writer.writerow(row)

        print(f"关系数据保存至: {rel_output}")


def write_staff_csv(base_output_name, results, staff_filters, staff_data):
    """生成人物数据CSV"""
    if not staff_filters or not staff_data:
        return

    # 为每种职位生成独立的CSV
    for pos_cn, match_mode, staff_conds in staff_filters:
        staff_fields = [field for field, _ in staff_conds if field != 'count']
        if not staff_fields:
            continue

        # 输出文件名：基础名 + _staff_职位名.csv
        staff_output = f"{base_output_name}_staff_{pos_cn}.csv"

        # 表头：源条目ID, 人物ID, 人物的筛选字段
        headers = ['source_id', 'person_id'] + staff_fields

        with open(staff_output, 'w', encoding='utf-8-sig', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(headers)

            # 收集数据
            for result in results:
                source_id = result['id']
                subject_type = result.get('type', 0)

                if subject_type not in TYPE_STAFF_MAP:
                    continue

                staff_positions = TYPE_STAFF_MAP[subject_type]
                cn_to_position_id = {v: k for k, v in staff_positions.items()}
                pos_id = cn_to_position_id.get(pos_cn)
                if pos_id is None:
                    continue

                subject_staffs = staff_data.get(source_id, [])
                matched_staffs = [staff for staff in subject_staffs if staff.get('position') == pos_id]

                for staff in matched_staffs:
                    row = [source_id, staff.get('person_id', '')]
                    # 添加人物的筛选字段值
                    for field in staff_fields:
                        row.append(str(staff.get(field, '')).strip())

                    writer.writerow(row)

        print(f"人物数据保存至: {staff_output}")


def write_episode_csv(base_output_name, results, ep_filters, episode_data):
    """生成剧集数据CSV"""
    if not ep_filters or not episode_data:
        return

    # 收集所有剧集筛选中使用的字段
    ep_fields = set()
    for _, ep_conds in ep_filters:
        for field, _ in ep_conds:
            if field != 'count':
                ep_fields.add(field)
    ep_fields = list(ep_fields)
    if not ep_fields:
        return

    # 输出文件名：基础名 + _ep.csv
    ep_output = f"{base_output_name}_ep.csv"

    # 表头：源条目ID, 剧集ID, 剧集的筛选字段
    headers = ['source_id', 'episode_id'] + ep_fields

    with open(ep_output, 'w', encoding='utf-8-sig', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)

        # 收集数据
        for result in results:
            source_id = result['id']
            subject_eps = episode_data.get(source_id, [])

            for ep in subject_eps:
                row = [source_id, ep.get('id', '')]
                # 添加剧集的筛选字段值
                for field in ep_fields:
                    row.append(str(ep.get(field, '')).strip())

                writer.writerow(row)

    print(f"剧集数据保存至: {ep_output}")


def check_files_overwrite(output_files):
    """检查文件覆盖"""
    existing = [f for f in output_files if os.path.exists(f)]
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
    filters, relation_filters, tag_filters, meta_tag_filters, staff_filters, ep_filters = get_user_filters()
    if not filters and not relation_filters and not tag_filters and not meta_tag_filters and not staff_filters and not ep_filters:
        print("未设置任何筛选条件，程序退出")
        return

    # 提取相关字段
    relevant_fields = get_relevant_fields(filters, relation_filters, staff_filters, ep_filters)

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
                print(f"   条件 {j}: 数量比较 '{cond}'")
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
    # 人物条件
    staff_idx = rel_idx + len(relation_filters)
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
    # 剧集筛选条件
    ep_idx = staff_idx + len(staff_filters)
    for i, (match_mode, ep_conds) in enumerate(ep_filters, ep_idx):
        mode_desc = "任意满足" if match_mode == 'any' else "全部满足"
        print(f"{i}. 剧集筛选: （{mode_desc}模式）")
        if ep_conds:
            print("   剧集条件:")
            for j, (field, cond) in enumerate(ep_conds, 1):
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
    main_csv = f"{output_name}.csv"

    # 检查要生成的所有文件
    output_files = [main_csv]
    # 添加关系CSV
    for rel_cn, _, _, _ in relation_filters:
        output_files.append(f"{output_name}_relation_{rel_cn}.csv")
    # 添加staff CSV
    for pos_cn, _, _ in staff_filters:
        output_files.append(f"{output_name}_staff_{pos_cn}.csv")
    # 添加episode CSV
    if ep_filters:
        output_files.append(f"{output_name}_ep.csv")

    if not check_files_overwrite(output_files):
        return

    # 检查是否需要关系数据
    has_relation_conditions = any(
        re.search(r'\{\{count:\s*[^ep}]+\s*\}\}', cond)
        for field_conds in grouped_filters.values()
        for cond in field_conds
    ) if grouped_filters else False
    has_relation_conditions = has_relation_conditions or bool(relation_filters)

    # 加载关系数据
    relations_data = None
    if has_relation_conditions:
        relations_data = load_relations(archive_dir)
        if not relations_data:
            print("错误：需关系筛选或关系数量统计，但未找到 subject-relations.jsonlines 文件")
            return

    # 检查是否需要剧集数据
    has_episode_conditions = any(
        re.search(r'\{\{count:ep\s*\}\}', cond)
        for field_conds in grouped_filters.values()
        for cond in field_conds
    ) if grouped_filters else False
    has_episode_conditions = has_episode_conditions or bool(ep_filters)

    # 加载staff数据
    staff_data = None
    if staff_filters:
        staff_data = load_staff_data(archive_dir)
        if not staff_data:
            print("错误：需人物筛选，但未找到 subject-persons.jsonlines 文件")
            return

    # 加载剧集数据
    episode_data = None
    if has_episode_conditions:
        episode_data = load_episode_data(archive_dir)
        if not episode_data:
            print("错误：需剧集筛选或剧集数量统计，但未找到 episode.jsonlines 文件")
            return

    # 预加载所有subject数据（因为需要提取关联条目的字段）
    all_subjects = {}
    if needs_full_load(relation_filters) or relation_filters:
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
                except json.JSONDecodeError as e:
                    print(f"解析subject数据出错: {e}")
                    continue

    # 提取count字段
    count_fields = collect_count_fields(filters)

    # 核心筛选逻辑
    results = []
    matched_cnt = 0
    print(f"\n开始处理 {input_file} ...")
    with open(input_file, 'r', encoding='utf-8') as f:
        total_lines = sum(1 for _ in f)

    with open(input_file, 'r', encoding='utf-8') as in_f:
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
                        if not matches_condition(val, cond, data, relations_data, episode_data, count_results):
                            all_matched = False
                            break
                    if not all_matched:
                        break

                # 全局条件检查
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
                            if matches_condition(val, cond, data, relations_data, episode_data, count_results):
                                global_matched = True
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
                    type_relation_map = {
                        1: BOOK_RELATIONS, 2: ANIME_RELATIONS, 3: MUSIC_RELATIONS, 4: GAME_RELATIONS, 6: REAL_RELATIONS
                    }
                    current_rel_map = type_relation_map.get(subject_type, {})
                    if not current_rel_map:
                        all_matched = False
                        continue

                    for rel_cn, rel_conds, negate, rel_mode in relation_filters:
                        rel_id = None
                        for id, name in current_rel_map.items():
                            if name == rel_cn:
                                rel_id = id
                                break
                        if rel_id is None:
                            if not negate:
                                all_matched = False
                            else:
                                relation_values[rel_cn] = []
                            break

                        related_ids = []
                        total_rel = len([r for r in subject_rels if r['relation_type'] == rel_id])
                        for rel in subject_rels:
                            if rel['relation_type'] != rel_id:
                                continue
                            related_sid = str(rel['related_subject_id'])
                            related_data = all_subjects.get(related_sid) if all_subjects else None
                            if related_data and check_related_subject(related_data, data, rel_conds, rel_mode):
                                related_ids.append(related_sid)

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

                # 5. 剧集条件检查
                if ep_filters and not check_episode_conditions(sid, episode_data, ep_filters):
                    continue

                # 6. 保存结果
                url = f"https://bgm.tv/subject/{sid}"
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

    # 生成精简主CSV
    if results:
        print("\n正在生成主CSV文件...")
        write_main_csv(main_csv, results, relevant_fields, count_fields, relation_filters)

        # 生成关系数据CSV
        write_relation_csv(output_name, results, relation_filters, all_subjects)

        # 生成人物数据CSV
        write_staff_csv(output_name, results, staff_filters, staff_data)

        # 生成剧集数据CSV
        write_episode_csv(output_name, results, ep_filters, episode_data)

    print(f"\n处理完成！共找到 {matched_cnt} 个符合条件的条目")
    print(f"主结果保存至: {main_csv}")


if __name__ == "__main__":
    main()
