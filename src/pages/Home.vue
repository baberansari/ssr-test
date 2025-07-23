<template>
  <h1>Home Page</h1>
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: 'Home Page',
  meta: [
    {
      name: 'description',
      content: 'This is the home page of the app.',
    },
    {
      property: 'og:title',
      content: 'Home Title',
    },
  ],
})
</script>
