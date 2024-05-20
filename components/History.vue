<template>
  <div>
    <!-- แสดงหน้ากรอกเลข HN ก่อน -->
    <v-dialog v-model="dialog" max-width="300">
      <v-card>
        <v-card-title class="text-center">กรุณากรอกเลข HN</v-card-title>
        <v-card-text>
          <v-text-field v-model="hnInput" label="เลข HN" outlined></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="submitHN">ยืนยัน</v-btn>
          <v-btn color="primary" @click="dialog = false">ปิด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- แสดงหน้าล่าสุดหลังจากที่ผู้ใช้กรอกเลข HN ถูกต้อง -->
    <v-dialog v-model="hnDialog" max-width="300">
      <v-card>
        <v-card-title class="text-center d-flex justify-center align-center">
          <span class="headline">{{ dialogTitle2 }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-list>
                  <v-list-item v-for="appointment in appointments" :key="appointment.id">
                    <v-list-item-content>
                      <v-list-item-title>HN: {{ appointment.hn }}</v-list-item-title>
                      <v-list-item-subtitle>วันที่: {{ formatDate(appointment.service_date) }}</v-list-item-subtitle>
                      <v-list-item-subtitle>เวลา: {{ appointment.time }}</v-list-item-subtitle>
                      <v-list-item-subtitle>สถานะ: {{ appointment.status_case_id}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="blue darken-1" class="white--text" @click="closeDialog">ปิด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import dayjs from 'dayjs';
import axios from 'axios';

export default {
  props: {
    dialog: Boolean,
    hn: String,
    dialogTitle: String,
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      appointments: [],
      dialog: false,
      hnDialog: false, // เพิ่มตัวแปรเพื่อควบคุมการแสดงหน้ากรอกเลข HN
      hnInput: '', // เพิ่มตัวแปรเพื่อเก็บค่าเลข HN ที่ผู้ใช้กรอก
    };
  },

  methods: {
    async submitHN() {
    // ตรวจสอบความถูกต้องของเลข HN ก่อนดำเนินการต่อ
    if (this.validateHN(this.hnInput)) {
        // เรียกฟังก์ชันเพื่อเช็คข้อมูล HN
        await this.fetchAppointments(this.hnInput);

        // ตรวจสอบว่ามีข้อมูล HN หรือไม่
        if (this.appointments.length > 0) {
            // กรณีมีข้อมูล HN ที่พบ
            this.hnDialog = true;
            this.dialog = false; // ปิดหน้ากรอกเลข HN หลังจากที่กรอกเลข HN ถูกต้อง
        } else {
            // กรณีไม่พบข้อมูล HN
            alert('ไม่พบข้อมูล HN ที่ค้นหา');
            this.hnInput = '';
            // อาจทำการล้างค่าหรือปรับการทำงานต่อได้ตามที่ต้องการ
        }
    } else {
        alert('เลข HN ไม่ถูกต้อง');
    }
},
    validateHN(hn) {
      // ตรวจสอบว่า hn เป็น string และไม่ว่าจะมีความยาวเท่าไหร่ก็ได้
      if (typeof hn !== 'string') {
        return false;
      }

      // ตรวจสอบว่า hn ไม่เป็นค่าว่างหรือว่างเปล่า
      if (hn.trim() === '') {
        return false;
      }

      // ถ้าผ่านทุกเงื่อนไขแล้วให้คืนค่าเป็น true
      return true;
    },
    async fetchAppointments(hn) {
      try {
        const { data } = await axios.get(this.endpointUrl + '/api/appointments/' + hn);
        this.appointments = data;
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    },
    formatDate(date) {
      return dayjs(date).format('DD-MM-YYYY');
    },
    closeDialog() {
      this.hnDialog = false;
    },
  },
};
</script>