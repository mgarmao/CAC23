import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics"

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    const firebaseConfig = {
        apiKey: config.public.Firebase_API_Key,
        authDomain: "cac23-cx97d0.firebaseapp.com",
        projectId: "cac23-c97d0",
        storageBucket: "cac23-c97d0.appspot.com",
        messagingSenderId: "1059496786578",
        appId: "1:1059496786578:web:5c360731856484432a044b",
        measurementId: "G-FL3EHTN6CP"
    };

    const app = initializeApp(firebaseConfig)

    const analytics = getAnalytics(app)
    const auth = getAuth(app)
    const firestore = getFirestore(app)
    
    nuxtApp.vueApp.provide('auth', auth)
    nuxtApp.provide('auth', auth)

    nuxtApp.vueApp.provide('firestore', firestore)
    nuxtApp.provide('firestore', firestore)
})