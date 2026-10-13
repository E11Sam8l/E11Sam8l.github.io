import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolveHomeTransitionTarget } from '../docs/.vuepress/shared/homeTransition.ts'

const location = 'https://example.com/'
const destinations = ['/knowledge/', '/blog/', '/projects/', '/about/']

test('all homepage navigation destinations use the same reveal as the cards', () => {
  for (const source of ['/', '/index.html']) {
    for (const destination of destinations) {
      assert.equal(resolveHomeTransitionTarget(source, destination, location), destination)
    }
  }
})

test('secondary pages never start the reveal, including between sections and back to home', () => {
  for (const source of [...destinations, '/knowledge/algorithm-notes/search.html']) {
    for (const destination of [...destinations, '/']) {
      assert.equal(resolveHomeTransitionTarget(source, destination, location), undefined)
    }
  }
})

test('the homepage button does not start a homepage-to-homepage reveal', () => {
  for (const destination of ['/', '/index.html', '/#about']) {
    assert.equal(resolveHomeTransitionTarget('/', destination, location), undefined)
  }
})

test('repository base paths and destination queries and anchors are retained', () => {
  assert.equal(
    resolveHomeTransitionTarget('/', 'https://example.com/site/blog/?tag=VuePress#projects', 'https://example.com/site/', '/site/'),
    '/blog/?tag=VuePress#projects',
  )
  assert.equal(resolveHomeTransitionTarget('/', '/blog/', 'https://example.com/site/', '/site/'), undefined)
})

test('external destinations and unrelated links do not start the reveal', () => {
  for (const destination of ['https://other.example/blog/', '/assets/example.pdf', '/unknown/']) {
    assert.equal(resolveHomeTransitionTarget('/', destination, location), undefined)
  }
})
