import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRoute, useRouter, withBase } from 'vuepress/client'
import { darkModeSymbol } from 'vuepress-theme-plume/client'

const appearanceKey = 'vice-page-appearance'
const homePaths = new Set(['/', '/index.html'])
const transitionPaths = new Set(['/knowledge/', '/blog/', '/projects/', '/about/'])
const isHome = (path: string) => homePaths.has(path)
let activeTransition: { token: symbol; cancel: () => void } | null = null

/** Keep the reading preference separate from Plume's forced homepage theme. */
export function setupPageTransition() {
  const route = useRoute()
  const preferredDark = ref(false)
  let applyingAppearance = true
  let revision = 0
  let disposed = false
  let printing = false
  let observer: MutationObserver | undefined

  if (typeof window !== 'undefined') {
    try {
      preferredDark.value = localStorage.getItem(appearanceKey) === 'dark'
    } catch {
      // Private browsing may make storage unavailable; keep the session preference.
    }
  }

  const savePreference = () => {
    try {
      localStorage.setItem(appearanceKey, preferredDark.value ? 'dark' : 'light')
    } catch {
      // Navigation and theme switching also work without persistent storage.
    }
  }

  // Plume's switches and hero use this controlled ref. Its native useDark storage
  // and system preference cannot overwrite the reading preference or force home light.
  const isDark = computed({
    get: () => isHome(route.path) || preferredDark.value,
    set: (dark: boolean) => {
      if (disposed || applyingAppearance || isHome(route.path)) return
      preferredDark.value = dark
      savePreference()
    },
  })
  provide(darkModeSymbol, isDark)

  const applyAppearance = () => {
    if (disposed) return
    const home = isHome(route.path)
    const theme = !printing && isDark.value ? 'dark' : 'light'
    if (document.documentElement.dataset.theme !== theme)
      document.documentElement.dataset.theme = theme
    document.documentElement.classList.toggle('vice-home-appearance', home)
    if (!home) document.documentElement.classList.remove('no-transition')
  }

  watch(isDark, () => {
    if (typeof document !== 'undefined' && !applyingAppearance) applyAppearance()
  }, { flush: 'post' })

  watch(() => route.path, async (path, previousPath) => {
    if (typeof document === 'undefined') return
    const currentRevision = ++revision
    applyingAppearance = true
    if (isHome(previousPath) && !isHome(path)) {
      preferredDark.value = false
      savePreference()
    }
    // Plume's hero restores its previous theme when unmounted. Apply ours afterward.
    // A synchronous route watcher can run before Vue queues the component update.
    await nextTick()
    await nextTick()
    if (disposed || currentRevision !== revision) return
    applyAppearance()
    await nextTick()
    if (!disposed && currentRevision === revision) applyingAppearance = false
  }, { flush: 'sync' })

  onMounted(async () => {
    // Plume still has legacy system/storage listeners. Reconcile their DOM writes
    // without writing back to that storage, avoiding cross-tab feedback loops.
    observer = new MutationObserver(applyAppearance)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('beforeprint', beforePrint)
    window.addEventListener('afterprint', afterPrint)
    const currentRevision = ++revision
    await nextTick()
    await nextTick()
    if (disposed || currentRevision !== revision) return
    applyAppearance()
    await nextTick()
    if (!disposed && currentRevision === revision) applyingAppearance = false
  })

  function beforePrint() {
    printing = true
    applyAppearance()
  }
  function afterPrint() {
    printing = false
    applyAppearance()
  }
  onUnmounted(() => {
    disposed = true
    revision++
    observer?.disconnect()
    window.removeEventListener('beforeprint', beforePrint)
    window.removeEventListener('afterprint', afterPrint)
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
    let transition: ViewTransition | undefined
    let stopTimer: ReturnType<typeof setTimeout> | undefined
    const token = Symbol('home-transition')
    const previousTransition = activeTransition
    activeTransition = {
      token,
      cancel: () => {
        transitionStopped = true
        transition?.skipTransition()
      },
    }
    previousTransition?.cancel()
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
      transition = document.startViewTransition(navigate)
      void transition.ready.then(() => {
        if (transitionStopped || activeTransition?.token !== token) return
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
        transition?.skipTransition()
      })
      await Promise.race([
        transition.finished,
        new Promise<void>((resolve) => {
          stopTimer = setTimeout(() => {
            transitionStopped = true
            transition?.skipTransition()
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
      if (activeTransition?.token === token) {
        root.classList.remove('vice-page-transition')
        activeTransition = null
      }
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
