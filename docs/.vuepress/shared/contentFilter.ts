import { reactive } from 'vue'
import type { ContentItem, ContentSection } from './content'

export interface ContentFilterState {
  selected: string[]
  page: number
}
export type ContentFilterStore = Record<ContentSection, ContentFilterState>

export function createContentFilterStore(): ContentFilterStore {
  const create = (): ContentFilterState => ({ selected: [], page: 1 })
  return reactive({ blog: create(), knowledge: create(), projects: create() })
}

export function filterContent(items: readonly ContentItem[], selected: readonly string[]): ContentItem[] {
  const selection = new Set(selected)
  return items.filter(item => !selection.size || item.tags.some(tag => selection.has(tag)))
}
