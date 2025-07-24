<template>
  <div class="about">
    <h1>About Page</h1>

    <div v-if="loading" class="card">
      <h3>Loading...</h3>
      <p>Please wait while we load content.</p>
    </div>

    <template v-else>
      <!-- Section 1: Content left, Image right -->
      <div class="section">
        <div class="section-inner">
          <div class="text">
            <h2>{{ aboutItems[0].title }}</h2>
            <p>{{ aboutItems[0].body }}</p>
          </div>
          <img :src="aboutItems[0].image" class="img" alt="Profile" />
        </div>
      </div>

      <!-- Section 2: Image left, Content right -->
      <div class="section alt">
        <div class="section-inner">
          <img :src="aboutItems[1].image" class="img" alt="Profile" />
          <div class="text">
            <h2>{{ aboutItems[1].title }}</h2>
            <p>{{ aboutItems[1].body }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useHead } from '@vueuse/head'
import { ref, inject, onMounted } from 'vue'

const aboutItems = ref([])
const loading = ref(false)
const ssrData = inject('ssr-data', {})

if (ssrData.aboutItems) {
  aboutItems.value = ssrData.aboutItems
} else {
  loading.value = true
  onMounted(async () => {
    try {
      const [postsRes, usersRes] = await Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/posts?_limit=2'),
        axios.get('https://randomuser.me/api/?results=2')
      ])

      aboutItems.value = postsRes.data.map((post, i) => ({
        ...post,
        image: usersRes.data.results[i]?.picture?.large || 'https://via.placeholder.com/150'
      }))
    } catch (err) {
      console.error('Axios fetch error:', err)
    } finally {
      loading.value = false
    }
  })
}

useHead({
  title: 'About Page',
  meta: [
    { name: 'description', content: 'This is the About page of the app.' },
    { property: 'og:title', content: 'About Title' },
  ],
})
</script>

<script>
import axios from 'axios'

export default {
  async load() {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }

    const [postsRes, usersRes] = await Promise.all([
      axios.get('https://jsonplaceholder.typicode.com/posts?_limit=2', { headers }),
      axios.get('https://randomuser.me/api/?results=2', { headers })
    ])

    const aboutItems = postsRes.data.map((post, i) => ({
      ...post,
      image: usersRes.data.results[i]?.picture?.large || 'https://via.placeholder.com/150'
    }))

    return { aboutItems }
  }
}

</script>


<style scoped>
.about {
  padding: 32px;
}
.section {
  margin-bottom: 48px;
}
.section-inner {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}
.img {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
}
.text {
  flex: 1;
}
.text h2 {
  margin: 0 0 16px;
  font-size: 24px;
}
.text p {
  font-size: 16px;
  color: #444;
  margin: 0;
}
.card {
  padding: 24px;
  border: 1px dashed #ccc;
  text-align: center;
}
</style>
