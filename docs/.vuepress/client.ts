import { h } from 'vue'
import { defineClientConfig } from 'vuepress/client'
import { Layout, NotFound } from 'vuepress-theme-plume/client'
import PageContextMenu from 'vuepress-theme-plume/features/PageContextMenu.vue'
import { setupPageTransition } from './composables/usePageTransition'
import { setupContentFilters } from './composables/useContentFilter'
import ContentBrowser from './components/ContentBrowser.vue'
import ContentListPage from './components/ContentListPage.vue'
import ContentBackLink from './components/ContentBackLink.vue'
import AboutPage from './components/AboutPage.vue'
import NotFoundContent from './components/NotFoundContent.vue'
import ContentScene from './components/ContentScene.vue'
import './styles/page-transition.css'
import './styles/sidebar.css'
import './styles/outline.css'
import './styles/vice-content.css'

export default defineClientConfig({
  enhance({ app }) {
    app.component('ContentBrowser', ContentBrowser)
    app.component('ContentListPage', ContentListPage)
    app.component('AboutPage', AboutPage)
  },
  setup() {
    setupPageTransition()
    setupContentFilters()
  },
  // 官方文档站同样通过标题插槽挂载主题自带的页面操作菜单。
  layouts: {
    NotFound: h(NotFound, null, {
      'not-found': () => h(NotFoundContent),
    }),
    Layout: h(Layout, null, {
      'sidebar-nav-before': () => h(ContentBackLink, { placement: 'sidebar' }),
      'doc-before': () => [h(ContentBackLink, { placement: 'content' }), h(ContentScene)],
      'doc-title-after': () => h(PageContextMenu),
    }),
  },
})
