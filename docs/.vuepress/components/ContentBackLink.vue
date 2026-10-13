<script setup lang="ts">
import { computed } from 'vue'
import { resolveRoute } from 'vuepress/client'
import { useData } from 'vuepress-theme-plume/client'
import VPLink from 'vuepress-theme-plume/components/VPLink.vue'
import type { ContentSection } from '../shared/content'

const { placement = 'sidebar' } = defineProps<{
  placement?: 'sidebar' | 'content' | 'listing'
}>()
const { page } = useData()
const sectionTitles: Record<ContentSection, string> = {
  blog: '博客', knowledge: '知识库', projects: '项目',
}

const backLink = computed(() => {
  const file = page.value.filePathRelative?.replace(/\\/g, '/') ?? ''
  const match = /^(blog|knowledge|projects)\/(.+)$/.exec(file)
  if (!match) return undefined
  if (/^(README|index)\.md$/i.test(match[2])) return { path: '/', text: '返回首页' }
  const section = match[1] as ContentSection
  const path = `/${section}/`
  const title = resolveRoute(path).meta.title || sectionTitles[section]
  return { path, text: `返回${title}列表` }
})
</script>

<template>
  <div v-if="backLink" class="content-back" :class="`content-back--${placement}`">
    <VPLink :href="backLink.path" class="content-back-link" no-icon>
      <span class="vpi-arrow-left" aria-hidden="true" />
      <span>{{ backLink.text }}</span>
    </VPLink>
  </div>
</template>

<style scoped>
.content-back--sidebar { margin-bottom: 12px; }
.content-back--content { margin-bottom: 20px; }
.content-back--listing { margin-bottom: 20px; }
.content-back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  overflow-wrap: anywhere;
  transition: background-color var(--vp-t-color), border-color var(--vp-t-color);
}
.content-back-link:hover {
  background-color: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
}
.content-back-link:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.content-back-link .vpi-arrow-left { flex-shrink: 0; }
@media (min-width: 960px) {
  .content-back--content { display: none; }
  /* 收起侧栏时，正文顶部继续提供返回入口。 */
  :global(.vp-doc-container:not(.has-sidebar)) .content-back--content { display: block; }
}
</style>
