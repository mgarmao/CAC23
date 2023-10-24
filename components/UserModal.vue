<template>
    <div id="modal-overlay" @click.self="handleClose">
        <div id="modal-container">
           <button id="signOut" @click="signoutUser()">Sign Out</button>
        </div>
    </div>
</template>

<script setup>
    const emit = defineEmits(["close"])

    const handleClose = () => {
        emit("close")
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
        border-radius: 1rem 1rem 1rem 1rem;
        color:black;

        text-align: center;
        color:#fff;
    }

    #signOut{
        border: none;
        background-color: rgb(32, 93, 199);
        color: white;
        border-radius: 1rem;
        padding: 0.5rem;
        font-size: 15px;

    }
</style>