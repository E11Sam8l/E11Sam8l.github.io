<script setup lang="ts">
import { computed } from 'vue'
import { resolveRoute } from 'vuepress/client'
import { useBreadcrumb, useData } from 'vuepress-theme-plume/client'
import NativeBreadcrumb from 'vuepress-theme-plume/components/VPDocBreadcrumb.vue'
import VPLink from 'vuepress-theme-plume/components/VPLink.vue'
import { withSectionBreadcrumb } from '../shared/breadcrumb'

const { page } = useData()
const { hasBreadcrumb, breadcrumbList: nativeItems } = useBreadcrumb()
const isProject = computed(() => /^(blog|knowledge|projects)\/[^/]+\//
  .test(page.value.filePathRelative?.replace(/\\/g, '/') ?? ''))

const breadcrumbList = computed(() => {
  const file = page.value.filePathRelative?.replace(/\\/g, '/')
  const section = file?.split('/')[0]
  const sectionTitle = resolveRoute(`/${section}/`).meta.title
  const items = nativeItems.value.map((item, index) => {
    if (index === 0 || !item.link || item.current) return item
    const title = resolveRoute(item.link).meta.title
    return title ? { ...item, text: title } : item
  })
  return withSectionBreadcrumb(file, items, sectionTitle)
})
</script>

<template>
  <NativeBreadcrumb v-if="!isProject" />
  <nav v-else-if="hasBreadcrumb" class="vp-breadcrumb" aria-label="面包屑导航">
    <ol vocab="https://schema.org/" typeof="BreadcrumbList">
      <li v-for="(item, index) in breadcrumbList" :key="`${index}-${item.link || item.text}`" property="itemListElement" typeof="ListItem">
        <VPLink :href="item.current ? undefined : item.link" class="breadcrumb" :class="{ current: item.current }" :aria-current="item.current ? 'page' : undefined" property="item" typeof="WebPage" :text="item.text" no-icon />
        <span v-if="index < breadcrumbList.length - 1" class="vpi-chevron-right" aria-hidden="true" />
        <meta property="name" :content="item.text">
        <meta property="position" :content="`${index + 1}`">
      </li>
    </ol>
  </nav>
</template>
