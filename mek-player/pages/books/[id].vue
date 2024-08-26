<template>
  <div id="app">
    <main>
      <section class="player">
        <div>
          <h1>{{ book.author }}</h1>
          <h2>{{ book.title }}</h2>
        </div>
        <div class="cover-wrapper">
          <img :src="cover" />
        </div>
        <div class="song-details">
          <h2 class="song-title">
            {{ current.title }}
          </h2>
          <KProgress :show-text="false" class="progress-bar-wrapper" v-bind:percent="current.percent"
            :color="['#df83f1', '#82279f', '#53cfe0']" />
          <div class="timer">
            <p class="start">{{ currentlyTimer }}</p>
            <p class="end">
              {{ current.totalTimer }}
            </p>
          </div>
        </div>
        <div class="controls">
          <button class="prev" @click="prev" v-if="chapters.length > 1">
            <IFaStepBackward />
          </button>
          <button class="play" v-if="!isPlaying" @click="play">
            <IFaPlay />
          </button>
          <button class="pause" v-else @click="pause">
            <IFaPause />
          </button>
          <button class="next" @click="next" v-if="chapters.length > 1">
            <IFaStepForward />
          </button>
        </div>
      </section>
    </main>
    <section class="playlist">
      <ul>
        <li v-for="chapter in chapters" :key="chapter.src" class="song">
          <div class="details" @click="play(chapter)">
            <h2 class="song-title">
              {{ chapter.title }}
            </h2>
            <KProgress v-if="chapter.isPlaying" :color="['#df83f1', '#82279f', '#53cfe0']" :show-text="false"
              class="progress-bar-wrapper" v-bind:percent="chapter.percent" />
          </div>
        </li>
      </ul>
    </section>
  </div>
  <div>
    <p>{{ book.lead }}</p>
    <p>{{ book.description }}</p>
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

interface Chapter {
  title: string
  src: string
  isPlaying?: boolean
  percent?: number
  currentlyTimer?: string
  totalTimer?: string
  seconds?: number
}

import axios from 'axios';
import { ref } from 'vue';
import KProgress from "k-progress-v3";

const route = useRoute()
const book = ref({} as Book)
const cover = ref('')

async function fetchData() {
  try {
    window.location.href.startsWith('http://localhost') ? axios.defaults.baseURL = 'http://localhost:3000' : axios.defaults.baseURL = 'https://bartlbalazs.github.io/mekjatszo/'
    const bookRespone = await axios.get<Book>('/static/books/' + route.params.id + '.json')
    if (bookRespone.data) {
      book.value = bookRespone.data;
      cover.value = "https://mek.oszk.hu" + book.value.cover
      chapters.value = book.value.audio_files.map(file => ({
        title: file.title,
        src: "https://mek.oszk.hu/" + book.value.id.replace('_', '/') + "/mp3/" + file.url,
      }));
      console.log(chapters.value[0])
      current.value = chapters.value[0];
    }
  } catch (error) {
    console.log(error);
  }
};

function formatTimer(seconds: any) {
  let minutes = parseInt((seconds / 60).toString());
  seconds = parseInt((seconds % 60).toString());

  let output = minutes >= 10 ? `${minutes}` : `0${minutes}`;
  output += seconds >= 10 ? `:${seconds}` : `:0${seconds}`;

  return output;
};

const current = ref({
  isPlaying: false,
  percent: 0,
  currentlyTimer: "00:00",
  totalTimer: "00:00",
  seconds: 0,
  title: "",
} as Chapter);
const index = ref(0);
const isPlaying = ref(false);
const currentlyTimer = ref("00:00");
const chapters = ref([{}] as Chapter[]);
const player = new Audio();
player.onloadedmetadata = function () {
  current.value.seconds = player.duration;
  current.value.totalTimer = formatTimer(player.duration);
};

function listenersWhenPlay() {
  player.addEventListener("timeupdate", () => {
    var playerTimer = player.currentTime;

    currentlyTimer.value = formatTimer(playerTimer);
    if (current.value.seconds) {
      current.value.percent = (playerTimer * 100) / current.value.seconds;
    }
    current.value.isPlaying = true;
  });
  player.addEventListener(
    "ended",
    function () {
      next();
    }
  );
}

function setCurrentChapter() {
  current.value = chapters.value[index.value];
  play(current.value);
};

function play(chapter: Chapter) {
  if (typeof chapter.src !== "undefined") {
    current.value.isPlaying = false;
    index.value = chapters.value.indexOf(current.value);
    current.value = chapter;
  } else {
    player.src = chapters.value[0].src;
    index.value = 0;
    current.value = chapters.value[0];
  }
  player.src = current.value.src;

  player.play();
  isPlaying.value = true;

  listenersWhenPlay();
};

function pause() {
  player.pause();
  isPlaying.value = false;
};

function next() {
  current.value.isPlaying = false;
  index.value = chapters.value.indexOf(current.value);
  index.value++;
  if (index.value > chapters.value.length - 1) {
    index.value = 0;
  }
  setCurrentChapter();
};

function prev() {
  current.value.isPlaying = false;
  index.value = chapters.value.indexOf(current.value);
  index.value--;
  if (index.value < 0) {
    index.value = chapters.value.length - 1;
  }
  setCurrentChapter();
};

onMounted(() => {
  fetchData();
  let jsmediatagsScript = document.createElement('script')
  jsmediatagsScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js')
  document.head.appendChild(jsmediatagsScript)
})
</script>
