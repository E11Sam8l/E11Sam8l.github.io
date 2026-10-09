import { defineThemeConfig } from 'vuepress-theme-plume'
import { collections } from './collections'
import { navbar } from './navbar'

// Plume 自动读取此文件，导航与集合修改支持开发时热更新。
export default defineThemeConfig({
  navbar,
  collections,
  outline: 'deep',
  // 使用 VuePress 原生文件路径，构建不自动写入日期和随机链接。
  autoFrontmatter: false,
})
