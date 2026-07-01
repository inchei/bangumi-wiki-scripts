# 开发指南

## 环境要求

- Go（版本见 `go.mod`）
- Node.js + pnpm（前端开发）
- DuckDB CLI（运行时需要；快照测试不需要，`-execute` 模式需要）

## 后端（Go）

```bash
cd bgq

# 构建
go build -o bin/bgq ./cmd/bgq/

# 测试（快照对比，不需要 DuckDB，~1s）
go test ./internal/query/ -v

# 修改 SQL 后更新快照
go test ./internal/query/ -update

# 也执行 SQL 验证（需要 DuckDB，使用小数据集 ~4s）
go test ./internal/query/ -execute

# 缺失条目关联检查 SQL 测试（不需要 DuckDB）
go test ./cmd/bgq/ -run TestBuildCheckSQL -v

# 缺失剧集标注测试（不需要 DuckDB）
go test ./cmd/bgq/ -run "TestExpand|TestEpLabel|TestResolveOverlaps|TestBuildEpPositionTable" -v

# 代码质量
gofmt -w .
go vet ./...
golangci-lint run ./...

# 热重载（Air）
./bin/bgq serve --dev
```

### 测试策略

- **快照测试**（`TestAllCombinations`）：生成所有 target × filter × mode 组合的 SQL，与 `testdata/all_combinations.golden` 对比。修改 SQL 生成逻辑后用 `-update` 接受变更。
- **单元测试**（`TestBuildLogic*`）：验证 logic 组合的 SQL 结构（括号、展开等）。
- **引擎测试**（`TestExecute*`）：验证 DuckDB 执行能力。
- **`-execute` 模式**：在快照测试基础上，使用 `testdata/archive/`（每个表 200 行）对生成的 SQL 执行 DuckDB 验证。同时测试 data-dir 模式和 db 模式（通过 `bgq ingest` 构建数据库）。用于捕获运行时错误（如缺失的 table join、列名不匹配等）。
- **Missing subjects 测试**（`TestBuildCheckSQL*`）：验证 `buildCheckSQL` 生成的 SQL 结构是否包含预期的 CTE、类型过滤、UNION ALL 等。
- **Missing episodes 测试**（`TestExpand*`, `TestEpLabel*`, `TestResolveOverlaps*`, `TestBuildEpPositionTable*`）：验证剧集描述匹配相关的辅助函数。

### 模型数据更新

从 [bangumi/common](https://github.com/bangumi/common) 和本地 archive 重新生成 `internal/model/` 下的常量：

```bash
go generate ./internal/model/
```

## 前端（Svelte）

```bash
cd frontend

pnpm install
pnpm dev                # 开发热重载
pnpm build              # 构建（嵌入 Go 二进制）

# 代码质量
pnpm lint               # ESLint
pnpm lint:css           # Stylelint
pnpm lint:css:fix       # Stylelint 自动修复
pnpm format             # Prettier 格式化
pnpm format:check       # 检查格式
```

构建产物（`frontend/dist/`）通过 `cp -r frontend/dist internal/server/dist` 复制后，由 `//go:embed dist/*` 嵌入 Go 二进制，`go build` 时自动包含。

## Pre-commit Hook

提交时自动运行（`.husky/pre-commit`）：

- **Go 文件**：`gofmt -w`（自动修复）+ `go vet` + `go test`
- **前端文件**：`lint-staged`（ESLint + Stylelint + Prettier）

## 全栈开发

```bash
# 终端 1：Go 后端热重载
cd bgq && ./bin/bgq serve --dev

# 终端 2：前端 dev server
cd bgq/frontend && pnpm dev
```

## 项目结构

```
bgq/
├── cmd/bgq/
│   ├── main.go                # 入口 + CLI 命令 + ingest 逻辑
│   ├── interactive.go         # 交互模式
│   ├── missing.go             # missing 子命令调度
│   ├── missing_subjects.go    # 缺失条目关联检查 + HTTP handler
│   ├── missing_subjects_test.go # buildCheckSQL SQL 生成测试
│   ├── missing_episodes.go    # 缺失剧集标注检查 + HTTP handler
│   ├── missing_episodes_test.go # 剧集辅助函数测试
│   ├── server.go              # Web 服务器 + API
│   └── dev.go                 # Air 热重载开发模式
├── cmd/gen-model/
│   ├── main.go           # 模型数据生成脚本
│   └── templates/        # Go 模板文件
├── internal/
│   ├── model/            # 数据模型 + Bangumi 常量
│   │   ├── model.go          # Go 结构体
│   │   ├── helpers.go        # 辅助函数（手写）
│   │   ├── generate.go       # go generate 指令
│   │   ├── platform.go       # 平台代码（自动生成）
│   │   ├── relation_data.go  # 关系类型（自动生成）
│   │   ├── staff_data.go     # 职位映射（自动生成）
│   │   └── metatags.go       # 公共标签（自动生成）
│   ├── config/           # YAML/JSON 配置解析 + 筛选类型定义
│   │   └── config.go
│   ├── query/            # SQL 生成 + DuckDB 执行引擎
│   │   ├── builder.go            # 主逻辑
│   │   ├── builder_generic.go    # manyToManyFilter + threeWayFilter
│   │   ├── builder_target.go     # targetConfig + nestedEntityConfig
│   │   ├── engine.go             # DuckDB 执行引擎
│   │   ├── testdata/                  # 快照 + 测试数据
│   │   │   ├── all_combinations.golden # SQL 快照
│   │   │   └── archive/               # 测试用数据子集（各 200 行）
│   └── server/           # 内嵌 Web UI（SPA）
│       ├── webui.go          # //go:embed dist/*
│       └── dist/             # 前端构建产物（从 frontend/dist 复制）
├── frontend/
│   ├── src/
│   │   ├── main.js
│   │   ├── App.svelte
│   │   ├── api.js
│   │   ├── stores.js
│   │   ├── yaml.js
│   │   ├── global.css
│   │   └── components/
│   ├── eslint.config.js
│   ├── .stylelintrc.json
│   ├── .prettierrc
│   └── package.json
├── Dockerfile
├── docker-compose.yml
├── docker-entrypoint.sh
├── download-archive.sh
├── go.mod
└── README.md
```

## API 接口

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/query` | POST | 执行查询（支持 yaml / filters / conditions 三种输入） |
| `/api/health` | GET | 健康检查 |
| `/api/persons/{name}/missing-subjects` | GET | 查询某人在指定条目类型中缺失的 staff 关联 |
| `/api/persons/{name}/missing-episodes` | GET | 查询某人在剧集描述中出现但缺少 staff 关联的剧集 |

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
