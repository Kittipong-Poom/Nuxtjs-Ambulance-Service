<template>
    <v-dialog v-model="dialog" max-width="650">
      <v-card>
        <v-card-title class="text-center d-flex justify-center align-center">
          <span class="headline  ">{{ dialogTitle1 }}</span>
        </v-card-title>
        <form @submit.prevent="save">
          <v-card-text>
  
            <!-- Your form fields go here -->
            <v-menu :readonly="viewMode" ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="editedItem.service_date" transition="scale-transition" offset-y min-width="auto">
              <template  v-slot:activator="{ on, attrs }">
                <v-text-field v-model="date" label="Picker in menu" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title scrollable locale="th">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  ยกเลิก
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                  ตกลง
                </v-btn>
              </v-date-picker>
            </v-menu>
  
            <v-text-field v-model="editedItem.time" label="เวลา" :readonly="viewMode"></v-text-field>
            <v-select v-model="editedItem.gender" label="เพศ" :items="['ชาย', 'หญิง', 'อื่นๆ']" :rules="[rules.phone]"
              :readonly="viewMode"></v-select>
            <v-text-field v-model="editedItem.age" label="อายุ" :rules="[rules.address]"
              :readonly="viewMode"></v-text-field>
            <v-select v-model="editedItem.status" label="ประเภทผู้ป่วย"
              :items="['อุบัติเหตุยานพาหนะ', 'อุบัติเหตุทั่วไป', 'อุบัติเหตุฉุกเฉิน']" :readonly="viewMode"></v-select>
            <v-select v-model="editedItem.violence" label="ความรุนเเรงของประเภทผู้ป่วย" :readonly="viewMode"
              :items="['ผู้ป่วยฉุกเฉินวิฤกติ', 'ผู้ป่วยเฉินเร่งด่วน', 'ผู้ป่วยไม่ฉุกเฉิน', 'ผู้ป่วยทั่วไป']"></v-select>
            <v-text-field v-model="editedItem.emergency_group" label="กลุ่มอาการฉุกเฉิน"
              :readonly="viewMode"></v-text-field>
            <v-text-field v-model="editedItem.coordinate" label="จุดเกิดเหตุ/พิกัด" :readonly="viewMode"></v-text-field>
            <v-select v-model="editedItem.patient_delivery" label="การติดตามการนำส่งผู้ป่วย"
              :items="['เสียชีวิต', 'ส่งต่อโรงพยาบาล', 'ไม่ประสงค์ส่งต่อโรงพยาบาล']" :readonly="viewMode"></v-select>
  
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="!viewMode && (dialogTitle1.includes('แก้ไข') || dialogTitle1.includes('จัดการผู้ป่วยใหม่'))"
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
      dialogTitle1: String,
      viewMode: Boolean,
    },
    data() {
      return {
        date: new Date().toISOString().substr(0, 10),
        menu: false,
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
          this.editedItem.service_date = this.date; // Assign the selected date
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
    
  <style></style>