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
  
            <v-row>
              <v-col cols="12" md="6">
                <!-- ละติจูด -->
                <v-text-field v-model="editedItem.lati" prepend-inner-icon="mdi-map-marker" label="ละติจูด" outlined
                  ref="lati"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <!-- ลองจิจูด -->
                <v-text-field v-model="editedItem.longi" prepend-inner-icon="mdi-map-marker" label="ลองจิจูด*" outlined
                  ref="longi"></v-text-field>
              </v-col>
            </v-row>
            <v-btn color="green" class="mb-5 align-center justify-center" @click="getCurrentLocation" text
              :loading="loading">ตำแหน่งล่าสุดของคุณ</v-btn>
  
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
        apiUrl: process.env.endpointUrl,
        menu: false,
        loading: false
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
      dateString(newDate) {
        if (newDate) {
          const [year, month, day] = newDate.split('-').map(Number);
          const gregorianYear = year - 543;  // Convert Buddhist year to Gregorian year
          this.editedItem.service_date = dayjs(new Date(gregorianYear, month - 1, day)).toISOString();
        }
      }
    },
    methods: {
      async getCurrentLocation() {
        this.loading = true;
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const position = await this.askForLocationPermission();
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.editedItem.lati = latitude;
          this.editedItem.longi = longitude;
          this.$forceUpdate();
  
          this.snackbar = {
            show: true,
            color: 'success',
            message: 'ดึงตำแหน่งปัจจุบันเสร็จสิ้น'
          };
        } catch (error) {
          console.error('Error getting current location:', error);
          this.snackbar = {
            show: true,
            color: 'error',
            message: 'เกิดข้อผิดพลาดในการดึงตำแหน่ง'
          };
        } finally {
          this.loading = false;
        }
      },
      askForLocationPermission() {
        return new Promise((resolve, reject) => {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          } else {
            reject(new Error('Geolocation is not supported by this browser.'));
          }
        });
      },
      async fetchAppointmentDate() {
        try {
          const response = await axios.get(`${this.apiUrl}/api/appointment/${this.editedItem.hn}`);
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
          // Convert Gregorian date to Buddhist date for storage
          const gregorianDate = dayjs(this.editedItem.service_date);
          const buddhistYear = gregorianDate.year() + 543;
          const buddhistDate = gregorianDate.year(buddhistYear).format('YYYY-MM-DD');
          console.log('Date check',buddhistDate)
          const response = await axios.put(`${this.apiUrl}/api/appointments/${this.editedItem.id}`, { ...this.editedItem, service_date: buddhistDate });
  
          this.editedItem.status_case_id = response.data.status_case_id;
  
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