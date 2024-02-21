

<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="saved.service_date" clearable label="วันที่" ></v-text-field>
        <v-text-field v-model="saved.description" clearable label="ระบุหมายเหตุ"></v-text-field>
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

  data() {
    return {
      service_date: '',
      description: '',
      // Introduce a flag to prevent infinite loop in watch
      updatingDialog: false,
    };
  },

  watch: {
    dialog(newValue) {
      // Update dialogVisible only if it's not being updated already
      if (!this.updatingDialog) {
        this.dialogVisible = newValue;
      }
    },
    dialogVisible(newValue) {
      // Set the flag to true before updating dialog prop
      this.updatingDialog = true;
      // Update the dialog prop
      this.$emit('update:dialog', newValue);
      // Reset the flag after updating dialog prop
      this.updatingDialog = false;
    },
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
    },
  },
};
</script>

  
  
  