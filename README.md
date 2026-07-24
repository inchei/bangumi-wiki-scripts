# bangumi-wiki-scripts [![bangumi](http://bgm.tv/img/ico/bgm80-15.png)](http://bgm.tv)

用于 [Bangumi](https://bgm.tv) Wiki 的脚本合集。依赖[官方 Archive](https://github.com/bangumi/Archive) 数据。

## 工具

### bgq 条目筛选

基于 DuckDB 的命令行/Web 筛选工具，支持 YAML 配置、交互模式、Web 界面。

- YAML 配置定义筛选条件（类型、字段、关系、人物、标签等）
- 输出 CSV / JSON / 终端表格
- 内嵌 Web UI，支持可视化筛选和 CSV 导出
- 支持 Linux、macOS、Windows，也可 Docker 部署

[文档](bgq/README.md)

导出的 CSV 可用于 wikiBatch。

### wikiBatch 批量 Wiki 编辑

用户脚本，在 `next.bgm.tv` 上批量审核编辑条目/角色/人物的 Wiki 信息。

- 通过 CSV 文件批量更新 Infobox、标签、系列状态
- 提交前 diff 预览，断点续传，重复检测
- 支持 Private API 和旧版表单两种提交方式

[文档](wikiBatch/README.md)

### wikiPersonAlias

用户脚本，将 `person_alias.json.gz` 导入 IndexedDB，提供 `window.personAliasQuery` / `window.personAliasQueryAll` 接口供其他脚本本地查询人物别名。

- 支持远程更新（GitHub Releases）和本地 `.json.gz` 导入
- 别名查询优先使用 bgq API，此脚本作为离线 fallback

安装：<https://raw.githubusercontent.com/inchei/bangumi-wiki-scripts/main/wikiPersonAlias/wikiPersonAlias.user.js>

### wikiMissingPositions

用户脚本，在条目页和人物关联页一键补完已填写但未关联的 STAFF。

- 条目页 infobox 高亮未关联姓名，点击弹出补完弹窗
- 关联页自动查询并预填缺失条目/剧集
- 需要配合 `bgq serve` 的 API 使用

安装：<https://raw.githubusercontent.com/inchei/bangumi-wiki-scripts/main/wikiMissingPositions/dist/wikiMissingPositions.user.js>

或启用[组件](https://bgm.tv/dev/app/6476)。

[文档](wikiMissingPositions/README.md)

## Python 脚本

使用 uv 进行依赖管理，运行脚本使用 `uv run script.py`。

| 脚本 | 说明 |
|------|------|
| [find_duplicate_isbns.py](find_duplicate_isbns.py) | 查找重复 ISBN 的条目（限 9784 开头的日本出版物） |
| [person_alias.py](person_alias.py) | 生成人物别名 JSON 数据（一对多映射），供 bgq API 或 wikiPersonAlias 脚本使用 |
| [check_volume_order.py](check_volume_order.py) | 检查单行本卷序一致性 |
| [find_dup_person_name.py](find_dup_person_name.py) | 查找简体中文名同名人物，输出 CSV 供 `sync_index.py` 同步到目录 |
| [extract_col.py](extract_col.py) | 从 CSV 列的 `key：value` 或 `name（role）` 中提取信息到新列 |
| [find_missing_persons.py](find_missing_persons.py) | 扫描动画条目 infobox 职位字段，找出出现 ≥2 次但未创建为人物的人员，生成 HTML 列表 |

### extract_col 列提取

从 CSV 指定列中按 key 提取信息到新列，支持两种数据格式：

- **key：value** 格式：`音响制作担当：白崎恵理` → 提取 `白崎恵理` 到新列，原列移除该项
- **name（key）** 格式：`西田達三(动作作画监督)` → 提取 `西田達三` 到新列，原列移除该项

```bash
# key：value 格式
python3 extract_col.py data.csv 音响 音响制作担当

# name（key）格式
python3 extract_col.py data.csv staff 动作作画监督

# 重命名新列
python3 extract_col.py data.csv 制作人员 辅佐 --new-col 演出助手
```

输出文件名默认为 `<输入>_extracted.csv`，提取失败的行写入 `<输入>_failed.csv`。

### find_missing_persons 缺失人物检测

扫描书籍/动画/音乐/游戏/三次元条目 infobox 中的职位字段，提取姓名并与 Bangumi 已有人员对比，找出出现次数 ≥2 但尚未创建为人物的人员名单。

数据源自动检测：优先使用 `bgq/bangumi.db`（DuckDB，~15s），无 DB 时降级为 JSONLines（~47s）。已知人物判断同时参考 `person.jsonlines` 主名和 `person_alias.json` 别名。

输出：
- **单文件模式**（默认）：`missing_persons.html`，自包含所有数据
- **分页模式**（`--multi`）：输出到 `docs/missing-persons/index.html` + `part-1..N.html`，每页 2000 人

HTML 页面中每人显示出现次数和关联条目列表（可展开），点击「创建」按钮自动搜索 `api.bgm.tv`，如果人物已存在则显示链接，否则打开 `bgm.tv/person/new` 预填姓名。需要 [wikiMissingPositions](https://raw.githubusercontent.com/inchei/bangumi-wiki-scripts/main/wikiMissingPositions/dist/wikiMissingPositions.user.js) 用户脚本和 [bangumi 组件](https://bgm.tv/dev/app/6476) 配合完成一键创建与关联。

```bash
# 单文件输出
uv run find_missing_persons.py

# 分页输出（用于 GitHub Pages 部署）
uv run find_missing_persons.py --multi
```

覆盖条目类型：书籍（作者、作画、插图等）、动画（人物设定、作画监督等）、音乐（艺术家、作曲等）、游戏（开发、发行、剧本等）、三次元（导演、编剧等）。结果每周三自动更新到 [GitHub Pages](https://inchei.github.io/bangumi-wiki-scripts/missing-persons/)。

## GitHub Actions

- **数据更新**（每周三自动运行）→ [GitHub Pages](https://inchei.github.io/bangumi-wiki-scripts/) 查看筛选结果，`data-latest` Release 包含人物别名数据
- **二进制构建**（bgq 代码变更时触发）→ `latest` Release：跨平台压缩包

### 网页端查看筛选结果

筛选结果以 HTML 表格形式部署到 [GitHub Pages](https://inchei.github.io/bangumi-wiki-scripts/)，ID 列带有超链接可直达 Bangumi 条目页。

### 本地批量生成

需要 CSV 文件用于 [wikiBatch](wikiBatch/README.md) 批量编辑时，可本地运行：

```bash
mkdir -p results
for f in filters/*.yaml; do
  name=$(basename "$f" .yaml)
  ./bgq/bin/bgq query --config "$f" --data-dir bangumi_archive --format csv --output "results/${name}.csv"
done
```

### 目录同步

`sync_index.py` 可将 bgq 筛选结果同步到 [Bangumi 目录](https://bgm.tv/index)，支持 subject/person/character/episode 四种类型。使用 `next.bgm.tv` 私有 API。

```bash
# 管道模式（类型自动从 CSV 列名推断：person_id→person, character_id→character, id→subject）
export =your_token
./bgq/bin/bgq query --config index_filters/example.yaml --data-dir bangumi_archive --format csv \
  | python sync_index.py --index 12345

# 文件模式
python sync_index.py --index 12345 --csv results/some-filter.csv

# 预览（不执行）
python sync_index.py --index 12345 --csv results/some-filter.csv --dry-run
```

**描述规则**：
- 存在 `index_desc` 列 → 用其值作为条目描述
- 否则 → 非 ID 列以 `列名：值` 拼接（排除 `id` 和 `*_id` 列）
- 行序即目录排序

**目录过滤器**：`index_filters/` 目录下的 YAML 需包含 `target_index` 和 `target` 字段。可 fork 本仓库，设置 `BANGUMI_TOKEN` secret，设置 `test_sync_indices.yml` 的 cron，并删除其他 `.yml` 文件，开启并使用 GitHub Actions 同步自己的目录。

### 同名人物同步

`find_dup_person_name.py` 从 `person.jsonlines` 提取所有有 `简体中文名` 的人物，按名字分组，将同名（≥2人）的人物输出为 CSV，支持 `order` 列（同名人物共享同一序号）：

```bash
python3 find_dup_person_name.py | python3 sync_index.py --index <目录ID>
```

批量同步所有目录（或用于 cron）：

```bash
BANGUMI_TOKEN=xxx ./sync_indices.sh --data-dir bangumi_archive --bgq bgq/bin/bgq
```
