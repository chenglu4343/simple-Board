import { NCollapse } from 'naive-ui'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('n-collapse', NCollapse)
})
