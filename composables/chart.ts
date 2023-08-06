export async function getLineChartData(data:any){
    return new Promise(async (resolve,reject)=>{
        let dateValues = []
        let priceValues = []

        const uid:any = await getUID()
        
        let previousDate = ""

        if(data[0].length>0){
            for(let i = 0; i<data[0][0].data.length; i++){
                if(!(previousDate == formatDateToYMD(data[0][0].data[i][2]))){
                    dateValues.push(formatDateToYMD(new Date(data[0][0].data[i][2])))
                }
                previousDate = formatDateToYMD(data[0][0].data[i][2])
            }


            let sameDateAgragatePrice = []
            let sameDateAdding = false
            let lastNoneMatchingDateI = 0
            
            for(let i = 0; i<data[0][0].data.length; i++){
                if(!(previousDate == formatDateToYMD(data[0][0].data[i][2]))){

                    if(sameDateAdding){
                        sameDateAgragatePrice.push(data[0][0].data[lastNoneMatchingDateI][0].Price)

                        let totalPrice = 0
                        for(let n=0; n<sameDateAgragatePrice.length; n++){
                            totalPrice = sameDateAgragatePrice[n]+totalPrice
                        }
                        
                        priceValues[lastNoneMatchingDateI] = totalPrice
                        
                        sameDateAdding=false
                    }


                    if(i>0){
                        const agragatePricePrice:number = data[0][0].data[i][0].Price+priceValues[lastNoneMatchingDateI]
                        priceValues.push(agragatePricePrice)
                    }
                    else{
                        priceValues.push(data[0][0].data[i][0].Price)
                    }

                    lastNoneMatchingDateI = i
                }

                else{
                    sameDateAgragatePrice.push(data[0][0].data[i][0].Price)
                    sameDateAdding = true
                }

                previousDate = formatDateToYMD(data[0][0].data[i][2])
            }

            if(sameDateAdding){
                sameDateAgragatePrice.push(data[0][0].data[lastNoneMatchingDateI][0].Price)
                let totalPrice = 0
                for(let n=0; n<sameDateAgragatePrice.length; n++){
                    totalPrice = sameDateAgragatePrice[n] +totalPrice
                }
                priceValues[lastNoneMatchingDateI] = totalPrice

                sameDateAdding=false
            }
        }

        priceValues.push(0) //Zeroing the line


        
        let categoriesKeysArray = priceValues
        let categoriesValueArray = dateValues

        resolve([categoriesKeysArray,categoriesValueArray])
        // categoriesValueArray.value = Object.values(categories).map((amount) => ((amount / data[0][0].data.length)*100)) //Percent
    })

    function formatDateToYMD(date:Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }
}

export function pieChartData(data:any){
    let categories:any = []

        for(let i=0; i<data[0][0].data.length; i++){
            if(categories.hasOwnProperty(data[0][0].data[i][0].Category)){
                categories[data[0][0].data[i][0].Category] = (categories[data[0][0].data[i][0].Category]+1)
            }
            else{
                categories[data[0][0].data[i][0].Category] = 1
            }
        }
        
}