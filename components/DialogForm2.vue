<template>
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <!-- Your form fields go here -->
          <v-text-field v-model="editedItem.hnnumberj" label="HN(Hospital Number)"></v-text-field>
          <v-text-field v-model="editedItem.appointmenttime" label="เวลานัดหมาย"></v-text-field>
          <v-text-field v-model="editedItem.patienttype" label="ประเภทผู้ป่วย"></v-text-field>
          <v-text-field v-model="editedItem.date" label="วันที่"></v-text-field>
          <v-text-field v-model="editedItem.other" label="เพิ่มเติม"></v-text-field>
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
  
  
  