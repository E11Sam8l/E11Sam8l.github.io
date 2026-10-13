import { defineThemeConfig } from 'vuepress-theme-plume'
import { discoverProjectCollections } from './collections'
import { navbar } from './navbar'

// Plume 自动读取此文件，导航与集合修改支持开发时热更新。
export default defineThemeConfig({
  navbar,
  // Plume 会缓存配置模块；每次加载配置时重新扫描目录，保证开发重启后发现新项目。
  get collections() {
    return discoverProjectCollections()
  },
  // 与 Plume 文档站一致：原生正文布局、二/三级标题大纲、阅读辅助线。
  aside: true,
  outline: [2, 3],
  readAid: 'left',
  prevPage: true,
  nextPage: true,
  backToTop: true,
})
