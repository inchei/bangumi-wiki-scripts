# bangumi wiki 批量更新工具

批量更新 [Bangumi](https://bgm.tv/) 条目/角色/人物 Wiki 信息的用户脚本。支持编辑 Wcode（Infobox）、标签和系列状态，并提供提交前 diff 预览。

## 功能特性

- **两种提交方式**：支持 Private API (PATCH) 和旧版表单 API (POST)
- **三种实体类型**：条目 (subject)、角色 (character)、人物 (person)
- **批量编辑**：通过 CSV 文件批量更新多个条目的 Wcode、标签和系列状态
- **Diff 预览**：提交前展示修改内容的可视化差异对比
- **断点续传**：自动保存处理进度，刷新页面后可继续
- **编辑摘要锁定**：可固定编辑摘要，批量应用相同摘要
- **重复检测**：24 小时内有人编辑过的条目会高亮提示
- **上一条目链接**：可快速跳转查看上一条处理过的条目

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 打开 `dist/wikiBatch.user.js`，复制全部内容
3. 在 Tampermonkey 中新建脚本，粘贴并保存

或者直接安装 `dist/wikiBatch.user.js` 文件。

脚本仅会在 `https://next.bgm.tv/` 域名下激活，页面右下角会出现浮动按钮。

## 使用说明

### 1. 基本设置

点击右下角工具按钮打开面板，在设置页面配置：

#### 提交方式

- **Private API**（推荐）：需要 Access Token，在[个人令牌页](https://next.bgm.tv/demo/access-token) 获取
- **旧 API**：需要 Formhash，在条目编辑页面控制台执行 `document.querySelector('[name=formhash]').value` 获取

#### CSV 文件格式

CSV 文件需包含标题行，**必须包含 `id` 列**。可选 `type` 列指定实体类型。其他列名为 Wcode 字段名，值为要设置的字段值。

```csv
id,作者,platform,tags,series
354667,虚渊玄,PC,标签A 标签B,true
```

- **type**：实体类型，可选值：`subject`（条目，默认）、`character` / `crt`（角色）、`person` / `prsn`（人物）。不填默认为 `subject`
- **id**：实体 ID（必填）
- **字段列**：列名即为 Wcode 字段名（如 `作者`、`platform`），值将更新到该字段
- **tags**：空格分隔的标签。带 `-` 前缀表示删除该标签（如 `-旧标签`）。**仅适用于条目**
- **series**：`true`/`false`/`1`/`0`/`yes`/`no`，设置是否为系列。**仅适用于条目**
- `\n` 在值中会被转换为换行符
- 角色和人物仅支持 Private API (PATCH) 提交方式

> **注意**：`tags` 和 `series` 列对角色和人物无效。提交角色/人物时仅更新 infobox。

### 2. 处理条目

上传 CSV 后点击"开始处理"，工具会逐个获取实体信息并展示。不同类型显示的编辑区不同：

- **条目 (subject)**：Wcode 编辑区、标签编辑区、系列状态复选框
- **角色 (character)** / **人物 (person)**：仅 Wcode 编辑区

共同功能：
- **当前实体**：名称和链接，标注实体类型
- **上一条目**：快速跳转查看上一个处理的实体
- **最后更新时间**：24 小时内有编辑的会红色高亮
- **编辑摘要**：自动生成或手动输入，点击锁图标可固定
- **Wcode 编辑区**：显示修改后的 Wcode，实时 diff 对比

确认无误后点击"确认更新"提交。如无实质修改，会自动跳过。提交失败时可选择重试或跳过。

### 3. 进度保存

处理进度自动保存在浏览器本地存储中。关闭面板或刷新页面后，重新打开即可从上次位置继续。

## 开发

### 项目结构

```
wikiBatch/
├── build.js              # 构建脚本 (esbuild)
├── header.js             # ==UserScript== 元数据头
├── dist/
│   └── wikiBatch.user.js # 构建输出
├── src/
│   ├── index.ts          # 入口文件
│   ├── core.ts           # 状态管理 + 类型定义
│   ├── utils.ts          # 工具函数
│   ├── ui.ts             # UI 辅助 (进度条、loading、状态消息)
│   ├── csv.ts            # CSV 解析 (papaparse)
│   ├── diff.ts           # Diff 显示 & Wcode 文本操作
│   ├── api.ts            # API 调用 (获取条目、提交更新)
│   ├── views.ts          # 视图切换
│   ├── handlers.ts       # 按钮点击事件处理
│   ├── dom.ts            # DOM 创建 & 事件绑定
│   ├── styles.ts         # CDN 样式表注入
│   ├── styles.css        # 应用样式 (独立 CSS 文件)
│   └── globals.d.ts      # GM_* API 类型声明
├── tsconfig.json
├── eslint.config.mjs
├── .stylelintrc.json
├── package.json
└── README.md
```

### 构建与检查

```bash
pnpm build           # esbuild 打包 → dist/wikiBatch.user.js
pnpm typecheck       # tsc --noEmit 类型检查
pnpm lint            # ESLint
pnpm lint:css        # Stylelint
```

npm 依赖（`diff`、`diff2html`、`papaparse`、`@trim21/gm-fetch`）通过 esbuild 打包进单文件，无需 CDN `@require`。

### 开发约定

- 所有源码使用 **TypeScript** + **ESM imports**，esbuild 负责打包为 IIFE
- CSS 在 `styles.css` 中编辑，构建时通过 `GM_addStyle` 注入
- 全局状态存储在 `state` 对象中（`core.ts`），通过 `saveState()` 持久化到 `localStorage` 和 `GM_setValue`
- 视图切换通过 `switchToXxxView()` 函数实现，按钮事件通过委托绑定在 `#static-buttons-container` 上
- Pre-commit hook 自动运行 lint + typecheck + build

## 许可

MIT
