<template>
    <div>
        <div id="body">
            <div id="month-ticker" >
                <button @click="goBackMonth" class="noSelect"><img src="../public/angle-left-solid.svg" alt="["></button>
                <div id="selected-month-year">{{ fullMonth }} {{ selectedYear }}</div>
                <button @click="goFowardMonth" :class="{'flip':true,'disabled':disableFowardBtn,'noSelect':true}"><img :class="{'disabled':disableFowardBtn}" src="../public/angle-left-solid.svg" alt="]"></button>
            </div>            
            <br>
            <div id="heading-chart">
                <h3 v-if="isLoaded&&noData" id="no-data-message">You Don't Have Any Expense For This Month</h3>
                <h3 v-if="!isLoaded">Loading...</h3>
                <PieChart v-if="isLoaded&&!noData" :labels="categoriesKeysArray" :values="categoriesValueArray" :width="190"></PieChart>
                <br>
                <br>
                <div  v-if="isLoaded&&!noData" id="monthly-total">This Month's Total: ${{ data[0][0].monthlyTotal }}</div>
            </div>
            
            <h1 v-if="isLoaded&&!noData">Categorical Breakdown</h1>
            <div v-if="isLoaded&&!noData" v-for="category in categoriesKeysArray">
                <div id="category-container"> 
                    <h3 id="category-title">{{ category }}: ${{ catLineChartData[category][0][(catLineChartData[category][0].length)-2] }}</h3>
                    <LineChart :xData="catLineChartData[category][1]" :yData="catLineChartData[category][0]" v-if="isLoaded"></LineChart>
                </div>
                <br>
            </div>
        </div>
    </div>
</template>

<script setup>
import { connectFirestoreEmulator } from "firebase/firestore";
import {getUID} from "../composables/auth.ts"
    const dateValues = ref([])
    const priceValues = ref([])
    const categoryDocs = ref([])

    const categoriesKeysArray = ref([])
    const categoriesValueArray = ref([])

    const catLineChartData = ref([])

    const data = ref([])
    let uid = ""
    let fetchedData = []
    const noData = ref(true)

    const disableFowardBtn = ref(true)

    const isLoaded = ref(false)

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthAbvs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lastDayOfMonths = [31,28,31,30,31,30,31,31,30,31,30,31]
    const date = new Date()
    const fullMonth = ref(monthNames[date.getMonth()])
    const day = Number(String(date).substring(8,10))
    const selectedMonthIndex = ref(1)
    const selectedMonth = ref(monthNames[(date.getMonth())])
    const selectedYear = ref(2023)


    const goBackMonth = ()=>{
        selectedMonthIndex.value--
        if((selectedMonthIndex.value)<0){
            selectedMonthIndex.value = 11
            selectedYear.value--
        }

        selectedMonth.value = monthAbvs[(selectedMonthIndex.value)]
        
        updateCharts(selectedMonth.value,selectedYear.value)
        disableFowardBtn.value = false
    }

    const goFowardMonth=()=>{
        if(!(selectedMonthIndex.value==getThisMonthNumber()&&selectedYear.value==getThisYear())){
            disableFowardBtn.value = false
            
            selectedMonthIndex.value++
            if((selectedMonthIndex.value)>=12){
                selectedMonthIndex.value = 0
                selectedYear.value++
            }
            
            selectedMonth.value = monthAbvs[(selectedMonthIndex.value)]
            updateCharts(selectedMonth.value,selectedYear.value)
            if(selectedMonthIndex.value==getThisMonthNumber()&&selectedYear.value==getThisYear()){
                disableFowardBtn.value = true
            }
        }
        else{
            disableFowardBtn.value = true
        }
    }

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
        let previousDate = ""
        
        ///
        if(data.value[0].length>0){
            noData.value = false
            for(let i = 0; i<data.value[0][0].data.length; i++){
                if(!(previousDate == formatDateToYMD(data.value[0][0].data[i][2]))){
                    dateValues.value.push(formatDateToYMD(new Date(data.value[0][0].data[i][2])))
                }
                previousDate = formatDateToYMD(data.value[0][0].data[i][2])
            }


            let sameDateAgragatePrice = []
            let sameDateAdding = false
            let lastNoneMatchingDateI = 0
            
            for(let i = 0; i<data.value[0][0].data.length; i++){
                if(!(previousDate == formatDateToYMD(data.value[0][0].data[i][2]))){

                    if(sameDateAdding){
                        sameDateAgragatePrice.push(data.value[0][0].data[lastNoneMatchingDateI][0].Price)

                        let totalPrice = 0
                        for(let n=0; n<sameDateAgragatePrice.length; n++){
                            totalPrice = sameDateAgragatePrice[n]+totalPrice
                        }
                        
                        priceValues.value[lastNoneMatchingDateI] = totalPrice
                        
                        sameDateAdding=false
                    }


                    if(i>0){
                        const agragatePricePrice = data.value[0][0].data[i][0].Price+priceValues.value[lastNoneMatchingDateI]
                        priceValues.value.push(agragatePricePrice)
                    }
                    else{
                        priceValues.value.push(data.value[0][0].data[i][0].Price)
                    }

                    lastNoneMatchingDateI = i
                }

                else{
                    sameDateAgragatePrice.push(data.value[0][0].data[i][0].Price)
                    sameDateAdding = true
                }

                previousDate = formatDateToYMD(data.value[0][0].data[i][2])
            }

            if(sameDateAdding){
                sameDateAgragatePrice.push(data.value[0][0].data[lastNoneMatchingDateI][0].Price)
                let totalPrice = 0
                for(let n=0; n<sameDateAgragatePrice.length; n++){
                    totalPrice = sameDateAgragatePrice[n] +totalPrice
                }
                priceValues.value[lastNoneMatchingDateI] = totalPrice

                sameDateAdding=false
            }

            priceValues.value.push(0) //Zeroing the linechart



            let categories = []

            for(let i=0; i<data.value[0][0].data.length; i++){
                if(categories.hasOwnProperty(data.value[0][0].data[i][0].Category)){
                    categories[data.value[0][0].data[i][0].Category] = (categories[data.value[0][0].data[i][0].Category]+1)
                    categoryDocs.value[data.value[0][0].data[i][0].Category].push([data.value[0][0].data[i][0]])
                }
                else{
                    categoryDocs.value[data.value[0][0].data[i][0].Category] = [data.value[0][0].data[i][0].Category]
                    categoryDocs.value[data.value[0][0].data[i][0].Category].push([data.value[0][0].data[i][0]])
                    categories[data.value[0][0].data[i][0].Category] = 1
                }
            }        


            if(data.value[0].length>0){
                for(let i = 0; i<data.value[0][0].data.length; i++){
                    if(!(previousDate == formatDateToYMD(data.value[0][0].data[i][2]))){
                        dateValues.value.push(formatDateToYMD(new Date(data.value[0][0].data[i][2])))
                    }
                    previousDate = formatDateToYMD(data.value[0][0].data[i][2])
                }


                let sameDateAgragatePrice = []
                let sameDateAdding = false
                let lastNoneMatchingDateI = 0
                
                for(let i = 0; i<data.value[0][0].data.length; i++){
                    if(!(previousDate == formatDateToYMD(data.value[0][0].data[i][2]))){

                        if(sameDateAdding){
                            sameDateAgragatePrice.push(data.value[0][0].data[lastNoneMatchingDateI][0].Price)

                            let totalPrice = 0
                            for(let n=0; n<sameDateAgragatePrice.length; n++){
                                totalPrice = sameDateAgragatePrice[n]+totalPrice
                            }
                            
                            priceValues.value[lastNoneMatchingDateI] = totalPrice
                            
                            sameDateAdding=false
                        }


                        if(i>0){
                            const agragatePricePrice = data.value[0][0].data[i][0].Price+priceValues.value[lastNoneMatchingDateI]
                            priceValues.value.push(agragatePricePrice)
                        }
                        else{
                            priceValues.value.push(data.value[0][0].data[i][0].Price)
                        }

                        lastNoneMatchingDateI = i
                    }

                    else{
                        sameDateAgragatePrice.push(data.value[0][0].data[i][0].Price)
                        sameDateAdding = true
                    }

                    previousDate = formatDateToYMD(data.value[0][0].data[i][2])
                }

                if(sameDateAdding){
                    sameDateAgragatePrice.push(data.value[0][0].data[lastNoneMatchingDateI][0].Price)
                    let totalPrice = 0
                    for(let n=0; n<sameDateAgragatePrice.length; n++){
                        totalPrice = sameDateAgragatePrice[n] +totalPrice
                    }
                    priceValues.value[lastNoneMatchingDateI] = totalPrice

                    sameDateAdding=false
                }
            }

            categoriesKeysArray.value = Object.keys(categories)
            categoriesValueArray.value = Object.values(categories)
            ////    
        
            ////
            previousDate=""
            for(let i=0; i<categoriesKeysArray.value.length; i++){
                catLineChartData.value[categoriesKeysArray.value[i]] = []
                catLineChartData.value[categoriesKeysArray.value[i]][0] = []
                catLineChartData.value[categoriesKeysArray.value[i]][1] = []

                let agragatePrice = 0
                let lastItemDate = ""
                let lastItemDay = 0
                let lastUniqueDateIndex = 0
                let agragatingPrice = false
                
                for(let n=1; n<categoryDocs.value[categoriesKeysArray.value[i]].length; n++){
                    const thisItemsDate = formatDateToYMD(timestampToDate(categoryDocs.value[categoriesKeysArray.value[i]][n][0].Date))
                    const thisItemsDay = Number(thisItemsDate.substring(8,10))
                    const thisMonthAndYear = thisItemsDate.substring(0,7)
                    const firstOfThisMonth = thisItemsDate.substring(0,8)+1
                    
                    const thisItemsPrice = categoryDocs.value[categoriesKeysArray.value[i]][n][0].Price


                    if(n==1&&(thisItemsDay!=1)){
                        catLineChartData.value[categoriesKeysArray.value[i]][0].push(0)                
                        catLineChartData.value[categoriesKeysArray.value[i]][1].push(firstOfThisMonth)
                    }

                    if(n==1){
                        for(let d=2; d<thisItemsDay; d++){
                            let dDate = ""
                            if(d>=10){
                                dDate = thisMonthAndYear+"-"+d
                            }
                            else{
                                dDate = thisMonthAndYear+"-0"+d
                            }
                            catLineChartData.value[categoriesKeysArray.value[i]][0].push(0)                
                            catLineChartData.value[categoriesKeysArray.value[i]][1].push(dDate)
                        }
                        lastUniqueDateIndex = n-1
                        catLineChartData.value[categoriesKeysArray.value[i]][0].push(thisItemsPrice)                
                        catLineChartData.value[categoriesKeysArray.value[i]][1].push(thisItemsDate)              
                    }
                    
                    else{
                        const previousPrice = catLineChartData.value[categoriesKeysArray.value[i]][0][(catLineChartData.value[categoriesKeysArray.value[i]][0].length)-1]
                        
                        if(lastItemDate==thisItemsDate){
                            if(!agragatingPrice){
                                agragatePrice = previousPrice
                            }
                            agragatePrice = thisItemsPrice + agragatePrice
                            agragatingPrice = true
                        }

                        else if(thisItemsDay!=lastItemDay+1){
                            let continuingPrice = previousPrice
                            if(agragatingPrice){
                                catLineChartData.value[categoriesKeysArray.value[i]][0][lastUniqueDateIndex]= agragatePrice                
                                catLineChartData.value[categoriesKeysArray.value[i]][1][lastUniqueDateIndex] = lastItemDate
                                continuingPrice = agragatePrice
                                agragatePrice = 0
                                agragatingPrice = false
                            }

                            lastUniqueDateIndex = catLineChartData.value[categoriesKeysArray.value[i]][0].length-1
                            for(let d=lastItemDay+1; d<thisItemsDay; d++){
                                let dDate = ""
                                if(d>=10){
                                    dDate = thisMonthAndYear+"-"+d
                                }
                                else{
                                    dDate = thisMonthAndYear+"-0"+d
                                }
                                catLineChartData.value[categoriesKeysArray.value[i]][0].push(continuingPrice)                
                                catLineChartData.value[categoriesKeysArray.value[i]][1].push(dDate)
                            }  
                            catLineChartData.value[categoriesKeysArray.value[i]][0].push(thisItemsPrice+continuingPrice)                
                            catLineChartData.value[categoriesKeysArray.value[i]][1].push(thisItemsDate)       
                        }
        
                        else{
                            let continuingPrice = catLineChartData.value[categoriesKeysArray.value[i]][0][catLineChartData.value[categoriesKeysArray.value[i]][0].length-1]
                            if(agragatingPrice){
                                catLineChartData.value[categoriesKeysArray.value[i]][0][catLineChartData.value[categoriesKeysArray.value[i]][0].length-1]= agragatePrice                
                                catLineChartData.value[categoriesKeysArray.value[i]][1][catLineChartData.value[categoriesKeysArray.value[i]][0].length-1] = lastItemDate
                                continuingPrice = agragatePrice
                                agragatePrice = 0
                                agragatingPrice = false
                            }
                            
                            
                            lastUniqueDateIndex = catLineChartData.value[categoriesKeysArray.value[i]][0].length-1
                            catLineChartData.value[categoriesKeysArray.value[i]][0].push(thisItemsPrice+continuingPrice)                
                            catLineChartData.value[categoriesKeysArray.value[i]][1].push(thisItemsDate)
                        }
                        
                    }

                    if(agragatingPrice&&(thisItemsDay!=lastItemDay)){
                        catLineChartData.value[categoriesKeysArray.value[i]][0].push(agragatePrice)                
                        catLineChartData.value[categoriesKeysArray.value[i]][1].push(lastItemDate)
                        agragatePrice = 0
                        agragatingPrice = false
                    }

                    //Continuing line until present day
                    if((n+1<=categoryDocs.value[categoriesKeysArray.value[i]].length)&&(thisItemsDay!=day)){
                        let continuingPrice = 0
                        if(agragatingPrice){
                            continuingPrice = agragatePrice

                            catLineChartData.value[categoriesKeysArray.value[i]][0][catLineChartData.value[categoriesKeysArray.value[i]][0].length-1]=agragatePrice                
                            catLineChartData.value[categoriesKeysArray.value[i]][1][catLineChartData.value[categoriesKeysArray.value[i]][0].length-1]= lastItemDate

                            agragatePrice = 0
                            agragatingPrice = false
                        }
                        else{
                            const previousPrice = catLineChartData.value[categoriesKeysArray.value[i]][0][(catLineChartData.value[categoriesKeysArray.value[i]][0].length)-1]
                            continuingPrice = previousPrice
                        }

                        if(getThisMonthNumber()==selectedMonthIndex.value){
                            for(let d=thisItemsDay+1; d<=day; d++){
                                let dDate = ""
                                if(d>=10){
                                    dDate = thisMonthAndYear+"-"+d
                                }
                                else{
                                    dDate = thisMonthAndYear+"-0"+d
                                }
                                catLineChartData.value[categoriesKeysArray.value[i]][0].push(continuingPrice)                
                                catLineChartData.value[categoriesKeysArray.value[i]][1].push(dDate)
                            }
                        }
                        else{
                            let lastDay = lastDayOfMonths[selectedMonthIndex.value]

                            if((selectedMonthIndex.value+1)==2 && selectYear%4==0){
                                lastDay = 29
                            }

                            for(let d=thisItemsDay+1; d<=lastDay; d++){
                                let dDate = ""
                                if(d>=10){
                                    dDate = thisMonthAndYear+"-"+d
                                }
                                else{
                                    dDate = thisMonthAndYear+"-0"+d
                                }
                                catLineChartData.value[categoriesKeysArray.value[i]][0].push(continuingPrice)                
                                catLineChartData.value[categoriesKeysArray.value[i]][1].push(dDate)
                            }
                        }
                        
                    }
                    else if (n+1>=categoryDocs.value[categoriesKeysArray.value[i]].length){
                        if(agragatingPrice){
                            catLineChartData.value[categoriesKeysArray.value[i]][0][catLineChartData.value[categoriesKeysArray.value[i]][0].length-1]=agragatePrice                
                            catLineChartData.value[categoriesKeysArray.value[i]][1][catLineChartData.value[categoriesKeysArray.value[i]][0].length-1] = thisItemsDate
                            agragatePrice = 0
                            agragatingPrice = false
                        }
                    }
                    lastItemDate = thisItemsDate
                    lastItemDay = thisItemsDay

                }
                catLineChartData.value[categoriesKeysArray.value[i]][0].push(0)
            }
            
        
            // categoriesValueArray.value = Object.values(categories).map((amount) => ((amount / data.value[0][0].data.length)*100)) //Percent
            catLineChartData.value.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
        else{
            noData.value = true
        }
        setTimeout(() => { isLoaded.value = true }, 100);
        ///
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

    onMounted(async()=>{
        uid = await getUID()
        fetchedData = await thisMonthsData(uid)
        selectedYear.value = getThisYear()
        selectedMonthIndex.value= getThisMonthNumber()
        updateCharts(getThisMonthThreeChar(),getThisYear())
        isLoaded.value = true
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

#category-container{
    background-color: #282828;
    border-radius: 1rem;
    padding: 1rem;
}
#category-title{
    margin-top: 0rem;
}
</style>