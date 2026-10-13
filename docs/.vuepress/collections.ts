import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMarkdown } from 'vuepress/markdown'
import type { MarkdownEnv } from 'vuepress/markdown'
import type { ThemeDocCollection } from 'vuepress-theme-plume'

const sourceDir = fileURLToPath(new URL('../', import.meta.url))
const markdown = createMarkdown({ assets: false, importCode: false, links: false, sfc: false })

/** 每个栏目下的一级文件夹都是一个独立项目；嵌套目录属于该项目。 */
export function discoverProjectCollections(root = sourceDir): ThemeDocCollection[] {
  return ['blog', 'knowledge', 'projects'].flatMap((section) => {
    const directory = join(root, section)
    if (!existsSync(directory)) return []
    return readdirSync(directory, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
      .map((entry): ThemeDocCollection => {
        const projectDir = join(directory, entry.name)
        const readme = readdirSync(projectDir).find(file => /^README\.md$/i.test(file))
        const env: MarkdownEnv = {}
        if (readme) markdown.render(readFileSync(join(projectDir, readme), 'utf8'), env)
        const title = typeof env.frontmatter?.title === 'string'
          ? env.frontmatter.title : env.title || entry.name
        const dir = `${section}/${entry.name}`
        return {
          type: 'doc',
          dir,
          title,
          linkPrefix: `/${dir}/`,
          // auto 发现章节；根 README 作为该分组的入口参与上下篇导航。
          sidebar: [{ text: '项目文档', items: 'auto', collapsed: false }],
          sidebarCollapsed: false,
        }
      })
  })
}

