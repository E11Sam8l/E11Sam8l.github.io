import { defineClientConfig } from 'vuepress/client'
import CoastalDistrict from './components/CoastalDistrict.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('CoastalDistrict', CoastalDistrict)
  },
})
