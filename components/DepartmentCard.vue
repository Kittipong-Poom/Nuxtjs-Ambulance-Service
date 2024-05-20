<template>
    <v-container class="bg-surface-variant">
      <v-row justify="center" no-gutters>
        <!-- Patient Card 1 -->
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-sheet class="pa-12 fill-height" color="grey-lighten-3">
            <v-sheet :elevation="7" class="mx-auto rounded-xl fill-height" width="110%">
              <v-sheet class="my-box rounded-xl pa-2 d-flex justify-space-between align-center fill-height">
                <div>
                  <div class="font-weight-black">ผู้ป่วยฉุกเฉิน</div>
                  <div class="all">รวม {{ emergencyCount }} คน</div>
                </div>
                <v-icon color="red" class="mr-3" size="35">mdi-ambulance</v-icon>
              </v-sheet>
            </v-sheet>
          </v-sheet>
        </v-col>
  
        <!-- Patient Card 2 -->
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-sheet class="pa-12 fill-height" color="grey-lighten-3">
            <v-sheet :elevation="7" class="mx-auto rounded-xl fill-height" width="110%">
              <v-sheet class="my-box rounded-xl pa-2 d-flex justify-space-between align-center fill-height">
                <div>
                  <div class="font-weight-black">ผู้ป่วยทั่วไป</div>
                  <div class="all">รวม {{ AllserviceCount }} คน</div>
                </div>
                <v-icon color="red" class="mr-3" size="35">mdi-hospital</v-icon>
              </v-sheet>
            </v-sheet>
          </v-sheet>
        </v-col>
      </v-row>
  
      <v-row justify="center" no-gutters>
        <!-- Emergency Month -->
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-sheet class="pa-12 fill-height" color="grey-lighten-3">
            
              <div class="emergencymonth">
                <v-sheet :elevation="7" class="mx-auto rounded-xl fill-height" width="110%">
                <v-card-subtitle>
                  <b>ผู้ป่วยฉุกเฉินของเดือนนี้</b>
                </v-card-subtitle>
                </v-sheet>
                <v-sheet class="mx-auto rounded-xl fill-height" :elevation="7" width="110%" color="#F5253A">
                  <v-card-subtitle>
                    <b class="white--text">สีแดง {{ redCount }} คน</b>
                    <v-icon color="black" size="25" class="ml-2">mdi-car-emergency</v-icon>
                  </v-card-subtitle>
                </v-sheet>
  
                <v-sheet class="mx-auto rounded-xl fill-height" :elevation="7" width="110%" color="#FFFF00">
                  <v-card-subtitle>
                    <b >สีเหลือง {{ yellowCount }} คน</b>
                    <v-icon color="black" size="25" class="ml-2">mdi-hospital-box</v-icon>
                  </v-card-subtitle>
                </v-sheet>
  
                <v-sheet class="mx-auto rounded-xl fill-height" :elevation="7" width="110%" color="#32CD32">
                  <v-card-subtitle>
                    <b>สีเขียว {{ greenCount }} คน</b>
                    <v-icon color="black" size="25" class="ml-2">mdi-human-greeting</v-icon>
                  </v-card-subtitle>
                </v-sheet>
  
                <v-sheet class="mx-auto rounded-xl fill-height" :elevation="7" width="110%" color="#F5F5F5">
                  <v-card-subtitle>
                    <b>สีขาว {{ whiteCount }} คน</b>
                    <v-icon color="black" size="25" class="ml-2">mdi-human-male</v-icon>
                  </v-card-subtitle>
                </v-sheet>
              </div>
            
          </v-sheet>
        </v-col>
  
        <!-- Patient Month -->
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-sheet class="pa-12 fill-height" color="grey-lighten-3">
              <div class="patientmonth">
                <v-sheet :elevation="7" class="mx-auto rounded-xl fill-height" width="110%">
                <v-card-subtitle>
                  <b>ผู้ป่วยทั่วไปของเดือนนี้</b>
                </v-card-subtitle>
                </v-sheet>
                <v-sheet :elevation="7" class="mx-auto rounded-xl fill-height" width="110%">
                  <v-card-subtitle>
                    <b>ผู้ป่วยติดเตียง {{ serviceBedCount }} คน</b>
                    <v-icon color="green" size="25" class="ml-2">mdi-bed</v-icon>
                  </v-card-subtitle>
                </v-sheet>
  
                <v-sheet :elevation="7" class="mx-auto rounded-xl fill-height" width="110%">
                  <v-card-subtitle>
                    <b>งานบริการ {{ serviceCount }} คน</b>
                    <v-icon color="green" size="25" class="ml-2">mdi-home</v-icon>
                  </v-card-subtitle>
                </v-sheet>
  
                <v-sheet :elevation="7" class="mx-auto rounded-xl fill-height" width="110%">
                  <v-card-subtitle>
                    <b>อื่นๆ {{ serviceCountOther }} คน</b>
                    <v-icon color="green" size="25" class="ml-2">mdi-dots-horizontal-circle</v-icon>
                  </v-card-subtitle>
                </v-sheet>
              </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </template>

<script>
import BarChartPatient from '../components/BarChartPatient.vue'
import PieChartPatient from '../components/PieChartPatient.vue'
import axios from 'axios';

export default {
    components: {
        BarChartPatient,
        PieChartPatient,
    },
    data() {
        return {
            bedCount: '',
            serviceCount: '',
            serviceCountOther: '',
            serviceBedCount: '',
            AllserviceCount: '',
            redCount: '',
            yellowCount: '',
            greenCount: '',
            whiteCount: '',
            patientsCount: '',
            emergencyCount: '',
            lastUpdateMonth: null,
            lastUpdateYear: null,
            endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
        }
    },

    methods: {
        async resetDataIfNeeded() {
            const today = new Date();
            const currentMonth = today.getMonth() + 1; // Months are zero-based, so add 1
            const currentYear = today.getFullYear();

            // If last update month and year are not set or if they are different from current month and year
            if (this.lastUpdateMonth === null || this.lastUpdateYear === null || this.lastUpdateMonth !== currentMonth || this.lastUpdateYear !== currentYear) {
                // Reset data and counts
                this.bedCount = '';
                this.serviceCount = '';
                this.serviceCountOther = '';
                this.serviceBedCount = '';
                this.AllserviceCount = '';
                this.redCount = '';
                this.yellowCount = '';
                this.greenCount = '';
                this.whiteCount = '';
                this.patientsCount = '';
                this.emergencyCount = '';

                // Update last update month and year to current values
                this.lastUpdateMonth = currentMonth;
                this.lastUpdateYear = currentYear;
            }
        },
        async getpatient() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/patients`);
                console.log(this.endpointUrl);
                console.log('getpatient:', response.data);
                if (Array.isArray(response.data)) {
                    this.patientsCount = response.data.length;
                    console.log('Data count:', this.patientsCount);
                } else {
                    console.log('Response data is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getemergency() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/caseurgents`);
                console.log(this.endpointUrl);
                console.log('getemergency:', response.data);
                this.emergencyCount = response.data.length;
                console.log('Data count:', this.emergencyCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        // async getbedpatient() {
        //     try {
        //         const response = await axios.get(`${this.endpointUrl}/api/gettype`);
        //         console.log(this.endpointUrl);
        //         console.log('getData:', response.data);
        //         this.bedCount = response.data.length;
        //         console.log('Data count:', this.bedCount);
        //     } catch (error) {
        //         console.error('Error:', error);
        //     }
        // },
        async getservicepatient() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/serviceCount`);
                console.log(this.endpointUrl);
                console.log('getservicepatient:', response.data);
                this.serviceCount = response.data.length;
                console.log('Data count:', this.serviceCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getservicepatientOther() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/gettype/service/other`);
                console.log(this.endpointUrl);
                console.log('getservicepatientOther:', response.data);
                this.serviceCountOther = response.data.length;
                console.log('Data count:', this.serviceCountOther);
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getservicepatientBed() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/bedCount`);
                console.log(this.endpointUrl);
                console.log('getservicepatientBed:', response.data);
                this.serviceBedCount = response.data.length;
                console.log('Data count:', this.serviceBedCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },


        async getAllservicepatient() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/patients`);
                console.log(this.endpointUrl);
                console.log('getAllservicepatient:', response.data);
                this.AllserviceCount = response.data.length;
                console.log('Data count:', this.AllserviceCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getredemergency() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/getviolence`);
                console.log(this.endpointUrl);
                console.log('getredemergency:', response.data);
                this.redCount = response.data.length;
                console.log('Data count:', this.redCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async getyellowemergency() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/getviolence/yellow`);
                console.log(this.endpointUrl);
                console.log('getyellowemergency:', response.data);
                this.yellowCount = response.data.length;
                console.log('Data count:', this.yellowCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async getgreenemergency() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/getviolence/green`);
                console.log(this.endpointUrl);
                console.log('getgreenemergency:', response.data);
                this.greenCount = response.data.length;
                console.log('Data count:', this.greenCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async getwhiteemergency() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/getviolence/white`);
                console.log(this.endpointUrl);
                console.log('getwhiteemergency:', response.data);
                this.whiteCount = response.data.length;
                console.log('Data count:', this.whiteCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },
    },

    created() {
        console.log('ENV', this.endpointUrl)
        // this.getbedpatient();
        this.resetDataIfNeeded();
        this.getservicepatient();
        this.getredemergency();
        this.getyellowemergency();
        this.getgreenemergency();
        this.getwhiteemergency();
        this.getemergency();
        this.getpatient();
        this.getservicepatientOther();
        this.getAllservicepatient();
        this.getservicepatientBed();
    },
};
</script>

<style>
.patientmonth,
.emergencymonth {
    text-align: center;
    margin-top: -40px;
}

.all {
    font-size: 1rem;
    color: green;
}

.head-text {
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
}

.img-select {
    width: 70%;
}

.mx-auto {
    margin-top: 10px;
    margin-bottom: 10px;
}

</style>