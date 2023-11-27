<template>  
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <v-card-text>
        <!-- Your form fields go here -->
        <v-text-field v-model="editedItem.hnnumber" label="HN(Hospital Number)"></v-text-field>
        <v-text-field v-model="editedItem.age" label="Age"></v-text-field>
        <v-text-field v-model="editedItem.gender" label="Gender"></v-text-field>
        <v-text-field v-model="editedItem.numberphone" label="NumberPhone"></v-text-field>
        <v-text-field v-model="editedItem.address" label="Address"></v-text-field>
        <v-text-field v-model="editedItem.coordinate" label="Coordinate"></v-text-field>
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


