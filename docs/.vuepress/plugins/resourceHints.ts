import { readFile, readdir, writeFile } from 'node:fs/promises'
import type { Plugin } from 'vuepress/core'

/** Reuse the theme's exact font bytes; discover the hashed name at build time. */
export function resourceHintsPlugin(): Plugin {
  return {
    name: 'vice-resource-hints',
    async onGenerated(app) {
      const assets = await readdir(app.dir.dest('assets'))
      const font = assets.find(name => /^inter-roman-latin-(?!ext-)[\w-]+\.woff2$/.test(name))
      if (!font) return
      const hint = `<link rel="preload" href="${app.options.base}assets/${font}" as="font" type="font/woff2" crossorigin>`
      await Promise.all(app.pages.map(async page => {
        const html = await readFile(page.htmlFilePath, 'utf8')
        await writeFile(page.htmlFilePath, html.replace('</head>', `${hint}</head>`))
      }))
    },
  }
}
