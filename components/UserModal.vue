<template>
    <div id="modal-overlay" @click.self="handleClose">
        <div id="modal-container">

            <div id="button-container" v-show="!areYouSure">
                <button id="signOut" @click="signOutUser()">Sign Out</button>
                <br>
                <br>
                <br>
                <button id="deleteAccount" @click="areYouSure=true">Delete Account</button>
            </div>

            <div v-show="areYouSure">
                <h3>Are You Sure You Want To Delete Your Account?</h3>
                <div id="yes-no-container">
                    <div><button id="yes" @click="deleteAccountAndData">Yes</button></div>
                    <div><button id="no" @click="areYouSure=false">No</button></div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
    const emit = defineEmits(["close"])
    const props = defineProps(["UID"])

    const areYouSure = ref(false)

    const handleClose = () => {
        emit("close")
    }

    const deleteAccountAndData = async()=>{
        await deleteAccountData(props.UID)
        deleteAccount()
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
        align-items: center;

        width: 70%;
        height: fit-content;
        max-width: 600px;
        background-color: #282828;
        padding: 20px;
        border-radius: 1rem 1rem 1rem 1rem;
        color:black;

        text-align: center;
        color:#fff;
    }

    #button-container{
        text-align: center;
    }


    #signOut{
        border: none;
        background-color: rgb(32, 93, 199);
        color: white;
        border-radius: 1rem;
        padding: 0.5rem;
        font-size: 15px;
    }

    #deleteAccount{
        border: none;
        background-color: rgb(186, 31, 31);
        color: white;
        border-radius: 1rem;
        padding: 0.5rem;
        font-size: 15px;
    }

    #yes-no-container{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
    }

    #yes{
        border: none;
        background-color: rgb(186, 31, 31);
        color: white;
        border-radius: 1rem;
        padding: 0.5rem;
        font-size: 15px;
    }

    #no{
        border: none;
        background-color: rgb(32, 93, 199);
        color: white;
        border-radius: 1rem;
        padding: 0.5rem;
        font-size: 15px;
    }

</style>