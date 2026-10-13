import type { App, Page, Plugin } from 'vuepress/core'
import { discoverProjectCollections } from '../collections.ts'
import type { ContentItem, ContentSection } from '../shared/content'

export function collectContentItems(app: Pick<App, 'pages'>): ContentItem[] {
  const sections = new Set(['blog', 'knowledge', 'projects'])
  const projects = new Map<string, { section: ContentSection; name: string; pages: Page[] }>()
  for (const page of app.pages) {
    const file = page.filePathRelative?.replace(/\\/g, '/') ?? ''
    const parts = file.split('/')
    const section = parts[0] as ContentSection
    if (!sections.has(section) || parts.length < 3 || !/\.md$/i.test(file)
      || parts.slice(1).some(part => part.startsWith('.'))) continue
    const key = `${section}/${parts[1]}`
    const project = projects.get(key) ?? { section, name: parts[1], pages: [] }
    project.pages.push(page)
    projects.set(key, project)
  }
  return [...projects.values()].flatMap(({ section, name, pages }): ContentItem[] => {
    const overview = pages.find(page => {
      const parts = page.filePathRelative!.replace(/\\/g, '/').split('/')
      return parts.length === 3 && /^README\.md$/i.test(parts[2])
    })
    // README controls the whole project; a folder without one opens its first document.
    const visiblePages = pages.filter(page => page.frontmatter.draft !== true
      && page.frontmatter.article !== false && page.frontmatter.postList !== false)
    if (overview && !visiblePages.includes(overview)) return []
    const page = overview ?? visiblePages.sort((a, b) => a.filePathRelative!
      .localeCompare(b.filePathRelative!, 'zh-CN', { numeric: true }))[0]
    if (!page) return []
    const metadata = overview?.frontmatter ?? {}
    const rawTags = metadata.tags
    const tags = [...new Set((Array.isArray(rawTags) ? rawTags : [rawTags])
      .filter((tag): tag is string => typeof tag === 'string')
      .map(tag => tag.trim()).filter(Boolean))]
    const sticky = metadata.sticky
    return [{
      section, title: overview ? page.title || name : name, path: page.path,
      tags,
      description: typeof metadata.description === 'string' ? metadata.description : '',
      createTime: typeof metadata.createTime === 'string' ? metadata.createTime : '',
      sticky: sticky === true ? Number.MAX_SAFE_INTEGER
        : typeof sticky === 'number' && Number.isFinite(sticky) && sticky > 0 ? sticky : 0,
      documentCount: visiblePages.length,
    }]
  }).sort((a, b) => b.sticky - a.sticky
    || (Date.parse(b.createTime.replace(/\//g, '-')) || 0) - (Date.parse(a.createTime.replace(/\//g, '-')) || 0)
    || a.title.localeCompare(b.title, 'zh-CN'))
}

export const contentIndexPlugin = (): Plugin => {
  let queue = Promise.resolve()
  let collectionSignature = ''
  let restart: (() => Promise<void>) | undefined
  let restartTimer: ReturnType<typeof setTimeout> | undefined
  const signature = (app: App) => JSON.stringify(discoverProjectCollections(app.dir.source()))
  const publish = (app: App) => {
    queue = queue.then(async () => {
      await app.writeTemp('content-index.ts',
        `import type { ContentItem } from ${JSON.stringify(app.dir.source('.vuepress/shared/content.ts'))}\nexport const contentIndex: ContentItem[] = ${JSON.stringify(collectContentItems(app))}\n`)
    })
    return queue
  }
  return {
    name: 'shared-content-index',
    onPrepared: (app) => {
      collectionSignature = signature(app)
      return publish(app)
    },
    onWatched: (_, watchers, restartDev) => {
      restart = restartDev
      watchers.push({ close: () => { clearTimeout(restartTimer); restart = undefined } })
    },
    onPageUpdated: async (...args) => {
      const app = args[0]
      await publish(app)
      if (!restart || signature(app) === collectionSignature) return
      clearTimeout(restartTimer)
      // Restart after the page-update queue finishes; VuePress cleanup waits for it.
      restartTimer = setTimeout(() => {
        void restart?.().catch(error => console.error('Failed to reload project collections:', error))
      }, 200)
    },
  }
}
