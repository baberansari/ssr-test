import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'
import { renderHeadToString } from '@vueuse/head'

export async function render(url) {
  const { app, router, head } = createApp()

  await router.push(url)
  await router.isReady()

  const appHtml = await renderToString(app)

  // ✅ Properly render the <head> content for SSR
  const { headTags } = await renderHeadToString(head)

  return {
    appHtml,
    headTags,
  }
}
