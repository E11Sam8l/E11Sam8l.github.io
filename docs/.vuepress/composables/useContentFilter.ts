import { computed, inject, provide, reactive, shallowRef, toValue, watch } from 'vue'
import type { InjectionKey, MaybeRefOrGetter } from 'vue'
import { contentIndex } from '@temp/content-index'
import type { ContentItem, ContentSection } from '../shared/content'
export interface ContentFilterState {
  selected: string[]
  page: number
  open: boolean
}
type FilterStore = Record<ContentSection, ContentFilterState>
const filterStoreKey: InjectionKey<FilterStore> = Symbol('content-filters')
const indexedItems = shallowRef<readonly ContentItem[]>(contentIndex)

// Only immutable content data is shared at module scope. Selection belongs to each app.
if (import.meta.hot) {
  import.meta.hot.accept('@temp/content-index', (module) => {
    if (module) indexedItems.value = module.contentIndex
  })
}

export function createContentFilterStore(): FilterStore {
  const create = (): ContentFilterState => ({ selected: [], page: 1, open: false })
  return reactive({ blog: create(), knowledge: create(), projects: create() })
}

export function setupContentFilters() {
  provide(filterStoreKey, createContentFilterStore())
}

export function filterContent(items: readonly ContentItem[], selected: readonly string[]): ContentItem[] {
  const selection = new Set(selected)
  return items.filter(item => !selection.size || item.tags.some(tag => selection.has(tag)))
}

export function useContentFilter(
  section: MaybeRefOrGetter<ContentSection>,
  source: MaybeRefOrGetter<readonly ContentItem[]> = indexedItems,
  pageSize = 15,
) {
  const store = inject(filterStoreKey)
  if (!store) throw new Error('Content filters must be initialized in the client config.')
  const state = computed(() => store[toValue(section)])
  const items = computed(() => toValue(source).filter(item => item.section === toValue(section)))
  const tags = computed(() => {
    const counts = new Map<string, number>()
    items.value.forEach(item => new Set(item.tags).forEach(tag => counts.set(tag, (counts.get(tag) ?? 0) + 1)))
    return [...counts].map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  })
  const filtered = computed(() => filterContent(items.value, state.value.selected))
  const size = Number.isFinite(pageSize) && pageSize > 0 ? Math.max(1, Math.floor(pageSize)) : 15
  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / size)))
  const page = computed(() => Math.min(Math.max(state.value.page, 1), totalPages.value))
  const visibleItems = computed(() => filtered.value.slice((page.value - 1) * size, page.value * size))
  const pageRange = computed(() => {
    const numbers = new Set([1, totalPages.value])
    for (let n = page.value - 2; n <= page.value + 2; n++) {
      if (n >= 1 && n <= totalPages.value) numbers.add(n)
    }
    const range: { value: number | string; more?: true }[] = []
    let previous = 0
    for (const n of [...numbers].sort((a, b) => a - b)) {
      if (previous && n - previous > 1) range.push({ value: `gap-${n}`, more: true })
      range.push({ value: n })
      previous = n
    }
    return range
  })

  function selectTag(tag: string) {
    if (!tags.value.some(item => item.name === tag)) return
    const current = state.value
    current.selected = current.selected.includes(tag)
      ? current.selected.filter(value => value !== tag)
      : [...current.selected, tag]
    current.page = 1
    current.open = true
  }
  function clear() {
    state.value.selected = []
    state.value.page = 1
  }
  function removeTag(tag: string) {
    state.value.selected = state.value.selected.filter(value => value !== tag)
    state.value.page = 1
  }
  function changePage(value: number) {
    if (Number.isInteger(value)) state.value.page = Math.min(Math.max(value, 1), totalPages.value)
  }

  // Prune deleted tags after content updates, while retaining each section's own state.
  watch(items, () => {
    const available = new Set(tags.value.map(tag => tag.name))
    const selected = state.value.selected.filter(tag => available.has(tag))
    if (selected.length !== state.value.selected.length) {
      state.value.selected = selected
      state.value.page = 1
    }
    state.value.page = page.value
  }, { immediate: true })

  return { state, tags, filtered, visibleItems, page, totalPages, pageRange, selectTag, clear, removeTag, changePage }
}
