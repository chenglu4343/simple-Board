import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~': '/',
    },
  },
  plugins: [
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
      ],
      dts: false,
    }),
  ],
})
