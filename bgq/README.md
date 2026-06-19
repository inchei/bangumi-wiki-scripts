# bgq — Bangumi Query 筛选工具

基于 DuckDB 的高性能 Bangumi 条目筛选工具，支持 YAML 配置文件、命令行交互、Web 界面三种使用方式。速度比原 Python 脚本快 40~55 倍。

## 安装

### 方式一：编译

```bash
# 需要 Go 1.21+
cd bgq
go build -o bin/bgq ./cmd/bgq/

# 下载 DuckDB（查询引擎）
curl -L https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip -o duckdb.zip
unzip duckdb.zip -d bin/
```

### 方式二：直接使用

确保 `bin/` 目录下有 `bgq` 和 `duckdb` 两个可执行文件，或设置环境变量：

```bash
export DUCKDB_PATH=/path/to/duckdb
```

## 快速开始

### 1. 准备数据

使用项目中的 `download_bangumi_archive.py` 下载数据，或直接指定 `bangumi_archive` 目录路径。

### 2. 编写筛选条件（YAML）

创建 `query.yaml`：

```yaml
data_dir: "../bangumi_archive"    # 数据目录路径
filters:                          # 筛选条件（AND 关系）
  - type:                         # 类型筛选
      value: 2                    # 2=动画
  - field:                        # 字段筛选
      field: 导演
      operator: contains          # 包含匹配
      value: "新海诚"
  - field:
      field: score
      operator: gt                # 大于
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

## 筛选条件详解

所有筛选条件是 **AND** 关系。每个条件对象只能包含一种筛选类型。

### 类型筛选

```yaml
- type:
    value: 2        # 数字：1=书籍 2=动画 3=音乐 4=游戏 6=三次元
# 或
- type:
    value: "动画"    # 中文名
```

### 字段筛选

支持直接字段（JSON 中的字段）和 infobox 字段（Wiki 模板中的字段）。

**直接字段**：`id`, `type`, `name`, `name_cn`, `platform`, `summary`, `nsfw`, `score`, `rank`, `date`, `series`

**Infobox 字段**：`出版社`, `作者`, `导演`, `原作`, `发售日`, `ISBN`, `页数` 等任意 infobox 中的键名。

```yaml
- field:
    field: score           # 字段名
    operator: gt           # 操作符
    value: 8.5             # 值
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
    mode: any               # any | all
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

## 完整 YAML 参考

```yaml
# === 必需字段 ===
data_dir: "/path/to/bangumi_archive"    # 数据目录（或使用 database）

# === 可选字段 ===
database: "/path/to/bangumi.db"          # 持久化数据库（导入后更快）
limit: 1000                              # 最大结果数

# === 筛选条件 ===
filters:
  - type: { value: 2 }
  - field: { field: "score", operator: "gt", value: "8.0" }

# === 输出配置 ===
output:
  format: csv                            # table | csv | json
  path: "./results.csv"                  # 输出路径（table 格式忽略）
  columns: [id, name, name_cn, score]    # 输出列

# === 排序 ===
sort:
  - field: score
    direction: desc                      # asc | desc
```

## 交互模式

兼容原 Python 脚本的交互式输入体验：

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

### API 接口

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/query` | POST | 执行查询 |
| `/api/schema/fields` | GET | 获取可用字段列表 |
| `/api/schema/relations` | GET | 获取关系类型 |
| `/api/schema/positions` | GET | 获取职位类型 |
| `/api/health` | GET | 健康检查 |

**查询请求示例**：

```json
{
  "filters": [
    {"type": {"value": 2}},
    {"field": {"field": "score", "operator": "gt", "value": "8.5"}}
  ],
  "columns": ["id", "name", "name_cn", "score"],
  "sort": [{"field": "score", "direction": "desc"}],
  "limit": 20
}
```

## 数据导入（可选）

将 JSONLines 数据导入 DuckDB 持久化数据库，后续查询更快：

```bash
./bin/bgq ingest --data-dir ./bangumi_archive --db ./bangumi.db
```

导入后的查询：

```yaml
database: "./bangumi.db"
filters:
  - field: { field: "出版社", operator: "contains", value: "角川" }
```

## 性能对比

| 查询类型 | Python 原版 | bgq | 提升 |
|----------|------------|-----|------|
| 简单类型+评分筛选 | ~30s | 0.7s | **~40x** |
| Infobox 字段筛选 | ~60s | 1.1s | **~55x** |
| 关系关联查询 | ~120s | 2-3s | **~50x** |

## 项目结构

```
bgq/
├── cmd/bgq/
│   ├── main.go           # 入口 + CLI 命令
│   ├── interactive.go    # 交互模式
│   └── server.go         # Web 服务器 + API
├── internal/
│   ├── model/            # 数据模型 + Bangumi 常量
│   │   ├── model.go
│   │   ├── relations.go
│   │   ├── relation_data.go
│   │   └── staff_data.go
│   ├── config/           # YAML 配置解析
│   │   └── config.go
│   ├── query/            # SQL 生成 + DuckDB 执行
│   │   ├── builder.go
│   │   └── engine.go
│   └── server/           # 内嵌 Web UI
│       └── webui.go
├── bin/                  # 编译产物
│   ├── bgq
│   └── duckdb
├── go.mod
└── README.md
```

## 与原版对比

| | filter_by_fields.py | bgq |
|---|---|---|
| 语言 | Python | Go |
| 查询引擎 | 逐行 Python 循环 | DuckDB（列式 SQL） |
| 配置文件 | ❌ 仅交互式 | ✅ YAML 配置 |
| Web 界面 | ❌ | ✅ 内嵌 SPA |
| 交互模式 | ✅ | ✅ 兼容格式 |
| CSV 导出 | ✅ UTF-8 BOM | ✅ UTF-8 BOM |
| 性能 | 基准 | 40-55x |
| 部署 | 需要 Python 环境 | 单文件二进制 |

## 许可

与原项目相同。
