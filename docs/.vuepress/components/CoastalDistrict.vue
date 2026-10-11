<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vuepress/client'
import CoastalScene from './world/CoastalScene.vue'

type LandmarkId = 'blog' | 'projects' | 'knowledge' | 'about'

type Landmark = {
  id: LandmarkId
  code: string
  name: string
  short: string
  description: string
  path: string
  position: { x: string; y: string }
}

const landmarks: Landmark[] = [
  {
    id: 'blog',
    code: '01',
    name: '电子杂志社',
    short: '博客 / JOURNAL',
    description: '个人文章、技术记录与值得留下来的思考。',
    path: '/blog/',
    position: { x: '29%', y: '49%' },
  },
  {
    id: 'projects',
    code: '02',
    name: '作品展览厅',
    short: '项目 / WORKS',
    description: '查看个人及合作项目，了解想法如何被做成作品。',
    path: '/projects/',
    position: { x: '70%', y: '47%' },
  },
  {
    id: 'knowledge',
    code: '03',
    name: '数字档案馆',
    short: '知识库 / ARCHIVE',
    description: '整理学习笔记、知识专题与持续积累的资料索引。',
    path: '/knowledge/',
    position: { x: '36%', y: '71%' },
  },
  {
    id: 'about',
    code: '04',
    name: '个人工作室',
    short: '关于 / STUDIO',
    description: 'Laplace and E11SAM8L 的共同入口，个人档案将逐步补充。',
    path: '/about/',
    position: { x: '66%', y: '70%' },
  },
]

const root = ref<HTMLElement | null>(null)
const preview = ref<HTMLElement | null>(null)
const selectedId = ref<LandmarkId | null>(null)
const selected = computed(() => landmarks.find(item => item.id === selectedId.value) ?? null)

function selectLandmark(landmark: Landmark) {
  selectedId.value = landmark.id
  nextTick(() => preview.value?.querySelector<HTMLButtonElement>('.preview-close')?.focus())
}

function closePreview() {
  selectedId.value = null
}

function onWindowKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedId.value)
    closePreview()
}

onMounted(() => window.addEventListener('keydown', onWindowKeydown))
onUnmounted(() => window.removeEventListener('keydown', onWindowKeydown))
</script>

<template>
  <section
    ref="root"
    class="coastal-district"
    aria-labelledby="district-title"
    tabindex="-1"
    @keydown.esc.stop.prevent="closePreview"
  >
    <header class="district-heading">
      <p class="district-kicker">THE COAST / OPEN DISTRICT</p>
      <h2 id="district-title">沿海街区</h2>
      <p>向下进入我们的数字街区，选择一处地标开始探索。</p>
    </header>

    <div class="world-shell">
      <div class="scene-frame" aria-hidden="true">
        <CoastalScene />
      </div>

      <div class="landmark-layer" aria-label="街区入口">
        <button
          v-for="landmark in landmarks"
          :key="landmark.id"
          class="landmark-hit"
          :class="{ 'is-selected': selectedId === landmark.id }"
          :style="{ '--landmark-x': landmark.position.x, '--landmark-y': landmark.position.y }"
          type="button"
          :aria-label="`查看${landmark.name}`"
          :aria-pressed="selectedId === landmark.id"
          @click="selectLandmark(landmark)"
        >
          <span class="landmark-pin" aria-hidden="true"><i /></span>
          <span class="landmark-label">
            <small>{{ landmark.code }}</small>
            <strong>{{ landmark.name }}</strong>
            <em>{{ landmark.short }}</em>
          </span>
        </button>
      </div>

      <Transition name="district-preview">
        <aside
          v-if="selected"
          ref="preview"
          class="landmark-preview"
          role="dialog"
          aria-modal="false"
          :aria-labelledby="`preview-${selected.id}`"
        >
          <button class="preview-close" type="button" aria-label="关闭地标介绍" @click="closePreview">×</button>
          <p class="preview-code">{{ selected.code }} / {{ selected.short }}</p>
          <h3 :id="`preview-${selected.id}`">{{ selected.name }}</h3>
          <p>{{ selected.description }}</p>
          <a class="preview-enter" :href="withBase(selected.path)">进入 {{ selected.name }} <span aria-hidden="true">↗</span></a>
        </aside>
      </Transition>
    </div>

    <nav class="landmark-rail" aria-label="地标快速选择">
      <span>EXPLORE</span>
      <button
        v-for="landmark in landmarks"
        :key="`rail-${landmark.id}`"
        type="button"
        :class="{ 'is-active': selectedId === landmark.id }"
        :aria-label="`选择${landmark.name}`"
        :aria-pressed="selectedId === landmark.id"
        @click="selectLandmark(landmark)"
      >
        {{ landmark.code }}
      </button>
    </nav>

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
.coastal-district {
  --district-night: #0d1626;
  --district-blue: #172d43;
  --district-sand: #f4c1a6;
  --district-coral: #ff9b7a;
  --district-aqua: #82d2ce;
  position: relative;
  width: 100%;
  min-height: clamp(620px, calc(100svh - var(--vp-nav-height)), 820px);
  overflow: hidden;
  color: #fff5ee;
  background: var(--district-night);
  isolation: isolate;
}

.district-heading {
  position: absolute;
  z-index: 4;
  top: clamp(24px, 5vw, 62px);
  left: clamp(22px, 7vw, 112px);
  max-width: 380px;
  pointer-events: none;
}

.district-kicker,
.preview-code,
.landmark-label small,
.landmark-label em,
.landmark-rail span,
.landmark-rail button {
  font-family: var(--vp-font-family-mono, ui-monospace, SFMono-Regular, Consolas, monospace);
  letter-spacing: 0.12em;
}

.district-kicker {
  margin: 0 0 10px;
  color: var(--district-aqua);
  font-size: 11px;
  font-weight: 650;
}

.district-heading h2 {
  margin: 0;
  color: #fff5ee;
  font-family: var(--vp-font-family-base);
  font-size: clamp(30px, 4.5vw, 62px);
  font-weight: 650;
  letter-spacing: -0.045em;
  line-height: 1;
}

.district-heading p:last-child {
  max-width: 290px;
  margin: 16px 0 0;
  color: rgb(240 218 210 / 0.75);
  font-size: 13px;
  line-height: 1.8;
}

.world-shell,
.scene-frame,
.landmark-layer {
  position: absolute;
  inset: 0;
}

.scene-frame {
  z-index: 1;
  pointer-events: none;
}

.landmark-layer {
  z-index: 3;
  pointer-events: none;
}

.landmark-hit {
  position: absolute;
  top: var(--landmark-y);
  left: var(--landmark-x);
  display: flex;
  align-items: center;
  gap: 9px;
  width: max-content;
  max-width: 180px;
  padding: 7px 9px;
  color: #fff5ee;
  text-align: left;
  cursor: pointer;
  background: rgb(10 22 34 / 0.28);
  border: 1px solid transparent;
  border-radius: 4px;
  transform: translate(-50%, -50%);
  transition: background-color 220ms ease, border-color 220ms ease, transform 220ms ease, box-shadow 220ms ease;
  pointer-events: auto;
}

.landmark-hit:hover,
.landmark-hit:focus-visible,
.landmark-hit.is-selected {
  background: rgb(10 22 34 / 0.78);
  border-color: rgb(130 210 206 / 0.75);
  box-shadow: 0 10px 30px rgb(4 12 22 / 0.32);
  transform: translate(-50%, -50%) scale(1.04);
}

.landmark-hit:focus-visible,
.landmark-rail button:focus-visible,
.preview-close:focus-visible,
.preview-enter:focus-visible {
  outline: 2px solid var(--district-sand);
  outline-offset: 3px;
}

.landmark-pin {
  display: grid;
  flex: 0 0 12px;
  place-items: center;
  width: 12px;
  height: 12px;
  border: 1px solid var(--district-aqua);
  border-radius: 50%;
}

.landmark-pin i {
  display: block;
  width: 4px;
  height: 4px;
  background: var(--district-sand);
  border-radius: 50%;
}

.landmark-label {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.landmark-label small {
  color: var(--district-sand);
  font-size: 9px;
  line-height: 1;
}

.landmark-label strong {
  font-size: 13px;
  font-weight: 650;
  line-height: 1.25;
  white-space: nowrap;
}

.landmark-label em {
  color: rgb(226 244 239 / 0.62);
  font-size: 8px;
  font-style: normal;
  line-height: 1.2;
  white-space: nowrap;
}

.landmark-preview {
  position: absolute;
  z-index: 6;
  right: clamp(20px, 7vw, 112px);
  bottom: clamp(66px, 7vw, 96px);
  width: min(360px, calc(100% - 40px));
  padding: 23px 26px 25px;
  color: #132034;
  background: rgb(247 239 226 / 0.94);
  border-left: 4px solid var(--district-coral);
  box-shadow: 0 24px 55px rgb(3 12 22 / 0.38);
}

.preview-close {
  position: absolute;
  top: 11px;
  right: 13px;
  width: 30px;
  height: 30px;
  padding: 0;
  color: #526271;
  font-size: 25px;
  line-height: 1;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.preview-code {
  margin: 0 28px 13px 0;
  color: #b55240;
  font-size: 10px;
  font-weight: 650;
}

.landmark-preview h3 {
  margin: 0;
  color: #132034;
  font-size: 25px;
  letter-spacing: -0.035em;
}

.landmark-preview p:not(.preview-code) {
  margin: 11px 0 20px;
  color: #526271;
  font-size: 13px;
  line-height: 1.8;
}

.preview-enter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  color: #fff9f2;
  font-size: 12px;
  font-weight: 650;
  text-decoration: none;
  background: #162c43;
  border: 1px solid #162c43;
  transition: background-color 180ms ease, color 180ms ease;
}

.preview-enter:hover {
  color: #162c43;
  background: transparent;
}

.landmark-rail {
  position: absolute;
  z-index: 5;
  right: clamp(20px, 7vw, 112px);
  bottom: 28px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.landmark-rail span {
  margin-right: 4px;
  color: rgb(228 244 239 / 0.72);
  font-size: 9px;
}

.landmark-rail button {
  width: 30px;
  height: 30px;
  padding: 0;
  color: rgb(234 244 239 / 0.7);
  font-size: 10px;
  cursor: pointer;
  background: rgb(9 22 35 / 0.58);
  border: 1px solid rgb(130 210 206 / 0.32);
  border-radius: 50%;
  transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease;
}

.landmark-rail button:hover,
.landmark-rail button.is-active {
  color: #102336;
  background: var(--district-aqua);
  border-color: var(--district-aqua);
}

.district-preview-enter-active,
.district-preview-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.district-preview-enter-from,
.district-preview-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.district-noscript {
  position: absolute;
  z-index: 7;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px;
  background: #f7efe2;
}

.district-noscript a {
  color: #162c43;
}

:global(.vp-home.vice-three-screens .vp-home-custom) {
  padding: 0 !important;
}

:global(.vp-home.vice-three-screens .vp-home-custom > .container) {
  max-width: none !important;
  padding: 0 !important;
}

:global(.vp-home.vice-three-screens .vp-home-custom .vp-doc) {
  max-width: none;
  padding: 0;
}

@media (max-width: 720px) {
  .coastal-district {
    min-height: 700px;
  }

  .district-heading {
    top: 22px;
    left: 20px;
  }

  .district-heading h2 {
    font-size: 36px;
  }

  .district-heading p:last-child {
    max-width: 240px;
    margin-top: 10px;
    font-size: 12px;
  }

  .landmark-hit {
    max-width: 140px;
    padding: 6px;
  }

  .landmark-label strong {
    font-size: 11px;
  }

  .landmark-label em {
    font-size: 7px;
  }

  .landmark-hit:nth-child(1) { top: 51%; left: 23%; }
  .landmark-hit:nth-child(2) { top: 50%; left: 77%; }
  .landmark-hit:nth-child(3) { top: 69%; left: 25%; }
  .landmark-hit:nth-child(4) { top: 68%; left: 76%; }

  .landmark-preview {
    right: 20px;
    bottom: 74px;
    left: 20px;
    width: auto;
    padding: 19px 20px 20px;
  }

  .landmark-preview h3 {
    font-size: 22px;
  }

  .landmark-rail {
    right: auto;
    bottom: 23px;
    left: 20px;
  }

  .landmark-rail span {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .landmark-hit,
  .preview-enter,
  .landmark-rail button,
  .district-preview-enter-active,
  .district-preview-leave-active {
    transition: none;
  }
}
</style>
