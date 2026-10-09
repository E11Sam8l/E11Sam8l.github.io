import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '知识库', link: '/knowledge/' },
  { text: '博客', link: '/blog/' },
  { text: '项目', link: '/projects/' },
  { text: '关于', link: '/about/' },
])
