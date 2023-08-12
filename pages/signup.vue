<template >
    <div id="sign-in">
        <h1 id="title">Sign up</h1>
        <input v-model="email" placeholder="Email">
        <input v-model="password" placeholder="Password">
        <button id="create-button" @click="createUser">Create Account</button>
        <button id="login-google" @click="loginGoogle"><img src="../public/google-logo.svg"><p>Continue With Google</p></button>
    </div>
</template>

<script setup>
    const email = ref("")
    const password = ref("")

    const createUser=async ()=>{
        const userCreds = await createNewUserWithEmail(email.value,password.value)
        if(userCreds){
            const result = await createUserDoc(userCreds)
        }
        if(result==true){
            await navigateTo('/tracker')
        }
    }

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

    #sign-in {
        margin-top: 50%;
        text-align: center;
        align-items: center;
        display: flex; 
        flex-direction: column;

        margin-top: 40%;
    }

    input{
        width: 70%;
        margin-top: 0.5rem;
        border: none;
        border-radius: 0.2rem;
        font-size: 16px;
        padding: 0.5rem;
    }

    #create-button{
        font-size: 18px;
        background: #c392ff;  
        border: none;
        border-radius: 0.5rem;
        width: 50%;
        margin-top: 0.5rem;
        padding: 0.3rem;
        cursor: pointer;
        transition: ease 0.3s;
        color: #000000;
    }

    #create-button:hover{
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