

<template>
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <!-- Your form fields go here -->
          <v-text-field v-model="editedItem.hnnumberj" label="HN(Hospital Number)" :rules="[rules.hnnumberj]"></v-text-field>
          <v-text-field v-model="editedItem.appointmenttime" label="เวลานัดหมาย" :rules="[rules.appointmenttime]"></v-text-field>
          <v-text-field v-model="editedItem.patienttype" label="ประเภทผู้ป่วย" :rules="[rules.patienttype]"></v-text-field>
          <v-text-field v-model="editedItem.date" label="วันที่" :rules="[rules.date]"></v-text-field>
          <v-text-field v-model="editedItem.other" label="เพิ่มเติม" :rules="[rules.other]"></v-text-field>
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
      editedItem: Object,
      dialogTitle: String
    },

    data () {
      return{
        rules: {
        hnnumberj: (value) => !!value || "กรอกข้อมูลให้ครบ",

        appointmenttime:  (value) => {
          if (value?.length >=3) return true
        return 'กรุณากรอกประเภทผู้ป่วยให้ครบ'
        } ,

        patienttype: (value) =>{
        if (value?.length >= 2) return true

        return 'กรอกประเภทผู้ป่วยให้ครบ'
        },
        date: (value)=>{
          if (value?.length >=2) return true

          return 'กรอกวันที่ให้ชัดเจน'
        },
        other:(value) => {
          if (value?.length >3 && /[0-4-]+/.test(value)) return true
          return 'กรอกข้อมูลให้ครบ'
          }
        }
      }
    },
    methods: {
      save() {
        // Save the edited item and close the dialog
        this.$emit('save', this.editedItem);
        this.close();
      },
      close() {
        // Close the dialog
        this.$emit('close');
      }
    }
  };
  </script>
  
  
  