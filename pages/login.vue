<template >
    <div id="logins">
        <h1 id="title">Log in</h1>
        <input v-model="email" type="email" placeholder="Email">
        <input v-model="password" type="password" placeholder="Password">
        <br>
        <button @click="login(email,password)" id="email-login-button">Login</button>
        <br>
        <button id="login-google" @click="loginWithGoogle"><img src="../public/google-logo.svg"><p>Login With Google</p></button>
        <button @click="signOutUser">Log out</button>
    </div>
</template>

<script setup>
    const email = ref("")
    const password = ref("")

</script>

<style scoped>

    #logins {
        margin-top: 50%;
        text-align: center;
        align-items: center;
        display: flex; 
        flex-direction: column;
    }

    input{
        width: 70%;
        margin-top: 0.5rem;
        border: none;
        border-radius: 0.2rem;
        font-size: 16px;
        padding: 0.5rem;
    }

    #email-login-button{
        font-size: 18px;
        background: #c392ff;  
        border: none;
        border-radius: 0.5rem;
        width: 50%;
        padding: 0.3rem;
        cursor: pointer;
        transition: ease 0.3s;
    }

    #email-login-button:hover{
        background: #c392fece;  
        transition: ease 0.3s;
    }

    #login-google {
        margin-top: 1rem;
        color: #fff;
        background-color: rgb(91, 142, 231);
        border-radius: 0.5rem;
        border: none;
        display: flex;

        align-items: center; 
        justify-content: center; 
        cursor: pointer;

        transition: ease 0.3s;
    }

    #login-google:hover{
        background-color: rgba(91, 142, 231, 0.754);
    }

    #login-google img {
        width: 1.5rem;
        margin-right: 0.5rem;
    }

    #login-google p{
        font-size: 18px;
    }

</style>