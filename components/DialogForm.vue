<template>
  <v-dialog v-model="dialog" max-width="650"  >
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline  ">{{ dialogTitle }}</span>
      </v-card-title>
      <form @submit.prevent="save">
        <v-card-text>

          <!-- Your form fields go here -->
          <v-text-field v-model="editedItem.hnnumber" label="HN(Hospital Number)"  :rules="[rules.hnnumber]" ref="hnnumber"
            :readonly="viewMode"></v-text-field>
          <v-text-field v-model="editedItem.age" label="อายุ" :rules="[rules.age]"  :readonly="viewMode"></v-text-field>
          <v-select v-model="editedItem.gender" label="เพศ" :items="['ชาย', 'หญิง', 'อื่นๆ']"
            :readonly="viewMode"></v-select>
          <v-text-field v-model="editedItem.numberphone" label="เบอร์โทรศัพท์" :rules="[rules.phone]"
            :readonly="viewMode"></v-text-field>
          <v-text-field v-model="editedItem.address" label="ที่อยู่" :rules="[rules.address]"
            :readonly="viewMode"></v-text-field>
          <v-text-field v-model="editedItem.time" label="เวลา" prepend-icon="mdi-clock-outline" :readonly="viewMode"></v-text-field>
          <v-select v-model="editedItem.trackpatient" label="การติดตามการนำส่งผู้ป่วย" 
            :readonly="viewMode" :items="['ส่งต่อโรงพยาบาล','ไม่ประสงค์ส่งต่อโรงพยาบาล']"></v-select>


            <v-menu :readonly="viewMode" ref="menu" v-model="menu" :close-on-content-click="false"
            :return-value.sync="editedItem.date_service" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="formattedDate" label="Picker in menu" prepend-icon="mdi-calendar" readonly
                v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable locale="th" :min="new Date().toISOString().substr(0, 10)">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                ยกเลิก
              </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">
                ตกลง
              </v-btn>
            </v-date-picker>
          </v-menu>


            <v-select v-model="editedItem.casestatus" :items="['รอรับงาน','กำลังดำเนินงาน','เสร็จสิ้น']" label="สถานะ" 
            :readonly="viewMode"></v-select>
          <v-select v-model="editedItem.type" label="เลือกประเภท"
            :items="['งานบริการ', 'ผู้ป่วยติดเตียง','อื่นๆ']" :readonly="viewMode"></v-select>
          <v-text-field v-model="editedItem.coordinate" label="พิกัด" :readonly="viewMode"></v-text-field>
          
        </v-card-text>
        <v-card-actions >
          <v-btn v-if="!viewMode && (dialogTitle.includes('แก้ไข') || dialogTitle.includes('จัดการผู้ป่วยใหม่'))"
            color="blue darken-1" class="white--text" @click="save">Save</v-btn>
          <v-btn color="blue darken-1" class="white--text" @click="close">Cancel</v-btn>
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
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      rules: {
        hnnumber: (value) => {
          if (!value) return "กรอกข้อมูลให้ครบ";
          return true;
        },
        address: (value) => {
          if (!value) return "กรอกที่อยู่";
          if (value.length < 2) return "ที่อยู่ต้องกรอกให้ชัดเจน";
          return true; 
        },
        age: (value) => {
          if (!value) return "กรอกอายุ";
          if (!/[0-5-]+/.test(value)) return "กรอกอายุให้ถูกต้อง";
          return true; 
        },
      },
      viewMode: false, 
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
    async save() {
  try {
    // Validate if the selected date is not in the past
    const selectedDate = new Date(this.date);
    const currentDate = new Date();
    
    if (selectedDate < currentDate) {
      // Show an error notification indicating that the selected date is in the past
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ไม่สามารถเลือกวันที่ย้อนหลังได้',
      });
      return; // Exit the method without saving
    }

    // Proceed with saving the edited item and close the dialog if the date is valid
    if (!this.viewMode && this.validateForm()) {
      this.editedItem.date_service = this.formattedDate;

      this.$emit('save', this.editedItem);
      this.close();
    }
  } catch (error) {
    console.error('Error saving item:', error);
  }
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
    }
  }
};
</script>

<style>

</style>