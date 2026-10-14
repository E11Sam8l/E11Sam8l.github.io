import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { gzipSync } from 'node:zlib'

const root = resolve(process.argv[2] || 'docs/.vuepress/dist')
const basePath = (process.env.DOCS_BASE || '').replace(/^\/+|\/+$/g, '')
const base = basePath ? `/${basePath}/` : '/'
const files = readdirSync(root, { recursive: true }).map(file => resolve(root, file)).filter(file => statSync(file).isFile())
const htmlFiles = files.filter(file => file.endsWith('.html'))
assert(htmlFiles.length > 0, 'Build output contains no HTML pages')

function localAsset(href, from) {
  if (/^(?:data:|https?:|\/\/|#)/.test(href)) return undefined
  const url = new URL(href, `https://pages.example${base}${relative(root, from)}`)
  assert(url.pathname.startsWith(base), `Asset escapes DOCS_BASE: ${href} in ${from}`)
  const file = resolve(root, decodeURIComponent(url.pathname.slice(base.length)))
  assert(existsSync(file), `Missing asset: ${href} in ${relative(root, from)}`)
  return file
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  for (const [, href] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (href.includes('/assets/')) localAsset(href, file)
  }
}
for (const file of files.filter(file => file.endsWith('.css'))) {
  // Quoted data SVGs can themselves contain url(#gradient) and single quotes.
  for (const match of readFileSync(file, 'utf8').matchAll(/url\((?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^)]*))\)/g)) {
    localAsset(match[1] ?? match[2] ?? match[3], file)
  }
}

const home = readFileSync(resolve(root, 'index.html'), 'utf8')
assert(!/<link rel="preload"[^>]+inter-roman-latin-ext-/.test(home), 'Do not preload the unused extended Latin font subset')
const startup = [...home.matchAll(/<link rel="modulepreload" href="([^"]+)"/g)].map(([, href]) => localAsset(href, resolve(root, 'index.html')))
assert(startup.length > 0, 'Homepage is missing its module preload hints')
assert(!startup.some(file => /(?:AboutPage-|ContentListPage-|vendor~index\.esm)/.test(file)), 'Homepage eagerly loads a deferred page or password WASM')
const scriptBytes = startup.reduce((sum, file) => sum + statSync(file).size, 0)
const scriptGzip = startup.reduce((sum, file) => sum + gzipSync(readFileSync(file)).length, 0)
const cssBytes = files.filter(file => file.endsWith('.css')).reduce((sum, file) => sum + statSync(file).size, 0)
const total = files.reduce((sum, file) => sum + statSync(file).size, 0)
assert(scriptBytes <= 400 * 1024, `Homepage JS budget exceeded: ${scriptBytes} bytes (400 KiB budget)`)
assert(cssBytes <= 350 * 1024, `CSS budget exceeded: ${cssBytes} bytes (350 KiB budget)`)
assert(total < 1024 ** 3, 'Published site exceeds the GitHub Pages 1 GiB size limit')
console.log(JSON.stringify({ pages: htmlFiles.length, base, startupJS: scriptBytes, startupJSGzip: scriptGzip, css: cssBytes, published: total }, null, 2))
console.log('PASS Pages asset paths, deferred feature boundaries, and performance budgets')
