<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

// Plume loads the search dialog on the first click. An outdated dev/build chunk
// must not leave a working-looking button that silently does nothing.
const failed = ref(false)
onErrorCaptured(() => {
  failed.value = true
  return false
})

function reloadSearch() {
  window.location.reload()
}
</script>

<template>
  <div class="vp-navbar-search">
    <div v-if="failed" class="search-recovery" role="alert">
      <span>搜索未能加载</span>
      <button type="button" @click="reloadSearch">刷新重试</button>
    </div>
    <SearchBox v-else />
  </div>
</template>

<style scoped>
.search-recovery { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 10px; font-size: 12px; line-height: 1.5; color: var(--vp-c-text-2); }
.search-recovery button { padding: 4px 8px; border: 1px solid var(--vp-c-divider); border-radius: 6px; color: var(--vp-c-brand-1); background: var(--vp-c-bg-alt); cursor: pointer; }
.search-recovery button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
</style>
