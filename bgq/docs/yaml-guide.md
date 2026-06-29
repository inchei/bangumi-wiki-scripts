# YAML 筛选条件参考

所有筛选条件是 **AND** 关系。每个条件对象只能包含一种筛选类型。

## 查询目标

`target` 指定查询的数据类型，默认为 `subject`（条目）：

```yaml
target: person          # subject | person | character | episode
```

| 值 | 说明 |
|----|------|
| `subject` | 条目（书籍、动画、音乐、游戏、三次元）—— 默认 |
| `person` | 人物 |
| `character` | 角色 |
| `episode` | 剧集 |

不同 target 支持的筛选条件不同。例如 `type`、`relation`、`staff` 仅适用于 `subject`，`person_relation` 仅适用于 `person`，`character_relation` 仅适用于 `character`。

## 类型筛选

```yaml
- type:
    value: 2            # 数字或中文名
```

| 值 | 1 | 2 | 3 | 4 | 6 |
|----|---|---|---|---|---|
| 类型 | 书籍 | 动画 | 音乐 | 游戏 | 三次元 |

## 字段筛选

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

## 全局搜索

在所有 infobox 字段中搜索：

```yaml
- global:
    operator: regex         # regex | contains | eq
    value: "完结"
```

## 标签筛选

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

## 关系筛选

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

## 人物筛选

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

## 剧集筛选

```yaml
- episode:
    mode: any               # any | all
    conditions:
      - field: name         # name | name_cn | airdate | duration | sort | description
        operator: regex
        value: "第\\d+話"
```

## 数量筛选

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

## 逻辑组合

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

## 简写形式

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
target: subject                         # subject（默认）| person | character | episode

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

## 高级用法

### 字段引用

`value` 以 `$` 开头时表示引用其他字段的值，而非字面量比较。例如查询「评分高于排名」的条目：

```yaml
- field:
    field: score
    operator: gt
    value: "$rank"
```

也支持引用 infobox 字段：

```yaml
- field:
    field: date
    operator: after
    value: "$发售日"
```

在嵌套条件（如 `relation`、`staff` 内部）中，用 `$main.` 前缀引用外层主条目自身字段，而非关联对象的字段：

```yaml
# 筛选关联条目评分高于主条目评分的系列
- relation:
    type: "系列"
    mode: any
    conditions:
      - field:
          field: score
          operator: gt
          value: "$main.score"
```

字段引用在 Web UI 中也受支持——输入框会自动高亮提示。
```
