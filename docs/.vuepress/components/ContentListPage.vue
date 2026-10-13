<script setup lang="ts">
import { computed } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import VPEncrypt from 'vuepress-theme-plume/components/VPEncrypt.vue'
import ContentBrowser from './ContentBrowser.vue'
import ContentBackLink from './ContentBackLink.vue'
import type { ContentSection } from '../shared/content'

const props = defineProps<{ section?: ContentSection }>()
const frontmatter = usePageFrontmatter()
const currentSection = computed<ContentSection>(() => {
  const section = props.section ?? frontmatter.value.contentSection
  return section === 'blog' || section === 'projects' ? section : 'knowledge'
})
</script>

<template>
  <div class="vp-posts content-list-page" :data-content-section="currentSection" vp-posts>
    <VPEncrypt>
      <slot name="posts-top" />
      <div class="content-list-container">
        <header class="content-list-heading">
          <ContentBackLink placement="listing" />
          <h1>{{ frontmatter.title }}</h1>
          <p v-if="frontmatter.description">{{ frontmatter.description }}</p>
        </header>
        <ContentBrowser :section="currentSection" />
      </div>
      <slot name="posts-bottom" />
    </VPEncrypt>
  </div>
</template>

<style scoped>
.content-list-page { min-height: calc(100svh - var(--vp-footer-height, 82px)); padding: calc(var(--vp-nav-height) + 32px) 16px 32px; }
.content-list-container { max-width: 784px; margin: 0 auto; }
.content-list-heading h1 { margin: 0 0 12px; color: var(--vp-c-text-1); font-size: 28px; font-weight: 600; }
.content-list-heading p { margin: 0; color: var(--vp-c-text-2); line-height: 1.8; }
@media (min-width: 960px) { .content-list-page { padding: 32px 24px; } }
</style>

<style>
/* Match the blog background only while a shared listing page is mounted. */
html:has(.content-list-page) body { background-color: var(--vp-c-bg-alt); }
</style>
