import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'
import { renderHeadToString } from '@vueuse/head'

export async function render(url) {
  const { app, router, head } = createApp()

  await router.push(url)
  await router.isReady()

 const matched = router.currentRoute.value.matched
let ssrData = {}

for (const route of matched) {
  const component = route.components?.default
  if (typeof component?.load === 'function') {
    const data = await component.load()
    ssrData = { ...ssrData, ...data }
  }
}

 app.provide('ssr-data', ssrData)


  const appHtml = await renderToString(app)
  const { headTags } = await renderHeadToString(head)

  return { appHtml, headTags, ssrData }
}
