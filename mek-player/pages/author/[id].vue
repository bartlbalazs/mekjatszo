<template>
  <div v-for="book in books">
    <div>
      <h2>{{ book.title }}</h2>
    </div>
    <div>
      <img :src="book.cover" />
    </div>
    <div>
      <p>{{ book.lead }}</p>
      <p>{{ book.description }}</p>
    </div>
    <div>
      <a :href="book.book_page">Tovább a könyvhöz</a>
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
  book_page: string
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
      for (let i = 0; i < books.value.length; i++) {
        books.value[i].cover = "https://mek.oszk.hu" + books.value[i].cover;
        books.value[i].book_page = window.location.href.startsWith('http://localhost') ? "/book/" + books.value[i].id : "/mekjatszo/book/" + books.value[i].id;
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