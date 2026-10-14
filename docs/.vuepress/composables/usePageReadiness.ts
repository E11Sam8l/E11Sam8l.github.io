import { onMounted, onUnmounted } from 'vue'
import { resolveRoute, useRoute, withBase } from 'vuepress/client'
import { loadPageComponents } from '../shared/pageComponents'
import { resolveInternalTransitionTarget } from '../shared/homeTransition'
import { withResourceDeadline } from '../shared/resourceDeadline'

/** Load the real route modules, so warming and navigation share the module cache. */
export function usePageReadiness() {
  const route = useRoute()
  const pending = new Map<string, Promise<void>>()
  let disposed = false
  let idle: number | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let intentTimer: ReturnType<typeof setTimeout> | undefined

  async function prepare(destination: string, images = true): Promise<void> {
    const target = resolveRoute(destination)
    const path = target.path.split(/[?#]/, 1)[0]
    let task = pending.get(path)
    if (!task) {
      task = Promise.all([target.loader(), loadPageComponents(path)]).then(() => undefined).catch(error => {
        pending.delete(path)
        throw error
      })
      pending.set(path, task)
    }
    await task
    if (images && /^\/about\/(?:index\.html)?$/.test(path)) {
      const [{ _pageData }, { prepareAvatars }] = await Promise.all([target.loader(), import('../shared/profileAssets')])
      const profiles = _pageData.frontmatter.profiles
      if (Array.isArray(profiles)) {
        // Image failures/timeouts should not make otherwise usable content fail.
        await withResourceDeadline(prepareAvatars(profiles), 1500).catch(() => {})
      }
    }
  }

  const connection = () => (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string }
  }).connection
  const canWarm = () => !disposed && !document.hidden && !connection()?.saveData
    && !/^(slow-)?2g$/.test(connection()?.effectiveType ?? '')

  function onIntent(event: Event) {
    if (!canWarm()) return
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
    const destination = resolveInternalTransitionTarget(link.href, location.href, withBase('/'))
    if (!destination || resolveRoute(destination).notFound) return
    clearTimeout(intentTimer)
    intentTimer = setTimeout(() => {
      if (canWarm()) void prepare(destination).catch(() => {})
    }, event.type === 'pointerover' ? 65 : 0)
  }

  onMounted(() => {
    document.addEventListener('pointerover', onIntent, { passive: true })
    document.addEventListener('focusin', onIntent)
    document.addEventListener('touchstart', onIntent, { passive: true })
    // Just the four entry pages, one at a time after first paint. Do not crawl
    // every article, image, or search index and compete with the current page.
    const entries = ['/', '/knowledge/', '/blog/', '/projects/', '/about/'].filter(path => path !== route.path)
    const warmNext = () => {
      if (!canWarm()) return
      const path = entries.shift()
      if (!path) return
      void prepare(path, false).catch(() => {}).finally(schedule)
    }
    const schedule = () => {
      if (!canWarm() || !entries.length) return
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(warmNext, { timeout: 3000 })
      else timer = setTimeout(warmNext, 800)
    }
    // Let initial fonts and images finish before issuing speculative requests.
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    removeLoadListener = () => window.removeEventListener('load', schedule)
  })
  let removeLoadListener = () => {}
  onUnmounted(() => {
    disposed = true
    if (idle !== undefined) window.cancelIdleCallback(idle)
    clearTimeout(timer)
    clearTimeout(intentTimer)
    removeLoadListener()
    document.removeEventListener('pointerover', onIntent)
    document.removeEventListener('focusin', onIntent)
    document.removeEventListener('touchstart', onIntent)
  })
  return prepare
}

/** Never hold a view-transition snapshot indefinitely for a missing font/image. */
export async function waitForPagePixels(): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const images = [...document.querySelectorAll<HTMLImageElement>('#app img')]
    .filter(image => image.loading !== 'lazy')
  try {
    await Promise.race([
      Promise.allSettled([document.fonts.ready, ...images.map(image => image.decode())]),
      new Promise<void>(resolve => { timer = setTimeout(resolve, 1200) }),
    ])
  } finally {
    clearTimeout(timer)
  }
}
