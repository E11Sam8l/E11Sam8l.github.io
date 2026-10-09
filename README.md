# 文件夹代表知识领域，Markdown代表具体知识点。

# 个人知识库与博客 V1

这是一个基于 VuePress 2、vuepress-theme-plume、Markdown、pnpm 和 GitHub Pages 的静态个人知识库与博客。

## 目录结构

```text
docs/       这里面放的就是我们要写的内容
├── README.md                         # 首页
├── knowledge/                         # doc collection：知识库
│   ├── README.md
│   └── markdown/
├── blog/                              # post collection：博客
├── projects/                          # 项目展示入口
├── about/                             # 关于页面
├── assets/                            # 图片、附件等静态资源
└── .vuepress/
    ├── config.ts                      # VuePress 构建与 base 配置
    ├── plume.config.ts                 # Plume 导航、集合与文章大纲
    ├── collections.ts                 # 知识库和博客集合
    └── navbar.ts                      # 顶部导航

legacy/                                # 原 Demo 与旧配置归档
├── original-README.md                 # 初始化前 README 备份
├── original-static.yml                # 初始化前 Pages 工作流备份
└── html-css-JavaScript-demo/
.github/workflows/deploy.yml           # GitHub Pages 自动部署
package.json                            # 依赖和脚本
pnpm-lock.yaml                          # 锁定依赖版本
pnpm-workspace.yaml                     # pnpm 发布冷却策略例外
```

`pnpm-workspace.yaml` 仅用于声明当前 Plume rc 依赖的发布冷却策略例外，不代表项目包含多个工作区。

## 环境要求

- Node.js `22.18+`（VuePress 2 rc31 与主题要求）
- pnpm `11+`

## 安装依赖       本地开发时 要先要先安装依赖

在仓库根目录执行：

```bash
pnpm install
```

如果你使用 npm 或其他包管理器，请优先保持团队统一使用 pnpm，并保留 `pnpm-lock.yaml`。

## 本地启动

```bash
pnpm dev
```

打开终端提示的本地地址（通常是 <http://localhost:8080>）。修改 `docs/` 下的 Markdown 后，页面会自动更新。

## 生产构建

```bash
pnpm build
```

构建产物位于 `docs/.vuepress/dist/`。该目录是临时产物，已写入 `.gitignore`，不需要提交。

## 主要配置文件

- `package.json`：声明 VuePress、Plume 依赖以及 `dev`、`build` 脚本。
- `docs/.vuepress/config.ts`：设置站点语言、标题、构建器和可迁移的 `DOCS_BASE` 路径。
- `docs/.vuepress/plume.config.ts`：集中加载顶部导航、内容集合和文章标题大纲设置。
- `docs/.vuepress/collections.ts`：把 `knowledge/` 配置为 doc collection，把 `blog/` 配置为 post collection。
- `docs/.vuepress/navbar.ts`：维护顶部导航链接；新增知识库主题不需要修改它。
- `.github/workflows/deploy.yml`：在合并到 `main` 后安装依赖、构建并发布 `docs/.vuepress/dist/`。
- `.gitignore`：排除依赖、构建缓存和 Obsidian 本地工作区状态。

## 如何新增知识库目录和笔记

1. 在 `docs/knowledge/` 下创建任意主题目录，例如 `docs/knowledge/摄影/`。
2. 在目录中添加 `README.md` 作为主题入口，也可以继续创建多层子目录。
3. 添加 `.md` 文件并使用标准 Markdown 标题组织内容。
4. 运行 `pnpm dev` 检查页面、左侧导航、右侧标题大纲和站内链接。
5. `sidebar: 'auto'` 会根据目录自动发现文章，不需要每次修改配置文件。

文件名建议使用小写英文、数字和短横线；中文文件名也可以工作，但统一命名有助于跨平台协作。

## 如何添加博客文章

在 `docs/blog/` 下创建一个 `.md` 文件；建议用子目录表示分类，例如 `docs/blog/项目记录/新文章.md`。可以写基本 frontmatter：

```md
---
title: 一篇新文章
createTime: 2026/10/08 12:00:00
tags:
  - 标签名称
---

# 一篇新文章

正文从这里开始。
```

博客集合会生成文章列表，并提供分类、标签和归档入口；文章所在的子目录会自动成为分类，不需要额外修改集合配置。

## 图片与附件

统一把站点资源放在 `docs/assets/` 或文章目录下的 `assets/` 中。Markdown 使用相对当前文件的路径；例如 `docs/knowledge/markdown/first-note.md` 引用公共资源时写成：

```md
![示例图片](../../assets/example.svg)
```

这种写法可以同时被 Obsidian 和 VuePress 识别。

较大的媒体文件建议放到专门的外部对象存储或图床，仓库只保留必要的小型资源。

## 使用 Obsidian

1. 在 Obsidian 中选择“打开文件夹作为仓库”，选择本项目的 `docs/` 目录。
2. 直接编辑 `knowledge/`、`blog/`、`projects/` 和 `about/` 中的 Markdown。
3. 图片可以放进 `assets/`；尽量使用相对清晰、稳定的文件名。
4. `.obsidian/` 工作区状态和插件目录已加入 `.gitignore`，不会进入仓库；Markdown 和资源文件仍会被 Git 跟踪。
5. 未来安装 Obsidian Git 插件时，提交范围仍建议只包含内容和配置变更。

V1 优先保证标准 Markdown 可发布；Obsidian 双链、嵌入等专有语法暂不作为发布前提。

## 提交与发布

```bash
git status
git add -A
git commit -m "build: initialize VuePress knowledge base"
git push -u origin HEAD
```

推送当前功能分支后，在 GitHub 创建 Pull Request。维护者审核并合并到 `main` 后，GitHub Actions 会安装依赖、运行 `pnpm build`，再把 `docs/.vuepress/dist/` 发布到 GitHub Pages。

## 检查 GitHub Actions

在仓库的 **Actions** 页面打开最新的 `Deploy VuePress site to GitHub Pages` 运行记录：

- `Build` 成功表示依赖安装和生产构建通过。
- `Deploy to GitHub Pages` 成功后，打开仓库 **Settings → Pages** 中显示的站点地址。
- 失败时先查看失败步骤的日志，常见原因是锁文件未同步、Node/pnpm 版本不一致或 Pages 没有选择 GitHub Actions 作为来源。

工作流已经声明了 Pages 所需的 `contents: read`、`pages: write` 和 `id-token: write` 权限，但不会修改仓库设置或权限。首次使用时，仓库维护者需要在 **Settings → Pages → Build and deployment** 选择 **GitHub Actions**。

## 迁移到其他 GitHub 账号或仓库

- 修改 Git remote：`git remote set-url origin https://github.com/新账号/新仓库.git`。
- 如果仍是用户站点（`新账号.github.io`），通常保持站点根路径 `/`。
- 如果改成项目站点，工作流会把 GitHub Pages 的 `base_path` 通过 `DOCS_BASE` 传给构建，不需要把账号名写进源码。
- 按需修改 `docs/.vuepress/config.ts` 的站点标题和描述、`docs/about/README.md` 的个人信息，以及 `docs/.vuepress/navbar.ts` 的公开链接。
- 不要把 Token、密钥或个人访问凭据写入仓库；使用 GitHub Actions 自带的 `GITHUB_TOKEN` 即可完成 Pages 部署。

## 当前 V1 范围

已包含首页、知识库 doc collection、博客 post collection、自动侧边栏、文章标题大纲、本地搜索、代码高亮、项目入口、Obsidian 忽略规则和 Pages 工作流。复杂 UI、评论、知识图谱、AI 问答与后端功能留待后续版本。


