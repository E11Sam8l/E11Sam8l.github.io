<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vuepress/client'
import CoastalScene from './world/CoastalScene.vue'

type LandmarkId = 'blog' | 'projects' | 'knowledge' | 'about'

type Landmark = {
  id: LandmarkId
  code: string
  name: string
  english: string
  description: string
  path: string
  position: { x: string; y: string }
}

const landmarks: Landmark[] = [
  {
    id: 'blog',
    code: '01',
    name: '电子杂志社',
    english: 'Digital Magazine',
    description: '从建站记录到技术随笔，把正在发生的思考留在时间线上。',
    path: '/blog/',
    position: { x: '29%', y: '52%' },
  },
  {
    id: 'projects',
    code: '02',
    name: '作品展览厅',
    english: 'Digital Exhibition',
    description: '展示已经完成、正在迭代，或值得被重新观看的作品。',
    path: '/projects/',
    position: { x: '71%', y: '49%' },
  },
  {
    id: 'knowledge',
    code: '03',
    name: '数字档案馆',
    english: 'Digital Archive',
    description: '将学习过程整理成可返回、可连接、可以继续生长的知识。',
    path: '/knowledge/',
    position: { x: '36%', y: '75%' },
  },
  {
    id: 'about',
    code: '04',
    name: '个人工作室',
    english: 'Studio',
    description: '了解 Laplace and E11SAM8L，以及这个数字空间为何存在。',
    path: '/about/',
    position: { x: '67%', y: '73%' },
  },
]

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const selectedId = ref<LandmarkId | null>(null)
const selected = computed(() => landmarks.find(item => item.id === selectedId.value) ?? null)
const selectedTrigger = ref<HTMLElement | null>(null)
const journeyComplete = ref(false)
const activeLandmarkIndex = ref(0)

let frame = 0
let motionQuery: MediaQueryList | null = null

const clamp = (value: number) => Math.max(0, Math.min(1, value))

function setJourneyProgress(value: number) {
  const host = root.value
  if (!host) return

  const progress = clamp(value)
  const screenPosition = Math.min(3.999, progress * landmarks.length)
  const screenIndex = Math.floor(screenPosition)
  const screenOffset = screenPosition - screenIndex
  const cameraTargets = window.innerWidth <= 760
    ? [
        { x: '51%', y: '-16%', zoom: 1.3 },
        { x: '-21%', y: '-12%', zoom: 1.3 },
        { x: '44%', y: '-35%', zoom: 1.28 },
        { x: '-15%', y: '-32%', zoom: 1.26 },
      ]
    : [
        { x: '39%', y: '-4%', zoom: 1.46 },
        { x: '-22%', y: '0%', zoom: 1.46 },
        { x: '31%', y: '-36%', zoom: 1.42 },
        { x: '-14%', y: '-32%', zoom: 1.38 },
      ]
  const currentCamera = cameraTargets[screenIndex]
  const nextCamera = cameraTargets[Math.min(3, screenIndex + 1)]
  const cameraMix = clamp((screenOffset - 0.72) / 0.28)
  const lerp = (from: number, to: number) => from + (to - from) * cameraMix
  const currentX = Number.parseFloat(currentCamera.x)
  const currentY = Number.parseFloat(currentCamera.y)
  const nextX = Number.parseFloat(nextCamera.x)
  const nextY = Number.parseFloat(nextCamera.y)
  const routeProgress = clamp((progress + 0.04) / 0.96)
  const reveals = landmarks.map((_, index) => index === screenIndex ? 1 : 0)

  host.style.setProperty('--journey-progress', progress.toFixed(4))
  host.style.setProperty('--route-progress', routeProgress.toFixed(4))
  host.style.setProperty('--camera-x', `${lerp(currentX, nextX).toFixed(2)}%`)
  host.style.setProperty('--camera-y', `${lerp(currentY, nextY).toFixed(2)}%`)
  host.style.setProperty('--map-zoom', lerp(currentCamera.zoom, nextCamera.zoom).toFixed(4))
  reveals.forEach((reveal, index) => host.style.setProperty(`--landmark-${index + 1}-opacity`, reveal.toFixed(4)))
  activeLandmarkIndex.value = screenIndex
  journeyComplete.value = screenIndex === landmarks.length - 1
  host.dataset.chapter = `landmark-${screenIndex + 1}`
}

function renderJourney() {
  frame = 0
  if (!track.value || !root.value || motionQuery?.matches) return

  const range = Math.max(1, root.value.offsetHeight - window.innerHeight)
  const progress = -root.value.getBoundingClientRect().top / range
  setJourneyProgress(progress)
}

function scheduleJourney() {
  if (!frame) frame = requestAnimationFrame(renderJourney)
}

function updateMotionMode() {
  if (!root.value || !motionQuery) return
  root.value.classList.toggle('is-reduced', motionQuery.matches)
  if (motionQuery.matches) {
    setJourneyProgress(0)
    activeLandmarkIndex.value = 0
    journeyComplete.value = false
    root.value.dataset.chapter = 'landmark-1'
  } else {
    scheduleJourney()
  }
}

function selectLandmark(landmark: Landmark, event?: MouseEvent) {
  selectedId.value = landmark.id
  selectedTrigger.value = event?.currentTarget as HTMLElement | null
  nextTick(() => root.value?.querySelector<HTMLElement>('.landmark-panel .panel-close')?.focus())
}

function closePanel() {
  selectedId.value = null
  nextTick(() => selectedTrigger.value?.focus())
}

function onWindowKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedId.value) {
    event.preventDefault()
    closePanel()
  }
}

function onLandmarkKeydown(event: KeyboardEvent, index: number) {
  if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return
  event.preventDefault()
  const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1
  const nextIndex = (index + direction + landmarks.length) % landmarks.length
  root.value?.querySelectorAll<HTMLButtonElement>('.landmark-hit')[nextIndex]?.focus()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  window.addEventListener('scroll', scheduleJourney, { passive: true })
  window.addEventListener('resize', scheduleJourney, { passive: true })
  window.addEventListener('keydown', onWindowKeydown)
  motionQuery.addEventListener?.('change', updateMotionMode)
  updateMotionMode()
})

onUnmounted(() => {
  window.removeEventListener('scroll', scheduleJourney)
  window.removeEventListener('resize', scheduleJourney)
  window.removeEventListener('keydown', onWindowKeydown)
  motionQuery?.removeEventListener?.('change', updateMotionMode)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <section ref="root" class="coastal-district" aria-labelledby="world-title">
    <div class="journey-stage">
      <div class="map-camera">
        <div class="scene-frame" aria-hidden="true">
          <CoastalScene />
        </div>
        <svg class="map-route" viewBox="0 0 1440 900" aria-hidden="true" focusable="false">
          <path class="map-route-base" d="M720 820C610 700 450 600 418 468C600 420 860 425 1037 468C915 555 690 640 533 693C690 710 840 710 979 684" pathLength="1" />
          <path class="map-route-progress" d="M720 820C610 700 450 600 418 468C600 420 860 425 1037 468C915 555 690 640 533 693C690 710 840 710 979 684" pathLength="1" />
          <g class="map-route-stops">
            <circle cx="418" cy="468" r="8" />
            <circle cx="1037" cy="468" r="8" />
            <circle cx="533" cy="693" r="8" />
            <circle cx="979" cy="684" r="8" />
          </g>
        </svg>
        <div class="landmark-layer" aria-label="数字街区入口">
          <button
            v-for="(landmark, index) in landmarks"
            :key="landmark.id"
            class="landmark-hit"
            :class="{ 'is-selected': selectedId === landmark.id, 'is-visible': activeLandmarkIndex === index }"
            :style="{ '--landmark-x': landmark.position.x, '--landmark-y': landmark.position.y }"
            type="button"
            :aria-label="`查看${landmark.name}`"
            :aria-expanded="selectedId === landmark.id"
            :aria-hidden="activeLandmarkIndex !== index"
            :tabindex="activeLandmarkIndex === index ? 0 : -1"
            aria-controls="landmark-panel"
            @click="selectLandmark(landmark, $event)"
            @keydown="onLandmarkKeydown($event, index)"
          >
            <span class="landmark-line" aria-hidden="true" />
            <span class="landmark-index">{{ landmark.code }}</span>
            <span class="landmark-label">
              <strong>{{ landmark.name }}</strong>
              <small>{{ landmark.english }}</small>
            </span>
          </button>
        </div>
      </div>
      <div class="scene-vignette" aria-hidden="true" />
      <div class="scene-grain" aria-hidden="true" />

      <header class="world-header">
        <a class="world-mark" :href="withBase('/')" aria-label="返回 West Coast Digital World 首页">
          <span class="world-mark-symbol">W</span>
          <span>West Coast<br><i>Digital World</i></span>
        </a>
        <p class="world-coordinate">34° 01′ N / 118° 29′ W</p>
        <p class="world-state">A PERSONAL DIGITAL SPACE</p>
      </header>

      <div
        v-for="(landmark, index) in landmarks"
        :key="`copy-${landmark.id}`"
        class="stage-copy landmark-copy"
        :class="{ 'is-active': activeLandmarkIndex === index }"
        :aria-hidden="activeLandmarkIndex !== index"
      >
        <p v-if="index === 0" class="stage-kicker">LAPLACE <span>AND</span> E11SAM8L / 01</p>
        <p v-else class="stage-kicker">{{ landmark.code }} / {{ landmark.english }}</p>
        <h1 v-if="index === 0" id="world-title">{{ landmark.name }}<br><em>{{ landmark.english }}</em></h1>
        <h2 v-else>{{ landmark.name }}<br><em>{{ landmark.english }}</em></h2>
        <p class="stage-description">{{ landmark.description }}</p>
        <a class="stage-entry" :href="withBase(landmark.path)">进入{{ landmark.name }} <span aria-hidden="true">↗</span></a>
        <p class="stage-index">{{ landmark.code }} / {{ index === 0 ? 'FIRST STOP' : 'ON THE COAST' }}</p>
      </div>

      <Transition name="landmark-panel">
        <aside
          v-if="selected"
          id="landmark-panel"
          class="landmark-panel"
          role="dialog"
          aria-modal="false"
          :aria-labelledby="`landmark-title-${selected.id}`"
        >
          <button class="panel-close" type="button" aria-label="关闭地标介绍" @click="closePanel">×</button>
          <p class="panel-code">{{ selected.code }} / {{ selected.english }}</p>
          <h3 :id="`landmark-title-${selected.id}`">{{ selected.name }}</h3>
          <p>{{ selected.description }}</p>
          <a class="panel-entry" :href="withBase(selected.path)">进入{{ selected.name }} <span aria-hidden="true">↗</span></a>
        </aside>
      </Transition>

      <div class="journey-footer">
        <p class="scroll-cue"><span aria-hidden="true" />{{ journeyComplete ? '街区地图 / 选择入口' : '向下滚动，沿路线进入街区' }}</p>
        <nav class="landmark-rail" aria-label="快速选择街区入口">
          <span>EXPLORE</span>
          <button
            v-for="landmark in landmarks"
            :key="`rail-${landmark.id}`"
            type="button"
            :class="{ 'is-active': selectedId === landmark.id }"
            :aria-label="`选择${landmark.name}`"
            :aria-pressed="selectedId === landmark.id"
            @click="selectLandmark(landmark, $event)"
          >
            {{ landmark.code }}
          </button>
        </nav>
      </div>
    </div>

    <div ref="track" class="journey-track" aria-hidden="true">
      <div class="journey-waypoint" />
      <div class="journey-waypoint" />
      <div class="journey-waypoint" />
      <div class="journey-waypoint" />
    </div>

    <noscript>
      <nav class="district-noscript" aria-label="首页入口">
        <a href="blog/">电子杂志社</a>
        <a href="projects/">作品展览厅</a>
        <a href="knowledge/">数字档案馆</a>
        <a href="about/">个人工作室</a>
      </nav>
    </noscript>
  </section>
</template>

<style scoped>
:global(.vp-home:has(.coastal-district)) {
  background: #0b151f;
}

:global(.vp-home:has(.coastal-district) .vp-home-custom) {
  padding: 0 !important;
}

:global(.vp-home:has(.coastal-district) .vp-home-custom > .container),
:global(.vp-home:has(.coastal-district) .vp-home-custom .vp-doc) {
  max-width: none;
  padding: 0;
}

:global(.vp-layout:has(.coastal-district)) {
  --vp-c-bg: #0b151f;
  --vp-c-bg-alt: #101f2c;
  --vp-c-bg-elv: #142a38;
  --vp-c-text-1: #ece7dc;
  --vp-c-text-2: #b7c0be;
  --vp-c-text-3: #849391;
  --vp-c-divider: rgb(220 225 214 / 0.14);
  --vp-c-border: rgb(220 225 214 / 0.18);
}

:global(.vp-layout:has(.coastal-district) .vp-nav) {
  --vp-c-bg: #0b151f;
  --vp-c-text-1: #ece7dc;
  --vp-c-text-2: #b7c0be;
  --vp-c-divider: rgb(220 225 214 / 0.14);
  background: rgb(11 21 31 / 0.78);
  border-bottom-color: rgb(220 225 214 / 0.14);
}

.coastal-district {
  --coast-ink: #0b151f;
  --coast-paper: #f2eadc;
  --coast-muted: #b8c2bf;
  --coast-coral: #d97963;
  --coast-aqua: #9bc6c0;
  --journey-progress: 0;
  --route-progress: 0;
  --camera-x: 0%;
  --camera-y: 0%;
  --map-zoom: 1.16;
  --landmark-1-opacity: 0;
  --landmark-2-opacity: 0;
  --landmark-3-opacity: 0;
  --landmark-4-opacity: 0;
  position: relative;
  min-height: 340svh;
  overflow: clip;
  color: var(--coast-paper);
  background: var(--coast-ink);
  isolation: isolate;
}

.journey-stage {
  position: sticky;
  z-index: 1;
  top: var(--vp-nav-height, 64px);
  height: calc(100svh - var(--vp-nav-height, 64px));
  min-height: 620px;
  overflow: hidden;
  background: var(--coast-ink);
  isolation: isolate;
}

.map-camera,
.scene-frame,
.scene-vignette,
.scene-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.map-camera {
  z-index: 2;
  transform: translate3d(var(--camera-x), var(--camera-y), 0) scale(var(--map-zoom));
  transform-origin: 50% 52%;
  transition: transform 160ms linear;
}

.scene-frame {
  z-index: -3;
  transform: none;
}

.map-route {
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  transform: none;
}

.map-route-base,
.map-route-progress {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.map-route-base {
  stroke: rgb(225 220 196 / 0.28);
  stroke-width: 3;
  stroke-dasharray: 0.012 0.018;
}

.map-route-progress {
  stroke: var(--coast-coral);
  stroke-width: 5;
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--route-progress));
  filter: drop-shadow(0 0 8px rgb(217 121 99 / 0.35));
}

.map-route-stops circle {
  fill: var(--coast-paper);
  stroke: var(--coast-coral);
  stroke-width: 4;
  opacity: 0.26;
  transform-box: fill-box;
  transform-origin: center;
}

.map-route-stops circle:nth-child(1) { opacity: var(--landmark-1-opacity); }
.map-route-stops circle:nth-child(2) { opacity: var(--landmark-2-opacity); }
.map-route-stops circle:nth-child(3) { opacity: var(--landmark-3-opacity); }
.map-route-stops circle:nth-child(4) { opacity: var(--landmark-4-opacity); }

:deep(.coastal-scene) {
  display: block;
  width: 100%;
  height: 100%;
}

.scene-vignette {
  z-index: -1;
  background:
    linear-gradient(180deg, rgb(5 12 19 / 0.72), transparent 20%, transparent 68%, rgb(5 12 19 / 0.82)),
    linear-gradient(90deg, rgb(5 12 19 / 0.54), transparent 25%, transparent 78%, rgb(5 12 19 / 0.42));
}

.scene-grain {
  z-index: 4;
  opacity: 0.12;
  mix-blend-mode: soft-light;
  background-image: repeating-radial-gradient(circle at 20% 30%, rgb(255 255 255 / 0.55) 0 0.6px, transparent 0.8px 3px);
  background-size: 4px 4px;
}

.world-header,
.stage-copy,
.journey-footer {
  position: absolute;
  z-index: 5;
}

.world-header {
  top: clamp(22px, 4vw, 52px);
  right: clamp(24px, 5.8vw, 92px);
  left: clamp(24px, 5.8vw, 92px);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  color: var(--coast-muted);
  font-size: 10px;
  letter-spacing: 0.16em;
  line-height: 1.35;
}

.world-mark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--coast-paper);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 1.15;
  text-decoration: none;
  text-transform: uppercase;
}

.world-mark-symbol {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  color: var(--coast-ink);
  font-family: Georgia, serif;
  font-size: 16px;
  letter-spacing: 0;
  background: var(--coast-paper);
}

.world-mark i {
  color: var(--coast-aqua);
  font-style: normal;
}

.world-coordinate,
.world-state {
  margin: 4px 0 0;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
}

.world-state {
  color: rgb(242 234 220 / 0.64);
  text-align: right;
}

.stage-copy {
  left: clamp(24px, 11vw, 176px);
  max-width: min(680px, calc(100% - 48px));
  pointer-events: none;
}

.landmark-copy {
  top: 22%;
  max-width: min(480px, calc(100% - 48px));
  opacity: 0;
  transform: translateY(22px);
  pointer-events: none;
  transition: opacity 240ms ease, transform 240ms ease;
}

.landmark-copy.is-active {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}

.stage-kicker,
.stage-index,
.panel-code,
.landmark-index,
.landmark-label small,
.scroll-cue,
.landmark-rail span,
.landmark-rail button {
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  letter-spacing: 0.14em;
}

.stage-kicker {
  margin: 0 0 22px;
  color: var(--coast-aqua);
  font-size: 11px;
  font-weight: 600;
}

.stage-kicker span {
  color: rgb(242 234 220 / 0.54);
  font-size: 9px;
}

.stage-copy h1,
.stage-copy h2 {
  margin: 0;
  color: var(--coast-paper);
  font-family: 'Iowan Old Style', 'Baskerville', 'Songti SC', 'Noto Serif SC', serif;
  font-weight: 400;
  letter-spacing: -0.065em;
  line-height: 1.04;
}

.stage-copy h1 {
  font-size: clamp(46px, 7.2vw, 110px);
}

.stage-copy h2 {
  font-size: clamp(42px, 6vw, 86px);
}

.stage-copy h1 em,
.stage-copy h2 em {
  color: var(--coast-coral);
  font-style: normal;
}

.stage-description {
  max-width: 350px;
  margin: 28px 0 0;
  color: rgb(242 234 220 / 0.78);
  font-size: 14px;
  line-height: 1.9;
}

.stage-index {
  margin: 38px 0 0;
  color: rgb(242 234 220 / 0.48);
  font-size: 10px;
}

.stage-entry {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 25px;
  padding-bottom: 5px;
  color: var(--coast-paper);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-decoration: none;
  border-bottom: 1px solid rgb(242 234 220 / 0.6);
  transition: color 180ms ease, border-color 180ms ease;
}

.stage-entry:hover,
.stage-entry:focus-visible {
  color: var(--coast-aqua);
  border-color: var(--coast-aqua);
}

.stage-entry:focus-visible {
  outline: 1px solid var(--coast-aqua);
  outline-offset: 5px;
}

.landmark-layer {
  position: absolute;
  z-index: 6;
  inset: 0;
  opacity: 1;
  pointer-events: none;
  transition: none;
}

.landmark-hit {
  position: absolute;
  top: var(--landmark-y);
  left: var(--landmark-x);
  display: flex;
  align-items: center;
  gap: 12px;
  width: max-content;
  max-width: 220px;
  padding: 8px 0;
  color: var(--coast-paper);
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
  transform: translate(-50%, -50%);
  transition: color 180ms ease, transform 180ms ease;
  pointer-events: auto;
}

.landmark-hit:nth-child(1) { opacity: var(--landmark-1-opacity); }
.landmark-hit:nth-child(2) { opacity: var(--landmark-2-opacity); }
.landmark-hit:nth-child(3) { opacity: var(--landmark-3-opacity); }
.landmark-hit:nth-child(4) { opacity: var(--landmark-4-opacity); }
.landmark-hit:not(.is-visible) { pointer-events: none; }

.landmark-hit:hover,
.landmark-hit:focus-visible,
.landmark-hit.is-selected {
  color: #fff;
  transform: translate(-50%, -50%) scale(1.04);
}

.landmark-hit:focus-visible {
  outline: 1px solid var(--coast-aqua);
  outline-offset: 8px;
}

.landmark-line {
  position: relative;
  display: block;
  width: 34px;
  height: 1px;
  background: var(--coast-coral);
  box-shadow: 0 0 0 4px rgb(11 21 31 / 0.36);
}

.landmark-line::after {
  position: absolute;
  top: 50%;
  right: 0;
  width: 6px;
  height: 6px;
  content: '';
  background: var(--coast-coral);
  border-radius: 50%;
  transform: translate(50%, -50%);
}

.landmark-index {
  color: var(--coast-coral);
  font-size: 10px;
}

.landmark-label {
  display: grid;
  gap: 4px;
}

.landmark-label strong {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
}

.landmark-label small {
  color: rgb(242 234 220 / 0.6);
  font-size: 8px;
  line-height: 1;
}

.landmark-panel {
  position: absolute;
  z-index: 8;
  right: clamp(24px, 7vw, 112px);
  bottom: clamp(74px, 8vw, 112px);
  width: min(390px, calc(100% - 48px));
  padding: 26px 30px 28px;
  color: var(--coast-ink);
  background: rgb(242 234 220 / 0.96);
  border-top: 3px solid var(--coast-coral);
  box-shadow: 0 24px 70px rgb(2 9 15 / 0.42);
}

.panel-close {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 30px;
  height: 30px;
  padding: 0;
  color: rgb(11 21 31 / 0.58);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.panel-close:focus-visible,
.panel-entry:focus-visible,
.landmark-rail button:focus-visible {
  outline: 2px solid var(--coast-aqua);
  outline-offset: 3px;
}

.panel-code {
  margin: 0 36px 18px 0;
  color: #b45849;
  font-size: 10px;
  font-weight: 600;
}

.landmark-panel h3 {
  margin: 0;
  color: var(--coast-ink);
  font-family: 'Iowan Old Style', 'Baskerville', 'Songti SC', 'Noto Serif SC', serif;
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -0.05em;
  line-height: 1.05;
}

.landmark-panel p:not(.panel-code) {
  max-width: 310px;
  margin: 16px 0 22px;
  color: rgb(11 21 31 / 0.66);
  font-size: 13px;
  line-height: 1.8;
}

.panel-entry {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 4px;
  color: var(--coast-ink);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid var(--coast-ink);
}

.panel-entry:hover {
  color: #b45849;
  border-bottom-color: #b45849;
}

.journey-footer {
  right: clamp(24px, 5.8vw, 92px);
  bottom: 28px;
  left: clamp(24px, 5.8vw, 92px);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.scroll-cue {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  margin: 0;
  color: rgb(242 234 220 / 0.65);
  font-size: 9px;
}

.scroll-cue span {
  display: block;
  width: 38px;
  height: 1px;
  background: var(--coast-aqua);
}

.landmark-rail {
  display: flex;
  align-items: center;
  gap: 8px;
}

.landmark-rail span {
  margin-right: 8px;
  color: rgb(242 234 220 / 0.54);
  font-size: 9px;
}

.landmark-rail button {
  width: 28px;
  height: 28px;
  padding: 0;
  color: rgb(242 234 220 / 0.76);
  font-size: 9px;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgb(242 234 220 / 0.28);
  border-radius: 50%;
  transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease;
}

.landmark-rail button:hover,
.landmark-rail button.is-active {
  color: var(--coast-ink);
  background: var(--coast-paper);
  border-color: var(--coast-paper);
}

.journey-track {
  position: relative;
  z-index: 0;
  display: grid;
  grid-template-rows: repeat(4, 100svh);
  height: 400svh;
  pointer-events: none;
}

.journey-waypoint {
  border: 0;
}

.district-noscript {
  position: absolute;
  z-index: 10;
  right: 24px;
  bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px;
  background: var(--coast-paper);
}

.district-noscript a {
  color: var(--coast-ink);
}

.landmark-panel-enter-active,
.landmark-panel-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.landmark-panel-enter-from,
.landmark-panel-leave-to {
  opacity: 0;
  transform: translateY(14px);
}

@media (max-width: 760px) {
  .journey-stage {
    min-height: 620px;
  }

  .world-header {
    right: 20px;
    left: 20px;
  }

  .world-coordinate {
    display: none;
  }

  .world-state {
    max-width: 120px;
    margin-top: 4px;
    text-align: right;
  }

  .stage-copy {
    top: 23%;
    left: 24px;
    max-width: calc(100% - 48px);
  }

  .stage-copy h1 {
    font-size: clamp(42px, 12vw, 70px);
  }

  .stage-copy h2 {
    font-size: clamp(40px, 11vw, 66px);
  }

  .stage-description {
    max-width: 260px;
    margin-top: 22px;
    font-size: 13px;
  }

  .landmark-hit {
    gap: 7px;
    max-width: 150px;
  }

  .landmark-line {
    width: 18px;
  }

  .landmark-label strong {
    font-size: 11px;
  }

  .landmark-label small {
    font-size: 7px;
  }

  .landmark-hit:nth-child(1) { top: 53%; left: 22%; }
  .landmark-hit:nth-child(2) { top: 51%; left: 78%; }
  .landmark-hit:nth-child(3) { top: 73%; left: 28%; }
  .landmark-hit:nth-child(4) { top: 71%; left: 73%; }

  .landmark-panel {
    right: 20px;
    bottom: 67px;
    left: 20px;
    width: auto;
    padding: 22px 22px 24px;
  }

  .landmark-panel h3 {
    font-size: 29px;
  }

  .journey-footer {
    right: 20px;
    bottom: 21px;
    left: 20px;
  }

  .scroll-cue {
    font-size: 8px;
  }

  .landmark-rail span {
    display: none;
  }
}

@media (max-width: 430px) {
  .world-mark {
    font-size: 8px;
  }

  .world-mark-symbol {
    width: 23px;
    height: 23px;
    font-size: 14px;
  }

  .world-state {
    max-width: 92px;
    font-size: 8px;
  }

  .stage-kicker {
    margin-bottom: 16px;
    font-size: 9px;
  }

  .stage-copy h1 {
    font-size: 42px;
  }

  .stage-copy h2 {
    font-size: 40px;
  }

  .landmark-label small {
    display: none;
  }

  .scroll-cue {
    max-width: 120px;
    line-height: 1.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .coastal-district.is-reduced {
    min-height: 0;
  }

  .coastal-district.is-reduced .journey-stage {
    position: relative;
    top: auto;
    height: min(760px, 100svh);
  }

  .coastal-district.is-reduced .journey-track {
    display: none;
  }

  .coastal-district.is-reduced .map-camera {
    transform: none;
  }

  .coastal-district.is-reduced .landmark-layer {
    opacity: 1;
  }

  .coastal-district.is-reduced .landmark-copy {
    transition: none;
  }

  .coastal-district.is-reduced .landmark-copy.is-active {
    opacity: 1;
    transform: none;
  }

  .coastal-district.is-reduced .landmark-copy:not(.is-active) {
    display: none;
  }

  .coastal-district.is-reduced .scroll-cue {
    visibility: hidden;
  }

  .coastal-district.is-reduced .landmark-copy,
  .coastal-district.is-reduced .map-camera,
  .coastal-district.is-reduced .landmark-layer,
  .coastal-district.is-reduced .landmark-panel-enter-active,
  .coastal-district.is-reduced .landmark-panel-leave-active {
    transition: none;
  }
}
</style>
