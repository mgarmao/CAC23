<template>
    <div class="modal-overlay" @click.self="handleChange">
        <div class="modal-container">
            <button @click="handleDelete">Delete</button>
        </div>
    </div>
</template>
  
<script setup>
    const emit = defineEmits(['close','deletedItem'])
    const props = defineProps(['UID','docID'])

    const handleChange = () => {
      emit('close')
    }

    const handleDelete = ()=>{
      emit('deletedItem')
      deleteExpense(props.UID, props.docID)
      emit('close')
    }

</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .modal-container {
    width: 80%;
    max-width: 600px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    color:black;
    
    margin-bottom:30%;
  }
  </style>
  