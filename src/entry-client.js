import { createApp } from './main.js'

const ssrData = window.__SSR_DATA__ || {}
const { app, router } = createApp()

app.provide('ssr-data', ssrData)

router.isReady().then(() => {
  app.mount('#app')
})
