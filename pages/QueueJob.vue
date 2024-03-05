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

                <v-btn color="#4CAF50" class="mr-2 white--text" @click="openAppointmentDialog(item)">
                    <v-icon>mdi-pencil-box-multiple-outline</v-icon>
                    แก้ไขข้อมูลนัดหมาย
                </v-btn>
                <!-- <v-btn v-if="item.casestatus !== 'เสร็จสิ้น' && item.casestatus !== 'กำลังดำเนินงาน'" color="#4CAF50"
                    class="mr-2 white--text" @click="openDialog('edit', item)">
                    <v-icon>mdi-pencil-box-multiple-outline</v-icon>
                    แก้ไขข้อมูลนัดหมาย
                </v-btn> -->
            </template>


            <template v-slot:item.type="{ item }">
                <v-chip :color="getTypeColor(item.type)" class="my-chip" dark>
                    {{ item.type }}
                </v-chip>
            </template>

            <template v-slot:item.casestatus="{ item }">
                <v-chip :color="getStatusColor(item.casestatus)" class="my-chip" dark
                    :class="{ 'black--text': item.casestatus === 'กำลังดำเนินงาน', }"
                    :dark="item.casestatus === 'รอรับงาน' || item.casestatus === 'เสร็จสิ้น'">
                    {{ item.casestatus }}

                </v-chip>
            </template>

        </v-data-table>
        <dialog-form :dialog="dialog" :edited-item="editedItem" :dialog-title="dialogTitle" @save="saveItem"
            @close="closeDialog" :view-mode="viewMode" :hide-fields="{ actions: true }" />

        <dialog-appointment v-if="isAppointmentDialogOpen" :dialog="isAppointmentDialogOpen" :edited-item="editedItem"
            :dialog-title="dialogTitle" @save="saveItem" @close-dialog="isAppointmentDialogOpen = false"
            :view-mode="viewMode" />
    </v-card>
</template>

<script>
import Swal from 'sweetalert2';
import Appointment from '~/components/DialogAppointment.vue';
import DialogQueueJob from '../components/DialogQueueJob.vue';
import Patient from './Patient.vue';
import axios from 'axios';
export default {
    components: {
        Patient,
        DialogQueueJob,
        Appointment,
    },
    data() {
        return {
            isDialogVisible: false,
            isAppointmentDialogOpen: false,
            endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
            headers: [
                { text: 'HN', value: 'hnnumber', align: 'center' },
                { text: 'อายุ', value: 'age', align: 'center' },
                { text: 'เพศ', value: 'gender', align: 'center' },
                { text: 'เบอร์โทรศัพท์', value: 'numberphone', align: 'center' },
                { text: 'ประเภทผู้ป่วย', value: 'type', align: 'center' },
                { text: 'การติดตามการนำส่งผู้ป่วย', value: 'trackpatient', align: 'center' },
                { text: 'ที่อยู่,พิกัด', value: 'coordinate', align: 'center' },
                { text: 'วันที่นัดหมาย', value: 'date_service', align: 'center' },
                { text: 'เวลานัดหมาย', value: 'time', align: 'center' },
                { text: 'สถานะ', value: 'casestatus', align: 'center' },
                { text: '', value: 'action', sortable: false, align: 'center' }
            ],
            selectedPatient: null,
            isDialogVisible: false,
            selectedItem: null,
            dialog: false,
            dialogTitle: '',
            desserts: [],
            search: '',
            editedItem: {
                hnnumber: '',
                age: '',
                gender: '',
                trackpatient: '',
                date_service: '',
                casestatus: '',
                numberphone: '',
                time: '',
                coordinate: '',
                type: ''
            },
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
        },

    },
    methods: {
        async openAppointmentDialog(item) {
            // Close the Patient.vue dialog if it is open
            if (this.dialog) {
                this.dialog = false;
            }

            // Set editedItem and dialogTitle based on item data
            this.editedItem = { ...item, date_service: null, casestatus: '' }; // Initialize casestatus as an empty string
            this.dialogTitle = 'แก้ไขนัดหมายผู้ป่วย'; // Set your dialog title here

            // Show the appointment dialog
            this.isAppointmentDialogOpen = true;
        },
        formatTime(time) {
            if (!time) return ''; // Return empty string if time is null or undefined
            const timeObj = new Date(time);
            const hours = timeObj.getHours().toString().padStart(2, '0'); // Add leading zero if needed
            const minutes = timeObj.getMinutes().toString().padStart(2, '0'); // Add leading zero if needed
            return `${hours}:${minutes}`;
        },
        formatDate(inputDate) {

            const date = new Date(inputDate);
            const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        },
        formatDateForMySQL(dateString) {
            // Extract the date parts
            const datePart = dateString.split('-');
            // Rearrange the date parts to match MySQL format (YYYY-MM-DD)
            const formattedDate = `${datePart[2]}-${datePart[1]}-${datePart[0]}`;
            return formattedDate;
        },
        // openDialog(action, item = null) {
        //     this.dialogTitle = action === 'add' ? 'จัดการผู้ป่วยใหม่' : 'แก้ไขข้อมูลผู้ป่วย';
        //     this.editedItem = action === 'add' ? {} : { ...item };
        //     this.dialog = true;
        //     this.viewMode = action !== 'add';
        //     this.viewMode = false;
        // },
        // formatDate(inputDate) {
        //     const date = new Date(inputDate);
        //     const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
        //     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        //     const year = date.getFullYear();
        //     return `${day}-${month}-${year}`;
        // },
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
        async saveItem(editedItem) {
            try {
                if (!editedItem.casestatus) {
                    // Display an error message if casestatus is not selected
                    this.$emit('error', 'โปรดเลือกสถานะ');
                    return; // Exit early if casestatus is not selected
                }
                let response;

                editedItem.date_service = this.formatDateForMySQL(editedItem.date_service);

                if (!editedItem.patient_id) {
                    // Add new patient
                    response = await axios.post(`${this.endpointUrl}/api/patients`, editedItem);
                    this.$store.commit('incrementPatientCount');

                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ',
                        text: 'กรอกข้อมูลสำเร็จ',
                    });
                } else {
                    // Update existing patient
                    response = await axios.put(`${this.endpointUrl}/api/patients/${editedItem.patient_id}`, editedItem);
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ',
                        text: 'แก้ไขข้อมูลสำเร็จ',
                    });
                }
                console.log('response', response);
                const savedPatient = response.data;

                this.$nextTick(() => {
                    if (!editedItem.patient_id) {
                        // Add new patient
                        this.desserts.push(savedPatient);
                    } else {
                        // Update existing patient
                        const index = this.desserts.findIndex(item => item.patient_id === savedPatient.patient_id);
                        this.$set(this.desserts, index, savedPatient.patient_id);
                    }
                    this.closeDialog();
                });
                this.desserts = await this.fetchDataFromServer();
            } catch (error) {
                console.error('Error saving item:', error);

                // Show an error notification
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'ไม่สามารถเพิ่มข้อมูลได้',
                });
            }
        },


        getTypeColor(type) {
            return this.statusColorMap[type] || 'defaultColor';
        },
        getStatusColor(type) {
            return this.statusColorMap[type] || 'defaultColor';
        },

        closeDialog() {
            // Close the dialog
            this.dialog = false;
            this.dialogTitle = '';
            this.editedItem = {};
            this.dialogVisible = false;
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
                        date_service: this.formatDate(item.date_service), // Format date here

                    };
                });


                this.desserts = formattedData;
                console.log(this.desserts);

            } catch (error) {
                console.error('Error loading data:', error);
            }

        },
        async fetchDataFromServer() {
            try {
                const { data } = await axios.get(this.endpointUrl + '/api/patients');
                const formattedData = data.map(item => {
                    // Assuming the date_service field contains the date to be formatted
                    return {
                        ...item,
                        date_service: this.formatDate(item.date_service) // Format date here
                    };
                });
                return formattedData;
            } catch (error) {
                console.error('Error fetching data from server:', error);
                throw error; // Propagate the error to the caller
            }
        },
    },
    // Fetch data when component is mounted
    mounted() {
        this.loadData();
    }
}
</script>