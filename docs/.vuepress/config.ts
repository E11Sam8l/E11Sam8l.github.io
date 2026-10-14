import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import { contentIndexPlugin } from './plugins/contentIndex'
import { resourceHintsPlugin } from './plugins/resourceHints'
import { contentPageClasses, getContentSection } from './shared/contentTheme'

/**
 * DOCS_BASE lets GitHub Pages provide a repository-aware base path.
 * It defaults to `/` for the current user-site repository and local preview.
 */
const basePath = (process.env.DOCS_BASE || '').replace(/^\/+|\/+$/g, '')
const base: '/' | `/${string}/` = basePath ? `/${basePath}/` : '/'

export default defineUserConfig({
  base,
  lang: 'zh-CN',
  title: '首页',
  plugins: [contentIndexPlugin(), resourceHintsPlugin()],
  extendsPage(page) {
    const section = getContentSection(page.filePathRelative)
    if (section) page.frontmatter.pageClass = contentPageClasses(section, page.frontmatter.pageClass)
  },
  alias: {
    '@theme/VPDocBreadcrumb.vue': fileURLToPath(new URL('./components/ProjectBreadcrumb.vue', import.meta.url)),
    '@theme/Nav/VPNavBarSearch.vue': fileURLToPath(new URL('./components/DocumentSearch.vue', import.meta.url)),
  },
  head: [
    ['script', { id: 'page-appearance' }, `
      (() => {
        // Keep this key aligned with usePageTransition.ts. Run before styles paint.
        let readingTheme = 'light'
        try {
          if (localStorage.getItem('vice-page-appearance') === 'dark') readingTheme = 'dark'
        } catch {}
        const base = ${JSON.stringify(base)}
        const path = location.pathname.startsWith(base)
          ? '/' + location.pathname.slice(base.length) : location.pathname
        const home = path === '/' || path === '/index.html'
        document.documentElement.dataset.theme = home ? 'dark' : readingTheme
        document.documentElement.classList.toggle('vice-home-appearance', home)
      })()
    `],
  ],
  bundler: viteBundler({
    viteOptions: {
      resolve: {
        alias: [{ find: /^hash-wasm$/, replacement: fileURLToPath(new URL('./shared/lazyHash.ts', import.meta.url)) }],
      },
    },
    // Vue 3.5 resolves imported types in theme SFCs through this Node fs adapter.
    vuePluginOptions: {
      script: {
        fs: {
          fileExists: existsSync,
          readFile: (file) => readFileSync(file, 'utf8'),
        },
      },
    },
  }),
  theme: plumeTheme({
    // Keep source Markdown unchanged while plume.config.ts reloads on restart.
    autoFrontmatter: false,
    search: { provider: 'local' },
    docsRepo: 'https://github.com/E11Sam8l/E11Sam8l.github.io',
    docsBranch: 'main',
    docsDir: 'docs',
    changelog: { maxCount: 10 },
    contributors: { mode: 'block' },
    // 页面操作菜单依赖生产构建导出的 Markdown。
    llmstxt: true,
    codeHighlighter: {
      lineNumbers: 10,
      renderIndentGuides: true,
      colorizedBrackets: true,
    },
  }),
})
