import { onMounted, onUnmounted } from 'vue'

/** Keep the three home sections animated in sync with scrolling. */
export function useHomeScroll() {
  let cleanup = () => {}
  onMounted(() => {
    const home = document.querySelector<HTMLElement>('.vice-home-title')?.closest<HTMLElement>('.vp-home')
    if (!home) return
    const scenes = ['.vp-home-hero', '.vp-home-features', '.vp-home-custom']
      .map(selector => home.querySelector<HTMLElement>(selector))
      .filter((scene): scene is HTMLElement => scene !== null)
    if (scenes.length !== 3) return
    const panels = scenes.map(scene => scene.parentElement!)
    const cards = [...scenes[1].querySelectorAll<HTMLElement>('.item')]
    const title = home.querySelector<HTMLElement>('.vice-home-title')
    const connector = title?.querySelector<HTMLElement>('.vice-home-connector')
    const heading = home.querySelector<HTMLElement>('.hero-name')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let panelStarts: number[] = []
    let panelDurations: number[] = []
    const clamp = (n: number) => Math.max(0, Math.min(1, n))
    home.classList.add('vice-three-screens')
    panels.forEach(panel => panel.classList.add('vice-screen'))

    const render = () => {
      frame = 0
      const viewport = Math.max(1, home.clientHeight)
      const scrollTop = home.scrollTop
      panels.forEach((panel, index) => {
        // Layout coordinates are measured only in resize(). Reading a
        // bounding rect for every panel on every scroll frame forces a layout
        // after the style writes from the previous frame.
        const offset = (panelStarts[index] ?? 0) - scrollTop
        const entrance = clamp(1 - Math.max(0, offset) / viewport)
        const duration = panelDurations[index] ?? 1
        const departure = index === 2 ? 0 : clamp(-offset / duration)
        const fade = index === 0 ? departure * .9 : Math.max(1 - entrance, clamp((departure - .35) / .65)) * .85
        panel.style.setProperty('--vice-panel-opacity', String(motion.matches ? 1 : 1 - fade))
        panel.style.setProperty('--vice-panel-scale', String(motion.matches ? 1 : index === 0 ? 1 + departure * .35 : 1 - (1 - entrance) * .08 + departure * .06))
        panel.style.setProperty('--vice-panel-y', `${motion.matches ? 0 : (1 - entrance) * 55 - departure * 45}px`)
        panel.style.setProperty('--vice-palm-scale', String(motion.matches ? 1 : 1 + departure * .2))
        panel.style.setProperty('--vice-hint-opacity', String(1 - clamp(departure * 4)))
        if (index === 1) cards.forEach((card, cardIndex) => {
          const reveal = motion.matches ? 1 : clamp(entrance * 1.8 - cardIndex * .22)
          card.style.setProperty('--vice-card-opacity', String(reveal))
          card.style.setProperty('--vice-card-y', `${(1 - reveal) * 55}px`)
        })
      })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render) }
    const resize = () => {
      if (title && connector && heading) {
        // 使用布局坐标，避免滚动时的缩放影响对齐。
        heading.style.setProperty('--vice-connector-x', `${title.offsetLeft + connector.offsetLeft + connector.offsetWidth / 2}px`)
      }
      panels.forEach((panel, index) => panel.style.setProperty('--vice-content-height', `${scenes[index].offsetHeight}px`))

      // The CSS custom property above changes the scroll geometry. Measure the
      // new geometry once, then let scroll frames use these cached values.
      const homeTop = home.getBoundingClientRect().top
      const scrollTop = home.scrollTop
      panelStarts = panels.map(panel => panel.getBoundingClientRect().top - homeTop + scrollTop)
      panelDurations = panels.map((panel, index) =>
        Math.max(1, panel.offsetHeight - scenes[index].offsetHeight),
      )
      schedule()
    }
    home.tabIndex = 0
    home.setAttribute('aria-label', '首页三个章节，可连续滚动浏览')
    home.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    motion.addEventListener('change', schedule)
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null
    scenes.forEach(scene => observer?.observe(scene))
    if (title) observer?.observe(title)
    resize()
    cleanup = () => {
      home.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', resize)
      motion.removeEventListener('change', schedule)
      observer?.disconnect()
      cancelAnimationFrame(frame)
      home.classList.remove('vice-three-screens')
      panels.forEach(panel => panel.classList.remove('vice-screen'))
      home.removeAttribute('tabindex')
      home.removeAttribute('aria-label')
    }
  })
  onUnmounted(() => cleanup())
}
