
<template>
  <div>
    <v-card>
      <v-card-title justify="center" class="center-container1">
        <h1 >ตารางข้อมูลผู้ป่วยทั่วไป</h1>
      </v-card-title>
      <v-card-title>
        <!-- Add new information -->
        <v-btn depressed class="button" color="primary" @click="openDialog('add')">
          จัดการผู้ป่วยใหม่
        </v-btn>
        <v-spacer />
        <v-text-field v-model="search" append-icon="mdi-magnify" label="ค้นหา" single-line hide-details />
      </v-card-title>
  
      <v-data-table depressed :headers="headers" :items="desserts" :search="search" @click:row="redirectToPatientDetail">
        <template v-slot:item.action="{ item }">
          <v-btn color="#4CAF50"  class="mr-2 white--text"  @click="openDialog('edit', item)">
            <v-icon>mdi-pencil-box-multiple-outline</v-icon>
            แก้ไข
          </v-btn>
          <v-btn  class="mr-2" color="primary" :readonly="viewMode" @click="openWatchDialog(item)">
            <v-icon>mdi-account-search-outline</v-icon>
            ดูข้อมูล
          </v-btn>
          <v-btn  color="red" class="white--text" @click="deleteItem(item)">
            <v-icon>mdi-delete</v-icon>
            ลบ
          </v-btn>
        </template>
   
        <template v-slot:item.type="{ item }">
          <v-chip :color="getStatusColor(item.type)" class="my-chip" dark>
            {{ item.type }}
          </v-chip>
        </template>
  
      </v-data-table>
      
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
      <dialog-form :dialog="dialog" :edited-item="editedItem" :dialog-title="dialogTitle" @save="saveItem" @close="closeDialog" :view-mode="viewMode" />
    </v-card>
  </div>
  

</template>

<script>
import DialogForm from '~/components/DialogForm.vue';
import DepartmentCard from '~/components/DepartmentCard.vue';
import BarChartPatient from '~/components/BarChartPatient.vue';
import axios from 'axios'
import Swal from 'sweetalert2';
export default {
  components: {
    DialogForm,
    DepartmentCard,
    BarChartPatient,
  },
  data() {
    return {
      confirm: false,
      confirmItem: null,
      dialogVisible: false,
      search: '',
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      headers: [
        { text: 'HN', value: 'hnnumber' },
        { text: 'อายุ', value: 'age' },
        { text: 'เพศ', value: 'gender' },
        { text: 'เบอร์โทรศัพท์', value: 'numberphone' },
        { text: 'ประเภทผู้ป่วย', value: 'type' },
        { text: 'การติดตามการนำส่งผู้ป่วย', value: 'trackpatient' },
        { text: 'ที่อยู่,พิกัด', value: 'address' },
        { text: 'วันที่นัดหมาย', value: 'date_service' },
        { text: 'เวลานัดหมาย', value: 'time' },
        { text: 'status', value: 'casestatus' },
        { text: '', value: 'action', sortable: false }
      ],
      //พิกัดจะให้กดคลิกแล้วให้เป็นหน้า map
      desserts: [],
      statusColorMap: {
        'ฉุกเฉิน': 'red',
        'ให้มารับที่พัก': 'green',
      },
      dialog: false,
      dialogTitle: '',
      editedItem: {
        hnnumber: '',
        age: '',
        gender: '',
        trackpatient:'',
        date_service:'',
        casestatus:'',
        numberphone: '',
        address: '',
        time:'',
        coordinate: '',
        type: ''
      },
    };
  },
  fetch() {
    this.loadData()
  },

  mounted() {
    console.log('ENV', this.endpointUrl)
    this.loadData();
  },
  methods: {
    redirectToPatientDetail(item) {
    
    console.log('คลิก Row นี้:', item);
  },

    getStatusColor(type) {
      return this.statusColorMap[type] || 'defaultColor';
    },
    openDialog(action, item = null) {
      this.dialogTitle = action === 'add' ? 'จัดการผู้ป่วยใหม่' : 'แก้ไขข้อมูลผู้ป่วย';
      this.editedItem = action === 'add' ? {} : { ...item };
      this.dialog = true;
      this.viewMode = action !== 'add';
      this.viewMode = false;
    },
    openWatchDialog(item) {
  this.dialogTitle = 'ดูข้อมูลผู้ป่วย';
  this.dialogVisible = true;
  this.editedItem = { ...item };
  this.dialog = true;
  this.viewMode = true;
},
    async saveItem(editedItem) {
      try {
        let response;

        if (!editedItem.patient_id) {
          // Add new patient
          response = await axios.post(`${this.endpointUrl}/api/patients`, editedItem);
          this.$store.commit('incrementPatientCount');

          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'แก้ไขข้อมูลสำเร็จ',
          });
        } else {
          // Update existing patient
          response = await axios.put(`${this.endpointUrl}/api/patients/${editedItem.patient_id}`, editedItem);
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
          if (!editedItem.patient_id) {
            // Add new patient
            this.desserts.push(savedPatient);
          } else {
            // Update existing patient
            const index = this.desserts.findIndex(item => item.patient_id === savedPatient.patient_id);
            this.$set(this.desserts, index, savedPatient.patient_id);
          }
          this.closeDialog();
        });
        this.desserts = await this.fetchDataFromServer();
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
            const response = await axios.delete(this.endpointUrl + `/api/patients/${item.patient_id}`);
            if (response.status === 200) {
              // Remove the deleted patient from the local state
              this.desserts = this.desserts.filter(p => p.patient_id !== item.patient_id);
              this.$store.commit('decrementPatientCount');
              // Show success notification
              Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
              });
              console.warn('This data delete already')
            } else {
              // Show an error notification
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'เกิดข้อผิดพลาดในการลบข้อมูล',
              });
            }
            this.desserts = await this.fetchDataFromServer();
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
        this.$emit('data-loaded', data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
    async fetchDataFromServer() {
    try {
      const { data } = await axios.get(this.endpointUrl + '/api/patients');
      return data;
    } catch (error) {
      console.error('Error fetching data from server:', error);
      throw error; // Propagate the error to the caller
    }
  },
    closeDialog() {
      // Close the dialog
      this.dialog = false;
      this.dialogTitle = '';
      this.editedItem = {};
      this.dialogVisible = false;
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

.button {
  height: 45px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 15px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}

.button:hover {
  background-color: #285CA2;
  box-shadow: 0px 15px 20px rgba(0, 47, 255, 0.4);
  color: #ffffff;
  transform: translateY(-7px);
}
.my-chip {
  width: 120px; 
  justify-content: center;
}

</style>

