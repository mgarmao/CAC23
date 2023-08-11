<template>
    <div id="logins">
        <h1 id="title">Log in</h1>
        <input v-model="email" type="email" placeholder="Email">
        <input v-model="password" type="password" placeholder="Password">
        <br>
        <button @click="loginEmail" id="email-login-button">Login</button>
        <br>
        <button id="login-google" @click="loginGoogle"><img src="../public/google-logo.svg"><p>Login With Google</p></button>
        <!-- <button @click="signOutUser">LOG OUT</button> -->
    </div>
</template>

<script setup>
    const email = ref("")
    const password = ref("")

    const loginGoogle= async()=>{
        const userCreds = await loginWithGoogle()
        const isThereADocAlreadyMade = await isThereUserDocWithUID(userCreds.uid)
        if(isThereADocAlreadyMade){
            await navigateTo('/tracker')
        }
        else{
            const result = await createUserDoc(userCreds)
            if(result){
                await navigateTo('/tracker')
            }
        }    
    }

    const loginEmail = async()=>{
        const result = await loginWithEmail(email.value, password.value)
        if(result==true){
            await navigateTo('/tracker')
        }      
    }

    onBeforeMount(async()=>{
        const isSignedIn = await isUserSignedIn()
        if(isSignedIn){
            await navigateTo('/tracker')
        }
    })
</script>

<style>
    body{
        transition: all ease 0.5s;
        background-color: #121212;
        color: #FFF;
        font-family: Arial, Helvetica, sans-serif;
    }
</style>

<style scoped> 

    h1{
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;
    }

    #logins {
        text-align: center;
        align-items: center;
        display: flex; 
        flex-direction: column;

        -ms-transform: translateY(65%);
        transform: translateY(65%);
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
        color: #000000;
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