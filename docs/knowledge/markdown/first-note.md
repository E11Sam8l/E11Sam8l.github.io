---
title: 第一篇 Markdown 笔记
tags:
  - Markdown
  - 入门
---

# 第一篇 Markdown 笔记

这是一篇用于验证 V1 内容链路的短笔记。它同时展示标题大纲、代码高亮和站内链接。

## 标题与锚点

Plume 会根据 Markdown 标题生成锚点。点击右侧大纲中的标题，可以跳转到对应位置。

## 代码高亮

```ts
export function greet(name: string): string {
  return `你好，${name}`
}
```

## 图片与附件

资源可以和内容分开放在 `docs/assets/`，从当前 Markdown 文件使用相对路径引用：

![本地资源路径示例](../../assets/example.svg)

## 继续阅读

回到 [Markdown 目录](./) 或前往 [博客](/blog/) 查看另一种内容类型。



