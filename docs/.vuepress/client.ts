import { defineClientConfig } from 'vuepress/client'
import { setupPageTransition } from './composables/usePageTransition'
import './styles/page-transition.css'

export default defineClientConfig({
  setup() {
    setupPageTransition()
  },
})
