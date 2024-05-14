<template>
  <v-dialog v-model="dialog" max-width="800">
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
                :return-value.sync="editedItem.service_date" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="formattedDate" label="วันที่นัดหมาย" outlined prepend-inner-icon="mdi-calendar"
                    readonly v-bind="attrs" v-on="on" clearable></v-text-field>
                </template>
                <v-date-picker v-model="dateString" no-title scrollable locale="th" :min="new Date().toISOString()">
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
              <v-text-field v-model="editedItem.time" label="เวลา" outlined type="time"></v-text-field>
            </v-col>

          </v-row>

          <!-- สถานะ -->
          <v-select v-model="editedItem.status_case_id" label="สถานะ" outlined :items="items_status"
            item-text="casestatus_name" item-value="casestatus_id"></v-select>
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
import axios from 'axios'

export default {
  props: {
    dialog: Boolean,
    editedItem: Object,
    dialogTitle: String,
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      items_status: [],
      menu: false,
    };
  },
  computed: {
    formattedDate() {
      if (!this.editedItem.service_date) {
        return '';
      }
      const thaiDate = dayjs(this.editedItem.service_date).year(2567);
      return thaiDate.format('DD-MM-YYYY');
    },
  },
  async created() {
    const { data } = await axios.get(this.endpointUrl + '/api/status');
    this.items_status = data;
  },

methods: {
  
  async save() {
    try {
      if (!this.editedItem.status_case_id) {
        // แสดงข้อความข้อผิดพลาดหากไม่ได้เลือกสถานะ
        this.$emit('error', 'โปรดเลือกสถานะ');
        return; // ออกจากฟังก์ชั่นถ้าไม่ได้เลือกสถานะ
      }

      // แปลงวันที่กลับเป็นรูปแบบที่ MySQL เข้าใจ
      const thaiDate = dayjs(this.editedItem.service_date).year(2567);
      const mysqlDate = thaiDate.format('YYYY-MM-DD');

      // สร้างข้อมูลที่จะส่งไปยัง API
      const postData = {
        service_date: mysqlDate,
        time: this.editedItem.time,
        hn: this.editedItem.hn,
        status_case_id: this.editedItem.status_case_id,
        lati: this.editedItem.lati,
        longi: this.editedItem.longi,
        number: this.editedItem.number,
        address: this.editedItem.address,
      };
      
      // ทำการ POST ข้อมูลไปยัง API
      const response = await axios.post(`${this.endpointUrl}/api/appointments`, postData);
      
      // ทำการปิด dialog หลังจากบันทึกข้อมูลสำเร็จ
      this.closeDialog();
      
      // ส่งข้อมูลที่บันทึกไปยัง component ที่เรียกใช้งาน
      this.$emit('save', response.data);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึก:', error);
    }
  },
  

    closeDialog() {
      if (this.dialog) {
    this.$emit('update:dialog', false); // Emit event to update the dialog prop
    this.dialogVisible = false;
    this.$emit('close-dialog'); // Emit event to update the dialog prop
      }
      
    },
  },
};
</script>