
<template>
  <v-card>
    <v-card-title justify="center" class="center-container1">
      <h1 class="dashboardtext">Datatable Patient</h1>
    </v-card-title>
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

      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" dark>
          {{ item.status }}
        </v-chip>
      </template>

    </v-data-table>
    <template>

    </template>
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



    <!-- Include the dialog -->
    <dialog-form :dialog="dialog" :edited-item="editedItem" :dialog-title="dialogTitle" @save="saveItem"
      @close="closeDialog" />
  </v-card>
</template>

<script>
import DialogForm from '~/components/DialogForm.vue';
import axios from 'axios'
import Swal from 'sweetalert2';
export default {
  components: {
    DialogForm
  },
  data() {
    return {
      confirm: false,
      confirmItem: null,
      search: '',
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      headers: [
        { text: 'HN', value: 'hnnumber' },
        { text: 'Age', value: 'age' },
        { text: 'Gender', value: 'gender' },
        { text: 'NumberPhone', value: 'numberphone' },
        { text: 'Address', value: 'address' },
        { text: 'Coordinate', value: 'coordinate' },
        { text: 'ประเภทผู้ป่วย', value: 'status' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      desserts: [],
      statusColorMap: {
        'ฉุกเฉิน': 'red',
        'ฉุกเฉินเร่งด่วน': 'red',
        'หมดสติ': 'yellow',
        'บาดเจ็บเล็กน้อย': 'green',
      },
      dialog: false,
      dialogTitle: '',
      editedItem: {
        hnnumber: '',
        age: '',
        gender: '',
        numberphone: '',
        address: '',
        coordinate: '',
        status: ''
      },
    };
  },
  fetch() {
    this.loadData()
  },
  mounted() {
    console.log('ENV', this.endpointUrl)

  },
  methods: {
    getStatusColor(status) {
      // Add logic to determine the color based on the status value
      return this.statusColorMap[status] || 'defaultColor';
    },
    openDialog(action, item = null) {
      // Set dialog properties based on the action
      this.dialogTitle = action === 'add' ? 'จัดการผู้ป่วยใหม่' : 'แก้ไขข้อมูลผู้ป่วย';
      this.editedItem = action === 'add' ? {} : { ...item };
      this.dialog = true;
    },
    async saveItem(editedItem) {
      try {
        let response;

        if (!editedItem.id) {
          // Add new patient
          response = await axios.post(`${this.endpointUrl}/api/patients`, editedItem);
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'แก้ไขข้อมูลสำเร็จ',
          });
        } else {
          // Update existing patient
          response = await axios.put(`${this.endpointUrl}/api/patients/${editedItem.id}`, editedItem);
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'แก้ไขข้อมูลสำเร็จ',
          });
        }
        console.log('response', response);
        const savedPatient = response.data;
        // Update the local state or trigger a refresh from the server
        // based on your application's architecture
        // For simplicity, updating the local state here:

        this.$nextTick(() => {
          if (!editedItem.id) {
            // Add new patient
            this.desserts.push(savedPatient);
          } else {
            // Update existing patient
            const index = this.desserts.findIndex(item => item.id === savedPatient.id);
            this.$set(this.desserts, index, savedPatient.id);
          }
          this.closeDialog();
        });

      } catch (error) {
        console.error('Error saving item:', error);

        // Show an error notification
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'ไม่สามารถเพิ่มข้อมูลได้',
        });
      }
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

        // Show a confirmation dialog using SweetAlert2
        const result = await Swal.fire({
          title: 'ยืนยันการลบ?',
          text: 'เมื่อยืนยันคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
          // If the user confirms, proceed with the deletion
          try {
            const response = await axios.delete(this.endpointUrl + `/api/patients/${item.id}`);
            if (response.status === 200) {
              // Remove the deleted patient from the local state
              this.desserts = this.desserts.filter(p => p.id !== item.id);

              // Show success notification
              Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
              });
            } else {
              // Show an error notification
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'เกิดข้อผิดพลาดในการลบข้อมูล',
              });
            }
          } catch (error) {
            console.error('Error deleting item:', error);

            // Show an error notification
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error deleting item',
            });
          }

          // Reset the confirm dialog and clear the confirmItem
          this.confirm = false;
          this.confirmItem = null;
        }
      }
    },
    async loadData() {
      try {
        const { data } = await axios.get(this.endpointUrl + '/api/patients')
        this.desserts = data;
        console.log("This data", data)
      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
    closeDialog() {
      // Close the dialog
      this.dialog = false;
      this.dialogTitle = '';
      this.editedItem = {};
    },

  }
};
</script>

<style>
body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.center-container1 {
  padding-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

}

.dashboardtext {
  display: inline;
  font-size: 35px;
  color: #000000;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
