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
          <v-select v-model="editedItem.age" label="อายุ*" :items="['ต่ำกว่า 1 ปี','1 - 12 ปี','13 - 19 ปี','20 - 39 ปี','40 - 59 ปี','60 ปีขึ้นไป']"  :readonly="viewMode"></v-select>
          <v-select v-model="editedItem.gender" label="เพศ" :items="['ชาย', 'หญิง', 'อื่นๆ']"
            :readonly="viewMode"></v-select>
            <v-text-field v-model="editedItem.numberphone" label="เบอร์โทรศัพท์*" :rules="[rules.phone]"
            :readonly="viewMode" ref="numberphone"></v-text-field>
          <v-text-field v-model="editedItem.coordinate" label="พิกัด*" :rules="[rules.address]"
            :readonly="viewMode" ref="coordinate"></v-text-field>

          <v-select v-model="editedItem.trackpatient" label="การติดตามการนำส่งผู้ป่วย" :readonly="viewMode"
            :items="['ส่งต่อโรงพยาบาล', 'ไม่ประสงค์ส่งต่อโรงพยาบาล']"></v-select>

          <!-- Show/hide status field based on hideFields prop -->
          <!-- <v-select v-if="!hideFields.dateAndTime" v-model="editedItem.casestatus"
            :items="['รอรับงาน', 'กำลังดำเนินงาน', 'เสร็จสิ้น']" label="สถานะ" :readonly="viewMode"></v-select> -->

          <v-select v-model="editedItem.type" label="เลือกประเภท" :items="['งานบริการ', 'ผู้ป่วยติดเตียง', 'อื่นๆ']"
            :readonly="viewMode"></v-select>
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

import dayjs from 'dayjs';
import 'dayjs/locale/th';
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
  methods: {
    async save() {
  try {
    this.$emit('notificationSaved');

    // Validate the form fields
    const isValid = await this.validateForm();

    // Validate the phone number
    const phoneField = this.$refs.numberphone;
    phoneField.validate();

    if (!this.viewMode && isValid && !phoneField.hasError) {
      // Check if the phone number has exactly 10 digits
      if (this.editedItem.numberphone.length === 10) {
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
    //   this.editedItem.date_service = ''; // Set editedItem.date_service to an empty string
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
    }
  }
};
</script>

<style></style>