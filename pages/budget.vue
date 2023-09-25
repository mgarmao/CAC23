<template>
    <div>
        <div id="body">
            <h1 v-if="isLoaded&&!noData">Budget</h1>
            <div v-if="isLoaded&&!noData">
                <div class="container"> 
                    <LineChart :xData="lineChartData[0]" :yData="lineChartData[1]" v-if="isLoaded"></LineChart>
                </div>
                <br>
            </div>
            <div class="container" v-if="isLoaded">
                Total Budget: ${{ Number(totalBudget) }}
                <br>
                <div v-if=" Math.round((thisMonthsTotal/totalBudget)*1000)/1000>1">
                    Over budget by {{((Math.round(((thisMonthsTotal/totalBudget)-1)*1000)/10))}}%
                </div>
                <div v-else>
                    You have used {{ Math.round((thisMonthsTotal/totalBudget)*100) }}% of your budget
                </div>
                <br>
                <div v-for="category in userCategories.length" :key="userCategories[category-1]" class="budget-input">
                    <div class="cat-name">{{userCategories[category-1]}} <span class="cat-percent">{{ Math.round((budgets[category-1]/getTotalBudget(budgets))*100) }}%</span></div>
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

    function formatDateToYMD(date){
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    
    const updateCharts = async(selectMonth, selectYear)=>{
        isLoaded.value = false
        fullMonth.value = monthNames[selectedMonthIndex.value]

        data.value = []
        data.value.push(fetchedData[0].filter(obj => obj.month.includes(selectMonth)&&obj.year.includes(selectYear)))
        
        ///
        if(data.value[0].length>0){
            noData.value = false
            
            let expenses = []

            for(let i=0; i<data.value[0][0].data.length; i++){
                expenses.push(data.value[0][0].data[i])
            }        
            
            lineChartData.value[0] = []
            lineChartData.value[1] = []
            
            let previousDate = ""
            let agragatingPrice = false
            let agragatePrice = 0
            
            for(let i in expenses){
                const expensePrice = expenses[i][0].Price
                const expenseDate = formatDateToYMD(timestampToDate(expenses[i][0].Date))
                
                if(expenseDate == previousDate){
                    agragatingPrice = true
                    agragatePrice = agragatePrice + expensePrice
                }

                else{
                    if(agragatingPrice){
                        lineChartData.value[1][lineChartData.value[1].length-1]=agragatePrice
                        lineChartData.value[0][lineChartData.value[1].length-1]= previousDate
                    }

                    lineChartData.value[1].push(expensePrice)
                    lineChartData.value[0].push(expenseDate)

                    agragatePrice = expensePrice
                    agragatingPrice = false
                }
                previousDate = expenseDate
            }
            if(agragatingPrice){
                lineChartData.value[1][lineChartData.value[1].length-1]= agragatePrice
                lineChartData.value[0][lineChartData.value[1].length-1]= previousDate
            }

            let totalPrice = 0
            for(let i in lineChartData.value[1]){
                totalPrice = totalPrice + lineChartData.value[1][i]
                lineChartData.value[1][i] = totalPrice
            }
        }
        else{
            noData.value = true
        }
        thisMonthsTotal.value = lineChartData.value[1][lineChartData.value[1].length-1]
        setTimeout(() => { isLoaded.value = true }, 300);
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