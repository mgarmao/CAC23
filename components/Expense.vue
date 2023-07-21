<template>
    <div id="modal-overlay" @click.self="handleClose" :class="{ 'fade-in':isOpen, 'fade-out': !isOpen}">
        <div id="modal-container" :class="{ 'slide-in': isOpen, 'slide-out':!isOpen}">
            <div id="icons">
                <img src="../public/down-arrow.svg" alt="back" id="down-icon" @click.self="handleClose">
                <img src="../public/more-icon.svg" alt="" id="more-icon">
            </div>

            <div id="name">{{ props.name }}</div>
            <div id="price">${{ props.price }}</div>
            <div id="date-and-time">{{formatDate(props.dateAndTime)}}</div>
            <div id="description">
                <img id="description-icon"/>
                <div id="description-text">{{ props.description }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(["close"])
const props = defineProps(["name","price","description","dateAndTime"])

const isOpen = ref(true)


const formatDate = (rawDate)=>{
    let dayOfWeek = String(rawDate).substr(0,3) 
    let month = String(rawDate).substr(3,4) 
    // let month = String(rawDate).substr(3,4) 

    return rawDate
}

const handleClose = () => {
    isOpen.value = false;
    // Optional: You can add a delay before emitting the close event if you want the slide-out animation to complete before removing the modal.
    setTimeout(() => emit("close"), 290)
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
        display: flex;
        justify-content: space-between; /* This will push the images to the left and right edges of the container */
        /* Add any styles you want for the container */
    }

    #name{
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

    #description-text{
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