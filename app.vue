<template>
  <div>
    <NuxtPage :class="{'content':!hide}"/>
    <div></div>
    <div id="footer-menu" :class="{'hidden':hide, 'noSelect':true}">
        <NuxtLink to="/tracker" class="noSelect"><tracker-icon :fillColor="trackerFillColor"></tracker-icon></NuxtLink>
        <NuxtLink to="/charts"><charts-icon :fillColor="chartsFillColor"></charts-icon></NuxtLink>
        <NuxtLink to="/budget"><budget-icon :fillColor="budgetFillColor"></budget-icon></NuxtLink>
    </div>
  </div>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet">
</template>

<script setup>

import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()
  const route = useRoute()

  const hide = ref(false)

  const authNeededPages = ["budget","tracker","charts"]

  const chartsFillColor = ref("#fff")
  const trackerFillColor = ref("#fff")
  const budgetFillColor = ref('#fff')

  router.beforeEach (async(to, from)=>{
    console.log("run")
    changeColors(to.fullPath)
  })

  const checkUserStatus = (path)=>{
    const userSignedIn = isUserSignedIn()
    if(userSignedIn){
      if(path=="login"||path=="signup"){
        console.log("Redirect Home")
      }
    }

    else{
      for(let i=0;i<authNeededPages.length; i++){
        console.log(authNeededPages[i])
      }
    }
  }

  checkUserStatus(route)


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
      budgetFillColor.value = '#fff'
    }
    else if(path=="/tracker"){
      chartsFillColor.value = "#fff"
      trackerFillColor.value = "#B37FF2"
      budgetFillColor.value = '#fff'
    }
    else if(path=='/budget'){
      chartsFillColor.value = "#fff"
      trackerFillColor.value = "#fff"
      budgetFillColor.value = '#B37FF2'
    }
    else{
      chartsFillColor.value = "#fff"
      trackerFillColor.value = "#fff"
      budgetFillColor.value = "#fff"
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
  font-family: 'Poppins', sans-serif;
}

.content {
  /* Calculate the height of the content area to make space for the footer */
  min-height: calc(100vh - 60px); /* 60px is the height of the footer */
  padding-bottom: 90px; /* Ensure there is space for the footer */
}


.noSelect {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.noSelect:focus {
  outline: none !important;
}

#footer-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  color: #fff;
  padding: 8px;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 0px;
  justify-items: center;
}

#footer-menu.hidden {
  display: none;
}

span{
  text-align: center;
}

#budget-text{

}
#tracker-text{
  color: white;
}
#overview-text{
  
}
</style>
