<template>
  <div class="about">
    <h1>Sports</h1>

    <div v-if="loading" class="card">
      <h3>Loading...</h3>
      <p>Please wait while we load content.</p>
    </div>

    <template v-else>
      <div class="cards">
        <div v-for="item in sports" :key="item.id" class="card">
          <h2>{{ item.title }}</h2>
          <p>Created at: {{ formatDate(item.created_at) }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useHead } from '@vueuse/head'
import { ref, inject, onMounted } from 'vue'

const sports = ref([])
const loading = ref(false)
const ssrData = inject('ssr-data', {})

if (ssrData.sports) {
  sports.value = ssrData.sports
} else {
  loading.value = true
  onMounted(async () => {
    try {
      const res = await axios.get('http://assistant-caochs.test/api/sport', {
        headers: {
          Authorization: 'Bearer 1|RnRN5pzxzeGiGSDCk6s36QCxo98gadELLqEoHbDa07cee14e'
        }
      })
      sports.value = res.data.data || []
    } catch (err) {
      console.error('❌ Error fetching sports:', err)
    } finally {
      loading.value = false
    }
  })
}

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString()

useHead({
  title: 'Sports List',
  meta: [
    { name: 'description', content: 'List of sports from API.' },
    { property: 'og:title', content: 'Sports Page' },
  ],
})
</script>

<script>
import axios from 'axios'

export default {
  async load() {
    try {
      const res = await axios.get('http://assistant-caochs.test/api/sport', {
        headers: {
          Authorization: 'Bearer 1|RnRN5pzxzeGiGSDCk6s36QCxo98gadELLqEoHbDa07cee14e'
        }
      })
      return { sports: res.data.data || [] }
    } catch (err) {
      console.error('SSR load error:', err)
      return { sports: [] }
    }
  }
}
</script>

<style scoped>
.about {
  padding: 32px;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  background-color: #f8f8f8;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.card h2 {
  margin: 0 0 12px;
  font-size: 20px;
}
.card p {
  margin: 0;
  font-size: 14px;
  color: #666;
}
</style>
