<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>

<script setup>
</script>

<style>
nav {
  padding: 1rem;
  background-color: #f0f0f0;
}
router-link {
  margin-right: 1rem;
}
</style>
