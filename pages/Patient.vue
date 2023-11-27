<template>
  <v-card>
    <v-card-title>
      <v-btn depressed color="primary" @click="openDialog('add')">
        เพิ่มรายการ
      </v-btn>
      <v-spacer />
      <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details />
    </v-card-title>
    <v-data-table :headers="headers" :items="desserts" :search="search">
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="openDialog('edit', item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
      {{ snackbarMessage }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>


     <!---ปุ่มลบ-->


     <v-dialog v-model="confirm" max-width="350">
      <v-card>
        <v-card-title class="headline">
          ยืนยันการลบ?
        </v-card-title>
        <v-card-text>
          เมื่อยืนยันคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancelDelete">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="submitDelete">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
      {{ snackbarMessage }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <!-- Include the dialog -->
    <dialog-form :dialog="dialog" :edited-item="editedItem" :dialog-title="dialogTitle" @save="saveItem"
      @close="closeDialog" />
  </v-card>
</template>

<script>
import DialogForm from '~/components/DialogForm.vue';
import axios from 'axios'

export default {
  components: {
    DialogForm
  },
  data() {
    return {
      confirm: false,
      confirmItem: null,
      search: '',
      headers: [
        { text: 'HN', value: 'hnnumber' },
        { text: 'Age', value: 'age' },
        { text: 'Gender', value: 'gender' },
        { text: 'NumberPhone', value: 'numberphone' },
        { text: 'Address', value: 'address' },
        { text: 'Coordinate', value: 'coordinate' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      desserts: [
        {
          hnnumber: '',
          age: '',
          gender: '',
          numberphone: '',
          address: '',
          coordinate: ''
        }
      ],
      dialog: false,
      dialogTitle: '',
      editedItem: {
        hnnumber: '',
        age: '',
        gender: '',
        numberphone: '',
        address: '',
        coordinate: ''
      },
      async fetch() {
        // Fetch data from the server before rendering the component
        await this.loadData();
      },
      async asyncData({ params }) {
        // Populate initial data on the server side
        const { data } = await axios.get('http://localhost:3001/api/patients');
        const desserts = response.data;

        return { desserts };
      },
      snackbar: false,
      snackbarColor: 'กรอกข้อมูลสำเร็จ', // You can customize the color
      snackbarMessage: '',
    };

  },
  methods: {
    openDialog(action, item = null) {
      // Set dialog properties based on the action
      this.dialogTitle = action === 'add' ? 'จัดการผู้ป่วยใหม่' : 'Edit Item';
      this.editedItem = action === 'add' ? {} : { ...item };
      this.dialog = true;
    },
    async saveItem(editedItem) {
      let response;
      if (!editedItem.id) {
        // Add new patient
        response = await axios.post('http://localhost:3001/api/patients', editedItem);
      } else {
        // Update existing patient
        response = await axios.put(`http://localhost:3001/api/patients/${editedItem.id}`, editedItem);
      }

      const savedPatient = response.data;

      // Update the local state or trigger a refresh from the server
      // based on your application's architecture
      // For simplicity, updating the local state here:
      if (!editedItem.id) {
        this.desserts.push(savedPatient);
      } else {
        const index = this.desserts.findIndex(item => item.id === editedItem.id);
        this.$set(this.desserts, index, savedPatient);
      }

      this.closeDialog();

      // Show the success snackbar
      this.showSnackbar('กรอกข้อมูลสำเร็จ', 'success');
    }, catch(error) {
      // Show an error snackbar if something goes wrong
      this.showSnackbar('Error saving item', 'error');
      console.error('Error saving item:', error);

    },

    showSnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },

    async deleteItem(item) {
      // Store the item to be confirmed for deletion
      this.confirmItem = item;
      this.confirm = true;
    },

    cancelDelete() {
      // Reset the confirm dialog and clear the confirmItem
      this.confirm = false;
      this.confirmItem = null;
    },

    async submitDelete() {
      // Check if there is a confirmed item for deletion
      if (this.confirmItem) {
        const item = this.confirmItem;
        try {
          const response = await axios.delete(`http://localhost:3001/api/patients/${item.id}`);
          if (response.status === 200) {
            // Remove the deleted patient from the local state
            this.desserts = this.desserts.filter(p => p.id !== item.id);
            this.showSnackbar('ลบข้อมูลสำเร็จ', 'success');
          } else {
            this.showSnackbar('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
          }
        } catch (error) {
          console.error('Error deleting item:', error);
          this.showSnackbar('Error deleting item', 'error');
        }

        // Reset the confirm dialog and clear the confirmItem
        this.confirm = false;
        this.confirmItem = null;
      }
    },


    async loadData() {
      try {
        const { data } = await axios.get('http://localhost:3001/api/patients');
        this.desserts = data;
      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
    closeDialog() {
      // Close the dialog
      this.dialog = false;
      this.dialogTitle = '';
      this.editedItem = {};
    }
  }
};
</script>

