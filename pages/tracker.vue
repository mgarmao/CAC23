<template>
    <div id="header">
        <div id="back-btn" class="noSelect"><NuxtLink to="/"><img src="../public/angle-left-solid.svg" alt="back"></NuxtLink></div>
        <div id="this-month">This Month</div>
        <div id="month">{{month}}</div>
        <div id="profile-btn"><img src="../public/user-solid.svg" alt="profile" id="profile-icon"></div>
    </div>

    <div id="month-stats">
        <div id="monthly-total">Monthly Total: $<span v-if="isLoaded">{{monthlyTotal}}</span></div>
    </div>

    <div id="input-section">
        <div id="plus-btn" :class="{'noSelect':true,'disabled':true}" @click="newExpense">+</div>
        <div id="text-input">
            <input id="name-input" placeholder="Name" v-model="inputName" :class="{'':!highlightInputName, 'highlight':highlightInputName}" @keypress="highlightInputName=false">
            <textarea id="description-input" placeholder="Description" v-model="inputDescription"></textarea>
        </div>

        <div id="category-price-input" class="noSelect">
            <input id="dollars-input" placeholder="$" v-model="inputPrice" :class="{'':!highlightPrice, 'highlight':highlightPrice}" type="number" @keypress="highlightPrice=false">
            <select id="category-selector" placeholder="Category" v-model="chosenCategory" :class="{'':!highlightCategory, 'highlight':highlightCategory}" @change="highlightCategory=false">
                <option value="" disabled selected >Category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Tech">Tech</option>
                <option value="Other">Other</option>
            </select>
            
        </div>
              
    </div>

    <div id="expense">
        <div v-if="!isLoaded">
            Loading...
        </div>
        <div v-if="isLoaded && !noItems">
            <div  v-for="month in items[0]" :key="1">
                <div v-if="month.month!=currentMonth" class="month-title">{{ month.month }} {{ month.year }} <span class="past-month-total">Total: ${{ month.monthlyTotal }}</span></div>
                <div v-for="item in month.data" :key="item[1]">
                    {{updateExpense(item[1],item[0].Name,item[2],item[0].Description,item[0].Category,item[0].Price)}}
                    <div class="item noSelect" @click.stop="openExpense(item[1],item[0].Name,item[2],item[0].Description,item[0].Category,item[0].Price)">
                        <div :class="{'item-header':true, 'shrink': isDescriptionEmpty(item[0].Description) }" >
                            <div class="item-name-date">
                                <div class="item-name">{{ item[0].Name }}</div>
                                <div class="item-date">{{ toDate(item[2]) }}</div>
                            </div>
                            <div class="item-description" v-if="item[0].Description!=''">{{ item[0].Description }}</div>
                        </div>
                        <div class="item-details">
                            <div class="item-category">{{ item[0].Category }}</div>
                            <div class="item-price">${{ item[0].Price }}</div>
            
                            <img src="../public/more-icon.svg" alt="..." class="item-options" @click.stop="openModal(item[1])"/>
                        </div>              
                    </div>
                    <hr>
                    <br>    
                </div>
            </div>
        </div>
        <div v-if="noItems" id="no-items-message"> You Dont Have Any Purchases Yet</div>
        <div v-if="isModalOpen">
            <ExpenseOptions @close="closeModal" @deletedItem="getDataDelayed" @dateChange="getDataDelayed" :docID="targetExpenseID" :UID="uid"/>
        </div>
        <div v-if="isExpenseOpen">
            <Expense @close="closeExpense" @getData="getDataDelayed" :name="targetName" :description="targetDescription" :price="targetPrice" :dateAndTime="targetDate" :docID="targetExpenseID" :UID="uid"/>
        </div>  
    </div>
    
</template>

<script setup>   
    const uid = ref()
    
    const isLoaded = ref(false);
    const items = ref();
    const monthlyTotal = ref()

    const noItems = ref(false)

    const inputName = ref("")
    const inputDescription = ref("")
    const chosenCategory = ref("")
    const inputPrice = ref("")

    const isModalOpen = ref(false)
    const isExpenseOpen = ref(false)

    const targetExpenseID = ref()

    const thisMonthHasAnItem = ref(false)

    const targetDocID = ref("")
    const targetName = ref("")
    const targetDate = ref("")
    const targetDescription = ref("")
    const targetCategory = ref("")
    const targetPrice = ref("")

    const highlightInputName = ref(false)
    const highlightCategory = ref(false)
    const highlightPrice = ref(false)

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date();
    const month = ref(months[d.getMonth()]); 
    const currentMonth = ref(month.value.substring(0,3))
    
    const openModal = (docID)=>{
        isModalOpen.value = true;
        targetExpenseID.value = docID
    }

    const closeModal = ()=>{
        isModalOpen.value = false;
    }

    const openExpense = (docID,name,date,description,category,price)=>{
        targetDocID.value = docID
        targetName.value = name
        targetDate.value = date
        targetDescription.value = description
        targetCategory.value = category
        targetPrice.value = price

        isExpenseOpen.value= true
    }

    const closeExpense=()=>{
        isExpenseOpen.value= false
    }
    
    
    function updateExpense(docID,name,date,description,category,price){
        if(docID==targetDocID.value){
            targetName.value = name
            targetDate.value = date
            targetDescription.value = description
            targetCategory.value = category
            targetPrice.value = price
        }
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
        if((inputName.value != "")&&(inputPrice.value!="")&&(chosenCategory.value!="")){
            await createNewExpense(uid.value, inputName.value, inputDescription.value, inputPrice.value, chosenCategory.value)
            inputName.value = ""
            inputPrice.value = ""
            chosenCategory.value = "Category"
            setTimeout(() => { getData() }, 500);
        }
        else{
            if(inputName.value ==""){
                highlightInputName.value = true
            }

            if(inputPrice.value==""){
                highlightPrice.value = true
            }

            if(chosenCategory.value==""||chosenCategory.value=="Category"){
                highlightCategory.value= true
            }
        }
    }


    const getThisMonthsTotal = ()=>{
        if(items.value[0][0]!=undefined){
            let firstItemMonth = items.value[0][0].month
            let thisMonthTrunked = month.value.substring(0,3)
            if(firstItemMonth==thisMonthTrunked){
                monthlyTotal.value = items.value[0][0].monthlyTotal
            }
            else{
                monthlyTotal.value = 0
            }
        }
        else{
            monthlyTotal.value = 0
        }

    }

    const getDataDelayed = ()=>{
        setTimeout(() => { getData() }, 200);
    }

    const getData = async()=>{
        uid.value = await getUID()
        const result = await getTrackerData(uid.value)
        items.value = result
        isLoaded.value = true
        if(items.value[0].month==month){
            thisMonthHasAnItem.value = true
        }

        if(items.value[0].length==0){
            noItems.value = true
        }
        else{
            noItems.value = false
        }
        getThisMonthsTotal()
    }

    function isDescriptionEmpty (des){
        if(des==""){
            return true
        }
        else{
            return false
        }
    }

    onMounted(async () => {
        getData()
    });
</script>

<style scoped>
    input, textarea, input:focus, textarea:focus, select{
        outline: none;
        color: #ffffff;
        border: solid 1px #282828;
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

    .highlight{
        border-color: #fff;
    }
    
    #plus-btn{
        margin-top: 1rem;
        margin-right: 0.6rem;
        background-color: #7997FF;
        margin-bottom: 3rem;
        padding: 11px;
        padding-top: 3px;
        padding-bottom: 3px;
        border-radius: 50%;

        font-size: 30px;
        color: black;
        cursor: pointer;
    }

    #text-input{
        display: flex;
        flex-direction: column;
        width: 50%;
    }

    #name-input{
        min-height: 30px;
        border-radius: 5px 0px 0px 0px;
        background: #282828;
        font-size: 16px;
    }

    #description-input{
        border-radius: 0px 0px 0px 5px;
        resize: none;
        background: #282828;
        font-family:'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        margin-bottom: 1rem;
        margin-top: 0rem;
        padding-bottom: -0.5px;
        border: solid  1px;
        border-color: #282828;
    }

    #category-price-input{
        display: flex;
        flex-direction: column;
        width: 28%;
        margin-top: -0.14rem;
    }

    input#name-input{
        color: #fff;
    }

    textarea#description-input {
        color: #fff;
    }

    #category-selector{
        font-size: 16px;
        height: 2.2rem;
        background: #282828;
        color: #fff;
        cursor: pointer;
        border-radius: 0rem 0.4rem 0.4rem 0rem;
    }

    #dollars-input{
        font-size: 15px;
        height: 2.2rem;
        border-radius: 5px;
        background: #BB86FC;  
        color: #2a2a2a;  
        text-align: center;
    }

    #dollars-input::placeholder{
        color: #2a2a2ad1;
    }

    #expense{
        color: white;
    }

    .month-title{
        color: #909090;
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        padding-bottom: 0.7rem;
    }

    .past-month-total{
        margin-left: 0.3rem;
        font-size: 19px;
    }
    .item{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 0.2rem;
        font-size: 15px;
        border-radius: 0.4rem;
        cursor: pointer;
    }

    .item-header{
        padding-left: 0.5rem;
        width: 11rem;
    }

    .shrink{
        height: 24px;
        margin-top: 20px;
    }

    .item-name-date{
        display: flex;
    }

    .item-date{
        padding-left: 0.7rem;
        width: 25%;
        margin-top: 0.25rem;
        min-width: 3rem;
    }

    .item-name{
        font-size: 18px;
        padding-bottom: 0.2rem;
        width: 75%;
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
        margin-left: 1rem;
    }

    .item-price{
        text-align: center;
        width: 5rem; 
        overflow: hidden;
        text-overflow: ellipsis;   
    }

    .item-options{
        width: 0.5rem;
        margin-top: -0.2rem;
        margin-right: 0.5rem;
        margin-left: auto;
        cursor: pointer;
    }

    .item-details{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 10px;
        height: 1rem;
        
        padding-top: 1.4rem;
        font-size: 18px;
    }

    #no-items-message{
        text-align: center;
    }
</style>
