<template>
    <div class="modal-overlay" @click.self="handleClose" :class="{ 'fade-in': isOpen, 'fade-out':!isOpen}">
        <div class="modal-container" :class="{ 'slide-in': isOpen, 'slide-out':!isOpen}">
            <div>
              <input type="date" id="date-input" :max="today" v-model="date" @click="checkIfDateInput" @keypress="checkIfDateInput">
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
  const props = defineProps(['UID','docID','itemDate'])
  const newDate = new Date(props.itemDate-1).toJSON().slice(0, 10)
  const newTime = String(props.itemDate).substring(16,24)
  const date = ref(newDate)
  const today = ref(new Date().toJSON().slice(0, 10))

  const time = ref(newTime)

  const isOpen = ref(true)
  const buttonDisabled = ref(true)

  const checkIfDateInput = () =>{
    const today = new Date()
    const inputDate = new Date(date.value)

    if((date.value!=undefined)&&(today>=inputDate)){
      buttonDisabled.value = false
    }
    else{
      buttonDisabled.value = true
    }
  }

  const handleClose = () => {
    isOpen.value = false;
    setTimeout(() => emit("close"), 90)
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

  function formatDateToYMD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }


  onMounted(()=>{
    checkIfDateInput()
  })
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

  div.slide-in {
    animation: 0.1s slide-in;
  }

  div.slide-out {
    animation: 0.1s slide-out;
  }

  @keyframes slide-in {
    from {
      padding: 0px;
      opacity: 0.2;
    }
    to {
      padding: 20px;
      opacity: 1;
    }
  }

  @keyframes slide-out {
    from {
      padding: 20px;
      opacity: 1;      
    }
    to {
      padding: 0px;
      opacity: 0.2;
    }
  }

  .fade-in{
    animation: 0.2s fade-in;
  }

  .fade-out{
    animation: 0.2s fade-out;
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

  </style>
  