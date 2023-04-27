import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@vue-macros/nuxt',
  ],
  css: [
    'normalize.css',
    '~/css/scrollbar.css',
  ],
  vite: {
    plugins: [
      Components({
        resolvers: [NaiveUiResolver()],
        dts: './types/vue-components.d.ts',
      }),
    ],
  },
})
