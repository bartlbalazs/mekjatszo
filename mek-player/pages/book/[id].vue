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
        <div class="chapter-details">
          <h2 class="chapter-title">
            {{ current.title }}
          </h2>
          <Slider v-model="current.percent" :tooltips="false" @end="seek"/>
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
          <button class="rewind" @click="rewind" v-if="chapters.length > 1">
            <IFaBackward />
          </button>
          <button class="play" v-if="!isPlaying" @click="play">
            <IFaPlay />
          </button>
          <button class="pause" v-else @click="pause">
            <IFaPause />
          </button>
          <button class="forward" @click="forward" v-if="chapters.length > 1">
            <IFaForward />
          </button>
          <button class="next" @click="next" v-if="chapters.length > 1">
            <IFaStepForward />
          </button>
        </div>
      </section>
    </main>
    <section class="playlist">
      <ul>
        <li v-for="chapter in chapters" :key="chapter.src" class="chapter">
          <div class="details" @click="play(chapter)">
            <h2 class="chapter-title">
              {{ chapter.title }}
            </h2>
          </div>
        </li>
      </ul>
    </section>
  </div>
  <div>
    <p>{{ book.lead }}</p>
    <p>{{ book.description }}</p>
    <p>Forrás: <a :href="source" target="_blank">{{ source }}</a></p>
  </div>
</template>

<script lang="ts" setup>
import Slider from '@vueform/slider'


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
  duration?: number
}

import axios from 'axios';
import { ref } from 'vue';

const route = useRoute()
const book = ref({} as Book)
const cover = ref('')
const source = ref('')

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
      current.value = chapters.value[0];
      document.title = book.value.author + " - " + book.value.title;
      source.value = book.value.url;
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

function seek(event: any) {
  const target_percent = event;
  try {
    const time = (target_percent * (current.value.duration ?? 0)) / 100;
    player.currentTime = time;
  } catch (error) {
    console.log(error);
  }
};

const current = ref({
  isPlaying: false,
  percent: 0,
  currentlyTimer: "00:00",
  totalTimer: "00:00",
  duration: 0,
  title: "",
} as Chapter);
const index = ref(0);
const isPlaying = ref(false);
const currentlyTimer = ref("00:00");
const chapters = ref([{}] as Chapter[]);
const player = new Audio();
player.onloadedmetadata = function () {
  current.value.duration = player.duration;
  current.value.totalTimer = formatTimer(player.duration);
};

function listenersWhenPlay() {
  player.addEventListener("timeupdate", () => {
    var playerTimer = player.currentTime;

    currentlyTimer.value = formatTimer(playerTimer);
    if (current.value.duration) {
      current.value.percent = (playerTimer * 100) / current.value.duration;
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
  console.log("Chapter: " + chapter);
  // If a chapter was selected from the playlist
  if (typeof chapter.src !== "undefined") {
    current.value = chapter;
    index.value = chapters.value.indexOf(current.value);
    player.src = current.value.src;
  } 
  
  // Start first chapter or continue playing the current chapter
  if (typeof chapter.src === "undefined") {
    // Start the first chapter
    if (player.src === '') {
      player.src = current.value.src;
    }
    // No changes needed when we continue playing the current chapter
  }

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

function forward() {
  player.currentTime += 10;
};

function rewind() {
  player.currentTime -= 10;
};

onMounted(() => {
  fetchData();
})

onUnmounted(() => {
  pause();
})
</script>

<style>
.chapter-details {
  margin-top: 25px;
}

.cover-wrapper {
  width: 100%;
  margin-top: 30px;
  height: 270px;
  text-align: center;
}

.cover-wrapper img{
  height: 100%;
}

.animated {
  animation: appear-smoothly 1s normal both;
  transition: all 0.3s; 
}

.cover {
  height: 100%;
  width: 270px;
  box-shadow: 0 24px 35px -16px rgba(107,179,237,.5);
  border-radius: 5px;
}

.chapter-title {
  width: 100%;
  color: #53565a;
  font-size: 1.13em;
  text-align: center;
  margin-bottom: 5px;
}

.details {
  margin-left: 10px;
  width: 100%;
}

.details > .chapter-title {
  color: #585858;
  font-size: inherit;
  text-align: left;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.play,
.pause {
  background-image: linear-gradient(to right top,#d16ba5,#c777b9,#ba83ca,#aa8fd8,#9a9ae1,#8aa7ec,#79b3f4,#69bff8,#52cffe,#41dfff,#46eefa,#5ffbf1);
  border-radius: 50%;
  width: 65px;
  height: 65px;
  justify-content: center;
  box-shadow: -1px 17px 24px -6px rgba(0,0,0,.2);
  cursor: pointer;
  font-size: 20px;
  color: #fff;
  margin-left: 15px;
  margin-right: 15px;
}

.next,
.prev {
  border: 0;
  border-radius: 50%;
  font-size: 15px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: rgba(0,0,0,.09);
  color: #fff;
  transition: background-color .2s;
  position: relative;
}

.rewind,
.forward {
  border: 0;
  border-radius: 50%;
  font-size: 15px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: rgba(0,0,0,.09);
  color: #fff;
  transition: background-color .2s;
  position: relative;
  margin-left: 10px;
  margin-right: 10px;
}

.playlist {
  background-color: #fff;
  overflow-y: auto;
  max-height: 622px;
  border-radius: 5px;
  padding-left: 0;
}

.playlist h3 {
  color: #212121;
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.playlist .chapter {
  display: flex;
  padding: 10px;
}

.playlist .chapter:hover {
  background-color: #ededed;
  transition: box-shadow .2s,background-color .3s;
}

.timer {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 10px;
}

#app {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
  padding: 20px;
}

@media (max-width: 768px) {
  #app {
    grid-template-columns: 1fr;
  }

  body {
    height: 100%;
    margin-top: 10px;
  }

  .playlist {
    margin-top: 5px;
    max-height: 200px;
  }

  .playlist ul {
    padding-left: 0;
  }
}
</style>
<style src="@vueform/slider/themes/default.css"></style>
