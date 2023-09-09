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
                <div v-for="category in userCategories">
                    {{category}} ..... <input type="number" >
                    <br>
                    <br>
                </div>
                <button @click="createNewCategory()">+</button>
                <input v-model="newCategory" type="text">
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

    const newCategory = ref('')

    const isLoaded = ref(false)

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
        createNewUserCategory(uid, userCategories.value, newCategory.value)
        newCategory.value = ""
    }

    onMounted(async()=>{
        uid = await getUID()
        fetchedData = await thisMonthsData(uid)
        
        let userCats = await getUsersCategories(uid)
        userCategories.value = userCats

        selectedYear.value = getThisYear()
        selectedMonthIndex.value= getThisMonthNumber()
        updateCharts(getThisMonthThreeChar(),getThisYear())
    })
</script>

<style>
img[src$="../public/tracker-icon.svg"] #my-path {
    fill: red !important;
}
</style>

<style scoped>
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
}

</style>