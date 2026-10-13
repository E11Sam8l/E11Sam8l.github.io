<script setup lang="ts">
import { computed } from 'vue'
import VPLink from 'vuepress-theme-plume/components/VPLink.vue'
import VPPagination from 'vuepress-theme-plume/components/Posts/VPPagination.vue'
import { useContentFilter } from '../composables/useContentFilter'
import type { ContentSection } from '../composables/useContentFilter'

const props = defineProps<{ section: ContentSection }>()
const { state, tags, filtered, visibleItems, page, totalPages, pageRange, selectTag, clear, removeTag, changePage }
  = useContentFilter(() => props.section)
const panelId = computed(() => `content-tags-${props.section}`)
</script>

<template>
  <section class="content-browser" :aria-label="`${{ blog: '博客', knowledge: '知识库', projects: '项目' }[section]}内容筛选`">
    <div class="filter-toolbar">
      <button class="filter-trigger" type="button" :aria-expanded="state.open" :aria-controls="panelId" @click="state.open = !state.open">
        <span class="vpi-tag" aria-hidden="true" /> 标签 <span class="tag-total">{{ tags.length }}</span>
        <span aria-hidden="true">{{ state.open ? '▴' : '▾' }}</span>
      </button>
      <span class="result-count" role="status" aria-live="polite">{{ state.selected.length ? '筛选结果' : '全部内容' }} · {{ filtered.length }} 项</span>
      <button v-if="state.selected.length" class="clear" type="button" @click="clear">清空筛选</button>
    </div>

    <div v-show="state.open" :id="panelId" class="filter-panel">
      <div class="filter-tags" aria-label="可选标签">
        <button v-for="tag in tags" :key="tag.name" type="button" class="tag-choice" :aria-pressed="state.selected.includes(tag.name)" @click="selectTag(tag.name)">
          {{ tag.name }} <span>{{ tag.count }}</span>
        </button>
        <p v-if="!tags.length" class="filter-hint">当前栏目尚未标注标签，已展示全部内容。</p>
      </div>
    </div>

    <div v-if="state.selected.length" class="selected-tags" aria-label="已选标签">
      <button v-for="tag in state.selected" :key="tag" type="button" :aria-label="`取消标签：${tag}`" @click="removeTag(tag)">{{ tag }} <span aria-hidden="true">×</span></button>
    </div>

    <div class="content-results">
      <slot v-for="(item, index) in visibleItems" :key="item.path" name="item" :item="item" :index="index">
        <article class="content-card">
          <h3><VPLink :href="item.path" :text="item.title" /></h3>
          <div v-if="item.tags.length || item.createTime" class="card-meta">
            <div v-if="item.tags.length" class="card-tags">
              <span class="vpi-tag" aria-hidden="true" />
              <button v-for="tag in item.tags" :key="tag" type="button" :aria-pressed="state.selected.includes(tag)" @click="selectTag(tag)">{{ tag }}</button>
            </div>
            <time v-if="item.createTime"><span class="vpi-clock" aria-hidden="true" /> {{ item.createTime.split(' ')[0].replaceAll('/', '-') }}</time>
          </div>
          <p v-if="item.description" class="description">{{ item.description }}</p>
        </article>
      </slot>
      <div v-if="!filtered.length" class="empty-state">
        <p>{{ state.selected.length ? '没有匹配的内容。' : '这里还没有内容。' }}</p>
        <button v-if="state.selected.length" type="button" @click="clear">清空筛选，查看全部</button>
      </div>
    </div>
    <VPPagination v-if="totalPages > 1" :page="page" :total-page="totalPages" :page-range="pageRange" :is-first-page="page === 1" :is-last-page="page === totalPages" @change="changePage" />
  </section>
</template>

<style scoped>
.content-browser { width: 100%; min-width: 0; margin: 24px 0; }
.filter-toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
button { font: inherit; cursor: pointer; }
.filter-trigger { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; color: var(--vp-c-text-1); background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 10px; }
.tag-total, .tag-choice span { color: var(--vp-c-text-2); font-size: 12px; }
.result-count, .filter-hint, .description, time { color: var(--vp-c-text-2); font-size: 14px; }
.clear, .empty-state button { color: var(--vp-c-brand-1); }
.clear { margin-left: auto; }
.filter-panel { padding: 18px; margin-bottom: 16px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 12px; }
.filter-hint { margin: 12px 0; }
.filter-tags, .selected-tags, .card-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-choice, .selected-tags button, .card-tags button { padding: 5px 10px; color: var(--vp-c-text-1); background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; }
.tag-choice[aria-pressed="true"], .selected-tags button, .card-tags button[aria-pressed="true"] { color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); }
.selected-tags { margin-bottom: 16px; }
.content-results { display: grid; gap: 16px; }
.content-card { display: flex; flex-direction: column; gap: 8px; padding: 16px; margin: 0 -16px; background: var(--vp-c-bg); transition: background-color var(--vp-t-color); }
.content-card h3 { margin: 0; padding: 0; font-size: 18px; font-weight: 600; }
.content-card h3 :deep(a) { color: var(--vp-c-text-1); text-decoration: none; }
.content-card h3 :deep(a:hover) { color: var(--vp-c-brand-1); }
.description { margin: 12px 0 0; line-height: 1.8; }
.card-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; }
.card-tags { align-items: center; gap: 6px; }
.card-tags button { padding: 3px 5px; font-size: 12px; line-height: 1; color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); border: 0; border-radius: 3px; }
time { display: inline-flex; align-items: center; gap: 6px; }
.empty-state { padding: 36px 20px; text-align: center; background: var(--vp-c-bg-soft); border-radius: 12px; }
button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
.content-browser :deep(.vp-pagination) { margin: 16px 0 0; border-radius: 12px; }
@media (min-width: 768px) {
  .content-card { padding: 24px 20px; margin: 0; border-radius: 8px; box-shadow: var(--vp-shadow-1); transition: background-color var(--vp-t-color), box-shadow var(--vp-t-color); }
  .content-card:hover { box-shadow: var(--vp-shadow-2); }
}
@media (max-width: 640px) { .filter-toolbar { gap: 10px; } }
</style>
