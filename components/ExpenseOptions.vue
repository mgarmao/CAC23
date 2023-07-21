<template>
    <div class="modal-overlay" @click.self="handleChange">
        <div class="modal-container">
            <div>
              <input type="date" id="date-input" v-model="date" @keypress="checkIfDateInput">
              <input type="time" id="time-input" v-model="time">
              <br>
              <button @click="handleDateChange" id="change-btn" :disabled="buttonDisabled">Change Date</button>
            </div>
            <button id="delete-btn" @click="handleDelete">Delete Item</button>
        </div>
    </div>
</template>
  
<script setup>
  import {changeExpenseDate} from '../composables/firestore.ts';
  const emit = defineEmits(['close','deletedItem','dateChange'])
  const props = defineProps(['UID','docID'])
  const date = ref()
  const time = ref()
  const buttonDisabled = ref(true)

  const checkIfDateInput = () =>{
    if(date.value!=undefined){
      buttonDisabled.value = false
    }
  }

  const handleChange = () => {
    emit('close')
  }

  const handleDelete = ()=>{
    emit('deletedItem')
    deleteExpense(props.UID, props.docID)
    emit('close')
  }

  const handleDateChange = ()=>{
    emit('dateChange')
    changeExpenseDate(props.UID,props.docID,date.value,time.value)
  }
</script>

<style scoped>
  .modal-overlay {
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
  
  .modal-container {
    width: 80%;
    max-width: 600px;
    background-color: #282828;
    padding: 20px;
    border-radius: 8px;
    color:black;
    
    margin-bottom:30%;
    text-align: center;
  }

  #date-input{
    margin-right: 1rem;
  }
  
  #change-btn {
  padding: 10px 20px;
  margin-top: 0.5rem;
  border: none;
  background-color: #3498db;
  color: #fff;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

  #change-btn:hover {
    background-color: #2980b9;
  }

  #change-btn[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  #delete-btn{
    margin-top:2rem;
    padding: 6px 12px;
    border: none;
    background-color: #e74c3c;
    color: #fff;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  #delete-btn:hover {
    background-color: #c0392b;
  }

  input[type="date"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: 1px solid #444;
    padding: 8px;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
    background-color: #222; /* Dark background color */
    color: #fff; /* Light text color */
    transition: border-color 0.3s ease; /* Add transition for border color change */
  }

  /* Optional: Add some styles to indicate focus and hover */
  input[type="date"]:focus,
  input[type="date"]:hover {
    border-color: #3498db; /* Accent color for focus and hover state */
  }

  /* Custom calendar icon */
  input[type="date"]::-webkit-calendar-picker-indicator {
    background-image: url('../public/calendar.svg'); /* Replace with the path to your custom calendar icon */
    background-size: 16px; /* Set the size of your custom icon */
    background-position: center; /* Center the icon */
    background-repeat: no-repeat; /* Prevent icon repetition */
    color: transparent; /* Hide default arrow icon */
    padding-right: 5px;
  }

  input[type="time"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: 1px solid #444;
    padding: 8px;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
    background-color: #222; /* Dark background color */
    color: #fff; /* Light text color */
    transition: border-color 0.3s ease; /* Add transition for border color change */
  }

  /* Optional: Add some styles to indicate focus and hover */
  input[type="time"]:focus,
  input[type="time"]:hover {
    border-color: #3498db; /* Accent color for focus and hover state */
  }

  /* Custom clock icon */
  input[type="time"]::-webkit-calendar-picker-indicator {
    background-image: url('../public/clock.svg'); /* Replace with the path to your custom clock icon */
    background-size: 16px; /* Set the size of your custom icon */
    background-position: center; /* Center the icon */
    background-repeat: no-repeat; /* Prevent icon repetition */
    color: transparent; /* Hide default arrow icon */
    padding-right: 5px;
  }

  </style>
  