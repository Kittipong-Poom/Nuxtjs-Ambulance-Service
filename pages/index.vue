<template>
  <div class="section">
     <!-- patient -->
    <v-card
      
      class="mx-auto my-12"
      max-width="374"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img
        cover
        height="250"
        src="https://cdn.discordapp.com/attachments/879568332402085888/1199760931761180732/pixlr-image-generator-1bbdf9c6-dc01-4fd1-b203-94acbeeb54b4.png?ex=65c3b770&is=65b14270&hm=6199992fab8d923fee7198eea53dc4c46f23f62589ae0be349f1098b92161dcb&"
      ></v-img>
        
      <v-btn to="/Patient" height="50px" class="distance" color="#3FD69F">
          Patient
        </v-btn>
    </v-card>

    <!-- job -->

    <v-card
      
      class="mx-auto my-12"
      max-width="374"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="deep-purple"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img
        cover
        height="250"
        src="https://cdn.discordapp.com/attachments/879568332402085888/1199764667485134858/image.png?ex=65c3baeb&is=65b145eb&hm=4d3ab5b088e95b9ff235e75335bf0ba3505c3be43033a9da3e07ce1d0c3e453c&"
      ></v-img>
        
      <v-btn to="/JOB" height="50px" class="distance" color="#3FD69F">
          Job
        </v-btn>
    </v-card>

<!-- Dashboard -->
    <v-card
      
      class="mx-auto my-12"
      max-width="374"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="deep-purple"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img
        cover
        height="250"
        src="https://cdn.discordapp.com/attachments/879568332402085888/1199762571243294841/image.png?ex=65c3b8f7&is=65b143f7&hm=1ed4736514b2d7ae743c355764d77ffdb3d9a94302c7ba336c1b6a2b2fd68c4c&"
      ></v-img>
        
      <v-btn to="/Dashboard" height="50px" class="distance" color="#3FD69F">
          Dashboard
      </v-btn>
    </v-card>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.section {
  margin: auto;
}

.distance {
  text-align: center;
  display:flex;
}
</style>