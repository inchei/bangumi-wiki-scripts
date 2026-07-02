# bgq — Bangumi Query 筛选工具

基于 DuckDB 的 [Bangumi Archive](https://github.com/bangumi/Archive) 条目筛选工具，支持 YAML 配置文件、命令行交互、Web 界面三种使用方式。

## 快速开始

1. 从 [GitHub Releases](https://github.com/inchei/bangumi-wiki-scripts/releases/latest) 下载的对应平台压缩包
2. 从 https://github.com/bangumi/Archive/releases/tag/archive 下载最新数据并解压到上述文件夹内
3. 在上述文件夹打开终端模拟器，运行 `./bgq serve --data-dir ./bangumi_archive` （Windows 将 `./bgq` 替换为 `bgq.exe`）

## 准备数据

```bash
cd bgq
./download-archive.sh ./bangumi_archive
```

或从 https://github.com/bangumi/Archive/releases/tag/archive 手动下载。

每周自动更新数据：

```bash
(crontab -l 2>/dev/null; echo "0 3 * * 1 $(pwd)/download-archive.sh $(pwd)/bangumi_archive") | crontab -
```

## 安装

从 [GitHub Releases](https://github.com/inchei/bangumi-wiki-scripts/releases/latest) 下载对应平台的压缩包（已包含 `bgq` 和 `duckdb`）

或从源码编译：

```bash
cd bgq

# 编译前端（产物嵌入 Go 二进制）
cd frontend && pnpm install && pnpm build && cd ..
cp -r frontend/dist internal/server/dist

# 编译 Go 二进制
go build -o bin/bgq ./cmd/bgq/

# 下载对应平台 DuckDB CLI，也可以使用发行版包，后续配置链接或环境变量即可
curl -L https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip -o duckdb.zip
unzip duckdb.zip -d bin/
```

## 部署 Web 界面

```bash
cd bgq
cp .env.example .env   # 按需编辑
docker-compose up -d --build
```

访问 `http://localhost:7860`。首次运行自动下载数据到卷中，后续数据更新可参考准备数据一节。

## 使用

### 命令行查询

```bash
./bin/bgq query --config query.yaml
```

| 参数 | 缩写 | 说明 |
|------|------|------|
| `--config` | `-c` | YAML 配置文件路径（必需） |
| `--data-dir` | `-d` | 数据目录（覆盖配置中的 data_dir） |
| `--output` | `-o` | 输出文件路径 |
| `--format` | `-f` | 输出格式：table / csv / json |
| `--verbose` | `-v` | 显示生成的 SQL |

YAML 格式说明见 [YAML 筛选条件参考](docs/yaml-guide.md)。

### Web 界面

```bash
./bin/bgq serve --data-dir ./bangumi_archive
```

提供可视化筛选器、实时查询、CSV 导出、YAML 编辑器。

### 交互模式

```bash
./bin/bgq interactive
```

使用说明见 [交互模式说明](docs/interactive-guide.md)。

### 使用数据库加速查询

将 JSONLines 导入 DuckDB 数据库，建立索引，加速重复查询：

```bash
./bin/bgq ingest --data-dir ./bangumi_archive --db ./bangumi.db
```

每周自动更新数据并重建数据库：

```bash
(crontab -l 2>/dev/null; echo "0 3 * * 1 cd $(pwd) && ./download-archive.sh ./bangumi_archive && ./bin/bgq ingest --data-dir ./bangumi_archive --db ./bangumi.db.tmp && mv ./bangumi.db.tmp ./bangumi.db") | crontab -
```

命令行查询时在配置文件中用 `database` 替代 `data_dir`：

```yaml
database: "./bangumi.db"
filters:
  - field: { field: "出版社", operator: "contains", value: "角川" }
```

Web 界面使用 `--db` 参数：

```bash
./bin/bgq serve --data-dir ./bangumi_archive --db ./bangumi.db
```

Docker 部署在 `.env` 中设置 `DB_PATH`。

## AI Agent Skill

bgq 提供 AI Agent skill，支持用自然语言查询 Bangumi 数据。

安装（Hermes Agent）：

```bash
cp -r skills/bgq-query ~/.hermes/skills/data-science/
```

或通过 `npx skills add`（适用于支持 skills CLI 的 agent）。

使用方式：直接用自然语言描述查询需求，agent 会自动生成 YAML 并执行。例如：

- "找评分8分以上的动画，按评分降序"
- "找出角川出版的已完结轻小说"
- "导演过高分动画的年轻导演有哪些"
- "排名最高的漫画中哪些还没改编成动画"

详细用法见 [skills/bgq-query/SKILL.md](skills/bgq-query/SKILL.md)。

## 附加功能

基于同数据库的便利查询，serve 后可提供相关 API。

### 检查缺失条目关联

检查某人是否在相关条目中缺少 staff 职位关联：

```bash
# 检查"川原砾"在书籍(1)类型中缺失的 staff 条目
./bin/bgq missing subjects "川原砾" --type 1 --db ./bangumi.db

# 限制仅检查特定职位
./bin/bgq missing subjects "川原砾" --type 1 --db ./bangumi.db --position 1
```

| 参数 | 说明 |
|------|------|
| `--type` | 条目类型：1(书籍) 2(动画) 3(音乐) 4(游戏) 6(三次元)（必需） |
| `--db` | DuckDB 数据库路径（默认查找 `./bangumi.db`） |
| `--position` | 限制仅检查指定职位 ID |

HTTP 接口（serve 后）：

```bash
curl "http://localhost:8080/api/persons/川原砾/missing-subjects?type=1"
```

```json
// 返回按 subject_id 聚合的缺失职位信息
{
  "324": {
    "name": "アクセル・ワールド",
    "positions": [1, 5]   // 缺失的职位 ID
  }
}
```

| 参数 | 说明 |
|------|------|
| `type` | 条目类型（必填） |
| `position` | 仅检查指定职位 ID（可选） |

Referrer 限制：仅允许来自 `bgm.tv`、`bangumi.tv`、`chii.in` 的请求，直接访问（新标签页、curl 无 referrer）不受限。

### 检查缺失剧集标注

检查某人在剧集描述中出现但缺少对应 staff 关联的剧集：

```bash
./bin/bgq missing episodes "川原砾" --db ./bangumi.db
```

HTTP 接口（serve 后）：

```bash
curl "http://localhost:8080/api/persons/川原砾/missing-episodes"
```

```json
// 返回匹配结果，按 subject 分组
{
  "matched": {
    "12": { "name": "アクセル・ワールド", "episodes": { "1": ["1", "2"] } }
  },
  "unmatched": {
    "12": { "name": "アクセル・ワールド", "episodes": [{"episode_id": 3, "label": "3"}] }
  }
}
```

## 开发

见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

与原项目相同。
