<template>
  <div>
    <NuxtPage/>
    <div id="footer-menu" :class="{'hidden':hide}">
        <NuxtLink to="/tracker"><tracker-icon :fillColor="trackerFillColor"></tracker-icon></NuxtLink>      
        <NuxtLink to="/charts"><charts-icon :fillColor="chartsFillColor"></charts-icon></NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()
  const route = useRoute()

  const hide = ref(false)

  const chartsFillColor = ref("#fff")
  const trackerFillColor = ref("#fff")

  router.beforeEach ((to, from)=>{
    changeColors(to.fullPath)
  })

  const changeColors = (path)=>{
    if((path=="/login")||(path=="/signup")||(path=="/")){
      hide.value = true
    }
    else{
      hide.value = false
    }

    if(path=="/charts"){
      chartsFillColor.value = "#B37FF2"
      trackerFillColor.value = "#fff"
    }
    else if(path=="/tracker"){
      chartsFillColor.value = "#fff"
      trackerFillColor.value = "#B37FF2"
    }
    else{
      chartsFillColor.value = "#fff"
      trackerFillColor.value = "#fff"
    }
  }

  changeColors(route.fullPath)
</script>


<style>
  body{
    transition: all ease 0.5s;
    background-color: #121212;
    color: #FFF;
    font-family: Arial, Helvetica, sans-serif;
  }
  #footer-menu{
    position: fixed; /* Fixed position to keep the footer at the bottom */
    bottom: 0; /* Align the footer to the bottom of the screen */
    left: 0; /* Align the footer to the left edge of the screen */
    width: 100%; /* Make the footer span the full width of the screen */
    background-color: #333; /* Background color for the footer */
    color: #fff; /* Text color for the footer menu links */
    padding: 20px; /* Adjust padding to your liking */
    display: grid; /* Use CSS Grid */
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Define grid columns */
    grid-gap: 20px; /* Adjust spacing between menu items */
    justify-items: center; /* Center the menu items horizontally */
  }
  
  #footer-menu.hidden{
    display: none;
  }
</style>
