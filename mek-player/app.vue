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
const show = ref(false)
</script>