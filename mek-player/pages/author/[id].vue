<template>
  <div v-for="book in books">
    <div>
      <h2>{{ book.title }}</h2>
    </div>
    <div>
      <img v-bind:src="'https://mek.oszk.hu' + book.cover" />
    </div>
    <div>
      <p>{{ book.lead }}</p>
      <p>{{ book.description }}</p>
    </div>
    <div>
      <a v-bind:href="'/book/' + book.id">Tovább a könyvhöz</a>
    </div>
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

import axios from 'axios';
import { ref } from 'vue';

const route = useRoute()
const books = ref([{}] as Book[])
const author = ref('')

async function fetchData() {
  try {
    window.location.href.startsWith('http://localhost') ? axios.defaults.baseURL = 'http://localhost:3000' : axios.defaults.baseURL = 'https://bartlbalazs.github.io/mekjatszo/'
    const authorRespone = await axios.get<Book[]>('/static/authors/' + route.params.id + '.json')
    if (authorRespone.data) {
      books.value = authorRespone.data;
      if (books.value.length > 0) {
        author.value = books.value[0].author;
        document.title = author.value;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchData();
})

</script>

<style></style>