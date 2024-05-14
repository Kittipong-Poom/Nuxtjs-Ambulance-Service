<template>
    <v-card>
        <v-card-title class="d-flex justify-center align-center  head1">
            <h2>ตารางจัดการคิว</h2>
        </v-card-title>

        <v-card-title>
            <v-spacer />
            <v-text-field v-model="search" append-icon="mdi-magnify" label="ค้นหา" single-line hide-details />

        </v-card-title>

        <v-data-table depressed :headers="headers" :items="filteredDesserts" :search="search">
            <template v-slot:item.action="{ item }">
                <div class="d-flex">
                  <v-btn color="#4CAF50" class="mr-2 white--text" @click="openAppointmentDialog(item)">
                    <v-icon>mdi-pencil-box-multiple-outline</v-icon>
                    แก้ไขข้อมูลนัดหมาย
                  </v-btn>
                  <v-btn color="blue" class="mr-2 white--text" @click="openGoogleMaps(item)">
                    <v-icon>mdi-map-marker</v-icon>
                    เริ่มการนำทาง
                  </v-btn>
                </div>
              </template>
              


            <template v-slot:item.type_patient_name="{ item }">
                <v-chip :color="getTypeColor(item.type_patient_name)" class="my-chip" dark
                    :class="{ 'black--text': item.type_patient_name === 'ผู้ป่วยติดเตียง', }">
                    {{ item.type_patient_name }}
                </v-chip>
            </template>

            <template v-slot:item.casestatus_name="{ item }">
                <v-chip :color="getStatusColor(item.casestatus_name)" class="my-chip" dark
                    :class="{ 'black--text': item.casestatus_name === 'กำลังดำเนินงาน', }"
                    :dark="item.casestatus_name === 'รอรับงาน' || item.casestatus_name === 'เสร็จสิ้น'">
                    {{ item.casestatus_name }}

                </v-chip>
            </template>

        </v-data-table>
        <dialog-form :dialog="dialog" :edited-item="editedItem" :dialog-title="dialogTitle" @save="saveItem"
            @close="closeDialog" :hide-fields="{ actions: true }" />

        <dialog-appointment v-if="isAppointmentDialogOpen" :dialog="isAppointmentDialogOpen" :edited-item="editedItem"
            :dialog-title="dialogTitle" @save="saveItem" @close-dialog="isAppointmentDialogOpen = false" />
    </v-card>
</template>

<script>
import Swal from 'sweetalert2';
import Appointment from '~/components/DialogAppointment.vue';
import Patient from './Patient.vue';
import axios from 'axios';
export default {
    components: {
        Patient,
        Appointment,
    },
    data() {
        return {
            isDialogVisible: false,
            isAppointmentDialogOpen: false,
            endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
            headers: [
                { text: 'HN', value: 'hn', align: 'center' },
                
                { text: 'เบอร์โทรศัพท์', value: 'number', align: 'center' },
                
                
                { text: 'ที่อยู่', value: 'address', align: 'center' },
                { text: 'ละติจูด', value: 'lati', align: 'center' },
                { text: 'ลองติจูด', value: 'longi', align: 'center' },
                { text: 'วันที่นัดหมาย', value: 'service_date', align: 'center' },
                { text: 'เวลานัดหมาย', value: 'time', align: 'center' },
                
                { text: 'สถานะ', value: 'status_case_id', align: 'center' },
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
                hn: '',
                age_name: '',
                gender: '',
                tracking_name: '',
                service_date: new Date(),
                casestatus_name: '',
                number: '',
                time: '',
                address: '',
                lati: '',
                longi: '',
                other: '',
                type_patient_name: ''
            },
            statusColorMap: {
                'งานบริการ': 'green',
                'รอรับงาน': 'red',
                'กำลังดำเนินงาน': 'yellow',
                'ยกเลิก': 'gray',
                'เสร็จสิ้น': 'green',
                'ผู้ป่วยติดเตียง': 'yellow',
                'อื่นๆ': 'blue',
            },
        }
    },
    computed: {
        // Computed property to filter desserts data
        filteredDesserts() {
            return this.desserts.filter(patient => {
                // Check if any of the fields in the patient data is filled
                return patient.hn || patient.age_name || patient.gender || patient.number || patient.time || patient.address || patient.lati || patient.longi
                    || patient.type_patient_name || patient.service_date || patient.tracking_name || patient.other || patient.casestatus_name
            }).sort((a, b) => {
                // Sort by casestatus_name: 'รอรับงาน', 'กำลังดำเนินงาน', 'เสร็จสิ้น'
                const statusOrder = { 'รอรับงาน': 1, 'กำลังดำเนินงาน': 2, 'เสร็จสิ้น': 3 };
                return statusOrder[a.casestatus_name] - statusOrder[b.casestatus_name];
            });
        },
        

    },
    methods: {
        async loadData() {
      try {
        const { data } = await axios.get(this.endpointUrl + '/api/appointments')
        // this.desserts = data;
        console.log("This data", data)
        this.$emit('data-loaded', data);
        this.desserts = data;
        console.log(this.desserts);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
    async fetchDataFromServer() {
      try {
        const { data } = await axios.get(this.endpointUrl + '/api/appointments');

        return data;
      } catch (error) {
        console.error('Error fetching data from server:', error);
        throw error; // Propagate the error to the caller
      }
    },
        openGoogleMaps(item) {
        // สร้าง URL ของ Google Maps ด้วยพิกัดที่ต้องการ
        const latitude = item.lati;
        const longitude = item.longi;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

        // เปิดลิงก์ในหน้าต่างใหม่
        window.open(url);
    },
        async openAppointmentDialog(item) {
            // Close the Patient.vue dialog if it is open
            if (this.dialog) {
                this.dialog = false;
            }

            // Set editedItem and dialogTitle based on item data
            this.editedItem = { ...item, service_date: new Date(), }; // Initialize casestatus as an empty string
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
            if (!dateString) {
                return null; // Return an empty string if dateString is undefined or null
            }
            const datePart = dateString.split('-');
            // Rearrange the date parts to match MySQL format (YYYY-MM-DD)
            const formattedDate = `${datePart[2]}-${datePart[1]}-${datePart[0]}`;
            return formattedDate;
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
        async saveItem(editedItem) {
            try {
                if (!editedItem.casestatus_name) {
                    // Display an error message if casestatus is not selected
                    this.$emit('error', 'โปรดเลือกสถานะ');
                    return; // Exit early if casestatus is not selected
                }
                let response;

                editedItem.service_date = this.formatDateForMySQL(editedItem.service_date);

                // Update existing patient
                console.log('แก้ไขข้อมูลนัดหมาย');
                response = await axios.put(`${this.endpointUrl}/api/appointments/${editedItem.id}`, {
                    status_case_id: editedItem.status_case_id,
                    service_date: editedItem.service_date,
                    time: editedItem.time
                });
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'แก้ไขข้อมูลสำเร็จ',
                });
                console.log('response', response);
                const savedPatient = response.data;

                this.$nextTick(() => {
                    if (!editedItem.hn_id) {
                        // Add new patient
                        this.desserts.push(savedPatient);
                    } else {
                        // Update existing patient
                        const index = this.desserts.findIndex(item => item.hn_id === savedPatient.hn_id);
                        this.$set(this.desserts, index, savedPatient.hn_id);
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
        
    },
    // Fetch data when component is mounted
    mounted() {
        this.loadData();
    }
}
</script>