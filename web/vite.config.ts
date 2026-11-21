import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: "./",
  // En desarrollo, /api va al servidor Bun.
  server: { proxy: { '/api': 'http://localhost:3100' } },
})
