import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createContentFilterStore, filterContent } from '../docs/.vuepress/shared/contentFilter.ts'
import type { ContentItem } from '../docs/.vuepress/shared/content.ts'

const projects: ContentItem[] = [
  { section: 'knowledge', title: '算法项目', path: '/knowledge/algorithms/', tags: ['算法', '示例'], description: '', createTime: '', sticky: 0, documentCount: 3 },
  { section: 'knowledge', title: '机器人项目', path: '/knowledge/robotics/', tags: ['机器人学', '运动控制'], description: '', createTime: '', sticky: 0, documentCount: 3 },
  { section: 'knowledge', title: '写作项目', path: '/knowledge/writing/', tags: ['Markdown', '写作'], description: '', createTime: '', sticky: 0, documentCount: 2 },
]

test('no selection displays all projects; a tag displays its matching project', () => {
  assert.deepEqual(filterContent(projects, []).map(item => item.title), ['算法项目', '机器人项目', '写作项目'])
  assert.deepEqual(filterContent(projects, ['运动控制']).map(item => item.title), ['机器人项目'])
})

test('multiple selected tags match any tag without duplicating projects', () => {
  assert.deepEqual(filterContent(projects, ['算法', '示例', '机器人学']).map(item => item.title), ['算法项目', '机器人项目'])
  assert.deepEqual(filterContent(projects, ['不存在的标签']), [])
})

test('each section and each app retain independent filter and pagination state', () => {
  const first = createContentFilterStore()
  const second = createContentFilterStore()
  first.knowledge.selected.push('算法')
  first.knowledge.page = 2
  first.blog.selected.push('学习记录')
  assert.deepEqual(first.projects, { selected: [], page: 1 })
  assert.deepEqual(first.blog, { selected: ['学习记录'], page: 1 })
  assert.deepEqual(first.knowledge, { selected: ['算法'], page: 2 })
  assert.deepEqual(second.knowledge, { selected: [], page: 1 })
})
