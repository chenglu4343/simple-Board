import { NScrollbar } from 'naive-ui'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('n-scrollbar', NScrollbar)
})
