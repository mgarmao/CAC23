<template>
    <div>
        <div id="body">
            <div id="header">
                <h1 v-if="isLoaded">Budget</h1>
                <img v-show="isLoaded" @click="userModal" id="user-img" src="../public/user-solid.svg" alt="">
            </div>

            <div v-if="isLoaded&&!noData">
                <div class="container"> 
                    <LineChart :yData="lineChartData[0]" :xData="lineChartData[1]" v-if="isLoaded"></LineChart>
                </div>
                <br>
            </div>

            <div class="container" v-if="isLoaded">
                <h3>Total Budget: ${{ Number(totalBudget) }}</h3>
                
                <div v-if="Number(totalBudget)>0">
                    <div v-if=" Math.round((thisMonthsTotal/totalBudget)*1000)/1000>1">
                        Over budget by {{((Math.round(((thisMonthsTotal/totalBudget)-1)*1000)/10))}}%
                    </div>
    
                    <div v-else>
                        You have used {{ Math.round((thisMonthsTotal/totalBudget)*100) }}% of your budget
                    </div>
                </div>

                <br>
                <div v-for="category in userCategories.length" :key="userCategories[category-1]" class="budget-input">
                    <div class="cat-name">{{userCategories[category-1]}} 
                        <span class="cat-percent" v-if="(getTotalBudget(budgets)!=0)&&(Math.round((budgets[category-1]/getTotalBudget(budgets))*100)!=NaN)&&(budgets[category-1]!=null)"> {{ Math.round((budgets[category-1]/getTotalBudget(budgets))*100) }}%</span>  
                        <span class="cat-percent" v-else>0%</span>
                    </div>
                    
                    <div class="cat-budget-input">
                        <input class="budget-input-field" @keyup="saveButtonDisabled=false" type="number" v-model="budgets[category-1]">
                        <img class="trash-btn" @click="deleteCategory(category-1)" src="../public/trash-can-regular.svg" alt="trash">
                    </div>
                </div>
                <br>
                <button @click="createNewCategory()" :disabled="addBtnDisabled" id="plus-button" class="button">+</button>
                <input @keyup="checkAddButtonDisabled()" v-model="newCategory" type="text" placeholder=" Add New Category" class="align-left" maxlength="15">
                <br>
                <br>
                <button @click="saveBudgets(), updateTotalBudgetDisplay(), saveButtonDisabled = true" class="save-button align-center" :disabled="saveButtonDisabled">Save Budget</button>
            </div>

            <UserModal v-if="openUserModal" :UID="uid" @close="closeModal"/>
            
        </div>
    </div>
</template>

<script setup>
import { connectFirestoreEmulator } from "firebase/firestore";
import {getUID} from "../composables/auth.ts"
    const lineChartData = ref([])

    const data = ref([])
    let uid = ""
    let fetchedData = []
    const noData = ref(true)

    const addBtnDisabled = ref(true)

    const newCategory = ref('')
    const budgets = ref([])
    const totalBudget = ref(0)
    const isLoaded = ref(false)
    const saveButtonDisabled = ref(true)
    const thisMonthsTotal = ref(0)
    const userCategories = ref([])

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthAbvs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date()
    const fullMonth = ref(monthNames[date.getMonth()])
    const selectedMonthIndex = ref(1)
    const selectedMonth = ref(monthNames[(date.getMonth())])
    const selectedYear = ref(2023)

    const todayDay = new Date().getDate()
    const todayMonth = new Date().getMonth()+1
    const todayYear = new Date().getFullYear()

    const openUserModal = ref(false)

    function formatDateToYMD(date){
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    
    const updateCharts = async(selectMonth, selectYear)=>{
        fullMonth.value = monthNames[selectedMonthIndex.value]

        data.value = []
        data.value.push(fetchedData[0].filter(obj => obj.month.includes(selectMonth)&&obj.year.includes(selectYear)))
        
        ///
        if(data.value[0].length>0){            
            createChartData(data.value[0][0])
            noData.value=false
        }
    }

    const getThisYear = ()=>{
        const date = new Date()
        return date.getFullYear()
    }

    const getThisMonthThreeChar = ()=>{
        const date = new Date()
        const monthAbv = monthAbvs[date.getMonth()]
        return monthAbv
    }

    const getThisMonthNumber =()=>{
        const date = new Date()
        return date.getMonth()
    }

    const createNewCategory = ()=>{
        if(newCategory.value!=""){
            userCategories.value.push(newCategory.value)
            budgets.value.push(0)
            updateUserCategory(uid, userCategories.value)
            updateCategoryBudgets(uid,budgets.value)
            newCategory.value = ""
        }
    }

    const saveBudgets = ()=>{
        fillBudgetArray(budgets.value)
        updateCategoryBudgets(uid,budgets.value)
        totalBudget.value = getTotalBudget(budgets.value)
    }

    const fillBudgetArray = (budgetArray)=>{
        for(let i=0; i<userCategories.value.length;i++){
            if(budgetArray[i]==undefined||budgetArray[i]==""){
                budgetArray[i]=0
            }
        }
        budgets.value = budgetArray
    }

    const updateTotalBudgetDisplay = ()=>{
        totalBudget.value = getTotalBudget(budgets.value)
    }

    const getTotalBudget = (budgetArray)=>{
        let total = 0 
        for(let i=0; i<budgets.value.length;i++){
            total=budgetArray[i]+total
        }
        return total
    }

    const deleteCategory=(categoryIndex)=>{
        userCategories.value.splice(categoryIndex,1)
        budgets.value.splice(categoryIndex, 1);
        updateCategoryBudgets(uid,budgets.value)
        updateUserCategory(uid,userCategories.value)
    }

    const checkAddButtonDisabled =()=>{
        if(newCategory.value!=""){
            addBtnDisabled.value=false
        }
        else{
            addBtnDisabled.value = true
        }
    }

    const userModal = ()=>{
        openUserModal.value = true;
    }

    const closeModal = ()=>{
        openUserModal.value = false;
    }

    const createChartData= (thisMonthData)=>{
        let chartData = []
        chartData[0] = []
        chartData[1] = []

        let totalPrice = 0
        let lastExpenseDay = 0
        let aggregating = false

        const monthExpense = thisMonthData.data
        for(let i=0;i<monthExpense.length;i++){
            const thisExpensePrice = monthExpense[i][0].Price
            const thisExpenseStringDate = new Date(monthExpense[i][2])
            const thisExpenseDate = formatDate(thisExpenseStringDate)
            const thisExpenseYear = thisExpenseStringDate.getFullYear()
            const thisExpenseMonth = thisExpenseStringDate.getMonth()+1
            const thisExpenseDay = thisExpenseStringDate.getDate()
            console.log(thisExpenseDay)
            
            if(i==0&&thisExpenseDay!=1){
                for(let n=1; n<thisExpenseDay; n++){
                    chartData[0].push(0)
                    chartData[1].push(thisExpenseYear+"-"+thisExpenseMonth+"-"+n)
                }
            }
            totalPrice = totalPrice+thisExpensePrice

            if(lastExpenseDay==thisExpenseDay){
                aggregating = true;
            }
            else if(aggregating){
                chartData[0].push(totalPrice)
                chartData[1].push(thisExpenseYear+"-"+thisExpenseMonth+"-"+lastExpenseDay)
                aggregating = false
            }
            else{
                chartData[0].push(totalPrice)
                chartData[1].push(thisExpenseDate)
            }

            lastExpenseDay = thisExpenseDay
            lastExpenseDay = thisExpenseDay
        }
        if(lastExpenseDay!=todayDay){
            for(let m=lastExpenseDay; m<=todayDay;m++){
                chartData[0].push(totalPrice)
                chartData[1].push(todayYear+"-"+todayMonth+"-"+m)
            }
        }
        lineChartData.value = chartData
        console.log(lineChartData.value[1])
    }   

    function formatDate(date) {
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year,month, day].join('-');
    }
 
        
    onMounted(async()=>{
        uid = await getUID()
        fetchedData = await thisMonthsData(uid)
        
        let userCats = await getUsersCategories(uid)
        userCategories.value = userCats

        selectedYear.value = getThisYear()
        selectedMonthIndex.value= getThisMonthNumber()
        updateCharts(getThisMonthThreeChar(),getThisYear())
        budgets.value = await getCatergoryBudgets(uid)
        totalBudget.value = await getTotalBudget(budgets.value)
        setTimeout(() => { isLoaded.value = true }, 100);
    })
</script>

<style>
img[src$="../public/tracker-icon.svg"] #my-path {
    fill: red !important;
}
</style>

<style scoped>
input{
    text-align: center;
    width: 50%;
    border-radius: 10rem;
    border: #282828;
}

input:focus{
    outline: none; 
    box-shadow: 0 0 2px 2px #1084ff; 
}

button:disabled{
    opacity: 0.4;
}

#header{
    display: flex;
}

#user-img{
    margin-left: auto;
    margin-right: 0.3rem;
    cursor: pointer;
}

#body{
    margin: 0.2rem;
    padding: 0.2rem;
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

.disabled{
    opacity: 65%;
    cursor: default;
}
#month-ticker button.disabled{
    cursor: default;
}

.flip{
    transform: scaleX(-1);
    text-align: left;
    margin-left: -0.2rem;
}

#selected-month-year{
    font-size: 22px;
    margin-top: 2px;
    text-align: center;
    margin-bottom: -1rem;
}

#heading-chart{
    background-color: #282828;
    border-radius: 1rem;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#no-data-message{
    text-align: center;
}

#category-title{
    margin-top: 0rem;
}

.container{
    background-color: #282828;
    border-radius: 1rem;
    padding: 1rem;
    text-align: center;
}

.budget-input{
    display: grid;
    grid-template-columns: 1.2fr 1fr; /* Three equal-width columns */
    gap: 10px; /* Add some gap between grid items */
    margin-bottom: 0.5rem;
    font-size: 17px;
    margin-bottom: 1.5rem;
}

.budget-input-field{
    font-size: 16px;
}

.save-button{
    border: none;
    background-color: rgb(32, 93, 199);
    color: white;
    border-radius: 1rem;
    padding: 0.5rem;
    font-size: 15px;
}

.align-center{
    display: block;
    margin: 0 auto;
}

.seperator{
    text-align: right;
}

.cat-name{
    text-align: right;
    margin-right: 0.8rem;
    font-size: 18px;
}

.cat-budget-input{
    display: inline-block;
    text-align: left;
    margin-left: 0.8rem;
    margin-top: -0.4rem;
}

.align-left{
    text-align: left;
    font-size: 16px;
}

#plus-button{
    border: none;
    background-color: rgb(32, 93, 199);
    color: white;
    border-radius: 1.5rem;
    padding-top: 0.11rem;
    padding-bottom: 0.11rem;
    font-size: 16px;
    margin-right: 0.2rem;
}

.budget-input-field{
    background-color: #d0d7eb;
}

.trash-btn{
    width: 1.3rem;
    margin-left: 0.9rem;
    margin-left: 1.8rem;
    cursor: pointer;
}

.cat-percent{
    color: rgba(255, 255, 255, 0.607);
    font-size: 15px;
}
</style>