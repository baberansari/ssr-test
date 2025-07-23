// src/router/index.js
import { createMemoryHistory, createWebHistory, createRouter as _createRouter } from 'vue-router'
import Home from '@/pages/Home.vue'
import About from '@/pages/About.vue'

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: [
      { path: '/', component: Home },
      { path: '/about', component: About },
    ]
  })
}
