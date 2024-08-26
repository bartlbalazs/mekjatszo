// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolve from 'unplugin-icons/resolver'
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: [
    '@bootstrap-vue-next/nuxt',
    '@nuxt/content',
    '@nuxt/image'
  ],
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  ssr: false,
  devtools: { enabled: true },
  vite: {
    plugins: [
      Components({
        resolvers: [IconsResolve()],
        dts: true,
      }),
      Icons({
        compiler: 'vue3',
        autoInstall: true,
      }),
    ],
  }
})
