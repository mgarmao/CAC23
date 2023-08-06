<template>
  <div>
    <NuxtPage/>
  </div>
</template>
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
</style>
