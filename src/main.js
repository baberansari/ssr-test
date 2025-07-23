// src/main.js
import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createHead } from '@vueuse/head'

export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  const head = createHead() // ✅ create head instance

  app.use(router)
  app.use(head) // ✅ register it with app

  return { app, router, head } // ✅ return head for SSR
}
