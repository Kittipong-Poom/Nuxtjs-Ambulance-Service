<template >
  
  <v-row justify="center" class="center-container" >
    <v-card-title>
          <h1 class="Ambutext">Ambulance Service</h1>
        </v-card-title>
    <img
    class="ambulance"
    src="/ambu.png"
  >
    <!-- First Dialog -->
    <v-dialog v-model="dialog1" persistent max-width="900px" >
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="custom-btn" color="#3FD69F" dark v-bind="attrs" v-on="on" @click="openDialog1">
          จัดการข้อมูลผู้ป่วยใหม่
        </v-btn>
      </template>
      <!-- Content for the first dialog -->
      <v-card>
        <v-card-title>
          <span class="text-h5">จัดการข้อมูลผู้ป่วยใหม่</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="HN(Hospital Number)*" required></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Age*" hint="Must have" persistent-hint required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Gender*" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="NumberPhone*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Address*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">

              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog1">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveAndOpenDialog2">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Second2 Dialog -->
    <v-dialog  v-model="dialog2" persistent max-width="900px" >
      
      <template  v-slot:activator="{ on, attrs }">
        
        <!-- This button will activate the second dialog -->
        <v-btn 
          class="distance"
          color="#3FD69F"
          dark
          v-bind="attrs"
          v-on="on"
          
        >
          จัดการข้อมูลสำหรับJOB
        </v-btn>
      </template>
      <!-- Content for the second dialog -->
      <v-card>
        <v-card-title>
          <span class="text-h5">จัดการข้อมูลสำหรับJOB</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="HN(Hospital Number)*" required></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field label="เวลานัดหมาย" hint="Must have" persistent-hint required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="ประเภทผู้ป่วย" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="วันที่" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="เพิ่มเติม" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">

              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <!-- Your content for the second dialog here -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog2">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveAndclose">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Three dialoag-->
    
    
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-row>
</template>

<script>

export default {
  
  data: () => ({
    dialog1: false,
    dialog2: false,
    dialog3: false,
    snackbar: false,
    snackbarMessage: '',
    snackbarTimeout: 2000,
    
  }),
  methods: {
    openDialog1() {
      this.dialog1 = true;
    },
    closeDialog1() {
      this.dialog1 = false;
    },
    closeDialog2() {
      this.dialog2 = false;
    },
    saveAndOpenDialog2() {
      // Perform save operation (add your logic here)

      // Show notification
      this.snackbarMessage = 'กรอกข้อมูลสำเร็จ';
      this.snackbar = true;

      // Close the first dialog
      this.closeDialog1();

      // Open the second dialog
      // this.dialog2 = true;
    },
    saveAndclose(){ this.snackbarMessage = 'กรอกข้อมูลสำเร็จ';
      this.snackbar = true;

      // Close the first dialog
      this.closeDialog2();},
    closeDialog2() {
      this.dialog2 = false;
    },
      editItem (item) {},
      deleteItem (item) {}
  }
}
</script>


<style scoped>
.center-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  /* Optional: Set height to viewport height for vertical centering */
}

.distance {
  margin: 25px;
  color: #000000;
}

.custom-btn {
  color: #000000;
}
.ambulance{
  height: 100px;
  width: 180px;
}
.Ambutext{
  color:#000000;
  font-size: 25px;
  font-family: Inter;
  border-radius: 12px;
  background-color: #4BA09B;
}
</style>