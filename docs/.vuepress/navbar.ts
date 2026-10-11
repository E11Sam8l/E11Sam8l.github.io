import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '电子杂志社', link: '/blog/' },
  { text: '作品展览厅', link: '/projects/' },
  { text: '数字档案馆', link: '/knowledge/' },
  { text: '个人工作室', link: '/about/' },
])
