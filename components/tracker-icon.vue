<template>
    <div>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 5C0 2.23858 2.23858 0 5 0H39C41.7614 0 44 2.23858 44 5V33H35C33.8954 33 33 33.8954 33 35V44H5C2.23858 44 0 41.7614 0 39V5ZM35 35V44H35.0156L44 35.0156V35H35ZM10 19C10 20.6569 8.65685 22 7 22C5.34315 22 4 20.6569 4 19C4 17.3431 5.34315 16 7 16C8.65685 16 10 17.3431 10 19ZM7 10C8.65685 10 10 8.65685 10 7C10 5.34315 8.65685 4 7 4C5.34315 4 4 5.34315 4 7C4 8.65685 5.34315 10 7 10ZM10 31C10 32.6569 8.65685 34 7 34C5.34315 34 4 32.6569 4 31C4 29.3431 5.34315 28 7 28C8.65685 28 10 29.3431 10 31Z" :fill="props.fillColor"/>
        </svg>
    </div>
</template>

<script setup>
    const props = defineProps(["fillColor"]) 
</script>

<style>

</style>