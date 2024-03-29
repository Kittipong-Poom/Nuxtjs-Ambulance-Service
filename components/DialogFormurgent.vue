<template>
  <v-dialog v-model="dialog" max-width="650">
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline">{{ dialogTitle1 }}</span>
      </v-card-title>
      <form @submit.prevent="save">
        <v-card-text>

          <v-menu  ref="menu" v-model="menu" :close-on-content-click="false"
            :return-value.sync="editedItem.service_date" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="formattedDate" label="Picker in menu" prepend-icon="mdi-calendar" readonly
                v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable locale="th" :min="new Date().toISOString().substr(0, 10)">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                ยกเลิก
              </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(formatDateForPicker(date))">
                ตกลง
              </v-btn>
            </v-date-picker>
          </v-menu>

          <v-text-field v-model="formattedTime" label="เวลา" readonly prepend-icon="mdi-clock-outline"></v-text-field>

          <v-combobox v-model="editedItem.gender" label="เพศ" :items="['ชาย', 'หญิง', 'อื่นๆ']"
            ></v-combobox>
          <v-combobox v-model="editedItem.age" label="อายุ*"
            :items="['ต่ำกว่า 1 ปี', '1 - 12 ปี', '13 - 19 ปี', '20 - 39 ปี', '40 - 59 ปี', '60 ปีขึ้นไป']"
            ></v-combobox>
          <v-combobox v-model="editedItem.status" label="ประเภทผู้ป่วย"
            :items="['อุบัติเหตุยานพาหนะ', 'อุบัติเหตุทั่วไป', 'อุบัติเหตุฉุกเฉิน']" ></v-combobox>

          <v-combobox v-model="editedItem.violence" label="ความรุนแรงของประเภทผู้ป่วย" 
            :items="['ผู้ป่วยฉุกเฉินวิกฤติ', 'ผู้ป่วยฉุกเฉินเร่งด่วน', 'ผู้ป่วยไม่ฉุกเฉิน', 'ผู้ป่วยทั่วไป']">
            <template #item="{ item, on }">
              <v-list-item v-on="on">
                <v-list-item-content>
                  <v-chip :color="getChipColor(item)" >
                    {{ item }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>



          <v-combobox v-model="editedItem.emergency_group" :items='["1.ปวดท้อง/หลัง / เชิงกรานและขาหนีบ",
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
    "26.โรคอุบัติใหม่ - โควิท 19"]' hint="เลือกกลุ่มอาการฉุกเฉิน" label="กลุ่มอาการฉุกเฉิน" 
            multiple clearable chips >
 
          </v-combobox>


          <v-text-field v-model="editedItem.lati" label="Latitude" prepend-icon="mdi-map-marker" ></v-text-field>
          <v-text-field v-model="editedItem.longi" label="Longitude" prepend-icon="mdi-map-marker" ></v-text-field>
          <v-combobox v-model="editedItem.patient_delivery" label="การติดตามการนำส่งผู้ป่วย"
            :items="['เสียชีวิต', 'ส่งต่อโรงพยาบาล', 'ไม่ประสงค์ส่งต่อโรงพยาบาล']" ></v-combobox>
        </v-card-text>
        <v-card-actions>
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