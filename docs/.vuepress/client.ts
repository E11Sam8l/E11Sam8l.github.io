import { defineClientConfig } from 'vuepress/client'
import { setupPageTransition } from './composables/usePageTransition'
import { setupContentFilters } from './composables/useContentFilter'
import ContentBrowser from './components/ContentBrowser.vue'
import ContentListPage from './components/ContentListPage.vue'
import './styles/page-transition.css'

export default defineClientConfig({
  enhance({ app }) {
    app.component('ContentBrowser', ContentBrowser)
    app.component('ContentListPage', ContentListPage)
  },
  setup() {
    setupPageTransition()
    setupContentFilters()
  },
})
