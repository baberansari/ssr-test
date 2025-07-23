// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const resolvePath = (p) => path.resolve(__dirname, p)

export default defineConfig(({ command, ssrBuild }) => {
  const isSSR = !!ssrBuild

  return {
    resolve: {
      alias: {
        '@': resolvePath('src'),
      },
    },
    plugins: [vue()],
    build: {
      ssr: isSSR ? 'src/entry-server.js' : false,
      outDir: isSSR ? 'dist/server' : 'dist/client',
      ssrManifest: !isSSR,
      rollupOptions: {
        input: isSSR
          ? resolvePath('src/entry-server.js') // ✅ SSR uses entry-server.js
          : resolvePath('index.html'),         // ✅ Client uses index.html
      },
      emptyOutDir: false, // don't delete between builds
    },
  }
})
