<template>
    <v-dialog v-model="dialog" max-width="800" @open="fetchAppointmentDate">
        <v-card>
            <v-card-title class="text-center d-flex justify-center align-center">
                <span class="headline">{{ dialogTitle }}</span>
            </v-card-title>
            <form @submit.prevent="save">
                <v-card-text>
                    <!-- วันที่ -->
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                                :return-value.sync="dateString" transition="scale-transition" offset-y
                                min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="formattedDate" label="วันที่นัดหมาย" outlined
                                        prepend-inner-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                                        clearable></v-text-field>
                                </template>
                                <v-date-picker v-model="dateString" no-title scrollable locale="th"
                                    :min="new Date().toISOString()">
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="menu = false">
                                        ยกเลิก
                                    </v-btn>
                                    <v-btn text color="primary" @click="$refs.menu.save(dateString)">
                                        ตกลง
                                    </v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>

                        <!-- เวลา -->
                        <v-col cols="12" md="6">
                            <v-text-field v-model="editedItem.time" label="เวลา" outlined ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="6">
                          <!-- ละติจูด -->
                          <v-text-field v-model="editedItem.lati" prepend-inner-icon="mdi-map-marker" label="ละติจูด" outlined
                             ref="lati"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <!-- ลองจิจูด -->
                          <v-text-field v-model="editedItem.longi" prepend-inner-icon="mdi-map-marker" label="ลองติจูด*" outlined
                            ref="longi"></v-text-field>
                        </v-col>
                    </v-row>

                    <!-- สถานะ -->
                    <v-select v-model="editedItem.status_case_id" outlined label="สถานะ"
                        :items="['รอรับงาน', 'กำลังดำเนินงาน', 'เสร็จสิ้น', 'ยกเลิก']"></v-select>
                </v-card-text>

                <!-- บันทึก -->
                <v-card-actions>
                    <v-btn color="blue darken-1" class="white--text" @click="save">บันทึก</v-btn>
                    <v-btn color="blue darken-1" class="white--text" @click="closeDialog">ยกเลิก</v-btn>
                </v-card-actions>
            </form>
        </v-card>
    </v-dialog>
</template>


<script>
import dayjs from 'dayjs';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    props: {
        dialog: Boolean,
        editedItem: Object,
        dialogTitle: String,
    },
    data() {
        return {
            endpointUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
            menu: false,
            dateString: '', // Initialize dateString here
        };
    },
    computed: {
        
        formattedDate() {
            if (!this.dateString) {
                return ''; // ถ้ายังไม่มีวันที่เลือก
            }
            // แปลงวันที่ในรูปแบบ ISO 8601 เป็นวันที่ในรูปแบบที่ต้องการ (DD-MM-YYYY)
            const selectedDate = new Date(this.dateString);
            const day = selectedDate.getDate().toString().padStart(2, '0');
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = selectedDate.getFullYear() + 543; // แปลงปีเป็นพ.ศ.
            return `${day}-${month}-${year}`;
        },
    },
    methods: {
        async fetchAppointmentDate() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/appointments/${this.editedItem.hn}`);
                if (response.data && response.data.service_date) {
                    this.dateString = response.data.service_date;
                    this.editedItem.service_date = response.data.service_date;
                }
            } catch (error) {
                console.error('Error fetching appointment date:', error);
            }
        },
        async save() {
    try {
        // Convert Thai date to Gregorian date for storage
        const thaiDate = dayjs(this.dateString).subtract(543, 'year');
        const mysqlDate = thaiDate.format('YYYY-MM-DD');

        const response = await axios.put(`${this.endpointUrl}/api/appointments/${this.editedItem.id}`, { ...this.editedItem, service_date: mysqlDate });

        // เมื่อบันทึกสำเร็จให้ทำการเปลี่ยนสถานะทันที
        this.editedItem.status_case_id = response.data.status_case_id;

        console.log('Save response:', response.data);
        this.$emit('update-success');
        this.closeDialog();
        Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'แก้ไขข้อมูลนัดหมายสำเร็จ',
        });
    } catch (error) {
        console.error('Error saving appointment:', error);
        alert('เกิดข้อผิดพลาดในการนัดหมาย.');
    }
},

        closeDialog() {
            this.$emit('close-dialog');
        }
    }
};

</script>
<style scoped>
/* Add any styles here */
</style>