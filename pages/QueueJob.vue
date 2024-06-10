<template>
    <v-card>
        <v-card-title class="d-flex justify-center align-center head1">
            <h2>ตารางจัดการคิว</h2>
        </v-card-title>

        <v-card-title>
            <v-spacer />
            <v-text-field v-model="search" append-icon="mdi-magnify" outlined label="ค้นหา" single-line hide-details />
        </v-card-title>

        <v-data-table :headers="headers" :items="filteredDesserts" :search="search" item-key="id" show-select
            v-model="selected" @input="handleSelectedItemsChange">
            <template v-slot:top>
                <v-toolbar flat>
                    <h3>เลือกทั้งหมด</h3>
                    <v-spacer></v-spacer>
                    <v-btn depressed class="button mb-0 mr-3" color="primary" @click="exportToExcel">
                        Export to Excel
                    </v-btn>
                    <v-btn depressed class=" mb-0 mr-3" color="red" dark @click="deleteSelectedItems">
                        ลบสิ่งที่เลือก</v-btn>
                </v-toolbar>
            </template>
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

            <template v-slot:item.status_case_id="{ item }">
                <v-chip :color="getStatusColor(item.status_case_id)" class="my-chip" dark
                    :class="{ 'black--text': item.status_case_id === 'กำลังดำเนินงาน', }"
                    :dark="item.status_case_id === 'รอรับงาน' || item.status_case_id === 'เสร็จสิ้น'">
                    {{ item.status_case_id }}
                </v-chip>
            </template>
        </v-data-table>

        <!-- <dialog-form :dialog="dialog" :edited-item="editedItem" :dialog-title="dialogTitle" @save="saveItem"
            @close="closeDialog" :hide-fields="{ actions: true }" /> -->

        <Appointment :dialog="isAppointmentDialogOpen" :editedItem="editedItem" :dialogTitle="dialogTitle"
            @close-dialog="isAppointmentDialogOpen = false" @update-success="handleUpdateSuccess" />
    </v-card>
</template>

<script>
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import Appointment from '~/components/DialogQueueManage.vue';
import axios from 'axios';
export default {
    components: {
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
            selectedItem: null,
            selected: [], // selected items
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
                status_case_id: '',
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
        filteredDesserts() {
            const search = this.search.toLowerCase();
            return this.desserts
                .filter(item => {
                    return Object.keys(item).some(key => {
                        return String(item[key]).toLowerCase().includes(search);
                    });
                })
                .sort((a, b) => {
                    const statusOrder = { 'รอรับงาน': 1, 'กำลังดำเนินงาน': 2, 'เสร็จสิ้น': 3 };
                    const statusComparison = statusOrder[a.status_case_id] - statusOrder[b.status_case_id];

                    if (statusComparison !== 0) {
                        return statusComparison;
                    }

                    const dateA = dayjs(a.service_date, 'YYYY-MM-DD');
                    const dateB = dayjs(b.service_date, 'YYYY-MM-DD');
                    return dateA.isAfter(dateB) ? 1 : -1;
                });
        }
    },
    methods: {
        exportToExcel() {
            import('xlsx').then(XLSX => {
                // Use the selected items if there are any, otherwise, use filtered desserts
                const itemsToExport = this.selected.length > 0 ? this.selected : this.filteredDesserts;

                // Map the items for export
                const dataToExport = itemsToExport.map(({ service_date, time, ...rest }) => rest);

                const worksheet = XLSX.utils.json_to_sheet(dataToExport);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
                XLSX.writeFile(workbook, 'จัดการตารางคิวงาน.xlsx');
            }).catch(error => {
                console.error('Error importing xlsx:', error);
                // Handle error if xlsx library fails to load
            });
        },
        handleSelectedItemsChange(selectedItems) {
            // Update selectedForDeletion array when items are selected/unselected
            this.selected = selectedItems;
        },
        async deleteSelectedItems() {
            if (this.selected.length === 0) {
                // Show warning message if no item is selected
                Swal.fire('แจ้งเตือน', 'กรุณาเลือกรายการที่ต้องการลบ', 'warning');
                return; // Exit the function if no item is selected
            }

            // Perform deletion confirmation
            const result = await Swal.fire({
                title: 'ยืนยันการลบ',
                text: 'ถ้าลบแล้วไม่สามรถกู้คืนข้อมูลได้อีก',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'แน่นอน ลบ!'
            });

            // Proceed with deletion if confirmed
            if (result.isConfirmed) {
                try {
                    // Delete only the selected items
                    await Promise.all(this.selected.map(async item => {
                        await axios.delete(`${this.endpointUrl}/api/appointmentsall/${item.id}`);
                    }));

                    // Remove the selected items from the desserts array
                    this.desserts = this.desserts.filter(dessert => !this.selected.includes(dessert));

                    // Clear the selected items array
                    this.selected = [];

                    // Show deletion success message
                    Swal.fire('ลบแล้ว!', 'รายการที่เลือกได้ถูกลบแล้ว', 'success');
                } catch (error) {
                    console.error('เกิดข้อผิดพลาดในการลบรายการ:', error);
                    // Show error message if deletion fails
                    Swal.fire('ข้อผิดพลาด', 'ไม่สามารถลบรายการที่เลือกได้', 'error');
                }
            }
        },

        async loadData() {
            try {
                const { data } = await axios.get(this.endpointUrl + '/api/appointments')
                console.log('data', data);

                const formattedData = data.map(item => {
                    if (item.time && typeof item.time === 'string') {
                        const [hours, minutes] = item.time.split(':');
                        return {
                            ...item,
                            service_date: this.formatDate(item.service_date),
                            time: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
                        };
                    } else {
                        console.error('Invalid time format:', item.time);
                        return item;
                    }
                });

                this.desserts = formattedData;
                console.log(this.desserts);

            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
        updateStatuses() {
            console.log('Updating statuses');
            const now = dayjs();

            this.desserts.forEach((item, index) => {
                console.log('Processing item:', item);
                const appointmentDateTime = dayjs(item.service_date + ' ' + item.time, 'DD-MM-YYYY HH:mm');

                if (item.status_case_id === 'รอรับงาน' && now.isAfter(appointmentDateTime)) {
                    this.$set(this.desserts, index, { ...item, status_case_id: 'กำลังดำเนินงาน' });
                } else if (item.status_case_id === 'กำลังดำเนินงาน' && now.isAfter(appointmentDateTime.add(1, 'hour'))) {
                    this.$set(this.desserts, index, { ...item, status_case_id: 'เสร็จสิ้น' });
                }
            });
        },
        async fetchDataFromServer() {
            try {
                const { data } = await axios.get(`${this.endpointUrl}/api/appointments`);
                const formattedData = data.map(item => {
                    return {
                        ...item,
                        service_date: this.formatDate(item.service_date),
                    };
                });
                this.desserts = formattedData;
            } catch (error) {
                console.error('Error fetching data from server:', error);
                throw error;
            }
        },
        openGoogleMaps(item) {
            const latitude = item.lati;
            const longitude = item.longi;
            const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
            window.open(url);
        },
        openAppointmentDialog(item) {
            // Pass the service date along with other item properties
            this.editedItem = { ...item, service_date: new Date(item.service_date.substr(6, 4) - 543 + "-" + item.service_date.substr(3, 2) + "-" + item.service_date.substr(0, 2)) };
            this.dialogTitle = 'แก้ไขนัดหมายผู้ป่วย';
            this.isAppointmentDialogOpen = true;
        },
        handleUpdateSuccess() {
            this.isAppointmentDialogOpen = false;
            console.log('Update was successful');
            this.fetchDataFromServer();  // Fetch data to get the latest updates
        },
        formatTime(time) {
            if (!time) return '';
            const timeObj = new Date(time);
            const hours = timeObj.getHours().toString().padStart(2, '0');
            const minutes = timeObj.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        },

        formatDate(inputDate) {
            const date = new Date(inputDate);
            const gregorianYear = date.getFullYear();
            const buddhistYear = gregorianYear;
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            return `${day}-${month}-${buddhistYear}`;
        },

        formatDateForsaveItem(dateString) {
            if (!dateString) {
                return null;
            }
            const datePart = dateString.split('-');
            const gregorianYear = parseInt(datePart[2]) - 543; // Convert Buddhist year to Gregorian calendar
            const formattedDate = `${gregorianYear}-${datePart[1]}-${datePart[0]}`;
            return formattedDate;
        },

        async saveItem(editedItem) {
            try {
                if (!editedItem.status_case_id) {
                    this.$emit('error', 'โปรดเลือกสถานะ');
                    return;
                }

                editedItem.service_date = this.formatDateForsaveItem(editedItem.service_date);

                // Format the time to ensure it follows the HH:MM format
                editedItem.time = this.formatTime(editedItem.time);

                let response;
                if (editedItem.id) {
                    response = await axios.put(`${this.endpointUrl}/api/appointments/${this.editedItem.id}`, editedItem);
                }
                const savedAppointment = response.data;

                if (!editedItem.id) {
                    this.desserts.push(savedAppointment);
                } else {
                    const index = this.desserts.findIndex(item => item.id === savedAppointment.id);
                    if (index !== -1) {
                        this.$set(this.desserts, index, savedAppointment);
                    }
                }
                this.closeDialog();
                this.$emit('item-saved');
                const index = this.desserts.findIndex(item => item.id === savedAppointment.id);
                if (index !== -1) {
                    this.$set(this.desserts[index], 'status_case_id', savedAppointment.status_case_id);
                }
            } catch (error) {
                console.error('Error saving item:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'ไม่สามารถเพิ่มข้อมูลได้',
                });
            }
        },
        closeDialog() {
            this.selectedPatient = null;
            this.isDialogVisible = false;
        },
        getTypeColor(type) {
            return this.statusColorMap[type] || 'defaultColor';
        },
        getStatusColor(type) {
            return this.statusColorMap[type] || 'defaultColor';
        }
    },
    mounted() {
        this.loadData();
    },
    created() {
        // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
        if (!localStorage.getItem('user')) {
            // ถ้าไม่มีข้อมูลใน localStorage ให้กลับไปหน้า Login
            this.$router.push('/error');
        }
    },
}
</script>