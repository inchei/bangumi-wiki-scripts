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
go build -o bin/bgq ./cmd/bgq/

# 下载 DuckDB CLI
curl -L https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip -o duckdb.zip
unzip duckdb.zip -d bin/
```

## 部署

```bash
cd bgq
docker-compose up -d --build
```

访问 `http://localhost:7860`。首次运行自动下载数据到卷中，后续数据更新可参考上一节。

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

## 开发

见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

与原项目相同。
