<template>
    <div id="header">
        <div id="back-btn"><NuxtLink to="/"><img src="../public/angle-left-solid.svg" alt="back"></NuxtLink></div>
        <div id="this-month">This Month</div>
        <div id="month">{{month}}</div>
        <div id="profile-btn"><img src="../public/user-solid.svg" alt="profile" id="profile-icon"></div>
    </div>

    <div id="month-stats">
        <div id="monthly-total">Monthly Total: ${{currentMonthExpenses}}</div>
    </div>

    <div id="input-section">
        <div id="plus-btn" v-on:click="createNewExpense">+</div>
        <div id="text-input">
            <input id="name-input" placeholder="Name">
            <textarea id="description-input" placeholder="Description"></textarea>
        </div>
        <div id="category-input">
            <select id="categoy-selector" placeholder="Category" :value="chosenCategory">
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Tech">Tech</option>
                <option value="Other">Other</option>
            </select>
        </div>
        <div >
            <input id="dollars-input" placeholder="$" :value="dollarInput">
        </div>
    </div>

    <div id="expense" v-if="loaded">
        Hey
        {{ items.length }}
        <div v-for="item in items" :key="item.Name" >
            {{ item.Name }}
        </div>
    </div>
</template>

<script setup>   
    import getUserTrackerData from '../composables/get/getUserTrackerData.ts'
    import {onAuthStateChanged } from "firebase/auth";
    import { nextTick, ref } from 'vue';

    const { $auth } = useNuxtApp()
    const auth = $auth

    const items = ref(["names","other","Stuff"])
    console.log(items)
    const currentMonthExpenses = ref(500)
    const chosenCategory = ref("")
    const dollarInput = ref()

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date();
    const month = ref(months[d.getMonth()]); 
    const loaded = ref(false)

    const forceRender = async () => {
        // Here, we'll remove MyComponent
        loaded.value = false;

        // Then, wait for the change to get flushed to the DOM
        await nextTick();

        // Add MyComponent back in
        loaded.value = true;
    };
    
    onMounted(()=>{
        onAuthStateChanged(auth, async(user) => {
            if (user) {
                let data = await getUserTrackerData(user.uid)
                items.value = data.items
                console.log(items.value)
                forceRender()
                loaded.value = true 
            } 
        });
    })
</script>

<style scoped>
    input, textarea, input:focus, textarea:focus, select{
        border:none;
        outline: none;
        color: #ffffff;
    }

    #header{
        background:none;
    }

    #back-btn{
        margin-right: 1rem;
        margin-bottom: -0.35rem;
    }

    #this-month{
        font-size: 30px;
        margin-right: 1rem;
    }

    #month{
        color: #808080;
        font-size: 20px;
        margin-bottom: -0.2rem;
    }

    #monthly-total{
        color: #FFF;
        font-size: 30px;
        text-align: center;
        margin-top: 1rem;
        margin-bottom: 2rem;
    }
    
    #input-section{
        display: flex;
        justify-content: center;
    }
    
    #plus-btn{
        margin-top: 0.3rem;
        margin-right: 0.8rem;
        background-color: #7997FF;
        margin-bottom: 3rem;
        padding: 15px;
        padding-top: 8px;
        padding-bottom: 8px;
        border-radius: 50%;

        font-size: 30px;
        color: black;
    }

    #text-input{
        display: flex;
        flex-direction: column;
    }

    #name-input{
        min-height: 30px;
        border-radius: 5px 0px 0px 0px;
        background: #282828;
        font-size: 16px;
    }

    #description-input{
        border-radius: 0px 0px 5px 5px;
        resize: none;
        background: #282828;
        font-family:'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        margin-bottom: 1rem;
        margin-top: -0.1rem;
        padding-bottom: -0.5px;
    }

    input#name-input{
        color: #fff;
    }

    textarea#description-input {
        color: #fff;
    }

    #categoy-selector{
        font-size: 18px;
        height: 2.2rem;
        background: #282828;
        border:none;
        color: #fff;
        margin-left: -0.1rem;
    }

    #dollars-input{
        font-size: 15px;
        height: 2.2rem;
        width: 3rem;
        border-radius: 5px;
        background: #BB86FC;  
        color: #2a2a2a;  
        text-align: center;
    }

    #expense{
        color: white;
    }
</style>