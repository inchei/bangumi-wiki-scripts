# /// script
# requires-python = ">=3.9"
# dependencies = [
#   "pyyaml",
# ]
# ///
import csv, os, re, html, yaml

results_dir = 'results'
filters_dir = 'filters'
output_dir = '_site'
os.makedirs(output_dir, exist_ok=True)

DARK_MODE = '''<style>
:root{--b:#fff;--t:#222;--tb:#ccc;--th:#f5f5f5;--ra:#fafafa;--l:#06c;--m:#666}
@media(prefers-color-scheme:dark){:root{--b:#121212;--t:#e0e0e0;--tb:#333;--th:#1e1e1e;--ra:#1a1a1a;--l:#7ec8e3;--m:#999}}
body{background:var(--b);color:var(--t);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:20px}a{color:var(--l)}table{border-collapse:collapse;width:100%}th,td{border:1px solid var(--tb);padding:8px;text-align:left;vertical-align:top}th{background:var(--th)}tr:nth-child(even){background:var(--ra)}
</style>'''


def filter_target(name):
    yaml_path = os.path.join(filters_dir, f'{name}.yaml')
    if os.path.exists(yaml_path):
        with open(yaml_path) as f:
            cfg = yaml.safe_load(f)
            if cfg and 'target' in cfg:
                return cfg['target']
    return 'subject'


def page_wrap(title, body):
    return ['<!DOCTYPE html>',
            '<html><head><meta charset="utf-8">',
            f'<title>{html.escape(title)}</title>',
            DARK_MODE,
            '</head><body>',
            *body,
            '</body></html>']


pages = []
for fname in sorted(os.listdir(results_dir)):
    if not fname.endswith('.csv'):
        continue
    target = filter_target(fname[:-4])

    with open(os.path.join(results_dir, fname), newline='', encoding='utf-8-sig') as f:
        rows = list(csv.reader(f))
    if not rows:
        continue

    headers = rows[0]
    try:
        id_col = headers.index('id')
    except ValueError:
        id_col = -1

    body = [f'<h1>{html.escape(fname)}</h1>',
            f'<p>{len(rows) - 1} 行</p>',
            '<table><thead><tr>']
    for col in headers:
        body.append(f'<th>{html.escape(col)}</th>')
    body.append('</tr></thead><tbody>')
    for row in rows[1:]:
        body.append('<tr>')
        for i, cell in enumerate(row):
            if i == id_col and cell:
                body.append(f'<td><a href="https://bgm.tv/{target}/{html.escape(cell)}" target="_blank">{html.escape(cell)}</a></td>')
            else:
                body.append(f'<td>{html.escape(cell)}</td>')
        body.append('</tr>')
    body.append('</tbody></table>')

    h = page_wrap(fname, body)
    out_name = fname[:-4] + '.html'
    with open(os.path.join(output_dir, out_name), 'w') as f:
        f.write('\n'.join(h))
    pages.append((out_name, fname))

txt_src = 'duplicate_check_results.txt'
if os.path.exists(txt_src):
    with open(txt_src) as f:
        text = f.read()
    escaped_lines = []
    for line in text.split('\n'):
        escaped = html.escape(line)
        escaped = re.sub(r'(https://bgm\.tv/subject/\d+)', r'<a href="\1" target="_blank">\1</a>', escaped)
        escaped_lines.append(escaped)
    h = page_wrap('重复ISBN检查结果', [
        '<h1>重复ISBN检查结果</h1>',
        '<pre>',
        '\n'.join(escaped_lines),
        '</pre>',
    ])
    with open(os.path.join(output_dir, 'duplicate_check_results.html'), 'w') as f:
        f.write('\n'.join(h))
    pages.append(('duplicate_check_results.html', 'duplicate_check_results.txt'))

idx_body = ['<h1>Bangumi 筛选结果</h1><ul>']
for out, src in pages:
    idx_body.append(f'<li><a href="{html.escape(out)}" target="_blank">{html.escape(src)}</a></li>')
idx_body.append('</ul>')
idx = page_wrap('筛选结果', idx_body)
with open(os.path.join(output_dir, 'index.html'), 'w') as f:
    f.write('\n'.join(idx))

print(f"已转换 {len(pages)} 个文件到 _site/")
