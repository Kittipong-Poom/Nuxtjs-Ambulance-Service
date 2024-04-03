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
                                <div class="all">รวม {{ this.AllserviceCount }} คน</div>
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
                <v-sheet :elevation="8" class="mx-auto rounded-xl" height="50" width="225">
                    <div class="emergencymonth">

                        <v-card-subtitle>
                            <b>ผู้ป่วยฉุกเฉินของเดือนนี้</b>
                        </v-card-subtitle>

                        <v-sheet class="mx-auto rounded-xl" :elevation="7" height="50" width="225" color="#DC143C">
                            <v-card-subtitle>
                                <b class="white--text"> สีเเดง {{ this.redCount }} คน </b>
                                <v-icon color="red" size="small" style="margin-left: 5px;">mdi-doctor</v-icon>
                            </v-card-subtitle>
                        </v-sheet>

                        <v-sheet class="mx-auto rounded-xl" :elevation="7" height="50" width="225" color="#32CD32">
                            <v-card-subtitle>
                                <b class="white--text"> สีเขียว {{ this.greenCount }} คน <v-icon color="red"
                                        size="small" style="margin-left: 5px;">mdi-doctor</v-icon></b>
                            </v-card-subtitle>
                        </v-sheet>

                        <v-sheet class="mx-auto rounded-xl" :elevation="7" height="50" width="225" color="#FFFF00">
                            <v-card-subtitle>
                                <b> สีเหลือง {{ this.yellowCount }} คน <v-icon color="red" size="small"
                                        style="margin-left: 5px;">mdi-doctor</v-icon></b>
                            </v-card-subtitle>
                        </v-sheet>

                        <v-sheet class="mx-auto rounded-xl" :elevation="7" height="50" width="225" color="#F5F5F5">
                            <v-card-subtitle>
                                <b> สีขาว {{ this.whiteCount }} คน <v-icon color="red" size="small"
                                        style="margin-left: 5px;">mdi-doctor</v-icon></b>
                            </v-card-subtitle>
                        </v-sheet>

                    </div>
                </v-sheet>
            </v-sheet>

            <!-- patientmonth -->

            <v-sheet class="pa-12" color="grey-lighten-3">
                <v-sheet :elevation="7" class="mx-auto rounded-xl" height="50" width="225">
                    <div class="patientmonth">

                        <v-card-subtitle>
                            <b>ผู้ป่วยนัดรับของเดือนนี้</b>
                        </v-card-subtitle>


                        <v-sheet :elevation="7" class="mx-auto rounded-xl" height="50" width="225">
                            <v-card-subtitle>
                                <b> ผู้ป่วยติดเตียง {{ this.serviceBedCount }} คน
                                    <v-icon color="green" size="small" style="margin-left: 5px;">mdi-bed
                                    </v-icon></b>
                            </v-card-subtitle>
                        </v-sheet>

                        <v-sheet :elevation="7" class="mx-auto rounded-xl" height="50" width="225">
                            <v-card-subtitle>
                                <b> ผู้ป่วยบริการ {{ this.serviceCount }} คน
                                    <v-icon color="green" size="small" style="margin-left: 5px;">mdi-home
                                    </v-icon></b>
                            </v-card-subtitle>
                        </v-sheet>

                        <v-sheet :elevation="7" class="mx-auto rounded-xl" height="50" width="225">
                            <v-card-subtitle>
                                <b> อื่นๆ {{ this.serviceCountOther }} คน
                                    <v-icon color="green" size="small" style="margin-left: 5px;">mdi-bed
                                    </v-icon></b>
                            </v-card-subtitle>
                        </v-sheet>

                    </div>
                </v-sheet>
            </v-sheet>
        </v-row>
    </div>
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
            endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
        }
    },

    methods: {
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

        async getemergency() {
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
        async getbedpatient() {
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
        async getservicepatient() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/serviceCount`);
                console.log(this.endpointUrl);
                console.log('getData:', response.data);
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
                console.log('getData:', response.data);
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
                console.log('getData:', response.data);
                this.serviceBedCount = response.data.length;
                console.log('Data count:', this.serviceBedCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },


        async getAllservicepatient() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/patients/time`);
                console.log(this.endpointUrl);
                console.log('getData:', response.data);
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
                console.log('getData:', response.data);
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
                console.log('getData:', response.data);
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
                console.log('getData:', response.data);
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
                console.log('getData:', response.data);
                this.whiteCount = response.data.length;
                console.log('Data count:', this.whiteCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },
    },

    created() {
        console.log('ENV', this.endpointUrl)
        this.getbedpatient();
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