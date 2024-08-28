<template>
  <div>
    <NuxtLayout>
      <BNavbar variant="primary" v-b-color-mode="'dark'">
        <BNavbarBrand to="/">MEKplayer</BNavbarBrand>
        <BNavbarNav>
          <BNavItem to="/">Hangoskönyvek</BNavItem>
          <BNavItem to="/authors">Szerzők</BNavItem>
        </BNavbarNav>
      </BNavbar>
      <BContainer>
        <NuxtPage />
      </BContainer>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
</script>
<style>

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes scale-up-center {
  0% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes flip-in-hor-bottom {
  0% {
    -webkit-transform: rotateX(80deg);
    transform: rotateX(80deg);
    opacity: 0;
  }

  100% {
    -webkit-transform: rotateX(0);
    transform: rotateX(0);
    opacity: 1;
  }
}

@keyframes appear-smoothly {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

* {
  box-sizing: border-box;
  user-select: none;
  overflow-wrap: break-word;
  margin: 0px;
  padding: 0px;
}

::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}

::-webkit-scrollbar
{
	width: 10px;
	background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
	background-color: #10b981;	
	background-image: -webkit-linear-gradient(45deg,
	                                          rgba(255, 255, 255, .2) 25%,
											  transparent 25%,
											  transparent 50%,
											  rgba(255, 255, 255, .2) 50%,
											  rgba(255, 255, 255, .2) 75%,
											  transparent 75%,
											  transparent)
}

ul {
  list-style: none;
}

button {
  appearance: none;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
  transform: scale(1.1);
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
    max-height: 200px;
  }
}
</style>