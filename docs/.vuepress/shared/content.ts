export type ContentSection = 'blog' | 'knowledge' | 'projects'

export interface ContentItem {
  section: ContentSection
  title: string
  path: string
  tags: string[]
  description: string
  createTime: string
  sticky: number
  documentCount: number
}
