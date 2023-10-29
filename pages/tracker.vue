<template>
    <div>
        <div id="body" class="noSelect">
            <!-- <div id="header">
                <div id="back-btn" class="noSelect"><NuxtLink to="/"><img src="../public/angle-left-solid.svg" alt="back"></NuxtLink></div>
                <div id="profile-btn"><img src="../public/user-solid.svg" alt="profile" id="profile-icon"></div>
            </div> -->
            <div id="month-ticker" v-if="isLoaded">
                <button @click="goBackMonth"><img src="../public/angle-left-solid.svg" alt="["></button>
                <div id="selected-month-year">{{ selectedMonth }} {{ selectedYear }}</div>
                <button @click="goFowardMonth" :class="{'flip':true,'disabled':disableFowardBtn}"><img :class="{'disabled':disableFowardBtn}" src="../public/angle-left-solid.svg" alt="]"></button>
            </div>
            <div id="month-stats">
                <div id="monthly-total">Monthly Total: $<span v-if="isLoaded">{{monthlyTotal}}</span></div>
            </div>

            <div id="input-section" @click="checkFormValid" @keyup="checkFormValid">
                <div id="plus-btn" :class="{'noSelect':true,'disabled':buttonDisabled}" @click="newExpense">+</div>
                <div id="text-input">
                    <input id="name-input" placeholder="Name" v-model="inputName" :class="{'':!highlightInputName, 'highlight':highlightInputName}" @keypress="highlightInputName=false">
                    <textarea id="description-input" placeholder="Description" v-model="inputDescription"></textarea>
                </div>

                <div id="category-price-input" class="noSelect" v-if="isLoaded">
                    <input id="dollars-input" placeholder="$" v-model="inputPrice" :class="{'':!highlightPrice, 'highlight':highlightPrice}" type="number" @keypress="highlightPrice=false">
                    <select @click="checkFormValid" id="category-selector" placeholder="Category" v-model="chosenCategory" :class="{'':!highlightCategory, 'highlight':highlightCategory}" @change="highlightCategory=false" >
                        <option value="" disabled selected >Category</option>
                        <option v-for="category in userCategories" :value="category">{{category}}</option>
                    </select>
                    
                </div>
                    
            </div>

            <div id="expense">
                <div v-if="!isLoaded">
                    Loading...
                </div>
                <div v-if="isLoaded && !noItems">
                    <!-- <div v-if="month.month!=currentMonth" class="month-title">{{ month.month }} {{ month.year }} <span class="past-month-total">Total: ${{ month.monthlyTotal }}</span></div> -->
                    <div v-for="item in items.data" :key="item.month">
                        {{updateExpense(item[1],item[0].Name,item[2],item[0].Description,item[0].Category,item[0].Price)}}
                        <div class="item noSelect" @click.stop="openExpense(item[1],item[0].Name,item[2],item[0].Description,item[0].Category,item[0].Price)">
                            <div class="item-date">{{ toDate(item[2]) }}</div>
                            <div :class="{'item-header':true, 'shrink': isDescriptionEmpty(item[0].Description)}" >
                                <div :class="{'item-name':!isDescriptionEmpty(item[0].Description),'item-name-shrink':isDescriptionEmpty(item[0].Description)}" >{{ item[0].Name }}</div>
                            </div>
                            <br v-if="!isDescriptionEmpty(item[0].Description)">
                            <div class="container">
                                <div class="item-description" >{{ item[0].Description }}</div>
                                <div class="item-details">                            
                                    <div class="item-category">{{ item[0].Category }}</div>
                                    <div class="item-price">${{ item[0].Price }}</div>
                                    <img src="../public/more-icon.svg" alt="..." class="item-options" @click.stop="openModal(item[1],item[2])"/>
                                </div>  
                            </div>            
                        </div>
                        <hr>
                        <br>    
                    </div>
                </div>
                <div v-if="noItems" id="no-items-message">You Don't Have Any Expense For This Month</div>
                <div v-if="isModalOpen">
                    <ExpenseOptions @close="closeModal" @deletedItem="closeModelAndGetData" @dateChange="closeModelAndGetData" :docID="targetExpenseID" :UID="uid" :itemDate="targetExpenseDate"/>
                </div>
                <div v-if="isExpenseOpen">
                    <Expense @close="closeExpense" @getData="getDataDelayed" :name="targetName" :description="targetDescription" :price="targetPrice" :dateAndTime="targetDate" :docID="targetExpenseID" :UID="uid"/>
                </div>  
            </div>
        </div>
    </div>
</template>

<script setup>   
    const uid = ref()
    
    const isLoaded = ref(false);
    const items = ref();
    const monthlyTotal = ref()

    const noItems = ref(false)

    const disableFowardBtn = ref(true)

    const inputName = ref("")
    const inputDescription = ref("")
    const chosenCategory = ref("")
    const inputPrice = ref("")

    const userCategories = ref([])

    const isModalOpen = ref(false)
    const isExpenseOpen = ref(false)
    let result = []
    const targetExpenseID = ref()
    const targetExpenseDate = ref()

    const thisMonthHasAnItem = ref(false)
    
    const buttonDisabled = ref(true)

    const selectedMonthIndex = ref(0)
    const selectedMonth = ref("")


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
    const thisMonthNum = d.getMonth()
    const thisYear = d.getFullYear()
    const currentMonth = ref(month.value.substring(0,3))
    
    let startingMonth = ""
    let selectedMonth3Char = currentMonth.value
    const selectedYear = ref(2023)

    const openModal = (docID,date)=>{
        isModalOpen.value = true;
        targetExpenseDate.value = date
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

    const checkFormValid = ()=>{
        if((inputName.value != "")&&(inputPrice.value!="")&&(chosenCategory.value!="")&&(chosenCategory.value!="Category")){
            buttonDisabled.value = false;
        }
        else{
            buttonDisabled.value = true
        }

    }

    

    const newExpense = async()=>{
        if((inputName.value != "")&&(inputPrice.value!="")&&(chosenCategory.value!="")&&(chosenCategory.value!="Category")){
            await createNewExpense(uid.value, inputName.value, inputDescription.value, inputPrice.value, chosenCategory.value)
            inputName.value = ""
            inputDescription.value = ""
            inputPrice.value = ""
            chosenCategory.value = "Category"
            getDataDelayed()
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
        if(items.value!=undefined){
            monthlyTotal.value = items.value.monthlyTotal
            noItems.value = false
        }
        else{
            noItems.value = true
            monthlyTotal.value = 0
        }
    }

    const getDataDelayed = ()=>{
        setTimeout(() => { getData() }, 600);
    }

    const getData = async()=>{
        uid.value = await getUID()
        result = await getTrackerData(uid.value)

        items.value = result[0].filter(obj => obj.month.includes(selectedMonth3Char)&&obj.year.includes(selectedYear.value));
        if(items.value.length!=0){
            items.value = items.value[0]
            if(items.value.month==month){
                thisMonthHasAnItem.value = true
            }
        }
        else{
            items.value = undefined
            noItems.value = true
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

    const closeModelAndGetData = ()=>{
        closeModal()
        getDataDelayed()
    }

    const goBackMonth = ()=>{
        selectedMonthIndex.value--

        if((selectedMonthIndex.value)<=0){
            selectedMonthIndex.value = 12
            selectedYear.value--
        }

        selectedMonth.value = months[(selectedMonthIndex.value)-1]
        selectedMonth3Char = selectedMonth.value.substring(0,3)
        
        items.value = result[0].filter(obj => obj.month.includes(selectedMonth3Char)&&obj.year.includes(selectedYear.value));
        items.value = items.value[0]
        if(items.value==undefined){
            noItems.value = true
        }
        else{
            noItems.value = false
        }            
        disableFowardBtn.value = false
        getThisMonthsTotal()
    }

    const goFowardMonth=()=>{
        if(!(selectedMonthIndex.value==thisMonthNum+1&&selectedYear.value==thisYear)){
            disableFowardBtn.value = false
            
            selectedMonthIndex.value++

            

            if((selectedMonthIndex.value)>=13){
                selectedMonthIndex.value = 1 
                selectedYear.value++
            }
            
            selectedMonth.value = months[(selectedMonthIndex.value)-1]
            selectedMonth3Char = selectedMonth.value.substring(0,3)
            items.value = result[0].filter(obj => obj.month.includes(selectedMonth3Char)&&obj.year.includes(selectedYear.value));
            items.value = items.value[0]
            
            if(items.value==undefined){
                noItems.value = true
            }
            else{
                noItems.value = false
            }

            if(selectedMonthIndex.value==thisMonthNum+1&&selectedYear.value==thisYear){
                disableFowardBtn.value = true
            }
        }
        else{
            disableFowardBtn.value = true
        }
        getThisMonthsTotal()
    }

    function getMonthFromString(mon){
        return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
    }

    onMounted(async () => {
        await getData()
        if(items.value!=undefined){
            startingMonth = getMonthFromString(items.value.month)
            selectedMonthIndex.value = startingMonth
            selectedMonth.value = months[(selectedMonthIndex.value)-1]
        }
        else{
            startingMonth = getMonthFromString(currentMonth.value)
            selectedMonthIndex.value = startingMonth
            selectedMonth.value = months[(selectedMonthIndex.value)-1]
        }
        let userCats = await getUsersCategories(uid.value)
        userCategories.value = userCats
        isLoaded.value = true
    });

</script>

<style scoped>
    #body{
        margin: 0.2rem;
        padding: 0.2rem;
    }
    .container{
        display: flex;
    }

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

    #month-ticker{
        display: grid;
        grid-template-columns: 1fr 2.2fr 1fr;
        justify-content: center;
        text-align: center;
        font-size: 20px;
        gap: 0px;
        padding: 15px;
        background-color: #2a2a2a;
        border-radius: 5rem;

        max-width: 340px; /* Set the maximum width you want */
        margin: 0 auto; /* Center horizontally */

        margin-top: 1.2rem;
    }
    
    #month-ticker button{
        background-color: rgba(0, 0, 0, 0);
        border: none;
        text-align: right;
        cursor: pointer;
    }

    #month-ticker img{
        width: 12px;
        margin-top: 3px;
    }

    #month-ticker button.disabled{
        opacity: 40%;
        cursor:default;
    }

    #selected-month-year{
        font-size: 19px;
        margin-top: 0px;
        text-align: center;
        margin-bottom: -1rem;
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
        padding-top: 0px;
        padding-bottom: 0px;
        border-radius: 50%;

        font-size: 30px;
        color: black;
        cursor: pointer;
    }

    #plus-btn.disabled{
        cursor:default;
        opacity: 30%;
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
        cursor: pointer;
    }

    .item-header{
        display: flex;
        width: 18rem;
        margin-bottom: -0.8rem;
    }
    .shrink{
        width: 13rem;
        margin-bottom: -1.3rem;
    }

    .item-name{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width:15rem;
        font-size: 18px;
    }

    .item-name-shrink{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: -0.2rem;
        max-width: 12.5rem;
        font-size: 18px;
    }
    

    .item-date{
        color: #ffffffca;
        margin-left: 0.05rem;
        margin-bottom: 0.2rem;
        font-size: 14px;
        margin-top: 0.1rem;
    }   

    
    .item-description{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 12rem;
        font-size: 15px;
    }

    .item-category{
        text-align: center;
        margin-right: -2rem;
    }

    .item-price{
        text-align: center;
        margin-right: -3rem;
    }

    .item-options{
        margin-left: auto;
        margin-top: -0.3rem;
        cursor: pointer;
        padding-left: 0.7rem;
        padding-right: 0.7rem;
    }

    .item-details{
        flex: 1;
        display: grid;
        grid-template-columns:  1fr 1fr 1fr; 
        grid-gap: 10px;
        margin-bottom: 0rem;
    }

    #no-items-message{
        text-align: center;
    }

    .flip{
        transform: scaleX(-1);
        text-align: left;
        margin-left: -0.2rem;
    }
</style>
