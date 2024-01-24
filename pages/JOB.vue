<template>
  <v-card>
    <v-card-title justify="center" class="center-container1">
      <h1 class="dashboardtext">Datatable JOB</h1>
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
    </v-data-table>

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
    <dialog-form2 :dialog="dialog" :edited-item="editedItem" :dialog-title="dialogTitle" @save="saveItemj"
      @close="closeDialog" />
  </v-card>
</template>

<script>
import DialogForm2 from '~/components/DialogForm2.vue';
import axios from 'axios'
import Swal from 'sweetalert2';
export default {
  components: {
    DialogForm2
  },
  data() {
    return {
      jobs: [],
      confirm: false,
      confirmItem: null,
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      search: '',
      headers: [
        { text: 'HN', value: 'hnnumberj' },
        { text: 'Appointment', value: 'appointmenttime' },
        { text: 'PatientType', value: 'patienttype' },
        { text: 'Date', value: 'date' },
        { text: 'Other', value: 'other' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      desserts: [],
      dialog: false,
      dialogTitle: '',
      editedItem: {
        hnnumberj: '',
        appointmenttime: '',
        patienttype: '',
        date: '',
        other: '',
      },

    }

  },
  async fetch() {
    // Fetch data from the server before rendering the component
    await this.loadData();
  },
  mounted() {
    console.log('ENV', this.endpointUrl)
  },
  methods: {
    openDialog(action, item = null) {
      // Set dialog properties based on the action
      this.dialogTitle = action === 'add' ? 'จัดการข้อมูลสำหรับJOB' : 'แก้ไข้ข้อมูลของ JOB';
      this.editedItem = action === 'add' ? {} : { ...item };
      this.dialog = true;
    },
    async saveItemj(editedItem) {
      try {
        let response;

        if (!editedItem.id) {
          // Add new job
          response = await axios.post(`${this.endpointUrl}/api/jobs`, editedItem);
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'แก้ไขข้อมูลสำเร็จ',
          });
        } else {
          // Update existing job
          response = await axios.put(`${this.endpointUrl}/api/jobs/${editedItem.id}`, editedItem);
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'แก้ไขข้อมูลสำเร็จ',
          });
        }
        console.log('response', response);
        const savedJob = response.data;
        // Update the local state or trigger a refresh from the server
        // based on your application's architecture
        // For simplicity, updating the local state here:

        await this.$nextTick();
          if (!this.jobs) {
            this.jobs = [];
          }

          if (!editedItem.id) {
            // Add new job
            this.jobs.push(savedJob);  // assuming you have a jobs array
          } else {
            // Update existing job
            const index = this.jobs.findIndex(item => item.id === savedJob.id);
            if (index !== -1) {
              this.$set(this.jobs, index, savedJob);
            } else {
              console.error('Job not found in the array');
            }
          }
          this.closeDialog();
        ;

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

    // Show an error snackbar if something goes wrong
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
            const response = await axios.delete(this.endpointUrl + `/api/jobs/${item.id}`);
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
        const { data } = await axios.get(this.endpointUrl + '/api/jobs');
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
    }
  }
};
</script>
