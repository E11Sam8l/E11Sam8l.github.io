import { readFileSync, existsSync } from 'node:fs'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import { contentIndexPlugin } from './plugins/contentIndex'

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
  plugins: [contentIndexPlugin()],
  extendsPage(page) {
    // Hide Plume's circular reading-progress / back-to-top control on subpages.
    if (page.frontmatter.pageLayout !== 'home') page.frontmatter.backToTop = false
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
    plugins: { git: false },
    contributors: false,
    editLink: false,
    lastUpdated: false,
  }),
})
