<template >
    <div>
        <input v-model="email">
        <input v-model="password">
        <button v-on:click="auth(email,password)">Create</button>
    </div>
</template>

<script>
    import auth from '../composables/auth/auth.ts'
    const email = ref("")
    const password = ref("")

</script>

<style lang="">
    
</style>