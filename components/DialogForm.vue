<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <form @submit.prevent="save">
        <v-card-text>

          <!-- Your form fields go here -->
          <v-text-field v-model="editedItem.hnnumber" label="HN(Hospital Number)" :rules="[rules.hnnumber]"
            ref="hnnumber"></v-text-field>
          <v-text-field v-model="editedItem.age" label="อายุ" :rules="[rules.age]"></v-text-field>
          <v-select v-model="editedItem.gender" label="เพศ" :items="['ชาย', 'หญิง', 'อื่นๆ']"></v-select>
          <v-text-field v-model="editedItem.numberphone" label="เบอร์โทรศัพท์" :rules="[rules.phone]"></v-text-field>
          <v-text-field v-model="editedItem.address" label="ที่อยู่" :rules="[rules.address]"></v-text-field>
          <v-text-field v-model="editedItem.time" label="เวลา" :rules="[rules.address]"></v-text-field>
          <v-select v-model="editedItem.type" label="เลือกประเภท"
            :items="['ฉุกเฉิน', 'หมดสติ', 'บาดเจ็บเล็กน้อย','ให้มารับที่พัก']"></v-select>
          <v-text-field v-model="editedItem.coordinate" label="พิกัด" ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="dialogTitle.includes('แก้ไข') || dialogTitle.includes('จัดการผู้ป่วยใหม่')" color="blue darken-1" @click="save">Save</v-btn>
          <v-btn color="blue darken-1" @click="close">Cancel</v-btn>
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
 
  },
  data() {
    return {
      rules: {
        hnnumber: (value) => !!value || "กรอกข้อมูลให้ครบ",

        phone: (value) => {
          if (value?.length > 8 && /[0-9-]+/.test(value)) return true
          return 'Phone number needs to be at least 9 digits.'
        },

        address: (value) => {
          if (value?.length >= 2) return true

          return 'ที่อยู่ต้องกรอกให้ชัดเจน'
        },
        gender: (value) => {
          if (value?.length >= 2) return true

          return 'กรุณากรอกเพศให้ถูกต้อง'
        },
        age: (value) => {
          if (value?.length > 0 && /[0-5-]+/.test(value)) return true
          return 'กรอกอายุให้ถูกต้อง'
        },
      }
    }
  },
  methods: {
    save() {
      // Save the edited item and close the dialog
      if (this.validateForm()) {
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


