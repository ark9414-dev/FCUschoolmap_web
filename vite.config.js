import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { existsSync, renameSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/schoolmap_web/' : '/',
  plugins: [
    vue(),
    {
      name: 'rename-dev-entry-for-pages',
      closeBundle() {
        const devEntry = resolve('dist/index.dev.html')
        const pagesEntry = resolve('dist/index.html')

        if (existsSync(devEntry)) {
          renameSync(devEntry, pagesEntry)
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
