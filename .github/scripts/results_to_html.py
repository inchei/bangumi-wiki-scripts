import csv, os, re, html, yaml

results_dir = 'results'
filters_dir = 'filters'
output_dir = '_site'
os.makedirs(output_dir, exist_ok=True)


def filter_target(name):
    yaml_path = os.path.join(filters_dir, f'{name}.yaml')
    if os.path.exists(yaml_path):
        with open(yaml_path) as f:
            cfg = yaml.safe_load(f)
            if cfg and 'target' in cfg:
                return cfg['target']
    return 'subject'


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

    h = ['<!DOCTYPE html>',
         f'<html><head><meta charset="utf-8"><title>{html.escape(fname)}</title></head><body>',
         f'<h1>{html.escape(fname)}</h1>',
         f'<p>{len(rows) - 1} 行</p>',
         '<table border="1"><thead><tr>']
    for col in headers:
        h.append(f'<th>{html.escape(col)}</th>')
    h.append('</tr></thead><tbody>')
    for row in rows[1:]:
        h.append('<tr>')
        for i, cell in enumerate(row):
            if i == id_col and cell:
                h.append(f'<td><a href="https://bgm.tv/{target}/{html.escape(cell)}" target="_blank">{html.escape(cell)}</a></td>')
            else:
                h.append(f'<td>{html.escape(cell)}</td>')
        h.append('</tr>')
    h.append('</tbody></table></body></html>')

    out_name = fname[:-4] + '.html'
    with open(os.path.join(output_dir, out_name), 'w') as f:
        f.write('\n'.join(h))
    pages.append((out_name, fname))

txt_src = 'duplicate_check_results.txt'
if os.path.exists(txt_src):
    with open(txt_src) as f:
        text = f.read()
    lines = []
    for line in text.split('\n'):
        escaped = html.escape(line)
        escaped = re.sub(r'(https://bgm\.tv/subject/\d+)', r'<a href="\1" target="_blank">\1</a>', escaped)
        lines.append(escaped)
    html_out = [
        '<!DOCTYPE html>',
        '<html><head><meta charset="utf-8"><title>重复ISBN检查结果</title></head><body>',
        '<pre>',
        '\n'.join(lines),
        '</pre></body></html>'
    ]
    with open(os.path.join(output_dir, 'duplicate_check_results.html'), 'w') as f:
        f.write('\n'.join(html_out))
    pages.append(('duplicate_check_results.html', 'duplicate_check_results.txt'))

idx = ['<!DOCTYPE html>',
       '<html><head><meta charset="utf-8"><title>筛选结果</title></head><body>',
       '<h1>Bangumi 筛选结果</h1><ul>']
for out, src in pages:
    idx.append(f'<li><a href="{html.escape(out)}" target="_blank">{html.escape(src)}</a></li>')
idx.append('</ul></body></html>')
with open(os.path.join(output_dir, 'index.html'), 'w') as f:
    f.write('\n'.join(idx))

print(f"已转换 {len(pages)} 个文件到 _site/")
