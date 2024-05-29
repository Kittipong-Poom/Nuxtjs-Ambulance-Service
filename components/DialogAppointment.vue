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

export default {
  props: {
    dialog: Boolean,
    editedItem: {
      type: Object,
      default: () => ({
        service_date: '',
        time: '',
        lati: '',
        longi: '',
        status_case_id: '',
        hn: '',
        number: '',
        address: '',
      }),
    },
    dialogTitle: String,
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      menu: false,
      dateString: '',
    };
  },
  computed: {
   formattedDate() {
      if (!this.editedItem.service_date) {
        return '';
      }
      const gregorianDate = dayjs(this.editedItem.service_date);
      const buddhistYear = gregorianDate.year() + 543;
      return gregorianDate.year(buddhistYear).format('DD-MM-YYYY');
    },
  },
  watch: {
    dialog(val) {
      if (val && !this.editedItem.status_case_id) {
        this.editedItem.status_case_id = 'รอรับงาน';
      }
    },
  
  },
  methods: {
    async save() {
      try {
        if (!this.editedItem.status_case_id) {
          this.$emit('error', 'โปรดเลือกสถานะ');
          return;
        }

        // Convert Thai date back to a format MySQL understands
        
        const gregorianDate = dayjs(this.editedItem.service_date);
        const buddhistYear = gregorianDate.year() + 543;
        const buddhistDate = gregorianDate.year(buddhistYear).format('YYYY-MM-DD');
        const postData = {
          service_date: buddhistDate,
          time: this.editedItem.time,
          hn: this.editedItem.hn,
          status_case_id: this.editedItem.status_case_id,
          lati: this.editedItem.lati,
          longi: this.editedItem.longi,
          number: this.editedItem.number,
          address: this.editedItem.address,
        };

        const response = await axios.post(`${this.endpointUrl}/api/appointments`, postData);
        this.closeDialog();
        this.$emit('save', response.data);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึก:', error);
      }
    },

    closeDialog() {
      this.$emit('update:dialog', false);
      this.$emit('close-dialog');
    },
  },
  mounted() {
    if (!this.editedItem.status_case_id) {
      this.editedItem.status_case_id = 'รอรับงาน';
    }
  }
};
</script>
<style scoped>
/* Add any styles here */
</style>
