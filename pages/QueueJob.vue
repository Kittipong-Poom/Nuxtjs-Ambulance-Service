
<template>
    <v-card>
        <v-card-title class="d-flex justify-center align-center  head1">
            <h1>ตารางจัดการคิว</h1>
        </v-card-title>

        <v-card-title>
            <v-spacer />
            <v-text-field v-model="search" append-icon="mdi-magnify" label="ค้นหา" single-line hide-details />

        </v-card-title>

        <v-data-table depressed :headers="headers" :items="filteredDesserts" :search="search">
            <template v-slot:item.action="{ item }">
                <v-icon v-if="item.type !== 'ฉุกเฉิน'" small class="mr-2" @click="toggleDialog(item)">
                mdi-text-box-edit
            </v-icon>
            </template>
            <template v-slot:item.type="{ item }">
                <v-chip :color="getStatusColor(item.type)" class="my-chip" dark>
                    {{ item.type }}
                </v-chip>
            </template>
        </v-data-table>
        <DialogQueueJob :patient="selectedPatient" v-if="isDialogVisible" @closeDialog="closeDialog" />
    </v-card>
</template>
  
<script>
import DialogQueueJob from '../components/DialogQueueJob.vue';
import Patient from './Patient.vue';
import axios from 'axios';
export default {
    components: {
        Patient,
        DialogQueueJob
    },
    data() {
        return {
            endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
            headers: [
                { text: 'HN', value: 'hnnumber' },
                { text: 'อายุ', value: 'age' },
                { text: 'เพศ', value: 'gender' },
                { text: 'เบอร์โทรศัพท์', value: 'numberphone' },
                { text: 'ประเภทผู้ป่วย', value: 'type' },
                { text: 'การติดตามการนำส่งผู้ป่วย', value: 'trackpatient' },
                { text: 'ที่อยู่,พิกัด', value: 'address' },
                { text: 'วันที่นัดหมาย', value: 'date_service' },
                { text: 'เวลานัดหมาย', value: 'time' },
                { text: 'status', value: 'casestatus' },
                { text: 'Actions', value: 'action', sortable: false }
            ],
            selectedPatient: null, 
            isDialogVisible: false, 
            selectedItem: null,
            dialogTitle: '',
            desserts: [],
            search: '',
            statusColorMap: {
                'ฉุกเฉิน': 'red',
                'ให้มารับที่พัก': 'green',
            },
        }
    },
    computed: {
        // Computed property to filter desserts data
        filteredDesserts() {
            return this.desserts.filter(patient => {
                // Check if any of the fields in the patient data is filled
                return patient.hnnumber || patient.age || patient.gender || patient.numberphone || patient.address || patient.time || patient.coordinate || patient.type;
            });
        }
    },
    methods: {
        showDialog(patient) {
        this.selectedPatient = patient;
        this.isDialogVisible = true;
    },
    closeDialog() {
        this.selectedPatient = null;
        this.isDialogVisible = false;
    },
    toggleDialog(patient) {
        if (this.isDialogVisible) {
            this.closeDialog();
        } else {
            this.showDialog(patient);
        }
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
        }
    },
    // Fetch data when component is mounted
    mounted() {
        this.loadData();
    }
}
</script>