<template>
  <v-dialog v-model="dialog" max-width="650">
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline  ">{{ dialogTitle }}</span>
      </v-card-title>
      <form ref="editedItemRef" @submit.prevent="save">

        <v-card-text>

          <!-- Your form fields go here -->
          <!-- <v-text-field v-model="editedItem.hnnumber" label="HN (Hospital Number)*" :readonly="readonlyHnNumber"
            :rules="[rules.hnnumber]" ref="hnnumber"></v-text-field> -->
          <!-- <v-combobox v-model="editedItem.age" label="อายุ*" :items="['ต่ำกว่า 1 ปี','1 - 12 ปี','13 - 19 ปี','20 - 39 ปี','40 - 59 ปี','60 ปีขึ้นไป']"  :readonly="viewMode"></v-combobox> -->
          <v-select v-model="editedItem.ages_id" label="อายุ" :items="items_ages" item-text="age_name" item-value="age_id" return-object></v-select>
          <v-select v-model="editedItem.gender" label="เพศ" :items="['ชาย', 'หญิง', 'อื่นๆ']"></v-select>

          <v-text-field v-model="editedItem.number" label="เบอร์โทรศัพท์*" :rules="[rules.phone]"
            :readonly="viewMode" ref="number"></v-text-field>
          <v-text-field v-model="editedItem.coordinate" label="พิกัด*" :rules="[rules.address]" :readonly="viewMode"
            ref="coordinate"></v-text-field>

          <v-select v-model="editedItem.tracking_patient_id" label="การติดตามการนำส่งผู้ป่วย" 
            :items="items_tracking" item-text="tracking_name" item-value="tracking_id"></v-select>

          <!-- Show/hide status field based on hideFields prop -->
          <!-- <v-select v-if="!hideFields.dateAndTime" v-model="editedItem.casestatus"
            :items="['รอรับงาน', 'กำลังดำเนินงาน', 'เสร็จสิ้น']" label="สถานะ" :readonly="viewMode"></v-select> -->

          <v-select v-model="editedItem.type_patient_id" label="เลือกประเภท" :items="items_type" item-text="type_patient_name" item-value="type_patient_id"></v-select>
          <v-text-field v-model="editedItem.other" label="เพิ่มเติม" :rules="[rules.other]"
            :readonly="viewMode"></v-text-field>


        </v-card-text>
        <v-card-actions>
          <v-btn v-if="!viewMode && (dialogTitle.includes('แก้ไข') || dialogTitle.includes('จัดการผู้ป่วยใหม่'))"
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
    viewMode: Boolean,
    hideFields: Object,
  },
  data() {
    return {
      // date: new Date().toISOString().substr(0, 10),
      // menu: false,
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      items_ages: [],
      items_tracking:[],
      items_type:[],
      hideDatePicker: false,
      rules: {
        // hnnumber: (value) => {
        //   if (!value) return "กรอกข้อมูลให้ครบ";
        //   return true;
        // },
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
      },
      viewMode: false,
    };
  },
  computed: {
    // formattedDate() {
    //   if (!this.date) {
    //     return ' '; // Return empty string if date is null or undefined
    //   }
    //   const thaiDate = dayjs(this.date).add(543, 'year');
    //   const thaiFormattedDate = thaiDate.format('DD-MM-YYYY');
    //   return thaiFormattedDate;
    // },

    readonlyHnNumber() {
      // If the dialog is in view mode or if the dialog is for editing existing patient, make HN number readonly
      return this.viewMode || this.dialogTitle.includes('แก้ไข');
    },


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

        if (!this.viewMode && isValid && !phoneField.hasError) {
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
    // clearDateInput() {
    //   if (!this.date) {
    //     // If date is already empty, no need to do anything
    //     return;
    //   }
    //   this.date = null; // Clear the date input
    //   this.editedItem.service_date = ''; // Set editedItem.service_date to an empty string
    // },
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
      const { data} = await axios.get(this.endpointUrl + '/api/ages');
      this.items_ages = data
    },
    async loaddatatraking() {
      const { data} = await axios.get(this.endpointUrl + '/api/tracking_patient');
      this.items_tracking = data
    },
    async loaddatatype() {
      const { data} = await axios.get(this.endpointUrl + '/api/type_patient');
      this.items_type = data
    }
  }
};
</script>

<style></style>