# bangumi-wiki-scripts [![bangumi](http://bgm.tv/img/ico/bgm80-15.png)](http://bgm.tv)

用于 [Bangumi](https://bgm.tv) Wiki 的脚本合集。依赖[官方 Archive](https://github.com/bangumi/Archive) 数据。

## 工具

### bgq — 高性能条目筛选

基于 DuckDB 的命令行/Web 筛选工具，支持 YAML 配置、交互模式、Web 界面。

- YAML 配置定义筛选条件（类型、字段、关系、人物、标签等）
- 输出 CSV / JSON / 终端表格
- 内嵌 Web UI，支持可视化筛选和 CSV 导出
- 支持 Linux、macOS、Windows，也可 Docker 部署

📖 **[bgq 详细文档](bgq/README.md)**

### wikiBatch — 批量 Wiki 编辑

Tampermonkey 用户脚本，在 `next.bgm.tv` 上批量审核编辑条目/角色/人物的 Wiki 信息。

- 通过 CSV 文件批量更新 Infobox、标签、系列状态
- 提交前 diff 预览，断点续传，重复检测
- 支持 Private API 和旧版表单两种提交方式

📖 **[wikiBatch 详细文档](wikiBatch/README.md)**

### 工作流：bgq → wikiBatch

bgq 输出的 CSV 可直接作为 wikiBatch 的输入：

```bash
# 1. 用 bgq 筛选目标条目，输出 CSV（必须含 id 列）
./bgq/bin/bgq query --config query.yaml --format csv --output results.csv

# 2. 在 next.bgm.tv 打开 wikiBatch，上传 results.csv 批量编辑
```

CSV 中的 `id` 列对应条目 ID，其他列名对应要更新的字段（如 `infobox`、`tags`、`series`）。

## Python 脚本

| 脚本 | 说明 |
|------|------|
| [download_bangumi_archive.py](download_bangumi_archive.py) | 下载最新 Bangumi Archive 数据 |
| [find_duplicate_isbns.py](find_duplicate_isbns.py) | 查找重复 ISBN 的条目（限 9784 开头的日本出版物） |
| [person_alias.py](person_alias.py) | 生成人物别名 JSON 数据 |
| [check_volume_order.py](check_volume_order.py) | 检查单行本卷序一致性 |

## GitHub Actions

每周二自动运行（Archive 更新后约半小时）：

- 重复 ISBN 检查 → [duplicate_check_results.txt](duplicate_check_results.txt)
- 人物别名生成 → Release 中的 `person_alias.json.gz`
- bgq 筛选查询 → Release 中的 `results/*.csv`（见下方）
- bgq 跨平台二进制构建 → Release 中各平台压缩包

### 自动筛选查询

CI 使用 bgq 执行 `filters/*.yaml` 中的查询，结果以 CSV 上传到 Release：

| 筛选文件 | 说明 |
|----------|------|
| [小说系列关联漫画单行本](filters/小说系列关联漫画单行本.yaml) | 小说平台的系列关联了漫画平台的单行本 |
| [漫画系列关联小说单行本](filters/漫画系列关联小说单行本.yaml) | 漫画平台的系列关联了小说平台的单行本 |
| [标题有序号而标记为系列](filters/标题有序号而标记为系列.yaml) | 标题含序号如 `(1)` 却被标记为系列 |
| [非系列关联单行本](filters/非系列关联单行本.yaml) | 非系列条目却关联了单行本 |
| [写了ISBN的系列](filters/写了ISBN的系列.yaml) | 系列条目不应有 ISBN，有则说明填写错误 |
| [连载结束无已完结标签](filters/连载结束无已完结标签.yaml) | 已填写连载结束但缺少已完结标签 |
| [有序号的单行本未关联系列](filters/有序号的单行本未关联系列.yaml) | 标题含序号的单行本但未关联系列 |
| [小说缺小说标签](filters/小说缺小说标签.yaml) | platform 为小说但没有"小说"标签 |
| [漫画缺漫画标签](filters/漫画缺漫画标签.yaml) | platform 为漫画但没有"漫画"标签 |
| [未填写作者](filters/未填写作者.yaml) | 有原作但 infobox 中"作者"字段为空 |

输出的 CSV 含 `id` 列，可直接上传到 [wikiBatch](wikiBatch/README.md) 批量审核编辑。

本地批量生成所有结果：

```bash
mkdir -p results
for f in filters/*.yaml; do
  name=$(basename "$f" .yaml)
  ./bgq/bin/bgq query --config "$f" --data-dir bangumi_archive --format csv --output "results/${name}.csv"
done
```

**尚无法用 bgq 自动检查的项目**：
- 过于便宜/昂贵的书籍（价格币种格式不统一）
- 发售日比连载开始还早（需跨字段比较，当前仅支持字段与常量比较）
