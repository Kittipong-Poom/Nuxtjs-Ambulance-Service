<template>
  <div class="hero">
    <div class="content">
      <h1>Ambulance</h1>
      <v-row justify="center" class="center-container">
        <v-btn class="custom-btn" height="65px" color="#3FD69F" dark to="/Patient">
          จัดการข้อมูลผู้ป่วยใหม่
        </v-btn>
        <!-- First Dialog -->
        <!-- Content for the first dialog -->
        <v-btn to="/JOB" height="65px" class="distance" color="#3FD69F" dark>
          จัดการข้อมูลสำหรับJOB
        </v-btn>
        <!-- Second2 Dialog -->
      </v-row>
    </div>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.hero {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.9;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(12, 3, 51, 0.3), rgba(12, 3, 51, 0.3)), url('/ambualance4.jpg');
  background-size: cover;
  z-index: 1;
}

.content {
  text-align: center;
  z-index: 1000; /* Ensure the content is above the pseudo-element overlay */
  
}

.content h1 {
  font-size: 160px;
  color: #ffffff;
  font-weight: 600;
}

.center-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 50vh;
}

.distance {
  margin: 25px;
  color: #000000;
  border-radius: 25px;
}

.custom-btn {
  color: #000000;
  border-radius: 25px;
}

.Ambutext {
  color: #000000;
  font-size: 25px;
  font-family: Inter;
  background-color: #3FD69F;
}
</style>
