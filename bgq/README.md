# bgq — Bangumi Query 筛选工具

基于 DuckDB 的 [Bangumi Archive](https://github.com/bangumi/Archive) 条目筛选工具，支持 YAML 配置文件、命令行交互、Web 界面三种使用方式。

## 准备数据

```bash
cd bgq
./download-archive.sh ./bangumi_archive

# 定期更新数据（cron）
0 3 * * 1 /path/to/download-archive.sh /path/to/data
```

或从 https://github.com/bangumi/Archive/releases/tag/archive 手动下载。

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

# 下载 DuckDB CLI
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

# 定期更新数据（cron）
0 3 * * 1 /path/to/download-archive.sh /path/to/data && \
  /path/to/bgq ingest --data-dir /path/to/data --db /path/to/data/bangumi.db.tmp && \
  mv /path/to/data/bangumi.db.tmp /path/to/data/bangumi.db
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

## 开发

见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

与原项目相同。
