import assert from 'node:assert/strict'
import { test } from 'node:test'
import { bcrypt } from 'hash-wasm'
import { bcryptVerify, sha256 } from '../docs/.vuepress/shared/lazyHash.ts'

test('deferred hashing preserves known SHA-256 results and concurrent calls', async () => {
  const results = await Promise.all([sha256('abc'), sha256(new TextEncoder().encode('abc'))])
  for (const result of results) assert.equal(result, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
})

test('deferred password verification still accepts/rejects the correct passwords', async () => {
  const hash = await bcrypt({ password: '测试密码', salt: '0123456789abcdef', costFactor: 4 })
  assert.equal(await bcryptVerify({ password: '测试密码', hash }), true)
  assert.equal(await bcryptVerify({ password: 'wrong', hash }), false)
})
