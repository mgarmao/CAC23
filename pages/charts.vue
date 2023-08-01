<template>
    <div>
        <h1>Categories</h1>
        <PieChart></PieChart>
        <LineChart :xData="dateValues" :yData="priceValues" v-if="isLoaded"></LineChart>
    </div>
</template>

<script setup>
    import {getUID} from "../composables/auth.ts"
    const dateValues = ref([])
    const priceValues = ref([])
    const isLoaded = ref(false)

    onMounted(async()=>{
        const uid = await getUID()
        const data = ref( await thisMonthsData(uid))
        let previousDate = ""

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
        console.log(priceValues.value)



        


        isLoaded.value = true
    })

    function formatDateToYMD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

</script>

<style scoped>

</style>