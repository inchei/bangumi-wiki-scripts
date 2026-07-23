#!/usr/bin/env python3
"""找出动画信息框职位字段中出现 ≥2 次但未创建为人物的人员，输出分页 HTML"""

import argparse
import json
import re
import sys
import time
import subprocess
import html as htmlmod
import tempfile
from pathlib import Path

# 职位 ID → 名称映射（仅动画 type=2）
ANIME_POSITIONS = {
    7: "人物原案", 8: "人物设定", 9: "构图", 10: "系列构成", 11: "美术监督",
    13: "色彩设计", 14: "总作画监督", 15: "作画监督", 16: "机械设定",
    17: "摄影监督", 18: "监修", 19: "道具设计", 20: "原画", 21: "第二原画",
    22: "动画检查", 24: "制作助理", 25: "背景美术", 26: "色彩指定",
    27: "数码绘图", 28: "剪辑", 29: "原案", 30: "主题歌编曲",
    31: "主题歌作曲", 32: "主题歌作词", 33: "主题歌演出", 34: "插入歌演出",
    35: "企画", 36: "企划制作人", 37: "制作管理", 38: "宣传", 39: "录音",
    40: "录音助理", 41: "系列监督", 42: "製作", 43: "设定", 44: "音响监督",
    45: "音响", 46: "音效", 47: "特效", 48: "配音监督", 49: "联合导演",
    50: "背景设定", 51: "补间动画", 52: "执行制片人", 53: "助理制片人",
    54: "制片人", 55: "音乐助理", 56: "制作进行", 57: "演员监督",
    58: "总制片人", 59: "联合制片人", 60: "台词编辑", 61: "后期制片协调",
    62: "制作助理", 63: "制作", 64: "制作协调", 65: "音乐制作",
    66: "特别鸣谢", 67: "动画制作", 69: "CG 导演", 70: "机械作画监督",
    71: "美术设计", 72: "副导演", 73: "OP・ED 分镜", 74: "总导演",
    75: "3DCG", 76: "制作协力", 77: "动作作画监督", 80: "监制", 81: "协力",
    82: "摄影", 83: "制作进行协力", 84: "设定制作", 85: "音乐制作人",
    86: "3DCG 导演", 87: "动画制片人", 88: "特效作画监督", 89: "主演出",
    90: "作画监督助理", 91: "演出助理", 92: "主动画师", 93: "上色",
    94: "上色检查", 95: "色彩检查", 96: "美术板", 97: "美术", 98: "印象板",
    99: "2D 设计", 100: "3D 设计", 101: "技术导演", 102: "特技导演",
    103: "色彩脚本", 104: "分镜协力", 105: "分镜抄写", 106: "副人物设定",
    107: "客座人物设定", 108: "构图监修", 109: "构图作画监督",
    110: "总作画监督助理", 111: "道具作画监督", 112: "概念设计",
    113: "服装设计", 114: "标题设计", 115: "设定协力", 116: "音乐监督",
    117: "选曲", 118: "插入歌作词", 119: "插入歌作曲", 120: "插入歌编曲",
    121: "创意制片人", 122: "副制片人", 123: "制作统括", 124: "现场制片人",
    125: "文艺制作", 127: "企画协力", 128: "OP・ED 演出",
    129: "Bank 分镜演出", 130: "Live 分镜演出", 131: "剧中剧分镜演出",
    132: "剧中剧人设", 133: "视觉导演", 134: "创意总监", 135: "特摄效果",
    136: "视觉效果", 137: "动作导演", 138: "转场绘", 139: "插画",
    140: "角色作画监督", 141: "作画监修", 142: "机设原案", 143: "概念艺术",
    144: "视觉概念", 145: "画面设计", 146: "怪物设计", 147: "故事概念",
    148: "剧本协调", 149: "脚本协力", 150: "副系列构成", 151: "构成协力",
    152: "录音工作室", 153: "整音", 154: "音响制作担当", 155: "在线剪辑",
    156: "离线剪辑", 157: "3D 动画师", 158: "CG 制作人", 159: "宣传制片人",
    160: "美术制作人", 161: "音响制作人", 162: "CG 制作进行",
    163: "美术制作进行", 164: "美术监督助理", 165: "色彩设计助理",
    166: "摄影监督助理", 167: "制作管理助理", 168: "设定制作助理",
}

POS_NAME_TO_ID = {v: k for k, v in ANIME_POSITIONS.items()}

INFOKEY_RE = re.compile(r'(?im)^\|([^|=\n]+?)\s*=\s*([^\n\r|]*)')
DELIM_RE = re.compile(r'[()[\]{}（）<>《》「」『』【】+×·→/／、,，;；：&＆\\等]+')

NON_PERSON_SUBSTRINGS = re.compile(r'(?:'
    r'总监|总策划|总制片|总导演|总作监|出品人|发行人'
    r'|制片|制片人|制作人|制作总指挥|制作管理|制作进行|制作担当|制作デスク'
    r'|导演|監督|チーフディレクター|ディレクター|チーフ'
    r'|监制|监修|監修'
    r'|企画|構成|构成|策划|统筹|协力|協力|协助|提供|支持'
    r'|辅助|辅佐|助理|助手|修型|鳴謝|鸣谢'
    r'|指导|编剧|脚本|原作|原案|分镜|演出|作曲|作词|编曲'
    r'|录音|混音|选曲|整音|效果|編集|剪辑|剪辑|编辑|摄影|宣传'
    r'|设计|合成|特效|美術|色彩|人设|原画|作画|背景|动画|制作|製作'
    r'|出品|发行|出版|発行|連載|掲載|刊|版'
    r'|后期|前期|版权|文学|文艺|设定|設定|原创音乐|原作音乐|调整|指挥|指挥者|指挥家'
    r'|工作室|委员会|委員会|株式会社|有限公司|有限责任公司|集团|公司'
    r'|企鹅影视|哔哩哔哩|腾讯|爱奇艺|优酷'
    r'|ミュージック|ピクチャーズ|エンタテインメント|エンタテイメント'
    r'|ワークス|スタジオ|プロダクション|アニメーション|プロモーション'
    r'|エージェンシー|ウォンバット|DIGITAL'
    r'|テレビジョン|テレビ|放送|出版|発行|シリーズ'
    r'|INC\.?|Inc\.?|Ltd\.?|Co\.|Corp\.'
    r'|[SsTt][Uu][Dd][Ii][Oo]|[Pp]roduction|[Ee]ntertainment|[Pp]ictures|[Mm]usic|[Ww]orks'
    r'|OP\d?|ED\d?|IN\d?|BGM|OST|OVA|OAD|ONA|TV|BD|DVD|CD|Blu-ray'
    r'|鬼戦車|Team[- ]|CV\b|NC\b'
    r'|話|回|巻|期|集|冊|章|部|編'
    r'|北京|上海|東京|日本|台湾|香港|中国'
    r'|顾问|演奏|指揮|協力|宣伝|宣伝協力'
    r'|より|漫画|アニメ|小説|原作小説|原作漫画'
    r'|片头曲|片尾曲|插曲|主題歌|主題曲|主題歌'
    r'|製作担当|音楽協力|製作協力'
    r'|東映動画|創通|マーベラス|Showgate|ショウゲート'
    r')')

_ALIAS_TRANS = str.maketrans({
    **{chr(c): chr(c - 0xFBE0) for c in range(0xFF66, 0xFF9E)},
    **{chr(c): chr(c - 0xFEE0) for c in range(0xFF21, 0xFF5B)},
    **{chr(c): chr(c - 0x60) for c in range(0x30A1, 0x30F7)},
})


def parse_args():
    parser = argparse.ArgumentParser(
        description='找出未在 bangumi 创建的人物，生成 HTML')
    parser.add_argument('--multi', action='store_true',
                        help='分页输出到 docs/missing-persons/（默认：单文件 missing_persons.html）')
    return parser.parse_args()


def is_likely_person(name: str) -> bool:
    if not name or len(name) < 2:
        return False
    if re.match(r'^[\d\-./#\s]+$', name):
        return False
    if not re.search(r'[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ffa-zA-Z]', name):
        return False
    if NON_PERSON_SUBSTRINGS.search(name):
        return False
    return True


def normalize(name: str) -> str:
    return re.sub(r'[\s-]', '', name).translate(_ALIAS_TRANS).lower()


def duckdb_query(db_path: Path, duckdb_cli: str, sql: str) -> list:
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        out_path = f.name
    full_sql = f"COPY ({sql}) TO '{out_path}' (ARRAY true)"
    subprocess.run([duckdb_cli, str(db_path), '-c', full_sql],
                   capture_output=True, check=True)
    with open(out_path, 'r', encoding='utf-8') as f:
        rows = json.load(f)
    Path(out_path).unlink(missing_ok=True)
    return rows


def load_known_persons(person_file: Path, alias_file: Path) -> set[str]:
    known = set()
    with open(person_file, 'r', encoding='utf-8') as f:
        for line in f:
            p = json.loads(line)
            name = p.get('name', '')
            if name:
                known.add(normalize(name))
    try:
        with open(alias_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        known.update(data[1].keys())
    except (FileNotFoundError, json.JSONDecodeError):
        pass
    return known


def load_subjects_duckdb(db_path: Path, duckdb_cli: str):
    return duckdb_query(db_path, duckdb_cli,
                        "SELECT id, name, infobox FROM subjects WHERE type = 2")


def load_subjects_jsonlines(archive_dir: Path):
    subject_file = archive_dir / 'subject.jsonlines'
    subjects = []
    with open(subject_file, 'r', encoding='utf-8') as f:
        for line in f:
            subj = json.loads(line)
            if subj.get('type') == 2:
                subjects.append(subj)
    return subjects


def parse_subjects(subjects: list[dict]):
    person_subjects: dict[str, dict[int, tuple[str, str, set[int]]]] = {}
    for subj in subjects:
        sid = subj['id']
        sname = subj.get('name', '')
        infobox = subj.get('infobox', '')
        for m in INFOKEY_RE.finditer(infobox):
            key = m.group(1).strip().rstrip('：:').strip()
            pos_id = POS_NAME_TO_ID.get(key)
            if pos_id is None:
                continue
            value = m.group(2).strip()
            for name in DELIM_RE.split(value):
                name = name.strip()
                if not name or not is_likely_person(name):
                    continue
                key_norm = normalize(name)
                entry = person_subjects.get(key_norm)
                if entry is None:
                    entry = {}
                    person_subjects[key_norm] = entry
                if sid in entry:
                    entry[sid][2].add(pos_id)
                else:
                    entry[sid] = (sname, name, {pos_id})
    return person_subjects


def write_part_html(output_dir: Path, part_num: int, total_parts: int,
                    chunk_missing: list, pending_chunk: list,
                    anime_count: int, total_missing: int):
    safe_title = htmlmod.escape(f'动画中缺失的人物 - 第 {part_num}/{total_parts} 页')
    prev_link = f'part-{part_num-1}.html' if part_num > 1 else None
    next_link = f'part-{part_num+1}.html' if part_num < total_parts else None

    pos_table = ','.join(f'{pid}:"{ANIME_POSITIONS[pid]}"' for pid in sorted(ANIME_POSITIONS))
    pending_json_raw = json.dumps(pending_chunk, ensure_ascii=False)

    lines = []
    lines.append(f'''<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{safe_title}</title>
<style>
  body {{ font-family: -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }}
  details {{ margin: 0.3em 0; }}
  summary {{ cursor: pointer; font-size: 1.05em; }}
  summary .count {{ color: #888; font-weight: normal; font-size: 0.85em; }}
  .btn-create {{ font-size: 0.7em; margin-left: 0.5em; cursor: pointer; padding: 0 0.5em; border: 1px solid #4caf50; border-radius: 3px; background: #e8f5e9; color: #2e7d32; vertical-align: middle; }}
  .btn-create:hover {{ background: #c8e6c9; }}
  ul {{ margin: 0.3em 0 0.5em 1.5em; padding: 0; }}
  li {{ margin: 0.15em 0; font-size: 0.9em; }}
  li .pos {{ color: #888; font-size: 0.85em; margin-left: 0.3em; }}
  .sr {{ margin: 0.2em 0 0.2em 1.5em; font-size: 0.9em; padding: 0.3em 0.6em; border-radius: 3px; }}
  .sr-found {{ background: #e8f5e9; }}
  .sr-missing {{ background: #fff3e0; }}
  .sr a {{ margin-right: 0.5em; }}
  .nav {{ margin-bottom: 1em; }}
  .nav a {{ margin-right: 1em; }}
</style>
</head>
<body>
<div class="nav">
  <a href="index.html">&#x2190; 返回首页</a>
''')
    if prev_link:
        lines.append(f'  <a href="{prev_link}">&#x2190; 上一页</a>\n')
    if next_link:
        lines.append(f'  <a href="{next_link}">下一页 &#x2192;</a>\n')
    lines.append(f'</div>\n')
    lines.append(f'<p>第 {part_num}/{total_parts} 页</p>\n')

    lines.append('<script>\n')
    lines.append(f'var _pendingData = {pending_json_raw};\n')
    lines.append('var _bgmMpPending = null;\n')
    lines.append('</script>\n')

    for idx, display_name, count, subjects in chunk_missing:
        safe_name = htmlmod.escape(display_name, quote=True)
        safe_name_text = htmlmod.escape(display_name)
        lines.append(f'<details class="person" data-idx="{idx}">\n')
        lines.append(f'  <summary>{safe_name_text} <span class="count">({count})</span>'
                      f' <button class="btn-create" data-idx="{idx}"'
                      f' data-name="{safe_name}">创建</button></summary>\n')
        lines.append('</details>\n')

    lines.append(f'''<script>
var _posNames = {{{pos_table}}};

function normalize(s) {{
  return s.replace(/[\\s-]/g, '').replace(/[\\u30A1-\\u30F6]/g, function(m) {{
    return String.fromCharCode(m.charCodeAt(0) - 0x60);
  }}).replace(/[\\uFF21-\\uFF5A]/g, function(m) {{
    return String.fromCharCode(m.charCodeAt(0) - 0xFEE0);
  }}).toLowerCase();
}}

function renderSubjects(idx, container) {{
  var data = _pendingData[idx];
  if (!data || !data.subjectsData) return;
  var ul = document.createElement('ul');
  var entries = Object.entries(data.subjectsData).sort(function(a, b) {{ return a[0].localeCompare(b[0]); }});
  for (var i = 0; i < entries.length; i++) {{
    var sid = entries[i][0].split(':')[1];
    var entry = entries[i][1];
    var li = document.createElement('li');
    li.innerHTML = '<a href="https://bgm.tv/subject/' + sid + '">' + entry.name + '</a> <span class="pos">[' +
      entry.positions.map(function(p) {{ return _posNames[p] || p; }}).join('\u3001') + ']</span>';
    ul.appendChild(li);
  }}
  container.appendChild(ul);
}}

document.addEventListener('click', function(e) {{
  var det = e.target.closest('details.person');
  if (!det || det.querySelector('ul')) return;
  renderSubjects(parseInt(det.dataset.idx), det);
}});

function showResult(btn, html, className) {{
  var sr = btn.parentElement.querySelector('.sr');
  if (!sr) {{
    sr = document.createElement('div');
    sr.className = 'sr';
    btn.parentElement.insertBefore(sr, btn.nextSibling);
  }}
  sr.className = 'sr ' + className;
  sr.innerHTML = html;
}}

window.addEventListener('message', function(e) {{
  if (e.data && e.data.type === 'bgm_mp_request' && _bgmMpPending) {{
    e.source.postMessage({{type: 'bgm_mp_data', data: _bgmMpPending}}, '*');
  }}
}});

document.addEventListener('click', function(e) {{
  var btn = e.target.closest('.btn-create');
  if (!btn) return;
  var idx = parseInt(btn.dataset.idx);
  var name = btn.dataset.name;
  _bgmMpPending = JSON.stringify(_pendingData[idx]);

  showResult(btn, '\u641C\u7D22\u4E2D\u2026', 'sr-loading');

  fetch('https://api.bgm.tv/v0/search/persons?limit=5', {{
    method: 'POST',
    headers: {{ 'Content-Type': 'application/json' }},
    body: JSON.stringify({{ keyword: name }})
  }}).then(function(r) {{ return r.json(); }}).then(function(data) {{
    var matches = (data.data || []).filter(function(p) {{
      return normalize(p.name) === normalize(name);
    }});
    if (matches.length) {{
      _bgmMpPending = null;
      var links = matches.map(function(p) {{
        return '<a href="https://bgm.tv/person/' + p.id + '" target="_blank">' + p.name + ' (ID:' + p.id + ')</a>';
      }}).join(' ');
      showResult(btn, '&#x2705; ' + links, 'sr-found');
      return;
    }}
    showResult(btn, '&#x2796; \u672A\u521B\u5EFA', 'sr-missing');
    window.open('https://bgm.tv/person/new?name=' + encodeURIComponent(name) + '&bgm_mp=1', '_blank');
  }}).catch(function() {{
    showResult(btn, '\u641C\u7D22\u5931\u8D25', 'sr-loading');
  }});
}});
</script>
</body>
</html>''')

    path = output_dir / f'part-{part_num}.html'
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    return path


def write_index_html(output_dir: Path, total_parts: int, anime_count: int,
                     total_missing: int, chunk_size: int, min_count: int):
    lines = []
    lines.append(f'''<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>动画中缺失的人物</title>
<style>
  body {{ font-family: -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }}
  h1 {{ margin-bottom: 0.3em; }}
  .stats {{ color: #666; font-size: 0.9em; margin-bottom: 1.5em; }}
  ul {{ padding: 0; list-style: none; }}
  li {{ margin: 0.4em 0; }}
  li a {{ font-size: 1.05em; }}
</style>
</head>
<body>
<h1>动画中缺失的人物</h1>
<p class="stats">扫描 {anime_count} 个动画条目，发现 {total_missing} 个在 ≥{min_count} 个条目中出现但未创建的人物（分 {total_parts} 页，每页 {chunk_size} 人）</p>
<p class="stats">生成于 {time.strftime('%Y-%m-%d')} — 需要 <a href="https://raw.githubusercontent.com/inchei/bangumi-wiki-scripts/main/wikiMissingPositions/dist/wikiMissingPositions.user.js" target="_blank">wikiMissingPositions</a> 用户脚本 / <a href="https://bgm.tv/dev/app/6476" target="_blank">bangumi 组件</a> 配合。</p>
<ul id="page-list">
''')

    for p in range(1, total_parts + 1):
        start = (p - 1) * chunk_size + 1
        end = min(p * chunk_size, total_missing)
        lines.append(f'  <li><a href="part-{p}.html">第 {p} 页（第 {start}-{end} 个）</a></li>\n')

    lines.append('</ul>\n</body>\n</html>')

    path = output_dir / 'index.html'
    with open(path, 'w', encoding='utf-8') as f:
        f.write(''.join(lines))
    return path


def write_single_html(missing: list, pending_list: list,
                       anime_count: int, total_missing: int) -> Path:
    pos_table = ','.join(f'{pid}:"{ANIME_POSITIONS[pid]}"' for pid in sorted(ANIME_POSITIONS))
    pending_json_raw = json.dumps(pending_list, ensure_ascii=False)

    lines = []
    lines.append(f'''<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>动画中缺失的人物</title>
<style>
  body {{ font-family: -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }}
  h1 {{ margin-bottom: 0.3em; }}
  .stats {{ color: #666; font-size: 0.9em; margin-bottom: 1.5em; }}
  details {{ margin: 0.3em 0; }}
  summary {{ cursor: pointer; font-size: 1.05em; }}
  summary .count {{ color: #888; font-weight: normal; font-size: 0.85em; }}
  .btn-create {{ font-size: 0.7em; margin-left: 0.5em; cursor: pointer; padding: 0 0.5em; border: 1px solid #4caf50; border-radius: 3px; background: #e8f5e9; color: #2e7d32; vertical-align: middle; }}
  .btn-create:hover {{ background: #c8e6c9; }}
  ul {{ margin: 0.3em 0 0.5em 1.5em; padding: 0; }}
  li {{ margin: 0.15em 0; font-size: 0.9em; }}
  li .pos {{ color: #888; font-size: 0.85em; margin-left: 0.3em; }}
  .sr {{ margin: 0.2em 0 0.2em 1.5em; font-size: 0.9em; padding: 0.3em 0.6em; border-radius: 3px; }}
  .sr-found {{ background: #e8f5e9; }}
  .sr-missing {{ background: #fff3e0; }}
  .sr a {{ margin-right: 0.5em; }}
</style>
</head>
<body>
<h1>动画中缺失的人物</h1>
<p class="stats">扫描 {anime_count} 个动画条目，发现 {total_missing} 个在 ≥2 个条目中出现但未创建的人物</p>
<p class="stats">生成于 {time.strftime('%Y-%m-%d')} — 需要 <a href="https://raw.githubusercontent.com/inchei/bangumi-wiki-scripts/main/wikiMissingPositions/dist/wikiMissingPositions.user.js" target="_blank">wikiMissingPositions</a> 用户脚本 / <a href="https://bgm.tv/dev/app/6476" target="_blank">bangumi 组件</a> 配合。</p>
''')

    lines.append('<script>\n')
    lines.append(f'var _pendingData = {pending_json_raw};\n')
    lines.append('var _bgmMpPending = null;\n')
    lines.append('</script>\n')

    for idx, (display_name, count, _) in enumerate(missing):
        safe_name = htmlmod.escape(display_name, quote=True)
        safe_name_text = htmlmod.escape(display_name)
        lines.append(f'<details class="person" data-idx="{idx}">\n')
        lines.append(f'  <summary>{safe_name_text} <span class="count">({count})</span>'
                      f' <button class="btn-create" data-idx="{idx}"'
                      f' data-name="{safe_name}">创建</button></summary>\n')
        lines.append('</details>\n')

    lines.append(f'''<script>
var _posNames = {{{pos_table}}};

function normalize(s) {{
  return s.replace(/[\\s-]/g, '').replace(/[\\u30A1-\\u30F6]/g, function(m) {{
    return String.fromCharCode(m.charCodeAt(0) - 0x60);
  }}).replace(/[\\uFF21-\\uFF5A]/g, function(m) {{
    return String.fromCharCode(m.charCodeAt(0) - 0xFEE0);
  }}).toLowerCase();
}}

function renderSubjects(idx, container) {{
  var data = _pendingData[idx];
  if (!data || !data.subjectsData) return;
  var ul = document.createElement('ul');
  var entries = Object.entries(data.subjectsData).sort(function(a, b) {{ return a[0].localeCompare(b[0]); }});
  for (var i = 0; i < entries.length; i++) {{
    var sid = entries[i][0].split(':')[1];
    var entry = entries[i][1];
    var li = document.createElement('li');
    li.innerHTML = '<a href="https://bgm.tv/subject/' + sid + '">' + entry.name + '</a> <span class="pos">[' +
      entry.positions.map(function(p) {{ return _posNames[p] || p; }}).join('\u3001') + ']</span>';
    ul.appendChild(li);
  }}
  container.appendChild(ul);
}}

document.addEventListener('click', function(e) {{
  var det = e.target.closest('details.person');
  if (!det || det.querySelector('ul')) return;
  renderSubjects(parseInt(det.dataset.idx), det);
}});

function showResult(btn, html, className) {{
  var sr = btn.parentElement.querySelector('.sr');
  if (!sr) {{
    sr = document.createElement('div');
    sr.className = 'sr';
    btn.parentElement.insertBefore(sr, btn.nextSibling);
  }}
  sr.className = 'sr ' + className;
  sr.innerHTML = html;
}}

window.addEventListener('message', function(e) {{
  if (e.data && e.data.type === 'bgm_mp_request' && _bgmMpPending) {{
    e.source.postMessage({{type: 'bgm_mp_data', data: _bgmMpPending}}, '*');
  }}
}});

document.addEventListener('click', function(e) {{
  var btn = e.target.closest('.btn-create');
  if (!btn) return;
  var idx = parseInt(btn.dataset.idx);
  var name = btn.dataset.name;
  _bgmMpPending = JSON.stringify(_pendingData[idx]);

  showResult(btn, '\u641C\u7D22\u4E2D\u2026', 'sr-loading');

  fetch('https://api.bgm.tv/v0/search/persons?limit=5', {{
    method: 'POST',
    headers: {{ 'Content-Type': 'application/json' }},
    body: JSON.stringify({{ keyword: name }})
  }}).then(function(r) {{ return r.json(); }}).then(function(data) {{
    var matches = (data.data || []).filter(function(p) {{
      return normalize(p.name) === normalize(name);
    }});
    if (matches.length) {{
      _bgmMpPending = null;
      var links = matches.map(function(p) {{
        return '<a href="https://bgm.tv/person/' + p.id + '" target="_blank">' + p.name + ' (ID:' + p.id + ')</a>';
      }}).join(' ');
      showResult(btn, '\u2705 ' + links, 'sr-found');
      return;
    }}
    showResult(btn, '\u2796 \u672A\u521B\u5EFA', 'sr-missing');
    window.open('https://bgm.tv/person/new?name=' + encodeURIComponent(name) + '&bgm_mp=1', '_blank');
  }}).catch(function() {{
    showResult(btn, '\u641C\u7D22\u5931\u8D25', 'sr-loading');
  }});
}});
</script>
</body>
</html>''')

    path = Path('missing_persons.html')
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    return path


def main():
    args = parse_args()
    bgq_dir = Path(__file__).resolve().parent / 'bgq'
    cwd_archive = Path.cwd() / 'bangumi_archive'
    bgq_archive = bgq_dir / 'bangumi_archive'
    archive_dir = cwd_archive if cwd_archive.exists() else bgq_archive
    db_path = bgq_dir / 'bangumi.db'
    duckdb_cli = bgq_dir / 'bin' / 'duckdb'
    if not duckdb_cli.exists():
        duckdb_cli = 'duckdb'
    person_file = archive_dir / 'person.jsonlines'
    alias_file = Path(__file__).resolve().parent / 'person_alias.json'
    t0 = time.time()

    print("查询动画条目中...", flush=True)
    if db_path.exists():
        print(f"  DuckDB: {db_path}", flush=True)
        subjects = load_subjects_duckdb(db_path, duckdb_cli)
    else:
        print(f"  JSONLines: {archive_dir}", flush=True)
        subjects = load_subjects_jsonlines(archive_dir)

    person_subjects = parse_subjects(subjects)
    anime_count = len(subjects)
    t1 = time.time()
    print(f"  动画条目数: {anime_count}")
    print(f"  唯一人物名: {len(person_subjects)}")
    print(f"  耗时: {t1-t0:.1f}s")

    print("加载已创建人物中...", flush=True)
    existing = load_known_persons(person_file, alias_file)
    t2 = time.time()
    print(f"  已有人员数: {len(existing)}")
    print(f"  耗时: {t2-t1:.1f}s")

    print("筛选缺失人物中...", flush=True)
    min_count = 2
    chunk_size = 2000
    missing = []
    for key, subjects in person_subjects.items():
        if key in existing:
            continue
        if len(subjects) < min_count:
            continue
        display_name = next(iter(subjects.values()))[1]
        missing.append((display_name, len(subjects), subjects))
    missing.sort(key=lambda x: -x[1])
    t3 = time.time()
    total_missing = len(missing)
    print(f"  缺失且 ≥{min_count} 次出现的人数: {total_missing}")
    print(f"  耗时: {t3-t2:.1f}s")

    if not total_missing:
        print("没有需要处理的人物", file=sys.stderr)
        return

    pending_list = []
    for display_name, count, subjects in missing:
        subjects_data = {}
        for sid, (sname, _, pos_ids) in subjects.items():
            subjects_data[f"2:{sid}"] = {
                "name": sname,
                "positions": sorted(pos_ids),
                "_type": 2,
            }
        pending_list.append({
            "personName": display_name,
            "subjectsData": subjects_data,
            "episodesData": None,
        })

    if args.multi:
        print("生成分页 HTML...", flush=True)
        output_dir = Path('docs/missing-persons')
        output_dir.mkdir(parents=True, exist_ok=True)
        total_parts = (total_missing + chunk_size - 1) // chunk_size

        for part_num in range(1, total_parts + 1):
            start = (part_num - 1) * chunk_size
            end = min(start + chunk_size, total_missing)
            chunk_missing = list(enumerate(missing))[start:end]
            chunk_pending = pending_list[start:end]
            chunk_missing = [(i - start, *rest) for i, rest in chunk_missing]
            out = write_part_html(output_dir, part_num, total_parts, chunk_missing,
                                  chunk_pending, anime_count, total_missing)
            if part_num == 1 or part_num == total_parts or part_num % 20 == 0:
                print(f"  [{part_num}/{total_parts}] {out}", flush=True)

        write_index_html(output_dir, total_parts, anime_count, total_missing, chunk_size, min_count)
        t4 = time.time()
        print(f"  输出目录: {output_dir}")
        print(f"  耗时: {t4-t3:.1f}s")
    else:
        print("生成单文件 HTML...", flush=True)
        out_path = write_single_html(missing, pending_list, anime_count, total_missing)
        t4 = time.time()
        print(f"  输出文件: {out_path}")
        print(f"  耗时: {t4-t3:.1f}s")

    print(f"\n总计耗时: {t4-t0:.1f}s")


if __name__ == '__main__':
    main()
