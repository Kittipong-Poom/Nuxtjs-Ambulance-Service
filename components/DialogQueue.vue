

<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>

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

  
  
  