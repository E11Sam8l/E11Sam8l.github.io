import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter, withBase } from 'vuepress/client'
import { useDarkMode } from 'vuepress-theme-plume/client'

const appearanceKey = 'vice-page-appearance'
const homePaths = new Set(['/', '/index.html'])
const transitionPaths = new Set(['/knowledge/', '/blog/', '/projects/', '/about/'])
const isHome = (path: string) => homePaths.has(path)

/** Keep the reading preference separate from Plume's forced homepage theme. */
export function setupPageTransition() {
  const route = useRoute()
  const isDark = useDarkMode()
  let preferredDark = false
  let applyingAppearance = true
  let revision = 0

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(appearanceKey)
      preferredDark = (saved ?? localStorage.getItem('vuepress-theme-appearance')) === 'dark'
    } catch {
      // Private browsing may make storage unavailable; keep the session preference.
    }
  }

  const savePreference = () => {
    try {
      localStorage.setItem(appearanceKey, preferredDark ? 'dark' : 'light')
    } catch {
      // Navigation and theme switching also work without persistent storage.
    }
  }

  const applyAppearance = () => {
    const home = isHome(route.path)
    const dark = home || preferredDark
    isDark.value = dark
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    document.documentElement.classList.toggle('vice-home-appearance', home)
    if (!home) document.documentElement.classList.remove('no-transition')
  }

  watch(isDark, (dark) => {
    if (applyingAppearance || isHome(route.path)) return
    preferredDark = dark
    savePreference()
  }, { flush: 'sync' })

  watch(() => route.path, async (path, previousPath) => {
    if (typeof document === 'undefined') return
    const currentRevision = ++revision
    applyingAppearance = true
    if (isHome(previousPath) && !isHome(path)) {
      preferredDark = false
      savePreference()
    }
    // Plume's hero restores its previous theme when unmounted. Apply ours afterward.
    // A synchronous route watcher can run before Vue queues the component update.
    await nextTick()
    await nextTick()
    if (currentRevision !== revision) return
    applyAppearance()
    await nextTick()
    if (currentRevision === revision) applyingAppearance = false
  }, { flush: 'sync' })

  onMounted(async () => {
    const currentRevision = ++revision
    await nextTick()
    await nextTick()
    if (currentRevision !== revision) return
    applyAppearance()
    await nextTick()
    if (currentRevision === revision) applyingAppearance = false
  })
}

/** Reveal the destination from the selected homepage card or about button's center. */
export function useHomePageTransition() {
  const router = useRouter()
  let home: HTMLElement | null = null
  let navigating = false

  const onClick = async (event: MouseEvent) => {
    const link = event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>('a.vp-home-feature, a.vice-about-link')
      : null
    if (!link || !home?.contains(link)) return

    // Preserve native new-tab behavior instead of Plume's ordinary click handler.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || link.hasAttribute('download') || (link.target && link.target !== '_self')) {
      event.stopImmediatePropagation()
      return
    }

    const url = new URL(link.href, window.location.href)
    const base = withBase('/')
    if (url.origin !== window.location.origin || !url.pathname.startsWith(base)) return
    const path = `/${url.pathname.slice(base.length)}`
    if (!transitionPaths.has(path)) return

    event.preventDefault()
    event.stopImmediatePropagation()
    if (navigating) return
    navigating = true

    const rect = link.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const root = document.documentElement
    let navigationStarted = false
    let transitionStopped = false
    let stopTimer: ReturnType<typeof setTimeout> | undefined
    const navigate = async () => {
      navigationStarted = true
      const failure = await router.push(`${path}${url.search}${url.hash}`)
      if (failure) throw failure
      await nextTick()
      await nextTick()
      // View Transition suppresses rendering until this callback completes.
      // Await Vue's DOM updates, never an animation frame or CSS animation here.
    }

    try {
      if (typeof document.startViewTransition !== 'function' || typeof root.animate !== 'function'
        || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        await navigate()
        return
      }

      root.classList.add('vice-page-transition')
      const transition = document.startViewTransition(navigate)
      void transition.ready.then(() => {
        if (transitionStopped) return
        root.animate([
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
        ], {
          duration: 750,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
          pseudoElement: '::view-transition-new(root)',
        })
      }).catch(() => {
        // Failed or unsupported animation must not obstruct the destination page.
        transition.skipTransition()
      })
      await Promise.race([
        transition.finished,
        new Promise<void>((resolve) => {
          stopTimer = setTimeout(() => {
            transitionStopped = true
            transition.skipTransition()
            resolve()
          }, 2500)
        }),
      ])
    } catch (error) {
      if (!navigationStarted) await navigate().catch(() => {})
      else if (error instanceof Error) console.warn('Page transition was interrupted:', error)
    } finally {
      transitionStopped = true
      clearTimeout(stopTimer)
      root.classList.remove('vice-page-transition')
      navigating = false
    }
  }

  onMounted(() => {
    home = document.querySelector<HTMLElement>('.vice-home-title')?.closest<HTMLElement>('.vp-home') ?? null
    home?.addEventListener('click', onClick, { capture: true })
  })
  onUnmounted(() => {
    home?.removeEventListener('click', onClick, { capture: true })
    // The transition intentionally outlives the homepage component it replaces.
    home = null
  })
}
