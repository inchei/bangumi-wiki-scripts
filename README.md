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

### wikiMissingPositions

用户脚本，在条目页和人物关联页一键补完已填写但未关联的 STAFF。

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

- **数据更新**（每周二自动运行）→ [GitHub Pages](https://inchei.github.io/bangumi-wiki-scripts/) 查看筛选结果，`data-latest` Release 包含人物别名数据
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

**目录过滤器**：`index_filters/` 目录下的 YAML 需包含 `target_index` 和 `target` 字段。可 fork 本仓库，设置 `BANGUMI_TOKEN` secret，设置 `test_sync_indices.yml` 的 cron，并删除其他 `.yml` 文件，开启并使用 GitHub Actions 同步自己的目录。

批量同步所有目录（或用于 cron）：

```bash
BANGUMI_TOKEN=xxx ./sync_indices.sh --data-dir bangumi_archive --bgq bgq/bin/bgq
```
