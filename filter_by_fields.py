import json
import os
import regex as re
import csv
from tqdm import tqdm
from collections import defaultdict
from datetime import datetime

# 关系类型定义
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

# 职位类型定义（整合所有资源类型的职位ID与中文映射）
STAFF_POSITIONS = {
    # anime 职位
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
    135: "特摄效果", 136: "视觉效果", 137: "动作导演",
    # game 职位
    1001: "开发", 1002: "发行", 1003: "游戏设计师", 1004: "剧本", 1005: "美工", 1006: "音乐",
    1007: "关卡设计", 1008: "人物设定", 1009: "主题歌作曲", 1010: "主题歌作词", 1011: "主题歌演出", 1012: "插入歌演出",
    1013: "原画", 1014: "动画制作", 1015: "原作", 1016: "导演", 1017: "动画监督", 1018: "制作总指挥",
    1019: "QC", 1020: "动画剧本", 1021: "程序", 1022: "协力", 1023: "CG 监修", 1024: "SD原画",
    1025: "背景", 1026: "监修", 1027: "系列构成", 1028: "企画", 1029: "机械设定", 1030: "音响监督",
    1031: "作画监督", 1032: "制作人", 1033: "海报",
    # book 职位
    2001: "作者", 2002: "作画", 2003: "插图", 2004: "出版社", 2005: "连载杂志", 2006: "译者",
    2007: "原作", 2008: "客串", 2009: "人物原案", 2010: "脚本", 2011: "书系", 2012: "出品方",
    2013: "图书品牌",
    # music 职位
    3001: "艺术家", 3002: "制作人", 3003: "作曲", 3004: "厂牌", 3005: "原作", 3006: "作词",
    3007: "录音", 3008: "编曲", 3009: "插图", 3010: "脚本", 3011: "出版方", 3012: "母带制作",
    3013: "混音", 3014: "乐器", 3015: "声乐",
    # real 职位
    4001: "原作", 4002: "导演", 4003: "编剧", 4004: "音乐", 4005: "执行制片人", 4006: "共同执行制作",
    4007: "制片人/制作人", 4008: "监制", 4009: "副制作人/制作顾问", 4010: "故事", 4011: "编审", 4012: "剪辑",
    4013: "创意总监", 4014: "摄影", 4015: "主题歌演出", 4016: "主演", 4017: "配角", 4018: "制作",
    4019: "出品", 4020: "配音导演", 4021: "录音", 4022: "海报"
}

# 整合关系类型映射
cn_to_relation_id = {}
for rel_dict in [ANIME_RELATIONS, BOOK_RELATIONS, MUSIC_RELATIONS, GAME_RELATIONS, REAL_RELATIONS]:
    for rel_id, rel_cn in rel_dict.items():
        if rel_cn not in cn_to_relation_id:
            cn_to_relation_id[rel_cn] = rel_id

# 中文职位名到ID的映射（用于筛选匹配）
cn_to_position_id = {v: k for k, v in STAFF_POSITIONS.items()}


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


def get_relation_count(subject_id, rel_cn, relations_data, cn_to_relation_id):
    """统计指定条目的指定关系数量"""
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
    """检查条件匹配，记录count统计结果"""
    if not condition:
        return True

    # 处理{{count:中文关系名}}
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
            b = re.search(regex_pattern, value)
            a = b is not None
            return a
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


STAFF_REQUIRE_ALL = True  # 默认：任一满足

def check_staff_conditions(subject_id, staff_data, staff_filters):
    """检查人物筛选条件（通过STAFF_REQUIRE_ALL变量切换模式）"""
    if not staff_filters or not staff_data:
        return True
    
    subject_id_str = str(subject_id)
    subject_staffs = staff_data.get(subject_id_str, [])
    if not subject_staffs:
        return False  # 无对应staff，不满足条件
    
    # 逐个检查staff筛选条件
    for pos_id, field, cond in staff_filters:
        matched_staffs = [staff for staff in subject_staffs if staff.get('position') == pos_id]
        if not matched_staffs:
            return False  # 无对应职位的staff，不满足条件
        
        # 根据全局变量决定检查逻辑
        if STAFF_REQUIRE_ALL:
            # 全部满足模式：只要有一个不满足就返回False
            all_matched = True
            for staff in matched_staffs:
                staff_value = str(staff.get(field, '')).strip()
                if not matches_condition(staff_value, cond, staff):
                    all_matched = False
                    break
            if not all_matched:
                return False
        else:
            # 任一满足模式：只要有一个满足就通过
            any_matched = False
            for staff in matched_staffs:
                staff_value = str(staff.get(field, '')).strip()
                if matches_condition(staff_value, cond, staff):
                    any_matched = True
                    break
            if not any_matched:
                return False
    
    return True


def get_user_filters():
    """获取用户筛选条件，新增staff筛选支持"""
    filters = []
    relation_filters = []
    # 分离存储两种标签筛选条件
    tag_filters = []  # 普通标签筛选，格式：(标签名, 是否排除)
    meta_tag_filters = []  # 元标签筛选，格式：(标签名, 是否排除)
    staff_filters = []  # 人物筛选，格式：(职位ID, 字段名, 条件)
    i = 1
    print("请添加筛选条件（输入空行结束添加）")
    print("格式说明：")
    print("- 普通字段：字段名:条件（例：出版社:角川、发售日:re:\\d{4}）")
    print("- 所有字段（全局匹配）：*:条件（例：*:re:完结$ 匹配任意字段值以“完结”结尾的条目）")
    print("- 数字比较：字段名:大于:值 或 字段名:小于:值（例：评分:大于:8、集数:小于:13）")
    print("- 日期比较：字段名:早于:日期 或 字段名:晚于:日期（例：发售日:晚于:2023-01-01）")
    print("- 字段引用自身：字段名:{{目标字段名}}（例：开始:{{发售日}}）")
    print("- 关系数量统计：字段名:比较符:{{count:中文关系名}}（例：册数:小于:{{count:单行本}}）")
    print("- 关系筛选（单个条件）：中文关系名:字段名:条件（例：单行本:发售日:re:\\d{4}）")
    print("- 关系筛选（多个条件）：relation:中文关系名（回车后输入条件，空行结束)")
    print("- 关系筛选（不含该关系）：relation:!中文关系名")
    print("- 普通标签筛选：tag:标签名 或 tag:!标签名（例：tag:轻小说、tag:!动画）")
    print("- 元标签筛选：meta_tag:标签名 或 meta_tag:!标签名（例：meta_tag:TV、meta_tag:!日本）")
    print("- 人物筛选：staff:中文职位名:字段名:条件（例：staff:原画:appear_eps:re:.*、staff:导演:person_id:大于:1000）")

    while True:
        condition_str = input(f"\n条件 {i} (输入空行结束)：").strip()
        if not condition_str:
            if i == 1:
                print("未添加任何筛选条件")
            else:
                print(f"已完成筛选条件添加，共设置 {i-1} 个条件")
            break

        # 处理staff筛选条件（staff:职位名:字段名:条件）
        if condition_str.startswith('staff:'):
            parts = condition_str.split(':', 3)  # 按冒号分割为4部分：staff、职位名、字段名、条件
            if len(parts) != 4:
                print("格式错误：staff筛选需满足 staff:中文职位名:字段名:条件（例：staff:原画:appear_eps:re:.*）")
                continue
            _, pos_cn, field, cond = [p.strip() for p in parts]
            # 匹配职位ID
            pos_id = cn_to_position_id.get(pos_cn)
            if pos_id is None:
                print(f"错误：未找到职位名称 '{pos_cn}'，请检查职位名是否正确")
                continue
            staff_filters.append((pos_id, field, cond))
            i += 1
            continue

        if condition_str.startswith(('relation:', 'tag:', 'meta_tag:')):
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
            # 处理普通标签筛选
            elif key_part == 'tag':
                tag_part = value_part
                negate = False
                if tag_part.startswith('!'):
                    negate = True
                    tag_name = tag_part[1:].strip()
                else:
                    tag_name = tag_part.strip()
                if not tag_name:
                    print("错误：标签名称不能为空")
                    continue
                tag_filters.append((tag_name, negate))
                i += 1
                continue
            # 处理元标签筛选
            elif key_part == 'meta_tag':
                tag_part = value_part
                negate = False
                if tag_part.startswith('!'):
                    negate = True
                    tag_name = tag_part[1:].strip()
                else:
                    tag_name = tag_part.strip()
                if not tag_name:
                    print("错误：元标签名称不能为空")
                    continue
                meta_tag_filters.append((tag_name, negate))
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

        # 处理普通字段/全局字段筛选
        if ':' not in condition_str:
            print("格式错误：条件需包含冒号（字段名:条件 或 *:条件）")
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
    """提取所有与筛选相关的字段，新增staff筛选字段"""
    relevant_fields = set()
    
    # 添加普通筛选字段（排除全局匹配符*）
    for field, _ in filters:
        if field != '*':
            relevant_fields.add(field)
    
    # 添加关系筛选中涉及的字段
    for _, related_conditions, _ in relation_filters:
        for field, _ in related_conditions:
            relevant_fields.add(field)
    
    # 添加staff筛选中涉及的字段
    for _, field, _ in staff_filters:
        relevant_fields.add(field)
    
    # 处理全局匹配中实际匹配的字段引用
    for field, cond in filters:
        if field == '*':
            # 提取条件中引用的字段（如{{field}}）
            ref_pattern = re.compile(r'\{\{\s*(\w+)\s*\}\}')
            matches = ref_pattern.findall(cond)
            for match in matches:
                relevant_fields.add(match)
    
    return sorted(relevant_fields)


def write_csv_file(output_csv_file, results, relevant_fields, relation_filters, all_subjects, count_fields, 
                  tag_filters, meta_tag_filters, staff_filters, staff_data):
    """生成CSV文件（包含标签和staff信息）"""
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

    # 统计每种职位的最大staff数
    max_staff = defaultdict(int)
    id_to_position_cn = {v: k for k, v in STAFF_POSITIONS.items()}
    for result in results:
        sid = result['id']
        subject_staffs = staff_data.get(sid, []) if staff_data else []
        for pos_id, _, _ in staff_filters:
            pos_cn = id_to_position_cn.get(pos_id, f"position_{pos_id}")
            count = sum(1 for staff in subject_staffs if staff.get('position') == pos_id)
            max_staff[pos_id] = max(max_staff[pos_id], count)

    # 构建表头：ID → URL → 筛选相关字段 → count字段 → 标签字段 → 关联字段 → 关联ID → staff字段
    headers = ['ID', 'URL'] + relevant_fields
    if count_fields:
        headers.extend(count_fields)
    
    # 添加标签列
    if tag_filters:
        headers.append("匹配的普通标签")
    if meta_tag_filters:
        headers.append("匹配的元标签")

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

    # 添加staff相关列
    for pos_id, field, _ in staff_filters:
        pos_cn = id_to_position_cn.get(pos_id, f"position_{pos_id}")
        max_cnt = max_staff[pos_id]
        for idx in range(1, max_cnt + 1):
            headers.append(f"staff_{pos_cn}_{idx}_{field}")
            headers.append(f"staff_{pos_cn}_{idx}_person_id")

    # 写入CSV行数据
    with open(output_csv_file, 'w', encoding='utf-8-sig', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        for result in results:
            row = [result['id'], result['url']]
            # 筛选相关字段值
            for field in relevant_fields:
                row.append(result['fields'].get(field, ''))
            # count字段值
            if count_fields:
                for count_field in count_fields:
                    row.append(result['counts'].get(count_field, 0))
            
            # 添加标签信息
            if tag_filters:
                # 获取原始数据中的普通标签
                subject_data = all_subjects.get(result['id'], {})
                tag_names = [tag['name'] for tag in subject_data.get('tags', [])]
                # 筛选出匹配的标签
                matched_tags = [tag for tag, negate in tag_filters 
                               if (not negate and tag in tag_names) or (negate and tag not in tag_names)]
                row.append(",".join(matched_tags))
            
            if meta_tag_filters:
                # 获取原始数据中的元标签
                subject_data = all_subjects.get(result['id'], {})
                meta_tags = subject_data.get('meta_tags', [])
                # 筛选出匹配的元标签
                matched_meta_tags = [tag for tag, negate in meta_tag_filters 
                                   if (not negate and tag in meta_tags) or (negate and tag not in meta_tags)]
                row.append(",".join(matched_meta_tags))

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

            # 添加staff相关信息
            sid = result['id']
            subject_staffs = staff_data.get(sid, []) if staff_data else []
            for pos_id, field, _ in staff_filters:
                pos_cn = id_to_position_cn.get(pos_id, f"position_{pos_id}")
                matched_staffs = [staff for staff in subject_staffs if staff.get('position') == pos_id]
                max_cnt = max_staff[pos_id]
                for idx in range(1, max_cnt + 1):
                    staff = matched_staffs[idx-1] if (idx-1) < len(matched_staffs) else None
                    # 字段值
                    val = str(staff.get(field, '')) if staff else ""
                    row.append(val)
                    # person_id
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
    for rel_id, related_conditions, negate in relation_filters:
        if not negate and related_conditions:
            return True
    return False


def check_tag_conditions(data, tag_filters):
    """检查普通标签条件"""
    if not tag_filters:
        return True
    
    # 提取普通标签名称列表（从字典数组中）
    tag_names = [tag['name'] for tag in data.get('tags', [])]
    
    # 检查每个标签条件
    for tag_name, negate in tag_filters:
        tag_exists = tag_name in tag_names
        
        # 应用否定条件
        if (negate and tag_exists) or (not negate and not tag_exists):
            return False
    
    return True


def check_meta_tag_conditions(data, meta_tag_filters):
    """检查元标签条件"""
    if not meta_tag_filters:
        return True
    
    # 提取元标签列表（字符串数组）
    meta_tags = data.get('meta_tags', [])
    
    # 检查每个元标签条件
    for tag_name, negate in meta_tag_filters:
        tag_exists = tag_name in meta_tags
        
        # 应用否定条件
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

    # 获取筛选条件，包含staff筛选条件
    filters, relation_filters, tag_filters, meta_tag_filters, staff_filters = get_user_filters()
    if not filters and not relation_filters and not tag_filters and not meta_tag_filters and not staff_filters:
        print("未设置任何筛选条件，程序退出")
        return

    # 提取所有与筛选相关的字段，包含staff字段
    relevant_fields = get_relevant_fields(filters, relation_filters, staff_filters)
    
    # 显示筛选条件
    grouped_filters = group_filters_by_field(filters)
    unique_fields = list(grouped_filters.keys())
    id_to_cn = {v: k for k, v in cn_to_relation_id.items()}
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
        print(f"{i}. 普通标签: {'不包含' if negate else '包含'} '{tag}'")
    
    # 元标签条件
    meta_tag_idx = tag_idx + len(tag_filters)
    for i, (tag, negate) in enumerate(meta_tag_filters, meta_tag_idx):
        print(f"{i}. 元标签: {'不包含' if negate else '包含'} '{tag}'")
    
    # 显示staff筛选条件
    staff_idx = meta_tag_idx + len(meta_tag_filters)
    id_to_position_cn = {v: k for k, v in STAFF_POSITIONS.items()}
    for i, (pos_id, field, cond) in enumerate(staff_filters, staff_idx):
        pos_cn = id_to_position_cn.get(pos_id, f"position_{pos_id}")
        print(f"{i}. 人物筛选: 职位 '{pos_cn}'（ID: {pos_id}）的字段 '{field}' 满足条件 '{cond}'")
    
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
    staff_data = load_staff_data(archive_dir)
    if staff_filters and not staff_data:
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

    # 提取所有count字段
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

                # 1. 标签检查（分别处理普通标签和元标签）
                if not check_tag_conditions(data, tag_filters):
                    continue
                if not check_meta_tag_conditions(data, meta_tag_filters):
                    continue

                # 2. 字段条件检查
                field_values = {}
                count_results = {}
                all_matched = True
                
                # 分离全局字段和普通字段
                global_conditions = grouped_filters.get('*', [])
                normal_fields = [f for f in unique_fields if f != '*']

                # 检查普通字段并记录值
                for field in normal_fields:
                    val = extract_field_value(data, field)
                    field_values[field] = val
                    for cond in grouped_filters[field]:
                        if not matches_condition(val, cond, data, relations_data, count_results):
                            all_matched = False
                            break
                    if not all_matched:
                        break

                # 处理全局条件并记录匹配的字段值
                matched_global_fields = set()
                if all_matched and global_conditions:
                    global_matched = False
                    # 获取当前条目的所有字段
                    all_fields = []
                    exclude_fields = {'id', 'url', 'tags', 'meta_tags', 'relations', 'infobox', 'created_at', 'updated_at'}
                    all_fields.extend([f for f in data.keys() if f not in exclude_fields and isinstance(data[f], (str, int, float, bool))])
                    
                    infobox = data.get('infobox', '')
                    if infobox:
                        infobox_field_pattern = re.compile(r'\|(\w+)\s*[:=]\s*.*?(?:\s*\||\s*}}|\r\n|\n)', re.IGNORECASE)
                        all_fields.extend(infobox_field_pattern.findall(infobox))
                    
                    # 检查每个字段是否满足全局条件
                    for field in all_fields:
                        val = extract_field_value(data, field)
                        for cond in global_conditions:
                            if matches_condition(val, cond, data, relations_data, count_results):
                                global_matched = True
                                matched_global_fields.add(field)
                                field_values[field] = val  # 只记录匹配全局条件的字段
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

                # 4. 人物条件检查
                if not check_staff_conditions(sid, staff_data, staff_filters):
                    continue

                # 5. 保存结果（包含标签信息）
                url = f"https://bgm.tv/subject/{sid}"
                out_f.write(json.dumps(data, ensure_ascii=False) + "\n")
                results.append({
                    'id': sid, 'url': url, 'fields': field_values, 
                    'relations': relation_values, 'counts': count_results,
                    # 存储标签信息
                    'tags': [tag['name'] for tag in data.get('tags', [])],
                    'meta_tags': data.get('meta_tags', [])
                })
                matched_cnt += 1

            except Exception as e:
                print(f"\n处理条目出错: {str(e)}")
                continue

    # 生成CSV（包含标签和staff信息）
    if results:
        print("\n正在生成CSV文件...")
        write_csv_file(output_csv, results, relevant_fields, relation_filters, all_subjects, count_fields,
                      tag_filters, meta_tag_filters, staff_filters, staff_data)

    print(f"\n处理完成！共找到 {matched_cnt} 个符合条件的条目")
    print(f"原始数据保存至: {output_file}")
    print(f"表格数据保存至: {output_csv}")


if __name__ == "__main__":
    main()
