import type { ContentSection } from './content'

export const contentSceneInfo: Record<ContentSection, { title: string; label: string; number: string }> = {
  knowledge: { title: '知识库', label: 'KNOWLEDGE', number: '01' },
  blog: { title: '博客', label: 'STORIES', number: '02' },
  projects: { title: '项目', label: 'PROJECTS', number: '03' },
}

export function getContentSection(file: string | null | undefined): ContentSection | undefined {
  const section = file?.replace(/\\/g, '/').split('/')[0]
  return section === 'blog' || section === 'knowledge' || section === 'projects' ? section : undefined
}

export function contentPageClasses(section: ContentSection, existing: unknown): string[] {
  const classes = Array.isArray(existing)
    ? existing.filter((item): item is string => typeof item === 'string')
    : typeof existing === 'string' ? existing.split(/\s+/).filter(Boolean) : []
  return [...new Set([...classes, 'vice-content-layout', `vice-section-${section}`])]
}
