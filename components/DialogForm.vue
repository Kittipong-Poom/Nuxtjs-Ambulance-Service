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
          <v-text-field v-model="editedItem.time" label="เวลา" :readonly="viewMode"></v-text-field>
          <v-select v-model="editedItem.trackpatient" label="การติดตามการนำส่งผู้ป่วย" 
            :readonly="viewMode" :items="['ส่งต่อโรงพยาบาล','ไม่ประสงค์ส่งต่อโรงพยาบาล']"></v-select>
            <v-text-field v-model="editedItem.date_service" label="วันที่นัดหมาย" 
            :readonly="viewMode"></v-text-field>
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
export default {
  props: {
    dialog: Boolean,
    editedItem: Object,
    dialogTitle: String,
    viewMode: Boolean,
  },
  data() {
    return {
      rules: {
        hnnumber: (value) => {
          if (!value) return "กรอกข้อมูลให้ครบ";
          return true; // Validation passed
        },
        address: (value) => {
          if (!value) return "กรอกที่อยู่";
          if (value.length < 2) return "ที่อยู่ต้องกรอกให้ชัดเจน";
          return true; // Validation passed
        },
        age: (value) => {
          if (!value) return "กรอกอายุ";
          if (!/[0-5-]+/.test(value)) return "กรอกอายุให้ถูกต้อง";
          return true; // Validation passed
        },
      },
      viewMode: false, // Define viewMode in the data section
    };
  },
  methods: {
    save() {
      // Save the edited item and close the dialog
      if (!this.viewMode && this.validateForm()) {
        this.$emit('save', this.editedItem);
        this.close();
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