<template >
    <div>
        <input v-model="email">
        <input v-model="password">
        <button @click="createNewUser(email,password)">Create</button>
    </div>
</template>

<script setup>
    const email = ref("")
    const password = ref("")

</script>

<style lang="">
    
</style>