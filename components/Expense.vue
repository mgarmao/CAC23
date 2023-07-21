<template>
    <div id="modal-overlay" @click.self="handleClose">
        <div id="modal-container" :class="{ 'slide-in': isOpen, 'slide-out':!isOpen}" v-show="isOpen">
            <div id="icons">
                <img src="" alt="back" id="down-icon" @click.self="handleClose">
                <img src="" alt="" id="more-icon">
            </div>

            <div id="name">{{ props.name }}</div>
            <div id="price">${{ props.price }}</div>
            <div id="date-and-time">{{ props.dateAndTime }}</div>
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


const handleClose = () => {
    isOpen.value = false;
    // Optional: You can add a delay before emitting the close event if you want the slide-out animation to complete before removing the modal.
    setTimeout(() => emit("close"), 500)
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
        border-radius: 1rem 1rem 0rem 0rem;
        color:black;
        margin-top: auto;
        text-align: center;

        color:#fff;
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
        animation: 0.5s slide-in;
    }

    div.slide-out {
        animation: 0.5s slide-out;
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