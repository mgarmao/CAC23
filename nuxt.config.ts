// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: [
    { src: '~/plugins/firebase.clients.ts', mode: 'client' }
  ],
  runtimeConfig:{
    public:{
      Firebase_API_Key: process.env.Firebase_API_Key
    }
  }
})
