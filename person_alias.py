import json
import re
from bgm_tv_wiki import parse

# 匹配括号及内容的正则表达式（支持中英文括号）
BRACKET_PATTERN = re.compile(r'([\(（])(.*?)([\)）])')

def process_brackets(text, is_primary_name):
    """
    处理文本中的括号内容
    :param text: 原始文本
    :param is_primary_name: 是否为"简体中文名"来源
    :return: 处理后的主文本和括号内内容列表
    """
    if not text:
        return text, []

    brackets = []
    # 查找所有括号及内容
    matches = BRACKET_PATTERN.findall(text)
    if matches:
        for left, content, right in matches:
            if content.strip():  # 只处理非空内容
                brackets.append(content.strip())
        # 移除所有括号及内容
        text = BRACKET_PATTERN.sub('', text).strip()

    # 如果是简体中文名来源，不返回括号内容作为新别名
    if is_primary_name:
        return text, []
    return text, brackets

def split_aliases(alias, is_exception_name):
    parts = [p.strip() for p in alias.replace(' / ', '、').split("、") if p.strip()]
    if not parts:
        return []
    if is_exception_name:
        return parts
    final_parts, kp = [], re.compile(r'[ァ-ヺ]')
    for part in parts:
        if "＝" not in part:
            final_parts.append(part)
            continue
        sub_parts, temp, i = part.split("＝"), [], 0
        while i < len(sub_parts):
            current = sub_parts[i].strip()
            if not current:
                i +=1
                continue
            if i < len(sub_parts)-1:
                next_part = sub_parts[i+1].strip()
                if next_part:
                    cl = current[-1] if current else ""
                    nf = next_part[0] if next_part else ""
                    if kp.match(cl) and kp.match(nf):
                        temp.append(f"{current}＝{next_part}")
                        i +=2
                        continue
            temp.append(current)
            i +=1
        final_parts.extend(temp)
    return final_parts

def parse_bangumi_person_jsonlines(file_path):
    persons = []  # 人物对象数组
    person_id_to_index = {}  # 人物ID到数组索引的映射
    aliases = {}  # 别名到人物索引的映射

    EXC_NAME = "2C＝がろあ"

    with open(file_path, 'r', encoding='utf-8') as f:
        for ln, line in enumerate(f, 1):
            try:
                jd = json.loads(line.strip())
                en = jd.get('name')
                person_id = jd.get('id')

                if not en or person_id is None:
                    continue

                # 处理人物信息
                if person_id not in person_id_to_index:
                    person_index = len(persons)
                    persons.append([en, person_id])  # 使用数组而不是对象
                    person_id_to_index[person_id] = person_index
                else:
                    person_index = person_id_to_index[person_id]

                is_exc = (en == EXC_NAME)
                ib = jd.get('infobox')
                if not ib:
                    continue

                pr = parse(ib)
                if not pr.fields:
                    continue

                qn = []
                for f in pr.fields:
                    # 处理简体中文名
                    if f.key == '简体中文名' and f.value:
                        cn = str(f.value).strip()
                        if cn:
                            # 处理括号，不将括号内容作为新别名
                            processed_cn, _ = process_brackets(cn, is_primary_name=True)
                            if processed_cn and processed_cn not in qn:
                                qn.append(processed_cn)

                    # 处理别名
                    elif f.key == '别名' and f.value:
                        ais = f.value if isinstance(f.value, tuple) else (f.value,)
                        for item in ais:
                            av = str(item.value).strip() if item.value else ""
                            if av:
                                split_als = split_aliases(av, is_exc)
                                for a in split_als:
                                    if a:
                                        # 处理括号，将括号内容作为新别名
                                        processed_a, bracket_contents = process_brackets(a, is_primary_name=False)
                                        # 添加处理后的主别名
                                        if processed_a and processed_a not in qn:
                                            qn.append(processed_a)
                                        # 添加括号内的内容作为新别名
                                        for bc in bracket_contents:
                                            if bc and bc not in qn:
                                                qn.append(bc)

                # 过滤空值和与原名相同的别名
                # 合并：窄假名→平假名、全角字母→半角、全角片假名→平假名
                trans = str.maketrans({
                    # 1. 窄假名（ｶﾈｼ等，Unicode：0xFF66-0xFF9D）→ 平假名
                    **{chr(c): chr(c - 0xFBE0) for c in range(0xFF66, 0xFF9E)},
                    # 2. 全角字母（０xFF21-0xFF5A）→ 半角
                    **{chr(c): chr(c - 0xFEE0) for c in range(0xFF21, 0xFF5B)},
                    # 3. 全角片假名（0x30A1-0x30F6）→ 平假名
                    **{chr(c): chr(c - 0x60) for c in range(0x30A1, 0x30F7)}
                })

                # 最终归一化列表推导
                qn = [re.sub(r'[\s-]', '', n).translate(trans).lower() for n in qn if n and n != en]

                # 将别名映射到人物索引
                for alias in qn:
                    if alias not in aliases:
                        aliases[alias] = person_index

            except Exception as e:
                print(f"Line {ln} error: {e}")
                continue

    return [persons, aliases]

if __name__ == "__main__":
    mapping = parse_bangumi_person_jsonlines("bangumi_archive/person.jsonlines")
    with open("person_alias.json", "w", encoding="utf-8") as f:
        json.dump(mapping, f, ensure_ascii=False, separators=(',', ':'))  # 紧凑格式输出
    print(f"Generated {len(mapping[1])} alias to {len(mapping[0])} persons. Saved to person_alias.json")
