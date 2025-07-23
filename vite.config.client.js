// vite.config.client.js
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
    outDir: 'dist/client',
    ssrManifest: true,
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // ✅ correct for client
    },
  },
})
