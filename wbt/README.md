# wikiBatchTogether (wbt)

多人协作的 wiki 批量审核服务：把 CSV 待办条目放进共享 SQLite 队列，所有登录用户看到同样的待审核内容；每条支持「确认更新」（通过 bgm.tv 旧 API 提交并从队列删除）与「标记错误」（转入全局错误编辑工作组）。登录仅用于确认身份（防滥用标记错误），不用于实际 API 调用：默认支持在登录页直接粘贴 access token（读 /v0/me 后即丢弃，不落盘）；配置 bgm OAuth 凭证后另开放 Bangumi OAuth 登录入口；编辑提交使用用户自存的 bgm.tv cookie，由后端代发旧 API POST（自动抓取 formhash）。

前端最大程度复用 [wikiBatch](../wikiBatch)（CodeMirror diff、infobox 合并、样式），以普通网页形式运行。

## 部署

```bash
cd wbt
go generate ./internal/server/   # 构建前端并拷贝 dist（需 pnpm）
go build -ldflags="-s -w" -o bin/wbt ./cmd/wbt/
cp wbt.example.toml wbt.toml     # 修改配置
./bin/wbt serve --config wbt.toml
```
单二进制部署：前端经 `//go:embed` 内嵌，数据库为 SQLite（纯 Go 驱动，免 CGo/外部依赖），上面的 `bin/wbt` 即全部。

首次启动请在网页设置中粘贴浏览器里的 bgm.tv cookie（至少含 `chii_auth`）以启用提交。

## CSV 导入

- 配置文件来源：`serve` 启动时与配置对账（移除的来源连同样目一并删除），定期按 cron 下载、增量合并。
- 一次性导入：`./bin/wbt import --db wbt.db --name 组名 --file /path/to.csv`（可重复执行等于增量合并；不同名生成不同工作组）。

CSV 规则与 wikiBatch 相同：按 `id`/`person_id`/`character_id` 列名区分条目/人物/角色；`tags` 列空格分隔、`-` 前缀为删除；`series` 列标记系列；`infobox` 列整体替换 Wcode；其余列按字段名更新 infobox。

## CLI

```
wbt serve [--config wbt.toml] [--dev]  启动服务（--dev 用 air 热重载）
wbt import [--name <组名>] --db <路径> --file <csv路径> [...]  导入一次性 CSV（--name 缺省用文件名去扩展名）
wbt remove --db <路径> --name <组名> [...]  删除工作组（连同其全部条目；无参数时列出全部工作组）
wbt completions [bash|zsh]  输出 shell 补全脚本（remove --name 支持 Tab 补全工作组名，eval 到 rc 文件启用）
wbt version
```
