<template>
  <div class="page-container">
    <div v-if="loading" class="card">
      <h3>Loading...</h3>
      <p>Please wait while we fetch data.</p>
    </div>

    <template v-else>
      <section>
        <h2>Latest Posts</h2>
        <div class="cards">
          <div v-for="post in posts" :key="post.id" class="card">
            <h3>{{ post.title }}</h3>
            <p>{{ post.body }}</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Users</h2>
        <div class="cards">
          <div v-for="user in users" :key="user.id" class="card">
            <img :src="user.image" alt="User Image" class="user-img" />
            <div>
              <h3>{{ user.name }}</h3>
              <p>{{ user.email }}</p>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'
import { ref, inject, onMounted } from 'vue'

const posts = ref([])
const users = ref([])
const loading = ref(false)

const ssrData = inject('ssr-data', {})

if (ssrData.posts) posts.value = ssrData.posts
if (ssrData.users) users.value = ssrData.users

if (!ssrData.posts || !ssrData.users) {
  loading.value = true
  onMounted(async () => {
    try {
      const [postsRes, usersRes, imagesRes] = await Promise.all([
        fetch("https://jsonplaceholder.typicode.com/posts?_limit=5"),
        fetch("https://jsonplaceholder.typicode.com/users?_limit=3"),
        fetch("https://randomuser.me/api/?results=3")
      ])

      const [postsData, usersData, imagesData] = await Promise.all([
        postsRes.json(),
        usersRes.json(),
        imagesRes.json()
      ])

      users.value = usersData.map((user, i) => ({
        ...user,
        image: imagesData.results[i]?.picture?.medium || 'https://via.placeholder.com/100'
      }))

      posts.value = postsData
    } catch (err) {
      console.error("❌ Fetch error", err)
    } finally {
      loading.value = false
    }
  })
}

useHead({
  title: 'Home Page',
  meta: [
    { name: 'description', content: 'This is the home page of the app.' },
    { property: 'og:title', content: 'Home Title' }
  ]
})
</script>

<script>
export default {
  async load() {
    const [postsRes, usersRes, imagesRes] = await Promise.all([
      fetch("https://jsonplaceholder.typicode.com/posts?_limit=5"),
      fetch("https://jsonplaceholder.typicode.com/users?_limit=3"),
      fetch("https://randomuser.me/api/?results=3")
    ])

    const [posts, usersData, imagesData] = await Promise.all([
      postsRes.json(),
      usersRes.json(),
      imagesRes.json()
    ])

    const users = usersData.map((user, i) => ({
      ...user,
      image: imagesData.results[i]?.picture?.medium || 'https://via.placeholder.com/100'
    }))

    return { posts, users }
  }
}
</script>

<style scoped>
.page-container {
  padding: 16px;
}
section {
  margin-bottom: 32px;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.user-img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}
.card h3 {
  margin: 0 0 4px;
  font-size: 18px;
}
.card p {
  margin: 0;
  font-size: 14px;
  color: #555;
}
</style>
