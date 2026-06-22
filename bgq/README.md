# bgq — Bangumi Query 筛选工具

基于 DuckDB 的高性能 Bangumi 条目筛选工具，支持 YAML 配置文件、命令行交互、Web 界面三种使用方式。

## 安装

### 下载预编译版本

从 [GitHub Releases](https://github.com/inchei/bangumi-wiki-scripts/releases/latest) 下载对应平台的压缩包：

| 平台 | 文件 |
|------|------|
| Linux x86_64 | `bgq-linux-amd64.tar.gz` |
| macOS ARM (M系列) | `bgq-darwin-arm64.tar.gz` |
| macOS Intel | `bgq-darwin-amd64.tar.gz` |
| Windows x86_64 | `bgq-windows-amd64.zip` |

每个包内已包含 `bgq` 和 `duckdb` 两个可执行文件，解压即可使用：

```bash
# Linux / macOS
tar xzf bgq-linux-amd64.tar.gz
cd bgq-linux-amd64

# Windows：解压 zip 后进入目录
```

然后下载 [Bangumi Archive](https://github.com/bangumi/Archive/releases/latest) 数据：

```bash
curl -L https://github.com/bangumi/Archive/releases/latest/download/archive-full.zip -o archive.zip
unzip archive.zip -d bangumi_archive/
```

或使用仓库中的脚本：`python download_bangumi_archive.py`

之后即可运行查询：

```bash
# 命令行查询
./bgq query --config query.yaml --data-dir ./bangumi_archive

# 启动 Web 界面
./bgq serve --data-dir ./bangumi_archive
# 浏览器打开 http://localhost:8080

# 查看版本
./bgq version
```

> `bgq` 会在可执行文件同目录下查找 `duckdb`，无需额外配置。如需自定义路径，设置 `DUCKDB_PATH` 环境变量。

### 从源码编译

```bash
# 需要 Go（版本见 bgq/go.mod）
cd bgq
go build -o bin/bgq ./cmd/bgq/

# 下载 DuckDB CLI（查询引擎）
curl -L https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip -o duckdb.zip
unzip duckdb.zip -d bin/
```

### Docker

```bash
cd bgq

# 先编译二进制（Dockerfile 不包含 Go 编译步骤）
go build -o bin/bgq ./cmd/bgq/

# 构建镜像
docker build -t bgq .

# 运行（首次启动会自动下载 Bangumi Archive 数据，约 1~2GB）
docker run -p 7860:7860 -v bgq-data:/data bgq

# 或挂载已有数据目录
docker run -p 7860:7860 -v /path/to/bangumi_archive:/data/bangumi_archive bgq
```

容器启动后访问 `http://localhost:7860`。

> **注意**：Dockerfile 基于 Alpine，需要先在宿主机编译好 `bin/bgq` 二进制。容器首次运行时由 `docker-entrypoint.sh` 自动从 GitHub 下载 Archive 数据到 `/data/bangumi_archive`。可通过 `DATA_DIR` 环境变量自定义数据目录。

### DuckDB 路径

`bgq` 通过外部调用 `duckdb` CLI 执行查询（避免 CGo 依赖）。查找顺序：

1. `DUCKDB_PATH` 环境变量
2. 可执行文件同目录下的 `duckdb`
3. 当前工作目录下的 `bin/duckdb`
4. `PATH` 中的 `duckdb`

## 快速开始

### 1. 准备数据

使用仓库根目录的 `download_bangumi_archive.py` 下载数据，或手动获取 [Bangumi Archive](https://github.com/bangumi/Archive) 的 `.jsonlines` 文件。

### 2. 编写筛选条件（YAML）

创建 `query.yaml`：

```yaml
data_dir: "../bangumi_archive"    # 数据目录路径
filters:                          # 筛选条件（AND 关系）
  - type:                         # 类型筛选
      value: 2                    # 1=书籍 2=动画 3=音乐 4=游戏 6=三次元
  - field:                        # 字段筛选
      field: 导演
      operator: contains
      value: "新海诚"
  - field:
      field: score
      operator: gt
      value: 8
output:
  format: table                   # table | csv | json
  columns:                        # 输出列
    - id
    - name
    - name_cn
    - score
    - 导演
sort:
  - field: score
    direction: desc
limit: 50
```

### 3. 执行查询

```bash
./bin/bgq query --config query.yaml
```

支持的命令行参数：

| 参数 | 缩写 | 说明 |
|------|------|------|
| `--config` | `-c` | YAML 配置文件路径（必需） |
| `--data-dir` | `-d` | 数据目录（覆盖配置中的 data_dir） |
| `--output` | `-o` | 输出文件路径 |
| `--format` | `-f` | 输出格式：table / csv / json |
| `--verbose` | `-v` | 显示生成的 SQL |

## 筛选条件详解

所有筛选条件是 **AND** 关系。每个条件对象只能包含一种筛选类型。

### 类型筛选

```yaml
- type:
    value: 2            # 数字或中文名
```

| 值 | 1 | 2 | 3 | 4 | 6 |
|----|---|---|---|---|---|
| 类型 | 书籍 | 动画 | 音乐 | 游戏 | 三次元 |

### 字段筛选

支持直接字段（JSON 中的字段）和 infobox 字段（Wiki 模板中的字段）。

**直接字段**：`id`, `type`, `name`, `name_cn`, `platform`, `summary`, `nsfw`, `score`, `rank`, `date`, `series`

**Infobox 字段**：`出版社`, `作者`, `导演`, `原作`, `发售日`, `ISBN`, `页数` 等任意 infobox 中的键名。

```yaml
- field:
    field: score
    operator: gt
    value: 8.5
```

**支持的操作符**：

| 操作符 | 含义 | 示例 |
|--------|------|------|
| `eq` | 等于 | `value: "角川書店"` |
| `contains` | 包含（模糊匹配） | `value: "角川"` |
| `regex` | 正则表达式 | `value: "角川\|KADOKAWA"` |
| `gt` | 大于 | `value: 8` |
| `gte` | 大于等于 | `value: 8` |
| `lt` | 小于 | `value: 5` |
| `lte` | 小于等于 | `value: 5` |
| `before` | 日期早于 | `value: "2020-01-01"` |
| `after` | 日期晚于 | `value: "2020-01-01"` |

### 全局搜索

在所有 infobox 字段中搜索：

```yaml
- global:
    operator: regex         # regex | contains | eq
    value: "完结"
```

### 标签筛选

```yaml
- tag:
    operator: contains      # contains | eq
    value: "轻小说"
    negate: false           # true = 排除此标签
```

也支持 `meta_tag`（公共标签）：

```yaml
- meta_tag:
    value: "漫画"
```

### 关系筛选

筛选具有特定关联关系的条目：

```yaml
- relation:
    type: "单行本"          # 关系中文名
    mode: any               # any=任意关联满足 | all=全部关联满足 | none=无此关联
    conditions:             # 对关联条目的筛选条件（可选）
      - field: 发售日
        operator: after
        value: "2020-01-01"
      - field: score
        operator: gt
        value: 7
```

**各类型常用关系名**：

| 书籍 | 动画 | 音乐 | 游戏 |
|------|------|------|------|
| 改编, 单行本, 系列, 前传, 续集, 番外篇, 画集, 不同版本 | 改编, 前传, 续集, 总集篇, 番外篇, 衍生, 角色出演 | 原声集, 角色歌, 片头曲, 片尾曲, 插入歌, 广播剧 | 改编, 前传, 续集, 外传, 扩展包, 不同版本, 合集 |

### 人物筛选

```yaml
- staff:
    position: "原作"        # 职位中文名
    mode: any               # any | all | none
    conditions:             # 对人物的筛选条件
      - field: name         # name | person_id | appear_eps
        operator: contains
        value: "川原砾"
```

**各类型常用职位名**：

| 书籍 | 动画 | 音乐 | 游戏 |
|------|------|------|------|
| 作者, 出版社, 插图, 原作, 译者, 连载杂志 | 原作, 导演, 脚本, 音乐, 人物设定, 原画, 声优 | 艺术家, 作曲, 作词, 编曲, 厂牌 | 开发, 发行, 剧本, 音乐, 导演 |

> 完整职位列表见 `internal/model/staff_data.go`

### 剧集筛选

```yaml
- episode:
    mode: any               # any | all
    conditions:
      - field: name         # name | name_cn | airdate | duration | sort | description
        operator: regex
        value: "第\\d+話"
```

### 数量筛选

按条目关联数量或剧集数量筛选：

```yaml
# 单行本数量 ≥ 5
- count:
    what: "单行本"
    operator: gte
    value: 5

# 剧集数量 > 12
- count:
    what: "ep"
    operator: gt
    value: 12
```

### 逻辑组合

使用 `logic` 将多个条件用 OR 组合（默认 AND）：

```yaml
- logic:
    op: or
    items:
      - field: { field: score, operator: gt, value: 8 }
      - tag: { value: "轻小说" }
```

支持嵌套：

```yaml
- logic:
    op: or
    items:
      - field: { field: score, operator: gt, value: 8.5 }
      - logic:
          op: and
          items:
            - tag: { value: "轻小说" }
            - field: { field: date, operator: after, value: "2020-01-01" }
```

### 简写形式

大多数筛选条件支持简写，无需嵌套：

```yaml
filters:
  - type: 2                           # 等价于 type: { value: 2 }
  - field: { field: score, operator: gt, value: 8 }
  - tag: "轻小说"                      # 等价于 tag: { value: "轻小说" }
  - meta_tag: "漫画"
```

## 完整 YAML 参考

```yaml
# === 数据源（二选一） ===
data_dir: "/path/to/bangumi_archive"    # JSONLines 数据目录
database: "/path/to/bangumi.db"         # 或已导入的 DuckDB 数据库

# === 查询目标 ===
target: subject                         # subject（默认）| person

# === 筛选条件 ===
filters:
  - type: { value: 2 }
  - field: { field: "score", operator: "gt", value: "8.0" }

# === 输出配置 ===
output:
  format: table                         # table | csv | json
  path: "./results.csv"                 # 输出文件路径（table 格式忽略）
  columns: [id, name, name_cn, score]   # 输出列

# === 排序 ===
sort:
  - field: score
    direction: desc                     # asc | desc

# === 限制 ===
limit: 1000                             # 最大结果数（默认 1000）
```

## 交互模式

```bash
./bin/bgq interactive
```

格式说明：

```
条目类型: 直接输入中文（动画、书籍、音乐、游戏、三次元）
普通字段: 字段名:条件           （例：出版社:角川）
正则匹配: 字段名:re:正则         （例：name:re:魔法）
数字比较: 字段名:大于:值         （例：评分:大于:8）
日期比较: 字段名:早于:日期       （例：发售日:早于:2020-01-01）
人物筛选: staff:职位名:name:人名 （例：staff:原作:name:川原砾）
剧集筛选: ep:字段名:条件         （例：ep:name:re:第\d+话）
关系筛选: relation:关系名        （例：relation:单行本）
全局搜索: *:条件                （例：*:re:完结）
```

空行执行查询，`:q` 退出，`:h` 显示帮助。

## Web 界面

启动 Web 服务器：

```bash
./bin/bgq serve --data-dir ./bangumi_archive --listen :8080
```

浏览器打开 `http://localhost:8080`，提供：

- **可视化筛选器**：下拉选择字段名、操作符，输入条件值
- **实时查询**：点击"执行查询"立即看到结果
- **CSV 导出**：一键下载结果
- **YAML 编辑器**：可切换查看/编辑 YAML 配置

### 开发模式

```bash
./bin/bgq serve --dev
```

使用 [Air](https://github.com/air-verse/air) 实现 Go 代码热重载，前端需另开终端运行：

```bash
cd frontend && npm run dev
```

### API 接口

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/query` | POST | 执行查询（支持 yaml / filters / conditions 三种输入） |
| `/api/schema/fields` | GET | 获取可用字段、条目类型、关系、职位 |
| `/api/schema/options` | GET | 按条目类型获取关系、职位、公共标签等选项 |
| `/api/health` | GET | 健康检查 |

**查询请求示例**：

```json
{
  "filters": [
    {"type": {"value": 2}},
    {"field": {"field": "score", "operator": "gt", "value": "8.5"}}
  ],
  "sort": [{"field": "score", "direction": "desc"}],
  "limit": 20
}
```

也支持直接传 YAML 字符串：

```json
{
  "yaml": "filters:\n  - type: { value: 2 }\n  - field: { field: score, operator: gt, value: 8.5 }"
}
```

## 数据导入（可选）

将 JSONLines 数据导入 DuckDB 持久化数据库，后续查询更快：

```bash
./bin/bgq ingest --data-dir ./bangumi_archive --db ./bangumi.db
```

导入后的查询使用 `database` 字段替代 `data_dir`：

```yaml
database: "./bangumi.db"
filters:
  - field: { field: "出版社", operator: "contains", value: "角川" }
```

导入会创建以下表并建立索引：
- `subjects` — 条目主表
- `subject_relations` — 条目关联
- `subject_persons` — 人物-条目关系
- `episodes` — 剧集

## 项目结构

```
bgq/
├── cmd/bgq/
│   ├── main.go           # 入口 + CLI 命令 + ingest 逻辑
│   ├── interactive.go    # 交互模式
│   ├── server.go         # Web 服务器 + API
│   └── dev.go            # Air 热重载开发模式
├── internal/
│   ├── model/            # 数据模型 + Bangumi 常量
│   │   ├── model.go
│   │   ├── relation_data.go    # 关系类型映射（自动生成）
│   │   ├── staff_data.go       # 职位映射（自动生成）
│   │   └── metatags.go         # 公共标签列表
│   ├── config/           # YAML/JSON 配置解析 + 筛选类型定义
│   │   └── config.go
│   ├── query/            # SQL 生成 + DuckDB 执行引擎
│   │   ├── builder.go
│   │   └── engine.go
│   └── server/           # 内嵌 Web UI（SPA）
│       └── webui.go
├── frontend/
│   ├── src/
│   │   ├── main.js               # 入口
│   │   ├── App.svelte            # 根组件
│   │   ├── api.js                # 后端 API 调用
│   │   ├── stores.js             # 全局状态（schema、筛选器）
│   │   ├── yaml.js               # YAML 解析/生成（js-yaml）
│   │   ├── global.css            # 全局样式
│   │   └── components/
│   │       ├── FilterTree.svelte     # 筛选条件树
│   │       ├── ConditionRow.svelte   # 单个条件行
│   │       ├── AwesompleteInput.svelte # 自动补全输入
│   │       ├── QuerySettings.svelte  # 排序/列/限制设置
│   │       ├── ResultTable.svelte    # 结果表格
│   │       └── YamlEditor.svelte     # YAML 编辑器
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── .stylelintrc.json
│   ├── .prettierrc
│   └── package.json
├── Dockerfile            # 容器构建
├── docker-entrypoint.sh  # 容器启动脚本（自动下载数据）
├── go.mod
└── README.md
```

## 开发

### 后端（Go）

**环境要求**：Go（版本见 `go.mod`），DuckDB CLI 仅运行时需要。

```bash
cd bgq

# 构建
go build -o bin/bgq ./cmd/bgq/

# 测试（不需要 DuckDB 或数据）
go test ./internal/query/ -v
go test ./internal/query/ -run TestBuildSQL -v

# 代码质量
gofmt -w .                              # 格式化
go vet ./...                            # 静态检查
golangci-lint run ./...                 # Lint

# 热重载（Air）
./bin/bgq serve --dev
```

### 前端（Svelte）

```bash
cd frontend

pnpm install                            # 安装依赖
pnpm dev                                # 开发模式（热重载）
pnpm build                              # 构建产物

# 代码质量
pnpm lint                               # ESLint 检查（JS/Svelte）
pnpm lint:css                           # Stylelint 检查（CSS/Svelte 样式）
pnpm lint:css:fix                       # Stylelint 自动修复
pnpm format                             # Prettier 格式化
pnpm format:check                       # 检查格式（CI 用）
```

构建产物嵌入到 Go 二进制中（`internal/server/webui.go`），`go build` 时自动包含。

### 全栈开发

```bash
# 终端 1：Go 后端热重载
cd bgq && ./bin/bgq serve --dev

# 终端 2：前端 dev server
cd bgq/frontend && pnpm dev
```

## 许可

与原项目相同。
