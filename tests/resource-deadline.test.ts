import assert from 'node:assert/strict'
import { test } from 'node:test'
import { withResourceDeadline } from '../docs/.vuepress/shared/resourceDeadline.ts'

test('resource deadlines preserve successful values and original failures', async () => {
  assert.equal(await withResourceDeadline(Promise.resolve('ready'), 100), 'ready')
  const error = new Error('network unavailable')
  await assert.rejects(withResourceDeadline(Promise.reject(error), 100), candidate => candidate === error)
})

test('stalled resources time out without cancelling a shared load', async () => {
  let complete!: (value: string) => void
  const shared = new Promise<string>(resolve => { complete = resolve })
  await assert.rejects(withResourceDeadline(shared, 5), /too long/)
  complete('ready for the next navigation')
  assert.equal(await withResourceDeadline(shared, 100), 'ready for the next navigation')
})
