<script setup lang="ts">
import VPLink from 'vuepress-theme-plume/components/VPLink.vue'
import VPPagination from 'vuepress-theme-plume/components/Posts/VPPagination.vue'
import { useContentFilter } from '../composables/useContentFilter'
import type { ContentSection } from '../shared/content'

const props = defineProps<{ section: ContentSection }>()
const { state, tags, items, filtered, visibleItems, page, totalPages, pageRange, selectTag, clear, changePage }
  = useContentFilter(() => props.section)
const sectionTitles: Record<ContentSection, string> = { blog: '博客', knowledge: '知识库', projects: '项目' }
</script>

<template>
  <section class="content-browser" :aria-label="`${sectionTitles[section]}内容筛选`">
    <div v-if="$slots.header" class="content-heading">
      <slot name="header" />
    </div>

    <aside class="filter-sidebar" :aria-label="`${sectionTitles[section]}标签筛选`">
      <div class="filter-sidebar-heading">
        <h2>标签 <span class="tag-total">{{ tags.length }}</span></h2>
        <button v-if="state.selected.length" class="filter-reset" type="button" @click="clear">清空</button>
      </div>
      <button class="filter-link filter-all" type="button" :aria-pressed="!state.selected.length" @click="clear">
        <span class="filter-label">全部项目</span>
        <span class="tag-count">{{ items.length }}</span>
        <span class="filter-check" aria-hidden="true">{{ !state.selected.length ? '✓' : '' }}</span>
      </button>
      <ul class="filter-tag-list">
        <li v-for="tag in tags" :key="tag.name">
          <button class="filter-link" type="button" :aria-pressed="state.selected.includes(tag.name)" @click="selectTag(tag.name)">
            <span class="filter-label">{{ tag.name }}</span>
            <span class="tag-count">{{ tag.count }}</span>
            <span class="filter-check" aria-hidden="true">{{ state.selected.includes(tag.name) ? '✓' : '' }}</span>
          </button>
        </li>
      </ul>
      <p v-if="!tags.length" class="filter-hint">当前栏目还没有标签。</p>
      <p v-else class="filter-hint">可多选，再次点击取消。</p>
    </aside>

    <div class="content-main">
      <div class="result-toolbar">
        <span class="result-count" role="status" aria-live="polite">{{ state.selected.length ? '筛选结果' : '全部项目' }} · {{ filtered.length }} 个项目</span>
        <span v-if="state.selected.length" class="filter-summary">已选 {{ state.selected.length }} 个标签 · 匹配任一标签</span>
      </div>
      <div class="content-results">
        <slot v-for="(item, index) in visibleItems" :key="item.path" name="item" :item="item" :index="index">
          <article class="content-card">
            <div class="vice-card-heading" aria-hidden="true">
              <span class="vice-card-number">{{ String(index + 1).padStart(2, '0') }} / PROJECT FILE</span>
              <span class="vice-card-arrow">↗</span>
            </div>
            <h3><VPLink :href="item.path" :text="item.title" /></h3>
            <div v-if="item.tags.length || item.createTime || item.documentCount" class="card-meta">
              <div v-if="item.tags.length" class="card-tags">
                <span class="vpi-tag" aria-hidden="true" />
                <span v-for="tag in item.tags" :key="tag" class="card-tag">{{ tag }}</span>
              </div>
              <time v-if="item.createTime"><span class="vpi-clock" aria-hidden="true" /> {{ item.createTime.split(' ')[0].replaceAll('/', '-') }}</time>
              <span class="document-count"><span class="vpi-books" aria-hidden="true" /> {{ item.documentCount }} 篇文档</span>
            </div>
            <p v-if="item.description" class="description">{{ item.description }}</p>
          </article>
        </slot>
        <div v-if="!filtered.length" class="empty-state">
          <p>{{ state.selected.length ? '没有匹配的内容。' : '这里还没有内容。' }}</p>
          <button v-if="state.selected.length" type="button" @click="clear">查看全部项目</button>
        </div>
      </div>
      <VPPagination v-if="totalPages > 1" :page="page" :total-page="totalPages" :page-range="pageRange" :is-first-page="page === 1" :is-last-page="page === totalPages" @change="changePage" />
    </div>
  </section>
</template>

<style scoped>
.content-browser {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  grid-template-areas: 'sidebar heading' 'sidebar results';
  align-items: start;
  gap: 24px 40px;
  width: 100%;
  min-width: 0;
}
.content-heading { grid-area: heading; min-width: 0; }
.content-main { grid-area: results; min-width: 0; }
.filter-sidebar {
  grid-area: sidebar;
  position: sticky;
  top: calc(var(--vp-nav-height) + 32px);
  max-height: calc(100svh - var(--vp-nav-height) - 64px);
  padding: 4px 18px 12px 0;
  border-right: 1px solid var(--vp-c-divider);
  overflow-y: auto;
  scrollbar-width: thin;
}
.filter-sidebar-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.filter-sidebar-heading h2 { display: flex; align-items: center; gap: 8px; margin: 0; color: var(--vp-c-text-1); font-size: 14px; font-weight: 600; }
.tag-total { color: var(--vp-c-text-3); font-size: 12px; font-weight: 400; }
button { font: inherit; cursor: pointer; }
.filter-reset { color: var(--vp-c-brand-1); font-size: 12px; }
.filter-link {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 14px;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 10px;
  border: 0;
  border-left: 2px solid transparent;
  color: var(--vp-c-text-2);
  background: transparent;
  text-align: left;
  font-size: 14px;
  line-height: 1.6;
  transition: color var(--vp-t-color), background-color var(--vp-t-color), border-color var(--vp-t-color);
}
.filter-link:hover { color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); }
.filter-link[aria-pressed='true'] { color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); border-left-color: var(--vp-c-brand-1); }
.filter-label { overflow-wrap: anywhere; }
.tag-count { color: var(--vp-c-text-3); font-size: 12px; }
.filter-check { width: 14px; text-align: center; font-size: 12px; }
.filter-all { margin-bottom: 8px; }
.filter-tag-list { padding: 0; margin: 0; list-style: none; }
.filter-hint { margin: 18px 10px 0; color: var(--vp-c-text-3); font-size: 12px; line-height: 1.8; }
.result-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 16px; }
.result-count, .description, time { color: var(--vp-c-text-2); font-size: 14px; }
.filter-summary { color: var(--vp-c-text-3); font-size: 12px; }
.empty-state button { color: var(--vp-c-brand-1); }
.content-results { display: grid; gap: 16px; }
.content-card { display: flex; flex-direction: column; gap: 8px; padding: 24px 20px; margin: 0; border-radius: 8px; background: var(--vp-c-bg); box-shadow: var(--vp-shadow-1); transition: background-color var(--vp-t-color), box-shadow var(--vp-t-color); }
.content-card:hover { box-shadow: var(--vp-shadow-2); }
.content-card h3 { margin: 0; padding: 0; font-size: 18px; font-weight: 600; }
.content-card h3 :deep(a) { color: var(--vp-c-text-1); text-decoration: none; }
.content-card h3 :deep(a:hover) { color: var(--vp-c-brand-1); }
.description { margin: 12px 0 0; line-height: 1.8; }
.card-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; }
.card-tags { display: flex; flex-wrap: wrap; align-items: center; gap: 0 6px; }
.card-tag { color: var(--vp-c-text-2); font-size: 12px; }
.card-tag + .card-tag::before { content: '·'; padding-right: 6px; color: var(--vp-c-text-3); }
time, .document-count { display: inline-flex; align-items: center; gap: 6px; }
.document-count { color: var(--vp-c-text-2); font-size: 14px; }
.empty-state { padding: 36px 20px; text-align: center; background: var(--vp-c-bg-soft); border-radius: 12px; }
button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: -2px; }
.content-main :deep(.vp-pagination) { margin: 16px 0 0; border-radius: 12px; }
@media (min-width: 721px) and (max-width: 960px) {
  .content-browser { grid-template-columns: 170px minmax(0, 1fr); column-gap: 24px; }
}
@media (max-width: 720px) {
  .content-browser { grid-template-columns: minmax(0, 1fr); grid-template-areas: 'heading' 'sidebar' 'results'; row-gap: 20px; }
  .filter-sidebar { position: static; max-height: none; padding: 0 0 18px; border-right: 0; border-bottom: 1px solid var(--vp-c-divider); overflow: visible; }
  .filter-sidebar-heading { margin-bottom: 10px; }
  .filter-all { width: max-content; min-width: 150px; margin-bottom: 10px; }
  .filter-tag-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0 8px; }
  .filter-hint { margin-top: 10px; }
  .content-card { padding: 20px 16px; }
}
</style>
