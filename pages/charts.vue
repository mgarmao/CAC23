<template>
    <div>
        <h2> AUGS</h2>
        <div id="heading-chart">
            <PieChart :labels="categoriesKeysArray" :values="categoriesValueArray" :width="190" v-if="isLoaded"></PieChart>
            <br>
            <br>
            <div id="monthly-total" v-if="isLoaded">This Month's Total: ${{ data[0][0].monthlyTotal }}</div>
        </div>
        
        <h1>Categorical Breakdown</h1>
        <div v-for="category in categoriesKeysArray">
            <div id="category-container">
                <h3 id="category-title">{{ category }}: ${{ catLineChartData[category][0][(catLineChartData[category][0].length)-2] }}</h3>
                <LineChart :xData="catLineChartData[category][1]" :yData="catLineChartData[category][0]" v-if="isLoaded"></LineChart>
            </div>
            <br>
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

    const data = ref()

    const isLoaded = ref(false)

    const date = new Date()
    const day = Number(String(date).substring(9,10))

    onMounted(async()=>{
        const uid = await getUID()
        data.value = await thisMonthsData(uid)
        let previousDate = ""

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
                const thisItemsDay = Number(thisItemsDate.substring(9,10))
                const thisMonthAndYear = thisItemsDate.substring(0,7)
            
                const firstOfThisMonth = thisItemsDate.substring(0,9)+1
                
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
                if(!(n+1<categoryDocs.value[categoriesKeysArray.value[i]].length)&&(thisItemsDay!=day)){
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
    
        isLoaded.value = true
    })


    function formatDateToYMD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

</script>

<style>
img[src$="../public/tracker-icon.svg"] #my-path {
    fill: red !important;
}
</style>

<style scoped>
#heading-chart{
    background-color: #282828;
    border-radius: 1rem;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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