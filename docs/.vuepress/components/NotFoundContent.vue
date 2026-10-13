<script setup lang="ts">
import { useData } from 'vuepress-theme-plume/client'

const { theme } = useData()
</script>

<template>
  <main class="site-not-found" aria-labelledby="site-not-found-title">
    <p class="code">{{ theme.notFound?.code ?? '404' }}</p>
    <h1 id="site-not-found-title">{{ theme.notFound?.title ?? '页面未找到' }}</h1>
    <div class="divider" />
    <blockquote>{{ theme.notFound?.quote ?? '你要访问的页面不存在，请通过顶部导航继续浏览。' }}</blockquote>
  </main>
</template>

<style scoped>
.site-not-found { padding: 64px 24px 96px; text-align: center; }
.code { font-size: 64px; font-weight: 600; line-height: 64px; }
h1 { padding-top: 12px; font-size: 20px; font-weight: 700; line-height: 1.5; letter-spacing: 2px; }
.divider { width: 64px; height: 1px; margin: 24px auto 18px; background-color: var(--vp-c-divider); }
blockquote { max-width: 320px; margin: 0 auto; font-size: 14px; font-weight: 500; color: var(--vp-c-text-2); line-height: 1.8; }
@media (min-width: 768px) { .site-not-found { padding: 96px 32px 168px; } }
</style>
