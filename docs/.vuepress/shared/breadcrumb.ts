export interface BreadcrumbItem {
  text: string
  link?: string
  current?: boolean
}

const sectionTitles: Record<string, string> = {
  blog: '博客',
  knowledge: '知识库',
  projects: '项目',
}

/** Plume 的独立项目集合保留项目层级，这里补回它所属的栏目。 */
export function withSectionBreadcrumb(
  filePathRelative: string | null | undefined,
  items: readonly BreadcrumbItem[],
  sectionTitle?: string,
): BreadcrumbItem[] {
  const parts = filePathRelative?.replace(/\\/g, '/').split('/') ?? []
  const section = parts[0]
  if (parts.length < 3 || !sectionTitles[section] || !items.length) return [...items]
  const link = `/${section}/`
  return [
    items[0],
    { text: sectionTitle || sectionTitles[section], link },
    ...items.slice(1).filter(item => item.link !== link),
  ]
}
