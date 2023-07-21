<template>
    <div id="modal-overlay" @click.self="handleClose" :class="{ 'fade-in':isOpen, 'fade-out': !isOpen}">
        <div id="modal-container" :class="{ 'slide-in': isOpen, 'slide-out':!isOpen}">
            <div id="icons">
                <img src="../public/down-arrow.svg" alt="back" id="down-icon" @click.self="handleClose">
                <img src="../public/more-icon.svg" alt="" id="more-icon" @click="isModalOpen=true">
            </div>

            <div id="name">{{ props.name }}</div>
            <div id="price">${{ props.price }}</div>
            <div id="date-and-time">{{formatDate(props.dateAndTime)}}</div>
            <div id="description">
                <img src="../public/shifted-bars.svg" id="description-icon" v-if="props.description!=''"/>
                <div id="description-text">{{ props.description }}</div>
            </div>
        </div>
    </div>
    <div v-if="isModalOpen">
        <ExpenseOptions @close="closeModal" @deletedItem="getDataDelayed" @dateChange="getDataDelayed" :docID="props.docID" :UID="props.UID"/>
    </div>
</template>

<script setup>
    const emit = defineEmits(["close","getData"])
    const props = defineProps(["name","price","description","dateAndTime","docID","UID"])

    const isOpen = ref(true)

    const isModalOpen = ref(false)

    const formatDate = (rawDate)=>{
        let dayOfWeek = String(rawDate).substr(0,3) 
        let month = String(rawDate).substr(4,3) 
        let day = String(rawDate).substr(8,2)
        let year = String(rawDate).substr(11,4)
        let fullTime = String(rawDate).substr(16,5)
        let hour = String(rawDate).substr(16,2)
        let minute = String(rawDate).substr(19,2)
        let meridiem = ""

        if(parseInt(hour)<10){
            fullTime = String(rawDate).substr(17,7)
            
        }
        if(parseInt(hour)<12){
            meridiem = "am"
        }
        else{
            hour = parseInt(hour)-12
            meridiem = "pm"
        }
        

        return month+" "+day+" "+year+" @"+hour+":"+minute+meridiem
    }

   

    const handleClose = () => {
        isOpen.value = false;
        setTimeout(() => emit("close"), 290)
    }

    const closeModal=()=>{
        isModalOpen.value= false
    }

    const getDataDelayed = ()=>{
        setTimeout(() => { emit("getData") }, 200);
    }
</script>

<style scoped>
    #modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
  
    #modal-container {
        width: 100%;
        height: 40%;
        max-width: 600px;
        background-color: #282828;
        padding: 20px;
        border-radius: 1.5rem 1.5rem 0rem 0rem;
        color:black;
        margin-top: auto;
        text-align: center;

        color:#fff;
    }

    #icons {
        margin-top: -0.3rem;
        display: flex;
        justify-content: space-between; /* This will push the images to the left and right edges of the container */
        /* Add any styles you want for the container */
    }

    #name{
        margin-top: 0.2rem;
        font-size: 30px;
    }
    
    #price{
        font-size: 28px;
        margin-top: 0.5rem;
    }

    #date-and-time{
        font-size: 20px;
        margin-top: 0.7rem;
    }

    #description{
        display: flex;
        align-items: center; 
        margin-top: 1rem;   
    }

    #description-icon{
        margin-right: 1rem;
        display: inline-block;
    }

    #description-text{
        display: inline-block;
        font-size: 20px;
    } 

    div.slide-in {
        animation: 0.3s slide-in;
    }

    div.slide-out {
        animation: 0.3s slide-out;
    }

    .fade-in{
        animation: 0.3s fade-in;
    }

    .fade-out{
        animation: 0.3s fade-out;
    }

    @keyframes fade-in{
        from {
            background-color: rgba(0, 0, 0, 0.0);
        }
        to {
            background-color: rgba(0, 0, 0, 0.3);
        }
    }

    @keyframes fade-out {
        from {
            background-color: rgba(0, 0, 0, 0.3);
        }
        to {
            background-color: rgba(0, 0, 0, 0.0);
        }
    }

    @keyframes slide-in {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }

    @keyframes slide-out {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(100%);
        }
    }  
</style>