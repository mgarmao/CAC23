<template>
    <div id="logins">
        <h1 id="title">Log in</h1>
        <input v-model="email" type="email" placeholder="Email" :class="true">
        <input v-model="password" type="password" placeholder="Password">
        <p v-show="loginErrorMessage" id="errorMessage">Your Email Or Password Is Incorrect</p>
        <p v-show="!loginErrorMessage"></p>
        <button @click="loginEmail" id="email-login-button">Login</button>
        <button id="login-google" @click="loginGoogle"><img src="../public/google-logo.svg"><p>Login With Google</p></button>
        <br>
        <button id="signup-link" @click="navigateTo('/signup')"><p>Don't Have and Account? Signup</p></button>
        <!-- <button @click="signOutUser">LOG OUT</button> -->
    </div>
</template>

<script setup>
    const email = ref("")
    const password = ref("")
    
    const loginErrorMessage = ref(false)

    const loginGoogle= async()=>{
        loginWithGoogle().then((userCreds)=>{
            isThereUserDocWithUID(userCreds.uid).then(async(isThereADocAlreadyMade)=>{
                if(isThereADocAlreadyMade){
                    await navigateTo('/tracker')
                }
                else{
                    createUserDoc(userCreds).then(async()=>{
                        await navigateTo('/tracker')
                    })
                }    
            })  
        })
    }

    const loginEmail = async()=>{
        const result = await loginWithEmail(email.value, password.value)
        if(result==true){
            await navigateTo('/tracker')
        }
        else{
            loginErrorMessage.value = true
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
        transform: translate(0, 60%);
    }

    input{
        width: 70%;
        margin-top: 0.5rem;
        border: none;
        border-radius: 0.2rem;
        font-size: 16px;
        padding: 0.5rem;
    }

    #errorMessage{
        color: rgb(216, 56, 56);
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
        margin-top: 1.3rem;
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

    #signup-link {
        margin-top: 1rem;
        color: #fff;
        background-color: rgb(121, 170, 255);
        border-radius: 0.5rem;
        border: none;
        display: flex;

        align-items: center; 
        justify-content: center; 
        cursor: pointer;

        transition: ease 0.3s;
    }

    #signup-link:hover{
        background-color: rgba(91, 142, 231, 0.754);
    }

    @media screen and (min-width: 900px) {
    #logins {
        transform: translate(0, 40%);
    }
    }
</style>