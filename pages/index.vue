<template>
  <div class="container-1 d-flex flex-column ">
    <h1 class=" justify-center d-flex" style="color: #007bff;">Register To Request New Patient Medical Records</h1>
    <div class="border">
      <div class="d-flex justify-space-around align-center bg-grey-lighten-4">
        <div class="ma-4 text-center">
          <v-img class="bg-white rounded-image" width="300" :aspect-ratio="1"
            src="https://i.pinimg.com/564x/5e/2e/c3/5e2ec394bd563cb03cc089b8ca1854d0.jpg"></v-img>
            <nuxt-link to="Patient">
          <v-btn color="#285CA2" class="mt-2 white--text button" >
            NEW PATIENT
          </v-btn>
          </nuxt-link>
        </div>

        <!-- Blog2 -->
        <div class="ma-4 text-center">
          <v-img class="bg-white rounded-image" width="300" :aspect-ratio="1"
            src="https://static.vecteezy.com/system/resources/previews/021/847/126/non_2x/ambulance-car-and-doctors-in-city-ambulance-staff-or-medical-emergency-service-concept-illustration-vector.jpg" cover></v-img>          
            <nuxt-link to="/Queue">
          <v-btn color="#285CA2" class="mt-2 white--text  button  " >
            New Job
          </v-btn>
          </nuxt-link>       
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body{
  font-family: 'Open Sans', sans-serif;
}
.container-1 {
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 80vh;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  font-family: 'Open Sans', sans-serif;
  font-size: 35px;
  text-align: center;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.border {
  border: 1px solid black;
  border-radius: 15px;
  overflow: hidden;
}

.rounded-image {
  border-radius: 15px;
  width: 100%; /* Ensure images take up 100% of the container width */
  height: auto;
  max-width: 100%;
}

.button {
  font-family: 'Open Sans', sans-serif;
  width: 100%; /* Full width on mobile */
  height: 45px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 15px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  
  
}
.button {
  /* ... existing styles ... */
  @media (max-width: 600px) {
    height: 35px;
    font-size: 12px;
  }
}


.button:hover {
  background-color: #285CA2;
  box-shadow: 0px 15px 20px rgba(0, 47, 255, 0.4);
  color: #ffffff;
  transform: translateY(-7px);
}

@media (max-width: 600px) {
  .container-1 {
    padding: 10px;
  }
  h1 {
    font-size: 20px;
  }
}
</style>
