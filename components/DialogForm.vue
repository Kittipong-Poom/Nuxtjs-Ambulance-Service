<template>
  <v-dialog v-model="dialog" max-width="650">
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <form ref="editedItemRef" @submit.prevent="save">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <!-- เบอร์โทรศัพท์ -->
                <v-text-field v-model="editedItem.hn" label="HN (Hospital Number)*" outlined :rules="[rules.hn]"
                  ref="hn"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="input-container">
                  <!-- อายุ -->
                  <v-select v-model="editedItem.ages_id" label="อายุ" :items="items_ages" outlined item-text="age_name"
                    item-value="age_id" prepend-inner-icon="mdi-gender-male-female" return-object></v-select>
                </div>
              </v-col>
              <v-col cols="12">
                <!-- เพศ -->
                <v-select v-model="editedItem.gender" label="เพศ" outlined :items="['ชาย', 'หญิง', 'อื่นๆ']"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <!-- เบอร์โทรศัพท์ -->
                <v-text-field v-model="editedItem.number" prepend-inner-icon="mdi-phone-outline" label="เบอร์โทรศัพท์*"
                  outlined :rules="[rules.phone]" ref="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <!-- พิกัด -->
                <v-text-field v-model="editedItem.address" prepend-inner-icon="mdi-map-marker" label="ที่อยู่" outlined
                  :rules="[rules.address]" ref="address"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <!-- เบอร์โทรศัพท์ -->
                <v-text-field v-model="editedItem.lati" prepend-inner-icon="mdi-map-marker" label="ละติจูด*" outlined
                  :rules="[rules.lati]" ref="lati"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <!-- พิกัด -->
                <v-text-field v-model="editedItem.longi" prepend-inner-icon="mdi-map-marker" label="ลองติจูด*" outlined
                  :rules="[rules.longi]" ref="longi"></v-text-field>
              </v-col>

              <v-btn color="green" class="mb-5 ml-4" @click="getCurrentLocation" text outlined
                :loading="loading">ตำแหน่งล่าสุดของคุณ</v-btn>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <!-- การติดตามการนำส่งผู้ป่วย -->
                <v-select v-model="editedItem.tracking_patient_id" label="การติดตามการนำส่งผู้ป่วย" outlined
                  :items="items_tracking" item-text="tracking_name" item-value="tracking_id"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <!-- เลือกประเภท -->
                <v-select v-model="editedItem.type_patient_id" label="เลือกประเภท" :items="items_type" outlined
                  item-text="type_patient_name" item-value="type_patient_id"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <!-- เพิ่มเติม -->
                <v-text-field v-model="editedItem.other" label="กรอกรายละเอียดเพิ่มเติม" outlined
                  :rules="[rules.other]"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="(dialogTitle.includes('แก้ไข') || dialogTitle.includes('จัดการผู้ป่วยใหม่'))"
            color="blue darken-1" class="white--text" @click.prevent="save">บันทึก</v-btn>
          <v-btn color="blue darken-1" class="white--text" @click="close">ยกเลิก</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import 'dayjs/locale/th';
import axios from 'axios';
export default {
  props: {
    dialog: Boolean,
    editedItem: Object,
    dialogTitle: String,
    hideFields: Object,
  },
  data() {
    return {
endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' :  'http://localhost:5000',
      items_ages: [],
      loading: false,
      items_tracking: [],
      items_type: [],
      hideDatePicker: false,
      rules: {
        address: (value) => {
          if (!value) return "กรอกที่อยู่";
          if (value.length < 2) return "ที่อยู่ต้องกรอกให้ชัดเจน";
          return true;
        },
        phone: (value) => {
          if (!value) return "กรอกเบอร์โทรศัพท์";
          if (value.length !== 10) return "กรอกเบอร์โทรศัพท์ให้เป็น 10 ตัว";
          if (!/^\d+$/.test(value)) return "กรอกเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น";
          return true;
        },
        other: (value) => {
          if (!value) return "กรอกรายละเอียดเพิ่มเติม";
          return true;
        },
        hn: (value) => { // Changed key to match template reference
          if (!value) return "กรอกเลข HN ";
          return true;
        },
        lati: (value) => { // Validate latitude if it exists
          if (!value) return "กรอกละติจูด";
          // Add additional validation logic if needed
          return true;
        },
        longi: (value) => { // Validate longitude if it exists
          if (!value) return "กรอกลองติจูด";
          // Add additional validation logic if needed
          return true;
        }
      },
    };
  },
  created() {
    this.loaddata();
    this.loaddatatraking();
    this.loaddatatype();
  },
  methods: {
    async save() {
      try {
        this.$emit('notificationSaved');
        // Validate the form fields
        const isValid = await this.validateForm();
        // Validate the phone number
        const phoneField = this.$refs.number;
        phoneField.validate();
        if (isValid && !phoneField.hasError) {
          // Check if the phone number has exactly 10 digits
          if (this.editedItem.number.length === 10) {
            // Save the edited item and close the dialog
            this.$emit('save', this.editedItem);
            this.close();
          } else {
            this.$emit('error', 'กรอกเบอร์โทรศัพท์ให้เป็น 10 ตัว');
          }
        }
      } catch (error) {
        console.error('Error saving item:', error);
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
    },
    close() {
      // Close the dialog
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
    async loaddata() {
      const { data } = await axios.get(this.endpointUrl + '/api/ages');
      this.items_ages = data
    },
    async loaddatatraking() {
      const { data } = await axios.get(this.endpointUrl + '/api/tracking_patient');
      this.items_tracking = data
    },
    async loaddatatype() {
      const { data } = await axios.get(this.endpointUrl + '/api/type_patient');
      this.items_type = data
    }
  }
};
</script>

<style></style>