<template >
  
  <v-row justify="center" class="center-container" >
    
    <v-btn class="custom-btn" height="65px" color="#3FD69F" dark  
            to="/Patient">
          จัดการข้อมูลผู้ป่วยใหม่
        </v-btn>
    <!-- First Dialog -->
   
      <!-- Content for the first dialog -->
      <v-btn 
          to="/JOB"
          height="65px"
          class="distance"
          color="#3FD69F"
          dark
          
        >
          จัดการข้อมูลสำหรับJOB
        </v-btn>

    <!-- Second2 Dialog -->
    
  </v-row>

  
</template>




<style scoped>
.center-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 85vh;
  
  /* Optional: Set height to viewport height for vertical centering */
}

.distance {
  margin: 25px;
  color: #000000;
  border-radius:25px;
}


.custom-btn {
  color: #000000;
  border-radius:25px;

}
.Ambutext{
  color:#000000;
  font-size: 25px;
  font-family: Inter;
  background-color: #3FD69F;
}

</style>