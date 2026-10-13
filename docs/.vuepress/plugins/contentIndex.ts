import type { App, Plugin } from 'vuepress/core'
import type { ContentItem, ContentSection } from '../composables/useContentFilter'

export function collectContentItems(app: Pick<App, 'pages'>): ContentItem[] {
  const sections = new Set(['blog', 'knowledge', 'projects'])
  return app.pages.flatMap((page): ContentItem[] => {
    const file = page.filePathRelative?.replace(/\\/g, '/') ?? ''
    const parts = file.split('/')
    const section = parts[0] as ContentSection
    // One first-level folder is one project. Only its README defines the card.
    if (!sections.has(section) || parts.length !== 3 || !/^README\.md$/i.test(parts[2])
      || page.frontmatter.draft === true || page.frontmatter.article === false
      || page.frontmatter.postList === false) return []
    const rawTags = page.frontmatter.tags
    const tags = [...new Set((Array.isArray(rawTags) ? rawTags : [rawTags])
      .filter((tag): tag is string => typeof tag === 'string')
      .map(tag => tag.trim()).filter(Boolean))]
    const sticky = page.frontmatter.sticky
    return [{
      section, title: page.title || parts[1], path: page.path,
      tags,
      description: typeof page.frontmatter.description === 'string' ? page.frontmatter.description : '',
      createTime: typeof page.frontmatter.createTime === 'string' ? page.frontmatter.createTime : '',
      sticky: sticky === true ? Number.MAX_SAFE_INTEGER
        : typeof sticky === 'number' && Number.isFinite(sticky) && sticky > 0 ? sticky : 0,
    }]
  }).sort((a, b) => b.sticky - a.sticky
    || (Date.parse(b.createTime.replace(/\//g, '-')) || 0) - (Date.parse(a.createTime.replace(/\//g, '-')) || 0)
    || a.title.localeCompare(b.title, 'zh-CN'))
}

export const contentIndexPlugin = (): Plugin => {
  let queue = Promise.resolve()
  const publish = (app: App) => {
    queue = queue.then(async () => {
      await app.writeTemp('content-index.ts',
        `import type { ContentItem } from '../composables/useContentFilter'\nexport const contentIndex: ContentItem[] = ${JSON.stringify(collectContentItems(app))}\n`)
    })
    return queue
  }
  return {
    name: 'shared-content-index',
    onPrepared: publish,
    onPageUpdated: (...args) => publish(args[0]),
  }
}
