<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vuepress-theme-plume/client'
import { contentSceneInfo, getContentSection } from '../shared/contentTheme'
import type { ContentSection } from '../shared/content'

const props = defineProps<{
  section?: ContentSection
  variant?: 'listing' | 'reading'
  title?: string
  description?: string
}>()
const { page, collection } = useData()
const section = computed(() => props.section ?? getContentSection(page.value.filePathRelative))
const info = computed(() => section.value ? contentSceneInfo[section.value] : undefined)
const variant = computed(() => props.variant ?? 'reading')
</script>

<template>
  <header v-if="info" class="vice-scene" :class="`vice-scene--${variant}`">
    <span class="vice-scene-sun" aria-hidden="true" />
    <span class="vice-scene-word" aria-hidden="true">{{ info.label }}</span>
    <div class="vice-scene-content">
      <p class="vice-scene-eyebrow">{{ info.number }} / {{ info.label }} <span aria-hidden="true">✦</span></p>
      <h1 v-if="variant === 'listing'">{{ title || info.title }}</h1>
      <p v-else class="vice-scene-project">{{ info.title }} <span aria-hidden="true">/</span> {{ collection?.title || page.title }}</p>
      <p v-if="description" class="vice-scene-description">{{ description }}</p>
    </div>
    <span class="vice-scene-caption" aria-hidden="true">{{ variant === 'listing' ? 'EXPLORE THE CHAPTERS' : 'READ THE STORY' }}</span>
  </header>
</template>
