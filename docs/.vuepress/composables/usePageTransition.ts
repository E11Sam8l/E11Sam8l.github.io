import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRoute, useRouter, withBase } from 'vuepress/client'
import { darkModeSymbol } from 'vuepress-theme-plume/client'
import {
  isHomePath as isHome,
  resolveHomeTransitionTarget,
  resolveInternalTransitionTarget,
} from '../shared/homeTransition'

const appearanceKey = 'vice-page-appearance'
let activeTransition: { token: symbol; cancel: () => void } | null = null

/** Keep the reading preference separate from Plume's forced homepage theme. */
export function setupPageTransition() {
  const route = useRoute()
  const router = useRouter()
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

  let fallbackFrame: number | undefined
  let fallbackTimer: number | undefined
  const runFallbackAnimation = (direction: 'forward' | 'back' = 'forward') => {
    const root = document.documentElement
    if (fallbackFrame !== undefined) cancelAnimationFrame(fallbackFrame)
    if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer)
    root.classList.remove('vice-route-forward', 'vice-route-back')
    // Restart on the next frame instead of forcing a synchronous layout.
    fallbackFrame = requestAnimationFrame(() => {
      fallbackFrame = undefined
      root.classList.add(direction === 'back' ? 'vice-route-back' : 'vice-route-forward')
      fallbackTimer = window.setTimeout(() => {
        fallbackTimer = undefined
        root.classList.remove('vice-route-forward', 'vice-route-back')
      }, 760)
    })
  }

  let navigating = false
  // Back/forward buttons and programmatic router pushes do not produce a click
  // event. Give those route changes the same lightweight entrance treatment.
  watch(() => route.path, (path, previousPath) => {
    if (path === previousPath || navigating || typeof document === 'undefined') return
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      runFallbackAnimation(isHome(path) && !isHome(previousPath) ? 'back' : 'forward')
  }, { flush: 'post' })

  const onClick = async (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const link = event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>('a[href]')
      : null
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return

    const currentUrl = new URL(window.location.href)
    const targetUrl = new URL(link.href, currentUrl)
    // Let the browser/router handle in-page anchors without replacing the page.
    if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) return

    const base = withBase('/')
    const destination = resolveInternalTransitionTarget(link.href, currentUrl.href, base)
    if (!destination || navigating) return

    event.preventDefault()
    event.stopImmediatePropagation()
    navigating = true

    const homeTarget = resolveHomeTransitionTarget(route.path, link.href, currentUrl.href, base)
    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const destinationPath = destination.split(/[?#]/, 1)[0]
    const returningHome = isHome(destinationPath) && !isHome(route.path)
    const endpointTransition = Boolean(homeTarget || returningHome)
    const useCircularReveal = Boolean(endpointTransition && typeof root.animate === 'function')
    const token = Symbol('page-transition')
    const previousTransition = activeTransition
    let transitionStopped = false
    let transition: ViewTransition | undefined
      let revealFinished: Promise<unknown> = Promise.resolve()
    let stopTimer: ReturnType<typeof setTimeout> | undefined
    activeTransition = {
      token,
      cancel: () => {
        transitionStopped = true
        transition?.skipTransition()
      },
    }
    previousTransition?.cancel()

    let navigationStarted = false
    const navigate = async () => {
      navigationStarted = true
      const failure = await router.push(destination)
      if (failure) throw failure
      await nextTick()
      await nextTick()
    }

    try {
      // Homepage and section endpoints share one circular reveal. Other routes
      // use a CSS entrance after navigation so they do not hold a view-transition
      // snapshot while a remote page chunk is being evaluated.
      if (!useCircularReveal || reducedMotion || typeof document.startViewTransition !== 'function') {
        await navigate()
        if (!reducedMotion) runFallbackAnimation(returningHome ? 'back' : 'forward')
        return
      }

      root.classList.add('vice-page-transition')
      if (returningHome) root.classList.add('vice-page-transition-reverse')
      transition = document.startViewTransition(navigate)

      if (useCircularReveal) {
        // The return transition is the exact reverse of the outgoing one:
        // both use the same top-right origin and the same duration/easing.
        const x = innerWidth
        const y = 0
        const radius = Math.hypot(innerWidth, innerHeight)
        revealFinished = transition.ready.then(() => {
          if (transitionStopped || activeTransition?.token !== token) return
          const keyframes = returningHome
            ? [
                { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
                { clipPath: `circle(0px at ${x}px ${y}px)` },
              ]
            : [
                { clipPath: `circle(0px at ${x}px ${y}px)` },
                { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
              ]
          const reveal = root.animate(keyframes, {
            duration: 1100,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both',
            pseudoElement: returningHome
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
          })
          return reveal.finished.catch(() => undefined)
        }).catch(() => {
          transition?.skipTransition()
        })
      }

      // A slow GitHub Pages chunk must not make the transition disappear. The
      // timeout is only a last-resort escape hatch for a stalled navigation.
      await Promise.race([
        Promise.all([
          transition.finished.catch(() => undefined),
          revealFinished,
        ]),
        new Promise<void>(resolve => {
          stopTimer = setTimeout(() => {
            transitionStopped = true
            transition?.skipTransition()
            resolve()
          }, 6000)
        }),
      ])
    } catch (error) {
      if (!navigationStarted) await navigate().catch(() => {})
      else if (error instanceof Error) console.warn('Page transition was interrupted:', error)
    } finally {
      transitionStopped = true
      clearTimeout(stopTimer)
      if (activeTransition?.token === token) {
        root.classList.remove('vice-page-transition', 'vice-page-transition-reverse')
        activeTransition = null
      }
      navigating = false
    }
  }

  onMounted(() => {
    // Capture links globally so navigation from the homepage, section listings,
    // article pages, breadcrumbs, and the navbar shares one transition path.
    document.addEventListener('click', onClick, { capture: true })
  })

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
    if (fallbackFrame !== undefined) cancelAnimationFrame(fallbackFrame)
    if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer)
    observer?.disconnect()
    document.removeEventListener('click', onClick, { capture: true })
    window.removeEventListener('beforeprint', beforePrint)
    window.removeEventListener('afterprint', afterPrint)
  })
}

/** Kept as a compatibility hook for existing homepage markdown. */
export function useHomePageTransition() {
  // Site-wide navigation is installed by setupPageTransition(), which runs once
  // for the app and therefore survives the homepage component being replaced.
}
