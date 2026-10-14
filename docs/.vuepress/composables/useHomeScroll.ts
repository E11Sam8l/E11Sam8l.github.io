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
    const heroContainer = home.querySelector<HTMLElement>('.hero-container')
    const contents = [home.querySelector<HTMLElement>('.hero-content'), scenes[1].querySelector<HTMLElement>(':scope > .container'), home.querySelector<HTMLElement>('.vice-about')]
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let resizeFrame = 0
    let viewport = 1
    let panelStarts: number[] = []
    let panelDurations: number[] = []
    const written = new WeakMap<HTMLElement, Map<string, string>>()
    const write = (element: HTMLElement | null, property: string, value: string) => {
      if (!element) return
      let values = written.get(element)
      if (!values) written.set(element, values = new Map())
      if (values.get(property) === value) return
      values.set(property, value)
      element.style.setProperty(property, value)
    }
    const clamp = (n: number) => Math.max(0, Math.min(1, n))
    home.classList.add('vice-three-screens')
    panels.forEach(panel => panel.classList.add('vice-screen'))

    const render = () => {
      frame = 0
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
        // Write compositor properties on the animated elements themselves.
        // Inherited variables on a whole panel invalidated every descendant.
        const scale = motion.matches ? 1 : index === 0 ? 1 + departure * .35 : 1 - (1 - entrance) * .08 + departure * .06
        const y = motion.matches ? 0 : (1 - entrance) * 55 - departure * 45
        write(contents[index], 'opacity', String(motion.matches ? 1 : 1 - fade))
        write(contents[index], 'transform', `translateY(${y}px) scale(${scale})`)
        if (index === 0) {
          write(scenes[0], '--vice-palm-scale', String(motion.matches ? 1 : 1 + departure * .2))
          write(heroContainer, '--vice-hint-opacity', String(1 - clamp(departure * 4)))
        }
        if (index === 1) cards.forEach((card, cardIndex) => {
          const reveal = motion.matches ? 1 : clamp(entrance * 1.8 - cardIndex * .22)
          write(card, '--vice-card-opacity', String(reveal))
          write(card, '--vice-card-y', `${(1 - reveal) * 55}px`)
        })
      })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render) }
    const resize = () => {
      resizeFrame = 0
      viewport = Math.max(1, home.clientHeight)
      const heights = scenes.map(scene => scene.offsetHeight)
      const connectorX = title && connector ? title.offsetLeft + connector.offsetLeft + connector.offsetWidth / 2 : null
      if (title && connector && heading) {
        // 使用布局坐标，避免滚动时的缩放影响对齐。
        write(heading, '--vice-connector-x', `${connectorX}px`)
      }
      panels.forEach((panel, index) => write(panel, '--vice-content-height', `${heights[index]}px`))

      // The CSS custom property above changes the scroll geometry. Measure the
      // new geometry once, then let scroll frames use these cached values.
      const homeTop = home.getBoundingClientRect().top
      const scrollTop = home.scrollTop
      panelStarts = panels.map(panel => panel.getBoundingClientRect().top - homeTop + scrollTop)
      panelDurations = panels.map((panel, index) =>
        Math.max(1, panel.offsetHeight - heights[index]),
      )
      schedule()
    }
    const scheduleResize = () => { if (!resizeFrame) resizeFrame = requestAnimationFrame(resize) }
    home.tabIndex = 0
    home.setAttribute('aria-label', '首页三个章节，可连续滚动浏览')
    home.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', scheduleResize, { passive: true })
    motion.addEventListener('change', scheduleResize)
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(scheduleResize) : null
    scenes.forEach(scene => observer?.observe(scene))
    if (title) observer?.observe(title)
    resize()
    cleanup = () => {
      home.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', scheduleResize)
      motion.removeEventListener('change', scheduleResize)
      observer?.disconnect()
      cancelAnimationFrame(frame)
      cancelAnimationFrame(resizeFrame)
      home.classList.remove('vice-three-screens')
      panels.forEach(panel => panel.classList.remove('vice-screen'))
      home.removeAttribute('tabindex')
      home.removeAttribute('aria-label')
    }
  })
  onUnmounted(() => cleanup())
}
