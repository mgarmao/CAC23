<template>
    <div id="header">
        <div id="back-btn"><NuxtLink to="/"><img src="../public/angle-left-solid.svg" alt="back"></NuxtLink></div>
        <div id="this-month">This Month</div>
        <div id="month">{{month}}</div>
        <div id="profile-btn"><img src="../public/user-solid.svg" alt="profile" id="profile-icon"></div>
    </div>

    <div id="month-stats">
        <div id="monthly-total" >Monthly Total: $<span v-if="isLoaded">{{items[1]}}</span></div>
    </div>

    <div id="input-section">
        <div id="plus-btn" @click="newExpense">+</div>
        <div id="text-input">
            <input id="name-input" placeholder="Name" v-model="inputName">
            <textarea id="description-input" placeholder="Description" v-model="inputDescription"></textarea>
        </div>
        <div id="category-input">
            <select id="categoy-selector" placeholder="Category" v-model="chosenCategory">
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Tech">Tech</option>
                <option value="Other">Other</option>
            </select>
        </div>
        <div >
            <input id="dollars-input" placeholder="$" v-model="inputPrice">
        </div>        
    </div>

    <div id="expense">
        <div v-if="!isLoaded">
            Loading...
        </div>
        <div v-if="isLoaded">
            <div v-for="item in items[0]" :key="item[1]">
                <div class="item">
                    <div class="item-header">
                        <div class="item-name-date">
                            <div class="item-name">{{ item[0].Name }}</div>
                            <div class="item-date">{{ toDate(item[2]) }}</div>
                        </div>
                        <div class="item-description">{{ item[0].Description }}</div>
                    </div>
                <div class="item-details">
                    <div class="item-category">{{ item[0].Category }}</div>
                    <div class="item-price">${{ item[0].Price }}</div>
                    
                    <img src="../public/more-icon.svg" alt="..." class="item-options" @click="openModal(item[1])"/>
                    
                    <div v-if="isModalOpen">
                        <ExpenseOptions @close="closeModal" @deletedItem="getData" :docID="targetExpenseID" :UID="uid"/>
                    </div>
                </div>                
            </div>
            <hr>
            <br>    
            </div>
        </div>
    </div>
    
</template>

<script setup>   
    const uid = ref()

    const isLoaded = ref(false);
    const items = ref();
    const currentMonthExpenses = ref(500)

    const inputName = ref("")
    const inputDescription = ref("")
    const chosenCategory = ref("")
    const inputPrice = ref()

    const isModalOpen = ref(false)
    const targetExpenseID = ref()

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date();
    const month = ref(months[d.getMonth()]); 

    const openModal = (docID)=>{
        isModalOpen.value = true;
        targetExpenseID.value = docID
    }

    const closeModal = ()=>{
        isModalOpen.value = false;
    }

    function toDate(rawDate){
        let outputDate = ""
        if(typeof rawDate == "object"){
            const date = String(rawDate)

            const dateStamp = date.substr(0,21)
            const dayOfWeek = date.substr(0,3)
            const month = date.substr(4,4)
            const day = date.substr(8,2)
            const year = date.substr(11,4)
            const hour = date.substr(16,2)
            const minute = date.substr(19,2)

            outputDate = month+day
        }
        else{
            outputDate = rawDate.toString().substr(0,10)
        }
        
        return outputDate
    }

    const newExpense = async()=>{
        if((inputName.value != "") && (inputDescription.value!="")&&(inputPrice.value!="")&&(chosenCategory.value!="")){
            await createNewExpense(uid.value, inputName.value, inputDescription.value, inputPrice.value, chosenCategory.value)
            getData()
        }
    }

    const getData = async()=>{
        uid.value = await getUID()
        const result = await getTrackerData(uid.value)
        items.value = result
        isLoaded.value = true
    }

    onMounted(async () => {
        getData()
    });
</script>

<style scoped>
    input, textarea, input:focus, textarea:focus, select{
        border:none;
        outline: none;
        color: #ffffff;
    }

    hr{
        border-color: #282828;
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

    .item{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1rem;
        font-size: 15px;
    }

    .item-header{
        padding-left: 0.5rem;
        width: 15rem;
    }

    .item-name-date{
        display: flex;
    }

    .item-date{
        padding-left: 0.8rem;
        width: 50px;
        margin-top: 0.25rem;
    }

    .item-name{
        font-size: 20px;
        padding-bottom: 0.2rem;

        max-width: 10rem; 
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .item-description{
        max-width: 15rem; 
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .item-category{
        text-align: center;
        width: 3rem;
    }

    .item-price{
        width: 3rem; 
        overflow: hidden;
        text-overflow: ellipsis;        
    }

    .item-options{
        width: 0.5rem;
        margin-top: -0.2rem;
    }

    .item-details{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 10px;
        height: 1rem;
        
        padding-top: 1.4rem;
        font-size: 18px;
    }
</style>
