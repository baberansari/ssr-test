// vite.config.server.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    ssr: 'src/entry-server.js', // ✅ SSR entry
    outDir: 'dist/server',
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/entry-server.js'), // ✅ required
    },
  },
})
