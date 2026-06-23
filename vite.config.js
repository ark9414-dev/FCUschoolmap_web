import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { existsSync, renameSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/',

  plugins: [
    vue(),

    {
      name: 'rename-dev-entry-for-azure',

      closeBundle() {
        const devEntry = resolve('dist/index.dev.html')
        const productionEntry = resolve('dist/index.html')

        if (existsSync(devEntry)) {
          renameSync(devEntry, productionEntry)
        }
      }
    }
  ],

  build: {
    rollupOptions: {
      input: resolve('index.dev.html')
    }
  }
})