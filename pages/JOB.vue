<template>
  <v-card>
    <v-card-title>
      <v-btn depressed color="primary" @click="openDialog('add')">
        เพิ่มรายการ
      </v-btn>
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
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
    <dialog-form2
      :dialog="dialog"
      :edited-item="editedItem"
      :dialog-title="dialogTitle"
      @save="saveItemj"
      @close="closeDialog"
    />
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
      confirm: false,
      confirmItem: null,
      search: '',
      headers: [
        { text: 'HN', value: 'hnnumberj' },
        { text: 'เวลานัดหมาย', value: 'appointmenttime' },
        { text: 'ประเภทผู้ป่วย', value: 'patienttype' },
        { text: 'วันที่', value: 'date' },
        { text: 'เพิ่มเติม', value: 'other' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      desserts: [],
      dialog: false,
      dialogTitle: '',
      editedItem: {
          hnnumberj: '',
          appointmenttime: '',
          patienttype: '',
          date:'',
          other:'',
      }, 
      
    }
    
  },
  fetch() {
    // Fetch data from the server before rendering the component
     this.loadData();
      },
  methods: {
    openDialog(action, item = null) {
      // Set dialog properties based on the action
      this.dialogTitle = action === 'add' ? 'จัดการข้อมูลสำหรับJOB' : 'Edit Item';
      this.editedItem = action === 'add' ? {} : { ...item };
      this.dialog = true;
    },
    async saveItemj(editedItem) {
      let response;
      if (!editedItem.id) {
        // Add new patient
        response = await axios.post('http://localhost:3001/api/jobs', editedItem);
      } else {
        // Update existing patient
        response = await axios.put(`http://localhost:3001/api/jobs/${editedItem.id}`, editedItem);
      }

      const savedJob = response.data;

      // Update the local state or trigger a refresh from the server
      // based on your application's architecture
      // For simplicity, updating the local state here:
      if (!editedItem.id) {
        this.desserts.push(savedJob);
      } else {
        const index = this.desserts.findIndex(item => item.id === editedItem.id);
        this.$set(this.desserts, index, savedJob);
      }

      Swal.fire({
        icon: "success",
        title: "กรอกข้อมูลสำเร็จ",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
        backdrop: `
    rgba(0,0,123,0.4)
    url("https://media.tenor.com/xzjlrhYq_lQAAAAj/cat-nyan-cat.gif")
    left top
    no-repeat
  `
      });

      this.closeDialog();
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
            const response = await axios.delete(`http://localhost:3001/api/jobs/${item.id}`);
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
        const { data } = await axios.get('http://localhost:3001/api/jobs');
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
