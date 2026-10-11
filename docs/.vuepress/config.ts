import { readFileSync, existsSync } from 'node:fs'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

/**
 * DOCS_BASE lets GitHub Pages provide a repository-aware base path.
 * It defaults to `/` for the current user-site repository and local preview.
 */
const basePath = (process.env.DOCS_BASE || '').replace(/^\/+|\/+$/g, '')
const base: '/' | `/${string}/` = basePath ? `/${basePath}/` : '/'

export default defineUserConfig({
  base,
  lang: 'zh-CN',
<<<<<<< HEAD
  title: '个人知识库与博客',
  description: '用 Markdown 持续记录知识、项目与思考。',
  userStyle: './.vuepress/styles/index.css',
=======
  title: '首页',
>>>>>>> 85fd0df99a2921c54330e314c99f5c51c1391a22
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
