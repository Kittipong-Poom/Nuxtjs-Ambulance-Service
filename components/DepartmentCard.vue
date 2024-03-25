<template>
    <div>
        <v-container class="bg-surface-variant">
            <v-row justify="center">
                <!-- Patient Card 1 -->
                <v-sheet class="pa-12" color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto rounded-xl" height="70" width="225">
                        <v-sheet class="my-box rounded-xl pa-2 d-flex justify-space-between align-center">
                            <div>
                                <div class="font-weight-black">ผู้ป่วยฉุกเฉิน</div>
                                <div class="all"> รวม {{ this.emergencyCount }} คน</div>
                            </div>
                            <v-icon color="red" size="x-large">mdi-doctor</v-icon>
                        </v-sheet>
                    </v-sheet>
                </v-sheet>
                

                <!-- Patient Card 2 -->
                <v-sheet class="pa-12 " color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto rounded-xl" height="70" width="225">
                        <v-sheet class="my-box rounded-xl pa-2 d-flex justify-space-between align-center">
                            <div>
                                <div class="font-weight-black">ผู้ป่วยนัดรับ</div>
                                <div class="all">รวม {{ this.patientsCount }} คน</div>
                            </div>
                            <v-icon color="green" size="x-large">mdi-hospital</v-icon>
                        </v-sheet>
                    </v-sheet>
                </v-sheet>
                </v-row>
                   </v-container>


                   <v-row justify="center">
                   <!-- emergencymonth -->
                   <v-sheet class="pa-12" color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto rounded-xl" height="250" width="225">
                   <div class="emergencymonth">
                 
                                <v-card-subtitle>
                                    <b>ผู้ป่วยฉุกเฉินของเดือนนี้</b>
                                </v-card-subtitle>
                             <div class="emergencyred">สีเเดง {{ this.redCount }} คน
                                <v-icon color="red" size="small" style="margin-left: 5px;">mdi-doctor</v-icon>
                            </div>
                             <div class="emergencyyellow">สีเหลือง {{ this.yellowCount }} คน 
                                <v-icon color="yellow" size="small" style="margin-left: 5px;">mdi-doctor</v-icon>
                            </div>
                             <div class="emergencygreen">สีเขียว {{ this.greenCount }} คน 
                                <v-icon color="green" size="small" style="margin-left: 5px;">mdi-doctor</v-icon>
                            </div>
                             <div class="emergencywhite">สีขาว   {{ this.whiteCount }} คน 
                                <v-icon color="smoke" size="small" style="margin-left: 5px;">mdi-doctor</v-icon>
                            </div>
                           
                       
                         
                          </div>
                        </v-sheet>
                      </v-sheet>

                        <!-- patientmonth -->
                          
                            <v-sheet class="pa-12" color="grey-lighten-3">
                                <v-sheet :elevation="7" class="mx-auto rounded-xl" height="250" width="225">
                                    <div class="patientmonth">
                                     <v-card-subtitle>
                                        <b>ผู้ป่วยนัดรับของเดือนนี้</b>
                                    </v-card-subtitle>
                                     <div class="patient1">ผู้ป่วยติดเตียง {{ this.bedCount }} คน
                                        <v-icon color="green" size="small" style="margin-left: 5px;">mdi-bed</v-icon>
                                     </div>
                                     <div class="patient2">ผู้ป่วยบริการ {{ this.serviceCount }} คน 
                                        <v-icon color="green" size="small" style="margin-left: 5px;">mdi-home</v-icon>
                                    </div>
                                     
                                   
                                </div>
                                </v-sheet>
                                </v-sheet>
                                  
                                </v-row>
    </div>
    
</template>
  
<script>
 import BarChartPatient from '../components/BarChartPatient.vue'
 import PieChartPatient from '../components/PieChartPatient.vue'
 import LineChartJob from '../components/LineChartJob.vue'
 import axios from 'axios';

export default {
    components: {
      BarChartPatient,
      PieChartPatient,
      LineChartJob,

    },
    data() {
        return{
            bedCount: '',
            serviceCount:'',
            redCount:'',
            yellowCount:'',
            greenCount:'',
            whiteCount:'',
            patientsCount:'',
            emergencyCount:'',
            endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
        }
    },
    computed: {
        patientCount() {
            return this.$store.state.patientCount;
        },
        jobsCountCount() {
            return this.$store.state.jobsCount;
        },
    },
    methods:{
        async getpatient() {
    try {
        const response = await axios.get(`${this.endpointUrl}/api/patients`);
        console.log(this.endpointUrl);
        console.log('getData:', response.data);
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
        async getemergency(){
    try {
        const response = await axios.get(`${this.endpointUrl}/api/caseurgents`);
        console.log(this.endpointUrl);
        console.log('getData:', response.data);
        this.emergencyCount = response.data.length;
        console.log('Data count:', this.emergencyCount);
    } catch (error) {
        console.error('Error:', error);
    }
},
        async getbedpatient(){
    try {
        const response = await axios.get(`${this.endpointUrl}/api/gettype`);
        console.log(this.endpointUrl);
        console.log('getData:', response.data);
        this.bedCount = response.data.length;
        console.log('Data count:', this.bedCount);
    } catch (error) {
        console.error('Error:', error);
    }
},
        async getservicepatient(){
    try {
        const response = await axios.get(`${this.endpointUrl}/api/gettype/service`);
        console.log(this.endpointUrl);
        console.log('getData:', response.data);
        this.serviceCount = response.data.length;
        console.log('Data count:', this.serviceCount);
    } catch (error) {
        console.error('Error:', error);
    }
},
        async getredemergency(){
    try {
        const response = await axios.get(`${this.endpointUrl}/api/getviolence`);
        console.log(this.endpointUrl);
        console.log('getData:', response.data);
        this.redCount = response.data.length;
        console.log('Data count:', this.redCount);
    } catch (error) {
        console.error('Error:', error);
    }
},
    async getyellowemergency(){
    try {
        const response = await axios.get(`${this.endpointUrl}/api/getviolence/yellow`);
        console.log(this.endpointUrl);
        console.log('getData:', response.data);
        this.yellowCount = response.data.length;
        console.log('Data count:', this.yellowCount);
    } catch (error) {
        console.error('Error:', error);
    }
},
    async getgreenemergency(){
    try {
        const response = await axios.get(`${this.endpointUrl}/api/getviolence/green`);
        console.log(this.endpointUrl);
        console.log('getData:', response.data);
        this.greenCount = response.data.length;
        console.log('Data count:', this.greenCount);
    } catch (error) {
        console.error('Error:', error);
    }
},
    async getwhiteemergency(){
    try {
        const response = await axios.get(`${this.endpointUrl}/api/getviolence/white`);
        console.log(this.endpointUrl);
        console.log('getData:', response.data);
        this.whiteCount = response.data.length;
        console.log('Data count:', this.whiteCount);
    } catch (error) {
        console.error('Error:', error);
    }
},
    },

    mounted() {
    console.log('ENV', this.endpointUrl)

    this.getbedpatient();
    this.getservicepatient();
    this.getredemergency();
    this.getyellowemergency();
    this.getgreenemergency();
    this.getwhiteemergency();
    this.getemergency();
    this.getpatient();
},
};
</script>
  
<style>
.patientmonth , .emergencymonth{
    text-align: center;
}

.all{
    font-size:1rem;
    color:green;
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

.emergencyred, .patient1{
    margin-top: 1rem;
    margin-bottom: 1.5rem;
}


.emergencygreen,.emergencywhite,.emergencyyellow{
    margin-bottom: 1.5rem;
}
</style>
  