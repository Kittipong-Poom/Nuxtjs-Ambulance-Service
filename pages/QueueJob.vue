
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
                <v-btn class="white--text" color="green" v-if="item.type !== 'ฉุกเฉิน'" @click="toggleDialog(item)">
                    <v-icon class="ma-2 ">mdi-text-box</v-icon>
                    เช็คข้อมูล
                </v-btn>
            </template>
            <template v-slot:item.type="{ item }">
                <v-chip :color="getTypeColor(item.type)" class="my-chip" dark>
                    {{ item.type }}
                </v-chip>
            </template>

            <template v-slot:item.casestatus="{ item }">
                <v-chip :color="getStatusColor(item.casestatus)" class="my-chip" dark
                    :class="{ 'black--text': item.casestatus === 'กำลังดำเนินงาน', }"
                    :dark="item.casestatus === 'รอรับงาน'|| item.casestatus === 'เสร็จสิ้น'">
                    {{ item.casestatus }}

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
                { text: 'HN', value: 'hnnumber', align: 'center' },
                { text: 'อายุ', value: 'age', align: 'center' },
                { text: 'เพศ', value: 'gender', align: 'center' },
                { text: 'เบอร์โทรศัพท์', value: 'numberphone', align: 'center' },
                { text: 'ประเภทผู้ป่วย', value: 'type', align: 'center' },
                { text: 'การติดตามการนำส่งผู้ป่วย', value: 'trackpatient', align: 'center' },
                { text: 'ที่อยู่,พิกัด', value: 'address', align: 'center' },
                { text: 'วันที่นัดหมาย', value: 'date_service' , align: 'center'},
                { text: 'เวลานัดหมาย', value: 'time', align: 'center' },
                { text: 'สถานะ', value: 'casestatus', align: 'center' },
                { text: '', value: 'action', sortable: false, align: 'center' }
            ],
            selectedPatient: null,
            isDialogVisible: false,
            selectedItem: null,
            dialogTitle: '',
            desserts: [],
            search: '',
            statusColorMap: {
                'งานบริการ': 'green',
                'รอรับงาน': 'red',
                'กำลังดำเนินงาน': 'yellow',
                'เสร็จสิ้น': 'green',
                'ผู้ป่วยติดเตียง': 'green',
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

        formatDate(inputDate) {
            const date = new Date(inputDate);
            const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        },
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



        getTypeColor(type) {
            return this.statusColorMap[type] || 'defaultColor';
        },
        getStatusColor(type) {
            return this.statusColorMap[type] || 'defaultColor';
        },
        async loadData() {
            try {
                const { data } = await axios.get(this.endpointUrl + '/api/patients')
                // this.desserts = data;
                console.log("This data", data)
                this.$emit('data-loaded', data);

                const formattedData = data.map(item => {
                    // Assuming the date_service field contains the date to be formatted
                    return {
                        ...item,
                        date_service: this.formatDate(item.date_service) // Format date here
                    };
                });

                this.desserts = formattedData;
                console.log(this.desserts);

            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
    },
    // Fetch data when component is mounted
    mounted() {
        this.loadData();
    }
}
</script>