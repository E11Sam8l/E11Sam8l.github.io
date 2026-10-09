import { defineCollections } from 'vuepress-theme-plume'

/**
 * Collections keep content rules next to the directories they describe.
 * Adding a new knowledge topic only requires creating a folder under
 * docs/knowledge; the `auto` sidebar discovers nested Markdown files.
 */
export const collections = defineCollections([
  {
    type: 'doc',
    dir: 'knowledge',
    title: '知识库',
    linkPrefix: '/knowledge/',
    sidebar: 'auto',
    autoFrontmatter: false,
    meta: {
      readingTime: true,
      wordCount: true,
      createTime: 'short',
    },
  },
  {
    type: 'post',
    dir: 'blog',
    title: '博客',
    link: '/blog/',
    linkPrefix: '/blog/',
    postList: true,
    tags: true,
    archives: true,
    categories: true,
    autoFrontmatter: false,
    meta: {
      tags: true,
      readingTime: true,
      wordCount: true,
      createTime: 'short',
    },
  },
])

