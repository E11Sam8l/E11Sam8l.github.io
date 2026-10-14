---
pageLayout: home
title: 个人知识库与博客
description: 在日落与霓虹之间，记录知识、项目与思考。
config:
  - type: hero
    full: true
    # 强制主页使用深色模式
    forceDark: true
    hero:
      name: '<span class="vice-home-subtitle">个人主页</span><span class="vice-home-title"><span class="vice-home-word vice-home-laplace">Laplace</span><span class="vice-home-connector">and</span><span class="vice-home-word">E11SAM8L</span></span>'
      tagline: 日落之后，灵感上线。
      text: '01 / WELCOME · KNOWLEDGE · STORIES · PROJECTS'
  - type: features
    index: 1
    title: 每一次探索，都有新的故事。
    description: '02 / EXPLORE · 从学习笔记到动手实践，这里是我们的开放世界。'
    features:
      - title: 知识库
        icon: '01'
        details: 从机器人学到 Markdown，把零散的灵感整理成可以反复探索的知识地图。
        link: /knowledge/
        linkText: 浏览知识库
      - title: 博客
        icon: '02'
        details: 记录学习的片段、建站的过程，以及值得留下来的日常思考。
        link: /blog/
        linkText: 阅读博客
      - title: 项目展示
        icon: '03'
        details: 把想法变成作品，记录每一次尝试、迭代和完成的瞬间。
        link: /projects/
        linkText: 查看项目
  - type: custom
    full: true
---

<div class="vice-about">
  <p class="vice-eyebrow">03 / ABOUT US</p>
  <h2>你好，<br>我们是 Laplace and E11SAM8L。</h2>
  <p class="vice-about-intro">这是一个用于记录知识、学习过程、项目实践和个人思考的空间。</p>
  <p class="vice-about-note">从学习笔记到动手实践，让每一次探索都留下痕迹。</p>
  <a class="vice-about-link" :href="withBase('/about/')">进入我们的个人主页 ↗</a>
</div>

<script setup>
import { withBase } from 'vuepress/client'
import { useHomeScroll } from './.vuepress/composables/useHomeScroll'
import './.vuepress/styles/home.css'

useHomeScroll()
</script>
