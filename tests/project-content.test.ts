import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import type { Page } from 'vuepress/core'
import { discoverProjectCollections } from '../docs/.vuepress/collections.ts'
import { collectContentItems } from '../docs/.vuepress/plugins/contentIndex.ts'

function page(file: string, title: string, frontmatter: Record<string, unknown> = {}): Page {
  const path = `/${file.replace(/README\.md$/i, '').replace(/\.md$/, '.html')}`
  return { filePathRelative: file, title, path, frontmatter } as Page
}

test('one project card groups its overview, chapters and nested documents', () => {
  const items = collectContentItems({ pages: [
    page('blog/demo/README.md', '博客项目', { tags: ['项目标签'], description: '项目介绍' }),
    page('blog/demo/1.chapter.md', '第一章', { tags: ['章节标签'] }),
    page('blog/demo/appendix/README.md', '附录', { tags: ['附录标签'] }),
    page('blog/demo/appendix/notes.md', '附录笔记'),
    page('knowledge/demo/README.md', '同名目录的知识项目'),
    page('projects/demo/README.md', '同名目录的实践项目'),
    page('blog/README.md', '栏目入口'),
    page('blog/standalone.md', '栏目散文档'),
  ] })
  assert.equal(items.length, 3)
  const blog = items.find(item => item.section === 'blog')!
  assert.equal(blog.title, '博客项目')
  assert.equal(blog.path, '/blog/demo/')
  assert.equal(blog.documentCount, 4)
  assert.deepEqual(blog.tags, ['项目标签'])
})

test('a project without README opens the first numbered document and has no chapter tags', () => {
  const [item] = collectContentItems({ pages: [
    page('projects/工具箱/10.usage.md', '使用方法', { tags: ['内部标签'] }),
    page('projects/工具箱/2.install.md', '安装方法', { tags: ['安装'] }),
  ] })
  assert.equal(item.title, '工具箱')
  assert.equal(item.path, '/projects/工具箱/2.install.html')
  assert.equal(item.documentCount, 2)
  assert.deepEqual(item.tags, [])
})

test('a hidden overview hides the whole project, while drafts do not count as documents', () => {
  const items = collectContentItems({ pages: [
    page('blog/hidden/README.md', '未发布项目', { draft: true }),
    page('blog/hidden/chapter.md', '内部章节'),
    page('blog/visible/README.md', '已发布项目'),
    page('blog/visible/chapter.md', '已发布章节'),
    page('blog/visible/draft.md', '草稿章节', { draft: true }),
    page('blog/.private/README.md', '隐藏目录'),
  ] })
  assert.equal(items.length, 1)
  assert.equal(items[0].title, '已发布项目')
  assert.equal(items[0].documentCount, 2)
})

test('new first-level directories become separate Plume collections with project-local navigation', () => {
  const root = mkdtempSync(join(tmpdir(), 'plume-projects-'))
  try {
    const project = join(root, 'knowledge', '运动控制')
    mkdirSync(join(project, 'appendix'), { recursive: true })
    writeFileSync(join(project, 'README.md'), '---\ntitle: "运动控制：入门"\n---\n\n# 学习项目\n')
    writeFileSync(join(project, 'appendix', 'README.md'), '# 项目内部附录\n')
    let collections = discoverProjectCollections(root)
    assert.equal(collections.length, 1)
    assert.equal(collections[0].title, '运动控制：入门')
    assert.equal(collections[0].dir, 'knowledge/运动控制')
    assert.equal(collections[0].linkPrefix, '/knowledge/运动控制/')
    mkdirSync(join(root, 'projects', '工具箱'), { recursive: true })
    collections = discoverProjectCollections(root)
    assert.equal(collections.length, 2)
    assert.equal(collections[1].title, '工具箱')
    assert.notEqual(collections[0].linkPrefix, collections[1].linkPrefix)
    writeFileSync(join(project, 'README.md'), '---\ntitle: 新的项目名称\n---\n')
    assert.equal(discoverProjectCollections(root)[0].title, '新的项目名称')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
