<template>
  <v-dialog v-model="dialog" max-width="650">
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline">{{ dialogTitle1 }}</span>
      </v-card-title>
      <form @submit.prevent="save">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <!-- วันที่ -->
                <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                  :return-value.sync="editedItem.service_date" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="formattedDate" label="วันที่เกิดเหตุ" outlined
                      prepend-inner-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="date" no-title scrollable locale="th"
                    :min="new Date().toISOString().substr(0, 10)">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      ยกเลิก
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(formatDateForPicker(date))">
                      ตกลง
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <!-- เวลา -->
              <v-col cols="12" md="6">
                <v-text-field v-model="formattedTime" outlined label="เวลา" readonly
                  prepend-inner-icon="mdi-clock-outline"></v-text-field>
              </v-col>
            </v-row>
            <!-- เพิ่มปุ่ม Current Location -->

            <!-- เพศ -->
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.gender" outlined label="เพศ" prepend-inner-icon="mdi-gender-male-female"
                  :items="['ชาย', 'หญิง', 'อื่นๆ']"></v-select>
              </v-col>
              <!-- อายุ -->
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.age" outlined label="อายุ*"
                  :items="['ต่ำกว่า 1 ปี', '1 - 12 ปี', '13 - 19 ปี', '20 - 39 ปี', '40 - 59 ปี', '60 ปีขึ้นไป']"></v-select>
              </v-col>
            </v-row>

            <v-row>
              <!-- ประเภทผู้ป่วย -->
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.status" outlined label="ประเภทผู้ป่วย"
                  :items="['อุบัติเหตุยานพาหนะ', 'อุบัติเหตุทั่วไป', 'อุบัติเหตุฉุกเฉิน']"></v-select>
              </v-col>
              <!-- ความรุนแรงของประเภทผู้ป่วย -->
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.violence" outlined label="ความรุนแรงของประเภทผู้ป่วย"
                  :items="['ผู้ป่วยฉุกเฉินวิกฤติ', 'ผู้ป่วยฉุกเฉินเร่งด่วน', 'ผู้ป่วยไม่ฉุกเฉิน', 'ผู้ป่วยทั่วไป']">

                  <template #item="{ item, on }">
                    <v-list-item v-on="on">
                      <v-list-item-content>
                        <v-chip :color="getChipColor(item)">
                          {{ item }}
                        </v-chip>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <!-- กลุ่มอาการฉุกเฉิน -->
            <v-combobox v-model="editedItem.emergency_group" prepend-icon="mdi-select-group" outlined :items='["1.ปวดท้อง/หลัง / เชิงกรานและขาหนีบ",
    "2.แอนาฟิแล็กลิส/ปฏิกิริยาภูมิแพ้",
    "3.สัตว์กัด",
    "4.เลือดออก (ไร้เหตุบาดเจ็บ)",
    "5.หายใจยากลำบาก",
    "6.หัวใจหยุดเต้น",
    "7.เจ็บแน่นทรวงอก/หัวใจ",
    "8.สำลักอุดทางหายใจ",
    "9.เบาหวาน",
    "10.ภยันตรายจากสภาพแวดล้อม",
    "11.(เว้นว่าง)",
    "12 ปวดศีรษะ/ลำคอ",
    "13.คลุ้มคลั่ง/จิตประสาท อารมณ์",
    "14.ยาเกินขนาด/ได้รับพิษ",
    "15.มีครรภ์/คลอด/นรีเวช",
    "16.ชัก",
    "17.ป่วย/อ่อนเพลีย (ไม่จำเพาะ)",
    "18. โรคหลอดเลือดสมองตีบตัน",
    "19.หมดสติ/ไม่ตอบสนอง/หมดสติชั่ววูบ",
    "20.เด็ก/ทารก",
    "21.ถูกทำร้าย/บาดเจ็บ",
    "22.บาดแผลไฟไหม้/ลวก",
    "23.อุบัติเหตุทางน้ำ",
    "24.พลัดตกหกล้ม/อุบัติเหตุ/เจ็บปวด",
    "25.อุบัติเหตุยานยนต์",
    "26.โรคอุบัติใหม่ - โควิท 19"]' hint="เลือกกลุ่มอาการฉุกเฉิน" label="กลุ่มอาการฉุกเฉิน" multiple clearable chips>
            </v-combobox>

            <!-- ส่วนของการกรอก Latitude และ Longitude -->

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.lati" label="Latitude" outlined
                  prepend-icon="mdi-map-marker"></v-text-field>
                <v-btn color="green" class="mb-5 ml-4" @click="getCurrentLocation" text
                  :loading="loading">ตำแหน่งล่าสุดของคุณ</v-btn>
              </v-col>
              <v-col cols="6" md="6">
                <v-text-field v-model="editedItem.longi" label="Longitude" outlined
                  prepend-icon="mdi-map-marker"></v-text-field>

              </v-col>
            </v-row>

            <!-- การติดตามการนำส่งผู้ป่วย -->
            <v-select v-model="editedItem.patient_delivery" prepend-icon="mdi-truck-plus" outlined
              label="การติดตามการนำส่งผู้ป่วย"
              :items="['เสียชีวิต', 'ส่งต่อโรงพยาบาล', 'ไม่ประสงค์ส่งต่อโรงพยาบาล']">
            </v-select>

          </v-container>
        </v-card-text>
        <v-card-actions>
          <!-- บันทึก -->
          <v-btn v-if="(dialogTitle1.includes('แก้ไข') || dialogTitle1.includes('จัดการผู้ป่วยใหม่'))"
            color="blue darken-1" class="white--text" @click="save">บันทึก</v-btn>
          <v-btn color="blue darken-1" class="white--text" @click="close">ยกเลิก</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import dayjs from 'dayjs';
import 'dayjs/locale/th';

export default {
  props: {
    dialog: Boolean,
    editedItem: Object,
    dialogTitle1: String,
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      formattedTime: dayjs().format('HH:mm'),
      loading: false,
      snackbar: {
        show: false,
        timeout: 3000, // Adjust timeout as needed
        color: '', // Color for snackbar
        message: '' // Message to display in snackbar
      },
      rules: {
        hnnumber: (value) => {
          if (!value) return "กรอกข้อมูลให้ครบ";
          return true; // Validation passed
        },
      },
    };
  },
  computed: {
    formattedDate() {
      const thaiDate = dayjs(this.date).add(543, 'year');
      const thaiFormattedDate = thaiDate.format('DD-MM-YYYY');
      return thaiFormattedDate;
    }
  },
  methods: {
    getChipColor(item) {
      switch (item) {
        case 'ผู้ป่วยฉุกเฉินเร่งด่วน':
          return 'yellow';
        case 'ผู้ป่วยไม่ฉุกเฉิน':
          return 'green';
        case 'ผู้ป่วยฉุกเฉินวิกฤติ':
          return 'red';
        case 'ผู้ป่วยทั่วไป':
          return 'grey'; // or any other color you prefer
        default:
          return 'default-color'; // set a default color if needed
      }
    },
    async save() {
      try {
        const selectedDate = new Date(this.date);
        const currentDate = new Date();

        selectedDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ไม่สามารถเลือกวันที่ย้อนหลังได้',
          });
          return;
        }

        if (this.validateForm()) {
          this.editedItem.service_date = this.formattedDate;
          this.editedItem.time = this.formattedTime; // Set the time to the formatted time
          this.$emit('save', this.editedItem);
          this.close();
        }
      } catch (error) {
        console.error('Error saving item:', error);
      }
    },
    close() {
      this.$emit('close');
    },
    validateForm() {
      for (const key in this.editedItem) {
        const fieldRef = this.$refs[key];

        if (fieldRef && fieldRef.validate) {
          fieldRef.validate();
          if (fieldRef.hasError) {
            return false;
          }
        }
      }
      return true;
    },
    updateTime() {
      this.formattedTime = dayjs().format('HH:mm');
    },
    formatDateForPicker(selectedDate) {
      const today = new Date(selectedDate);
      const selected = new Date(selectedDate);

      // Check if the selected date is today or in the future
      if (selected >= today) {
        return selected;
      } else {
        // If selected date is in the past, return today's date
        return today;
      }
    },
    async getCurrentLocation() {
      this.loading = true

      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        // ขอความอนุญาตให้เข้าถึงตำแหน่งปัจจุบันของผู้ใช้
        const position = await this.askForLocationPermission();
        // อ่านค่า Latitude และ Longitude จากตำแหน่งปัจจุบัน
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // กำหนดค่า Latitude และ Longitude ให้กับตัวแปร editedItem
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
        // Update snackbar to show error message
        this.snackbar = {
          show: true,
          color: 'error',
          message: 'เกิดข้อผิดพลาดในการดึงตำแหน่ง'
        };
      } finally {
        // Reset loading state
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
    }
  },
  created() {
    // Update the time every minute
    setInterval(this.updateTime, 60000);
    // Initial update
    this.updateTime();
  },
};
</script>

<style></style>