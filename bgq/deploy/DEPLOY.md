# 免费部署（无需信用卡）

全部使用 GitHub 自带服务，**完全免费，无需信用卡**。

## 架构

```
GitHub Actions (每周自动)
    │
    ├── 构建 bangumi_web.db → 上传到 GitHub Release
    └── 部署前端 → GitHub Pages
          │
用户浏览器 ← https://{user}.github.io/bangumi-wiki-scripts/bgq/
    │
    └── DuckDB-WASM 查询 ← GitHub Release 上的 bangumi_web.db
```

## 第一步：启用 GitHub Pages

仓库 Settings → Pages → Source: **GitHub Actions**

## 第二步：推送代码

提交并推送后，GitHub Actions 会自动：
1. 构建 `bangumi_web.db`
2. 上传到 GitHub Release
3. 部署到 GitHub Pages

网页地址：`https://{你的用户名}.github.io/bangumi-wiki-scripts/bgq/`

## 数据库 URL

网页通过 GitHub Release 下载数据库，URL 格式：
```
https://github.com/{owner}/{repo}/releases/latest/download/bangumi_web.db
```

已在 `deploy/index.html` 中预设为 `inchei/bangumi-wiki-scripts`。如果你 fork 了仓库，需要改为自己的用户名/仓库名。

## 更新

GitHub Action 每周二自动运行（与原 workflow 同时）。数据库和网页都会自动更新。也可在 Actions 页面手动触发 `workflow_dispatch`。

## 常见问题

**Q: 数据库 500MB，首次加载慢？**
A: DuckDB-WASM 使用 HTTP Range 请求，只读取查询涉及的列。首次约 3-5 秒加载 schema，之后查询通常 < 1 秒。

**Q: GitHub Release 有大文件限制吗？**
A: 每个文件 ≤ 2GB，完全够用。

**Q: 数据库使用 GitHub Release 的流量有限制吗？**
A: GitHub 没有公开的流量限制，合理使用即可。
