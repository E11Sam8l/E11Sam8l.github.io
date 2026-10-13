import assert from 'node:assert/strict'
import { test } from 'node:test'
import { withSectionBreadcrumb } from '../docs/.vuepress/shared/breadcrumb.ts'

test('project overview includes its section between home and the current project', () => {
  const items = withSectionBreadcrumb('knowledge/algorithm-notes/README.md', [
    { text: '首页', link: '/' },
    { text: '算法笔记（示例）', link: '/knowledge/algorithm-notes/', current: true },
  ])
  assert.deepEqual(items.map(item => item.text), ['首页', '知识库', '算法笔记（示例）'])
  assert.equal(items[1].link, '/knowledge/')
  assert.equal(items[2].current, true)
})

test('nested chapters retain the project and parent directories after the section', () => {
  const items = withSectionBreadcrumb('projects/task-board/verification/acceptance.md', [
    { text: '首页', link: '/' },
    { text: '任务看板', link: '/projects/task-board/' },
    { text: '验证记录', link: '/projects/task-board/verification/' },
    { text: '验收用例', link: '/projects/task-board/verification/acceptance.html', current: true },
  ])
  assert.deepEqual(items.map(item => item.text), ['首页', '项目', '任务看板', '验证记录', '验收用例'])
  assert.deepEqual(items.slice(0, -1).map(item => item.link), ['/', '/projects/', '/projects/task-board/', '/projects/task-board/verification/'])
})

test('a section is inserted only once and can use the section page title', () => {
  const items = withSectionBreadcrumb('blog/demo/chapter.md', [
    { text: '首页', link: '/' },
    { text: '博客', link: '/blog/' },
    { text: '博客项目', link: '/blog/demo/' },
    { text: '章节', current: true },
  ], '学习博客')
  assert.deepEqual(items.map(item => item.text), ['首页', '学习博客', '博客项目', '章节'])
})

test('non-project pages retain the native breadcrumb', () => {
  const original = [{ text: '首页', link: '/' }, { text: '关于', current: true }]
  assert.deepEqual(withSectionBreadcrumb('about/README.md', original), original)
})
