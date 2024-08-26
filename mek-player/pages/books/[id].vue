<template>
  <div>
    <li v-for="file in book.audio_files">
      {{ file.title }} -{{ file.url }}
    </li>

    </div>
</template>

<script lang="ts" setup>

interface Book {
  id: string
  title: string
  author: string
  lead: string
  cover: string
  description: string
  url: string
  audio_files: [{
    url: string,
    title: string
  }]
}

import { ref } from 'vue'
import axios from 'axios'


const route = useRoute()
const book = ref({} as Book)

async function fetchData() {
  try {
    window.location.href.startsWith('http://localhost') ? axios.defaults.baseURL = 'http://localhost:3000' : axios.defaults.baseURL = 'https://bartlbalazs.github.io/mekjatszo/'
    const bookRespone = await axios.get<Book>('/static/books/' + route.params.id + '.json')
    if (bookRespone.data) {
      book.value = bookRespone.data;
      const songs = book.value.audio_files.map(file => ({
        name: file.title,
        url: "https://mek.oszk.hu/08800/08820/mp3/" + file.url
      }));

    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchData()
})
</script>
