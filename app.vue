<template>
  <div>
    <NuxtPage :class="{'content':!hide}"/>
    <div></div>
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
  body {
  margin: 0; 
  padding: 0; 
  transition: all ease 0.5s;
  background-color: #121212;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
}

.content {
  /* Calculate the height of the content area to make space for the footer */
  min-height: calc(100vh - 60px); /* 60px is the height of the footer */
  padding-bottom: 90px; /* Ensure there is space for the footer */
}

#footer-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  color: #fff;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 0px;
  justify-items: center;
}

#footer-menu.hidden {
  display: none;
}
</style>
