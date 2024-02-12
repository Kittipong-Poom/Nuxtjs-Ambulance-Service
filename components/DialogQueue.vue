

<template>
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <!-- Your form fields go here -->
          <!-- <v-text-field v-model="editedItem.hnnumberj" label="HN(Hospital Number)" :rules="[rules.hnnumberj]"></v-text-field> -->
          <v-text-field v-model="saved.appointmenttime" label="เวลานัดหมาย" :rules="[rules.appointmenttime]"></v-text-field>
          <!-- <v-text-field v-model="editedItem.patienttype" label="ประเภทผู้ป่วย" :rules="[rules.patienttype]"></v-text-field> -->
          <v-text-field v-model="saved.service_date" label="วันที่" :rules="[rules.service_date]"></v-text-field>
          <v-text-field v-model="saved.description" label="เพิ่มเติม" :rules="[rules.description]"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" @click="save">Save</v-btn>
          <v-btn color="blue darken-1" @click="close">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  
  export default {
    props: {
      dialog: Boolean,
      saved: Object,
      dialogTitle: String,
      patient: Object,
    },

    data () {
      return{
        appointmenttime: '',
      service_date: '',
      description: '',
        rules: {
        // hnnumberj: (value) => !!value || "กรอกข้อมูลให้ครบ",

        appointmenttime:  (value) => {
          if (value?.length >=3) return true
        return 'กรุณากรอกประเภทผู้ป่วยให้ครบ'
        } ,

        patienttype: (value) =>{
        if (value?.length >= 0) return true

        return 'กรอกประเภทผู้ป่วยให้ครบ'
        },
        service_date: (value)=>{
          if (value?.length >=2) return true

          return 'กรอกวันที่ให้ชัดเจน'
        },
        }
      }
    },
    methods: {
      save() {
        // Save the edited item and close the dialog
        this.$emit('save');
        this.close();
      },
      close() {
        // Close the dialog
        this.$emit('close');
      }
    }
  };
  </script>
  
  
  