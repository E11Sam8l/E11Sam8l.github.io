// Plume imports these async functions even on public pages. Keep their API,
// but fetch/compile the WASM implementation only when a password is checked.
// The explicit subpath bypasses our exact `hash-wasm` Vite alias.
export async function sha256(data: Parameters<typeof import('hash-wasm')['sha256']>[0]): Promise<string> {
  const { sha256 } = await import('hash-wasm/dist/index.esm.js')
  return sha256(data)
}

export async function bcryptVerify(options: Parameters<typeof import('hash-wasm')['bcryptVerify']>[0]): Promise<boolean> {
  const { bcryptVerify } = await import('hash-wasm/dist/index.esm.js')
  return bcryptVerify(options)
}
