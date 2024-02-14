<template>
    <v-card>
        <v-card-title class="d-flex justify-center align-center  head">
            <h1>ตารางจัดการคิว</h1>
        </v-card-title>

        <v-card-title>
            <v-spacer />
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details />

        </v-card-title>

        <v-data-table depressed :headers="headers" :items="filteredDesserts" :search="search">
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="openQueueDialog(item)">
                    mdi-text-box-edit
                </v-icon>
            </template>
            <template v-slot:item.type="{ item }">
                <v-chip :color="getStatusColor(item.type)" class="my-chip" dark>
                    {{ item.type }}
                </v-chip>
            </template>
        </v-data-table>
        <v-dialog v-model="dialog" max-width="800px">
      <template v-if="selectedPatientData">
        <DialogQueueJob :patient="selectedPatientData" />
      </template>
    </v-dialog>
    </v-card>
</template>
  
<script>
import DialogQueueJob from '../components/DialogQueueJob.vue';
import Patient from './Patient.vue';
import axios from 'axios';
export default {
    props: {
        item: Object
    },
    components: {
        Patient,
        DialogQueueJob,
    },
    data() {
        return {
            endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
            headers: [
                { text: 'HN', value: 'hnnumber' },
                { text: 'อายุ', value: 'age' },
                { text: 'เพศ', value: 'gender' },
                { text: 'เบอร์โทรศัพท์', value: 'numberphone' },
                { text: 'ที่อยู่', value: 'address' },
                { text: 'เวลา', value: 'time' },
                { text: 'พิกัด', value: 'coordinate' },
                { text: 'ประเภทผู้ป่วย', value: 'type' },
                { text: 'Actions', value: 'action', sortable: false }
            ],
            desserts: [],
            search: '',
            dialog: false,
            selectedPatientData: null,
            statusColorMap: {
                'ฉุกเฉิน': 'red',
                'หมดสติ': 'yellow',
                'บาดเจ็บเล็กน้อย': 'green',
                'ให้มารับที่พัก': 'green',
            },
        }
    },
    computed: {
        // Computed property to filter desserts data
        filteredDesserts() {
            return this.desserts.filter(patient => {
                return patient.hnnumber || patient.age || patient.gender || patient.numberphone || patient.address || patient.time || patient.coordinate || patient.type;
            });
        }
    },
    methods: {
        openQueueDialog(patientData) {
      this.selectedPatientData = patientData;
      this.dialog = true;
    },
        getStatusColor(type) {
            return this.statusColorMap[type] || 'defaultColor';
        },
        async loadData() {
            try {
                const { data } = await axios.get(this.endpointUrl + '/api/patients')
                this.desserts = data;
                console.log("This data", data)
                this.$emit('data-loaded', data);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
        openQueueDialog(item) {
            // Emit an event to the parent component with the selected patient data
            this.$emit('open-queue-dialog', item);
        }
    },
    // Fetch data when component is mounted
    mounted() {
        this.loadData();
    }
}
</script>
  


   