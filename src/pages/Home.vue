<template>
  <div class="page-container">
    <div v-if="loading" class="card">
      <h3>Loading...</h3>
      <p>Please wait while we fetch player data.</p>
    </div>

    <template v-else>
      <section>
        <h2>Player List</h2>
        <div class="cards">
          <div v-for="player in players" :key="player.id" class="card">
            <img :src="playerImageUrl(player.image)" alt="Player Image" class="user-img" />
            <div>
              <h3>{{ player.name }}</h3>
              <p>Number: {{ player.number }}</p>
              <p>Position: {{ player.position }}</p>
              <p>Height: {{ player.height }} | Weight: {{ player.weight }}</p>
              <p>DOB: {{ player.dob }}</p>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, inject, onMounted } from 'vue'
import { useHead } from '@vueuse/head'

const players = ref([])
const loading = ref(false)
const ssrData = inject('ssr-data', {})

if (ssrData.players) {
  players.value = ssrData.players
} else {
  loading.value = true
  onMounted(async () => {
    try {
      const response = await axios.get('https://staging.humandashboard.ca/api/player-list', {
        headers: {
          Authorization: 'Bearer 117|GST61T4wC8ulmh8SKEyX1CBhoCs8dfpWDhQ9ecnz482f4f60'
        }
      })
      players.value = response.data.data
    } catch (err) {
      console.error('Failed to load player list', err)
    } finally {
      loading.value = false
    }
  })
}

const playerImageUrl = (path) => {
  return path ? `https://staging.humandashboard.ca/${path}` : ''
}

useHead({
  title: 'Player List',
  meta: [
    { name: 'description', content: 'List of players from API.' },
    { property: 'og:title', content: 'Player List Page' }
  ]
})
</script>

<script>
import axios from 'axios'

export default {
  async load() {
    try {
      const res = await axios.get('https://staging.humandashboard.ca/api/player-list', {
        headers: {
          Authorization: 'Bearer 117|GST61T4wC8ulmh8SKEyX1CBhoCs8dfpWDhQ9ecnz482f4f60'
        }
      })
      return { players: res.data.data }
    } catch (e) {
      console.error('SSR Load Error', e)
      return { players: [] }
    }
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
