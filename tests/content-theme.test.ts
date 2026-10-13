import assert from 'node:assert/strict'
import { test } from 'node:test'
import { contentPageClasses, getContentSection } from '../docs/.vuepress/shared/contentTheme.ts'

test('section listings and nested documents share their section theme', () => {
  for (const section of ['blog', 'knowledge', 'projects'] as const) {
    assert.equal(getContentSection(`${section}/README.md`), section)
    assert.equal(getContentSection(`${section}/my-project/appendix/notes.md`), section)
    assert.equal(getContentSection(`${section}\\my-project\\README.md`), section)
    assert.deepEqual(contentPageClasses(section, undefined), ['vice-content-layout', `vice-section-${section}`])
  }
})

test('homepage, biography and unrelated source paths do not get content styling', () => {
  for (const path of ['README.md', 'about/README.md', 'knowledge-archive/README.md', null, undefined]) {
    assert.equal(getContentSection(path), undefined)
  }
})

test('author-specified page classes survive applying the shared theme', () => {
  assert.deepEqual(contentPageClasses('blog', 'my-page custom-layout'), ['my-page', 'custom-layout', 'vice-content-layout', 'vice-section-blog'])
  assert.deepEqual(contentPageClasses('knowledge', ['custom', 'vice-content-layout']), ['custom', 'vice-content-layout', 'vice-section-knowledge'])
})
