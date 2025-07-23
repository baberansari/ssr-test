<template>
  <h1>About Page</h1>
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: 'About Page',
  meta: [
    {
      name: 'description',
      content: 'This is the About page of the app.',
    },
    {
      property: 'og:title',
      content: 'About Title',
    },
  ],
})
</script>
