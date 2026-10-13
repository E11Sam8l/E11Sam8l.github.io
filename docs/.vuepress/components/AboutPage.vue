<script setup lang="ts">
import { computed } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import VPLink from 'vuepress-theme-plume/components/VPLink.vue'
import '../styles/about.css'

interface Experience {
  period: string
  title: string
  subtitle: string
  detail?: string
  current?: boolean
}
interface Profile {
  name: string
  subtitle?: string
  avatar?: string
  experienceTitle?: string
  experiences: Experience[]
}

const frontmatter = usePageFrontmatter<{ profiles?: Profile[] }>()
const profiles = computed(() => frontmatter.value.profiles?.slice(0, 2) ?? [])
const avatars = import.meta.glob('../../about/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function avatarFor(profile: Profile): string | undefined {
  const requested = profile.avatar?.replace(/^\.\//, '').toLowerCase()
  return Object.entries(avatars).find(([path]) => {
    const filename = path.split('/').pop()!.toLowerCase()
    return requested ? filename === requested : filename.replace(/\.[^.]+$/, '') === profile.name.toLowerCase()
  })?.[1]
}
</script>

<template>
  <main class="duo-about" aria-labelledby="duo-about-title">
    <header class="duo-masthead">
      <VPLink href="/" class="duo-back" no-icon>
        <span class="vpi-arrow-left" aria-hidden="true" /> 返回首页
      </VPLink>
      <h1 id="duo-about-title">关于我们<span>OUR STORIES</span></h1>
      <span class="duo-masthead-note">两个人 · 同一片日落</span>
    </header>

    <div class="duo-panels">
      <article
        v-for="(profile, index) in profiles"
        :key="profile.name"
        class="duo-profile"
        :class="index === 0 ? 'duo-profile--laplace' : 'duo-profile--e11'"
        :aria-labelledby="`profile-name-${index}`"
      >
        <div class="duo-scene" aria-hidden="true">
          <div class="duo-sun" />
          <svg class="duo-palms" viewBox="0 0 720 900" preserveAspectRatio="xMidYMax slice">
            <g fill="currentColor">
              <path d="M44 900Q93 675 116 417L127 417Q123 688 86 900Z M121 425Q44 358 0 387Q53 390 121 436Z M121 425Q27 422 0 488Q66 452 121 436Z M121 425Q88 302 49 314Q95 358 121 436Z M121 425Q151 315 221 341Q166 358 121 436Z M121 425Q218 367 270 427Q201 410 121 436Z M121 425Q213 447 218 513Q166 466 121 436Z" />
              <path d="M662 900Q657 697 622 521L613 521Q628 731 618 900Z M619 527Q697 463 720 491Q664 496 619 536Z M619 527Q705 526 720 587Q673 551 619 536Z M619 527Q669 405 700 431Q650 477 619 536Z M619 527Q590 421 521 456Q588 476 619 536Z M619 527Q537 478 489 537Q558 513 619 536Z" />
            </g>
          </svg>
        </div>

        <div class="duo-profile-content">
          <div class="duo-profile-index">
            <span>{{ String(index + 1).padStart(2, '0') }} / PERSONAL PROFILE</span>
            <span class="duo-profile-star" aria-hidden="true">✦</span>
          </div>

          <div class="duo-identity">
            <div class="duo-avatar">
              <img v-if="avatarFor(profile)" :src="avatarFor(profile)" :alt="`${profile.name} 的头像`" width="88" height="88">
              <span v-else class="duo-avatar-initial" aria-hidden="true">{{ profile.name.charAt(0) }}</span>
            </div>
            <div class="duo-name-block">
              <h2 :id="`profile-name-${index}`">{{ profile.name }}</h2>
              <p v-if="profile.subtitle" class="duo-subtitle">{{ profile.subtitle }}</p>
              <p v-else class="duo-subtitle duo-subtitle--quiet">A STORY TO BE CONTINUED</p>
            </div>
          </div>

          <section class="duo-journey" :aria-labelledby="`profile-journey-${index}`">
            <div class="duo-section-heading">
              <h3 :id="`profile-journey-${index}`">{{ profile.experienceTitle || '个人经历' }}</h3>
              <span>THE JOURNEY</span>
            </div>
            <ol v-if="profile.experiences?.length" class="duo-timeline">
              <li v-for="experience in profile.experiences" :key="`${experience.period}-${experience.title}`" class="duo-timeline-item" :class="{ 'is-current': experience.current }">
                <span class="duo-timeline-dot" aria-hidden="true" />
                <div class="duo-period-row">
                  <p class="duo-period">{{ experience.period }}</p>
                  <span v-if="experience.current" class="duo-current">进行中</span>
                </div>
                <h4>{{ experience.title }}</h4>
                <p class="duo-qualification">{{ experience.subtitle }}</p>
                <p v-if="experience.detail" class="duo-detail">{{ experience.detail }}</p>
              </li>
            </ol>
            <div v-else class="duo-journey-empty">
              <span class="duo-empty-line" aria-hidden="true" />
              <p>经历待补充</p>
              <span class="duo-empty-caption">下一段故事，留给之后的记录。</span>
            </div>
          </section>

          <div class="duo-profile-footer" aria-hidden="true">
            <span>{{ profile.name }}</span><span>TO BE CONTINUED ↗</span>
          </div>
        </div>
      </article>
      <div class="duo-seam" aria-hidden="true"><span>&amp;</span></div>
    </div>
  </main>
</template>
