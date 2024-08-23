// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: ['@bootstrap-vue-next/nuxt', '@nuxt/content'],
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  ssr: false,
  devtools: { enabled: true }
})