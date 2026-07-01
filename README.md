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

Tampermonkey 用户脚本，在 `next.bgm.tv` 上批量审核编辑条目/角色/人物的 Wiki 信息。

- 通过 CSV 文件批量更新 Infobox、标签、系列状态
- 提交前 diff 预览，断点续传，重复检测
- 支持 Private API 和旧版表单两种提交方式

[文档](wikiBatch/README.md)

### wikiMissingPositions

Tampermonkey 用户脚本，在条目页和人物关联页一键补完已填写但未关联的 STAFF。

- 条目页 infobox 高亮未关联姓名，点击弹出补完弹窗
- 关联页自动查询并预填缺失条目/剧集
- 需要配合 `bgq serve` 的 API 使用

安装：<https://raw.githubusercontent.com/inchei/bangumi-wiki-scripts/main/wikiMissingPositions/dist/wikiMissingPositions.user.js>

或启用[组件](https://bgm.tv/dev/app/6476)。

[文档](wikiMissingPositions/README.md)

## Python 脚本

| 脚本 | 说明 |
|------|------|
| [find_duplicate_isbns.py](find_duplicate_isbns.py) | 查找重复 ISBN 的条目（限 9784 开头的日本出版物） |
| [person_alias.py](person_alias.py) | 生成人物别名 JSON 数据 |
| [check_volume_order.py](check_volume_order.py) | 检查单行本卷序一致性 |

## GitHub Actions

- **数据更新**（每周二自动运行）→ `data-latest` Release：重复 ISBN 检查、人物别名、筛选结果
- **二进制构建**（bgq 代码变更时触发）→ `latest` Release：跨平台压缩包

### 自动筛选查询

CI 使用 bgq 执行 `filters/*.yaml` 中的查询，结果以 CSV 上传到 [data-latest Release](https://github.com/inchei/bangumi-wiki-scripts/releases/tag/data-latest)：

- [小说系列关联漫画单行本](https://github.com/inchei/bangumi-wiki-scripts/releases/download/data-latest/novel-series-manga-volumes.csv)
- [漫画系列关联小说单行本](https://github.com/inchei/bangumi-wiki-scripts/releases/download/data-latest/manga-series-novel-volumes.csv)
- [标题有序号而标记为系列](https://github.com/inchei/bangumi-wiki-scripts/releases/download/data-latest/numbered-title-marked-series.csv)
- [非系列关联单行本](https://github.com/inchei/bangumi-wiki-scripts/releases/download/data-latest/non-series-linked-volumes.csv)
- [写了ISBN的系列](https://github.com/inchei/bangumi-wiki-scripts/releases/download/data-latest/series-with-isbn.csv)
- [连载结束无已完结标签](https://github.com/inchei/bangumi-wiki-scripts/releases/download/data-latest/serialization-ended-no-complete-tag.csv)
- [有序号的单行本未关联系列](https://github.com/inchei/bangumi-wiki-scripts/releases/download/data-latest/numbered-volumes-no-series.csv)
- [小说缺小说标签](https://github.com/inchei/bangumi-wiki-scripts/releases/download/data-latest/novel-missing-novel-tag.csv)
- [漫画缺漫画标签](https://github.com/inchei/bangumi-wiki-scripts/releases/download/data-latest/manga-missing-manga-tag.csv)
- [未填写作者](https://github.com/inchei/bangumi-wiki-scripts/releases/download/data-latest/missing-author.csv)

输出的 CSV 含 `id` 列，可直接上传到 [wikiBatch](wikiBatch/README.md) 批量审核编辑。

本地批量生成所有结果：

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
export BANGUMI_TOKEN=your_token
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

**目录过滤器**：`index_filters/` 目录下的 YAML 需包含 `target_index` 和 `target` 字段。CI 中设置 `BANGUMI_TOKEN` secret 即可自动同步。

批量同步所有目录（或用于 cron）：

```bash
BANGUMI_TOKEN=xxx ./sync_indices.sh --data-dir bangumi_archive --bgq bgq/bin/bgq
```
