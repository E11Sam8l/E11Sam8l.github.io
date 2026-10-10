---
pageLayout: home
title: 个人知识库与博客
description: 在日落与霓虹之间，记录知识、项目与思考。
config:
  - type: hero
    full: true
    # effect: tint-plate
    # # 分别配置明暗模式下的动态色板。
    # effectConfig:
    #   light: '220,150,195'
    #   dark: '72,32,100'
    hero:
      name: '<span class="vice-home-subtitle">个人主页</span><span class="vice-home-title"><span class="vice-home-word vice-home-laplace">Laplace</span><span class="vice-home-connector">and</span><span class="vice-home-word">E11SAM8L</span></span>'
      tagline: 日落之后，灵感上线。
      text: '01 / WELCOME · KNOWLEDGE · STORIES · PROJECTS'
  - type: features
    index: 1
    title: 每一次探索，都有新的故事。
    description: '02 / EXPLORE · 从学习笔记到动手实践，这里是我们的开放世界。'
    features:
      - title: 知识库
        icon: '01'
        details: 从机器人学到 Markdown，把零散的灵感整理成可以反复探索的知识地图。
        link: /knowledge/
        linkText: 浏览知识库
      - title: 博客
        icon: '02'
        details: 记录学习的片段、建站的过程，以及值得留下来的日常思考。
        link: /blog/
        linkText: 阅读博客
      - title: 项目展示
        icon: '03'
        details: 把想法变成作品，记录每一次尝试、迭代和完成的瞬间。
        link: /projects/
        linkText: 查看项目
  - type: custom
    full: true
---

<div class="vice-about">
  <p class="vice-eyebrow">03 / ABOUT ME</p>
  <h2>你好，<br>我们是 Laplace and E11SAM8L。</h2>
  <p class="vice-about-intro">这是一个用于记录知识、学习过程、项目实践和个人思考的空间。</p>
  <p class="vice-about-note">从学习笔记到动手实践，让每一次探索都留下痕迹。</p>
  <a class="vice-about-link" :href="withBase('/about/')">进入我的个人主页 ↗</a>
</div>

<!-- 三个章节连续滚动，动画进度直接跟随滚动距离。 -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { withBase } from 'vuepress/client'

let cleanup = () => {}
onMounted(() => {
  const home = document.querySelector('.vice-home-title')?.closest('.vp-home')
  if (!home) return
  const scenes = ['.vp-home-hero', '.vp-home-features', '.vp-home-custom'].map(selector => home.querySelector(selector))
  if (scenes.some(scene => !scene)) return
  const panels = scenes.map(scene => scene.parentElement)
  const cards = [...scenes[1].querySelectorAll('.item')]
  const title = home.querySelector('.vice-home-title')
  const connector = title?.querySelector('.vice-home-connector')
  const heading = home.querySelector('.hero-name')
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0
  const clamp = n => Math.max(0, Math.min(1, n))
  const panelTop = panel => panel.getBoundingClientRect().top - home.getBoundingClientRect().top + home.scrollTop
  home.classList.add('vice-three-screens')
  panels.forEach(panel => panel.classList.add('vice-screen'))

  const render = () => {
    frame = 0
    const viewport = home.clientHeight
    panels.forEach((panel, index) => {
      const offset = panelTop(panel) - home.scrollTop
      const entrance = clamp(1 - Math.max(0, offset) / viewport)
      const duration = Math.max(1, panel.offsetHeight - scenes[index].offsetHeight)
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
</script>

<!-- 首页样式保存在本文件；选择器仅匹配带有 vice-home-title 的首页。 -->
<style>
.vp-home:has(.vice-home-title) {
  --vice-dusk: #30213f;
  --vice-about-background: radial-gradient(ellipse at 20% 40%, #7f395a66, transparent 65%), linear-gradient(135deg, #24162f, #101526);
  --vp-c-brand-1: #ff91b8;
  --vp-c-brand-2: #f975a6;
  --vp-c-brand-3: #df558b;
  --vp-c-brand-soft: #ff91b81c;
  --vp-c-bg: #120f25;
  --vp-c-bg-soft: #20162f;
  --vp-c-text-1: #fff1f5;
  --vp-c-text-2: #e9cddd;
  --vp-c-home-hero-tagline: #fff1f5;
  --vp-c-home-hero-text: #f7b7ca;
  background: var(--vice-dusk);
}
.vp-home:has(.vice-home-title) .vp-home-hero {
  isolation: isolate;
  overflow: hidden;
  min-height: 680px;
  background: linear-gradient(180deg, #17162f, #823f75 58%, #e28091 82%, var(--vice-dusk));
}
.vp-home:has(.vice-home-title) .bg-filter { opacity: .55; }
.vp-home:has(.vice-home-title) .bg-filter::after {
  background: linear-gradient(180deg, #17162f, transparent 38%, transparent 58%, var(--vice-dusk));
}
.vp-home:has(.vice-home-title) .vp-home-hero::before {
  position: absolute;
  inset: 0;
  content: '';
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 76%, #ffb47580, transparent 44%), linear-gradient(0deg, var(--vice-dusk), transparent 36%);
}
.vp-home:has(.vice-home-title) .vp-home-hero::after {
  position: absolute;
  inset: 0;
  content: '';
  pointer-events: none;
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201440%20900%27%3E%3Cg%20fill%3D%27%23120f25%27%3E%3Cpath%20d%3D%27M70%20900Q145%20650%20165%20405L180%20405Q175%20680%20125%20900Z%20M170%20410Q55%20320%200%20360Q65%20365%20170%20425Z%20M170%20410Q30%20405%200%20490Q80%20430%20170%20425Z%20M170%20410Q100%20250%2045%20265Q120%20320%20170%20425Z%20M170%20410Q215%20260%20300%20295Q230%20320%20170%20425Z%20M170%20410Q300%20335%20355%20415Q260%20380%20170%20425Z%20M170%20410Q280%20435%20290%20520Q240%20455%20170%20425Z%27%2F%3E%3Cpath%20d%3D%27M1310%20900Q1295%20645%201260%20460L1245%20460Q1260%20710%201260%20900Z%20M1250%20465Q1370%20370%201440%20410Q1355%20415%201250%20480Z%20M1250%20465Q1380%20465%201440%20550Q1350%20505%201250%20480Z%20M1250%20465Q1340%20290%201405%20330Q1325%20355%201250%20480Z%20M1250%20465Q1215%20300%201130%20345Q1205%20365%201250%20480Z%20M1250%20465Q1120%20395%201050%20475Q1160%20445%201250%20480Z%20M1250%20465Q1140%20505%201170%20595Q1185%20525%201250%20480Z%27%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") center bottom / cover no-repeat;
  opacity: .85;
}
.vp-home:has(.vice-home-title) .hero-content {
  width: 100%;
  max-width: 1440px;
  padding: 64px 36px;
  box-sizing: border-box;
}
.vp-home:has(.vice-home-title) .vp-home-hero.full .hero-container .hero-content { margin-top: -16px; }
.vp-home:has(.vice-home-title) .hero-name {
  position: relative;
  width: 100%;
  background: none;
  -webkit-text-fill-color: initial;
}
.vice-home-title {
  position: relative;
  --vice-title-gradient: linear-gradient(180deg, #fff7e8 12%, #ffc2b2 48%, #f47fae 85%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .16em;
  width: max-content;
  margin: 0 auto;
  font-family: Impact, 'Arial Black', sans-serif;
  font-size: clamp(21px, 5.9vw, 100px);
  white-space: nowrap;
  line-height: 1.12;
  letter-spacing: -.025em;
  background: none;
  filter: drop-shadow(0 6px 0 #321c4b) drop-shadow(0 14px 24px #160d36a0);
}
.vice-home-word,
.vice-home-connector {
  display: block;
  flex: none;
  line-height: 1;
  background: var(--vice-title-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.vice-home-laplace { transform: translateY(-.035em); }
.vice-home-subtitle {
  display: block;
  position: relative;
  left: var(--vice-connector-x, 50%);
  width: max-content;
  transform: translateX(-50%);
  margin-bottom: 30px;
  font-family: var(--vp-font-family-base);
  font-size: clamp(14px, 1.4vw, 19px);
  font-weight: 500;
  letter-spacing: .45em;
  color: #f9d8e1;
  -webkit-text-fill-color: #f9d8e1;
  line-height: 1.5;
}
.vice-home-connector {
  font-size: .56em;
  transform: translateY(.04em);
  letter-spacing: 0;
}
.vp-home:has(.vice-home-title) .hero-tagline {
  margin-top: 34px;
  font-size: clamp(22px, 2.5vw, 35px);
  font-weight: 500;
  letter-spacing: .1em;
  line-height: 1.6;
  text-shadow: 0 2px 16px #26143f;
}
.vp-home:has(.vice-home-title) .hero-text {
  margin: 28px auto 0;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: .2em;
  color: #efd0dc;
  line-height: 1.8;
}
.vp-home:has(.vice-home-title) .hero-text::before {
  display: block;
  width: 48px;
  height: 1px;
  margin: 0 auto 20px;
  content: '';
  background: linear-gradient(90deg, transparent, #ffd0bb, transparent);
}
.vp-home:has(.vice-home-title) .vp-button.brand {
  color: #25132f;
  background: linear-gradient(110deg, #ffb493, #ff8fbd);
  border-color: transparent;
  box-shadow: 0 8px 32px #f776a43d;
}
.vp-home:has(.vice-home-title) .vp-button.alt { background: #211730a6; border-color: #f7b7ca66; color: #fff1f5; }
.vp-home:has(.vice-home-title) .vp-home-features { padding-top: 72px; padding-bottom: 72px; }
.vp-home:has(.vice-home-title) .vp-home-feature {
  background: linear-gradient(145deg, #51324d99, #291d3599);
  border-color: #efb7ce33;
  box-shadow: 0 12px 36px #17102320, inset 0 1px 0 #ffe1ec0a;
}
.vp-home:has(.vice-home-title) .vp-home-feature .icon { background: transparent; color: #ffb493; font-weight: 900; font-size: 28px; }
.vp-home:has(.vice-home-title) .vp-home-feature:hover { border-color: #ff91b8; }
@media (max-width: 640px) {
  .vp-home:has(.vice-home-title) .vp-home-hero { min-height: 620px; height: 100svh; }
  .vp-home:has(.vice-home-title) .hero-text { font-size: 12px; letter-spacing: .15em; }
  .vp-home:has(.vice-home-title) .vp-home-hero::after { opacity: .45; }
}
@media (prefers-reduced-motion: reduce) {
  .vp-home:has(.vice-home-title) .bg-filter canvas { visibility: hidden; }
}
/* 每章都有停留与过渡行程，鼠标和触摸保持连续滚动。 */
.vp-home.vice-three-screens {
  --vice-stage-height: calc(100svh - var(--vp-nav-height));
  height: calc(100svh - var(--vp-nav-height)); min-height: 0;
  overflow-y: auto; overflow-x: hidden; scroll-snap-type: none;
  overscroll-behavior-y: contain; scrollbar-width: thin; scrollbar-color: #f975a6 #120f25;
}
.vice-three-screens > .vice-screen {
  height: calc(var(--vice-content-height, var(--vice-stage-height)) + var(--vice-stage-height) * .85);
  position: relative;
}
.vice-three-screens > .vice-screen:first-child { background: var(--vice-dusk); }
.vice-three-screens > .vice-screen:nth-child(2) { background: linear-gradient(180deg, var(--vice-dusk), #24162f); }
.vice-three-screens > .vice-screen:last-child {
  background: var(--vice-about-background);
  height: calc(var(--vice-content-height, var(--vice-stage-height)) + var(--vice-stage-height) * .25);
}
.vice-three-screens > .vice-screen > div {
  position: sticky;
  top: 0;
}
.vice-three-screens .vp-home-hero::after {
  transform: scale(var(--vice-palm-scale, 1));
  transform-origin: center bottom;
}
.vp-home.vice-three-screens .vp-home-hero {
  height: calc(100svh - var(--vp-nav-height)); min-height: 0; margin-top: 0;
}
.vice-three-screens .hero-content,
.vice-three-screens .vp-home-features > .container,
.vice-three-screens .vice-about {
  transform: translateY(var(--vice-panel-y, 0px)) scale(var(--vice-panel-scale, 1));
  opacity: var(--vice-panel-opacity, 1); will-change: transform, opacity;
}
.vice-three-screens .hero-container::after {
  position: absolute; bottom: 24px; left: 50%; content: '向下滚动 · 探索内容 ↓';
  width: max-content; color: #fff1f5; font-size: 12px; letter-spacing: .15em; transform: translateX(-50%);
  opacity: var(--vice-hint-opacity, 1);
}
.vp-home.vice-three-screens .vp-home-features,
.vp-home.vice-three-screens .vp-home-custom {
  display: flex; align-items: center; width: 100%;
  min-height: calc(100svh - var(--vp-nav-height)); padding: 48px 72px;
}
.vp-home.vice-three-screens .vp-home-features {
  background:
    radial-gradient(ellipse at 78% 35%, #ad5d8130, transparent 60%),
    radial-gradient(ellipse at 15% 55%, #77539124, transparent 60%),
    linear-gradient(180deg, var(--vice-dusk) 0%, #35243f 40%, #2d2039 76%, #24162f 100%);
}
.vp-home.vice-three-screens .vp-home-features > .container > .title {
  max-width: 850px; margin: 0 auto 24px; font-size: clamp(30px, 4vw, 54px); line-height: 1.2;
}
.vp-home.vice-three-screens .vp-home-features > .container > .description {
  color: #dfc2d3;
  font-size: 14px;
  line-height: 1.9;
}
.vice-three-screens .vp-home-features .items { margin-top: 32px; }
.vice-three-screens .vp-home-feature .box { padding: 24px; }
.vice-three-screens .vp-home-features .item {
  opacity: var(--vice-card-opacity, 1);
  transform: translateY(var(--vice-card-y, 0px));
  will-change: transform, opacity;
}
.vice-three-screens .vp-home-features .item:focus-within {
  opacity: 1;
  transform: none;
}
.vp-home.vice-three-screens .vp-home-custom {
  background: var(--vice-about-background);
}
.vice-about { max-width: 880px; margin: auto; text-align: left; }
.vice-about .vice-eyebrow { color: #ffb493; font-size: 13px; letter-spacing: .24em; }
.vice-about h2 { margin: 28px 0; color: #fff1f5; font-size: clamp(30px, 4.4vw, 62px); line-height: 1.2; border: 0; }
.vice-about-intro { max-width: 660px; color: #e9cddd; font-size: 20px; line-height: 1.8; }
.vice-about-note { color: #bba5bd; }
.vice-about .vice-about-link { display: inline-block; margin-top: 28px; padding: 12px 24px; color: #25132f; background: linear-gradient(110deg, #ffb493, #ff8fbd); border-radius: 30px; text-decoration: none; }
.vp-layout:has(.vice-three-screens) .vp-footer,
.vp-layout:has(.vice-three-screens) .vp-back-to-top,
.vp-layout:has(.vice-three-screens) .vp-sign-down { display: none !important; }
@media (max-width: 640px) {
  .vp-home.vice-three-screens .vice-home-title { font-size: clamp(20px, 5.9vw, 38px); }
  .vp-home.vice-three-screens .hero-content { padding: 48px 20px; }
  .vp-home.vice-three-screens .vice-home-subtitle { margin-bottom: 24px; }
  .vp-home.vice-three-screens .hero-tagline { margin-top: 28px; font-size: 23px; }
  .vp-home.vice-three-screens .hero-text { max-width: 300px; font-size: 12px; letter-spacing: .12em; }
  .vp-home.vice-three-screens .vp-home-features,
  .vp-home.vice-three-screens .vp-home-custom { padding: 36px 36px 56px 24px; }
  .vice-three-screens .vp-home-features .items { margin-top: 20px; }
  .vice-three-screens .vp-home-feature .box { padding: 14px; }
  .vice-three-screens .vp-home-feature .icon { display: none; }
  .vice-three-screens .vp-home-feature .details { font-size: 13px; }
  .vice-about-intro { font-size: 16px; }
}
@media (max-height: 650px) and (min-width: 641px) {
  .vp-home.vice-three-screens .vice-home-title { font-size: min(82px, 5.9vw); }
  .vp-home.vice-three-screens .hero-tagline { margin-top: 20px; font-size: 26px; }
  .vp-home.vice-three-screens .hero-content { padding: 32px 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .vice-three-screens > .vice-screen,
  .vice-three-screens > .vice-screen:last-child { height: auto; min-height: var(--vice-stage-height); }
  .vice-three-screens > .vice-screen > div { position: relative; }
  .vice-three-screens .vp-home-features .item { transform: none; opacity: 1; }
  .vice-three-screens .vp-home-feature { animation: none !important; }
  .vice-three-screens .hero-content,
  .vice-three-screens .vp-home-features > .container,
  .vice-three-screens .vice-about { transform: none; opacity: 1; }
}
</style>
