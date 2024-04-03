<template>
  <div>
    <v-card>
      <v-card-title justify="center" class="center-container1">
        <h1>ตารางข้อมูลผู้ป่วยทั่วไป</h1>
      </v-card-title>
      <v-card-title>
        <!-- Add new information -->
        <v-btn depressed class="button" color="primary" @click="openDialog('add')">
          จัดการผู้ป่วยใหม่
        </v-btn>
        <v-spacer />
        <v-text-field v-model="search" append-icon="mdi-magnify" outlined label="ค้นหา" single-line hide-details />
      </v-card-title>

      <v-data-table v-model="selected" show-select depressed :headers="headers" :items="desserts" :search="search"
        @click:row="redirectToPatientDetail">

        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Select All</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-checkbox v-model="selectAll" @change="selectAllItems"></v-checkbox>
            <v-btn color="red" dark @click="deleteSelectedItems">Delete Selected</v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.action="{ item }">
          
          <v-btn color="#4CAF50" class="mr-2 white--text" @click="openDialog('edit', item)">
            <v-icon>mdi-pencil-box-multiple-outline</v-icon>
            แก้ไข
          </v-btn>
          <v-btn class="mr-2" color="primary" @click="openAppointmentDialog(item)">
            <v-icon>mdi-account-search-outline</v-icon>
            นัดหมาย
          </v-btn>
          <v-btn color="red" class="white--text " @click="deleteItem(item)">
            <v-icon>mdi-delete</v-icon>
            ลบ
          </v-btn>
        </template>


        <template v-slot:item.type_patient_name="{ item }">
          <v-chip :color="getTypeColor(item.type_patient_name)" class="my-chip" dark
          :class="{ 'black--text': item.type_patient_name === 'ผู้ป่วยติดเตียง', }">
            {{ item.type_patient_name }}
          </v-chip>
        </template>

        <template v-slot:item.casestatus="{ item }">
          <v-chip :color="getStatusColor(item.casestatus_name)" class="my-chip" dark
            :class="{ 'black--text': item.casestatus_name === 'กำลังดำเนินงาน', }"
            :dark="item.casestatus_name === 'รอรับงาน' || item.casestatus_name === 'เสร็จสิ้น'">
            {{ item.casestatus_name }}
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
              ยกเลิก
            </v-btn>
            <v-btn color="green darken-1" text @click="submitDelete">
              ตกลง
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Include the dialog -->
      <dialog-form :dialog="dialog" :edited-item="editedItem" :dialog-title="dialogTitle" @save="saveItem"
        @close="closeDialog" :hide-fields="{ dateAndTime: true }" />

      <dialog-appointment v-if="isAppointmentDialogOpen" :dialog="isAppointmentDialogOpen" :edited-item="editedItem"
        :dialog-title="dialogTitle" @save="saveItem" @close-dialog="isAppointmentDialogOpen = false"
        />
    </v-card>
  </div>
</template>

<script>
import Appointment from '~/components/DialogAppointment.vue';
import Calendar from '~/components/Calendar.vue';
import DialogForm from '~/components/DialogForm.vue';
import DepartmentCard from '~/components/DepartmentCard.vue';
import BarChartPatient from '~/components/BarChartPatient.vue';
import axios from 'axios'
import Swal from 'sweetalert2';
export default {
  components: {
    Calendar,
    DialogForm,
    DepartmentCard,
    BarChartPatient,
    Appointment,
  },
  data() {
    return {
      newDate: "",
      confirm: false,
      confirmItem: null,
      dialogVisible: false,
      selectAll: false,
      events: [],
      selected: [],
      selectedForDeletion:[],
      search: '',
      action: '',
      isAppointmentDialogOpen: false,
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      headers: [
        { text: 'HN', value: 'hn_id', align: 'center' },
        { text: 'อายุ', value: 'age_name', align: 'center' },
        { text: 'เพศ', value: 'gender', align: 'center' },
        { text: 'เบอร์โทรศัพท์', value: 'number', align: 'center' },
        { text: 'ประเภทผู้ป่วย', value: 'type_patient_name', align: 'center' },
        { text: 'การติดตามการนำส่งผู้ป่วย', value: 'tracking_name', align: 'center' },
        { text: 'ที่อยู่/พิกัด', value: 'coordinate', align: 'center' },
        // { text: 'วันที่นัดหมาย', value: `service_date`, align: 'center' },
        // { text: 'เวลานัดหมาย', value: 'time', align: 'center' },
        // { text: 'สถานะ', value: 'casestatus', align: 'center' },
        { text: 'เพิ่มเติม', value: 'other', align: 'center' },
        { text: '', value: 'action', sortable: false, align: 'center' }
      ],
      //พิกัดจะให้กดคลิกแล้วให้เป็นหน้า map
      desserts: [],
      items_status: [],
      statusColorMap: {
        'งานบริการ': 'green',
        'ผู้ป่วยติดเตียง': 'yellow',
        'อื่นๆ':'blue'
      },
      dialog: false,
      dialogTitle: '',
      editedItem: {
        ages_id: '',
        gender: '',
        number: '',
        tracking_patient_id: '',
        coordinate: '',
        type_patient_id: '',
        other: '',
        status_case_id: null,
        service_date: '',
        time: ''
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
  // computed: {
  //   formattedDesserts() {
  //     return this.desserts.map(dessert => ({
  //       ...dessert,
  //       service_date: null
  //     }));
  //   },
  // },
  methods: {

    selectAllItems() {
      if (this.selectAll) {
        // Select all items for deletion
        this.selectedForDeletion = this.desserts.map(item => item.hn_id);
      } else {
        // Deselect all items for deletion
        this.selectedForDeletion = [];
      }
    },
    async deleteSelectedItems() {
      if (this.selectedForDeletion.length === 0) {
        return; // No items selected, do nothing
      }

      const result = await Swal.fire({
        title: 'Confirm Deletion',
        text: 'Are you sure you want to delete selected items?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete them!'
      });

      if (result.isConfirmed) {
        try {
          await Promise.all(this.selectedForDeletion.map(async hn_id => {
            await axios.delete(`${this.endpointUrl}/api/patients/${hn_id}`);
          }));

          // Remove deleted items from local state
          this.desserts = this.desserts.filter(item => !this.selectedForDeletion.includes(item.hn_id));
          
          // Clear selected items for deletion
          this.selectedForDeletion = [];

          // Show success notification
          Swal.fire('Deleted!', 'Selected items have been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting items:', error);
          // Show error notification
          Swal.fire('Error', 'Failed to delete selected items.', 'error');
        }
      }
    },

    closeDialog() {
      this.dialog = false;
      this.isAppointmentDialogOpen = false;
      // Other logic...
    },
    openAppointmentDialog(item) {
      // Close the Patient.vue dialog if it is open
      if (this.dialog) {
        this.dialog = false;
      }
      const { data } = axios.get(this.endpointUrl + '/api/status');
      this.items_status = data;
      // Set editedItem and dialogTitle based on item data

      this.editedItem = item;
      console.log(item);
      console.log(this.editedItem.age_name);

      this.dialogTitle = 'นัดหมายผู้ป่วย'; // Set your dialog title here

      // Show the appointment dialog
      this.isAppointmentDialogOpen = true;

    },
    // formatDate(inputDate) {
    //   if (!inputDate) {
    //     return ''; // Return an empty string if inputDate is null
    //   }
    //   const date = new Date(inputDate);
    //   const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
    //   const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    //   const year = date.getFullYear();
    //   return `${day}-${month}-${year}`;
    // },
    formatDateForMySQL(dateString) {
      // Extract the date parts
      if (!dateString) {
        return null; // Return an empty string if dateString is undefined or null
      }
      const datePart = dateString.split('-');
      // Rearrange the date parts to match MySQL format (YYYY-MM-DD)
      const formattedDate = `${datePart[2]}-${datePart[1]}-${datePart[0]}`;
      return formattedDate;
    },
    // formatDateWithoutTime(dateTimeString) {
    //   return dateTimeString.split('T')[0];
    // },
    redirectToPatientDetail(item) {

      console.log('คลิก Row นี้:', item);
    },

    getTypeColor(type) {
      return this.statusColorMap[type] || 'defaultColor';
    },
    getStatusColor(type) {
      return this.statusColorMap[type] || 'defaultColor';
    },
    openDialog(action, item = null) {
      this.dialogTitle = action === 'add' ? 'จัดการผู้ป่วยใหม่' : 'แก้ไขข้อมูลผู้ป่วย';
      this.editedItem = action === 'add' ? {} : { ...item };
      this.dialog = true;
    },

    // openWatchDialog(item) {
    //   this.dialogTitle = 'ดูข้อมูลผู้ป่วย';
    //   this.dialogVisible = true;
    //   this.editedItem = { ...item };
    //   this.dialog = true;
    //   this.viewMode = true;
    // },

    async saveItem(editedItem) {
      try {
        let response;

        editedItem.service_date = this.formatDateForMySQL(editedItem.service_date);

        if (!editedItem.hn_id) {
          // Add new patient
          response = await axios.post(`${this.endpointUrl}/api/patients`, {
            ages_id: editedItem.ages_id.age_id,
            gender: editedItem.gender,
            number: editedItem.number,
            tracking_patient_id: editedItem.tracking_patient_id,
            coordinate: editedItem.coordinate,
            type_patient_id: editedItem.type_patient_id,
            other: editedItem.other,
            status_case_id: null,
            service_date: null,
            time: null
          });
          console.log(editedItem);
          this.$store.commit('incrementPatientCount');

          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'กรอกข้อมูลสำเร็จ',
          });
        } else {
          // Update existing patient
          console.log('นัดหมายผู้ป่วย', editedItem.time);
          response = await axios.put(`${this.endpointUrl}/api/patients/${editedItem.hn_id}`, {
            status_case_id: editedItem.status_case_id,
            service_date: editedItem.service_date,
            time: editedItem.time
          });
        }
        if (editedItem.hasOwnProperty('time')) {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'นัดหมายผู้ป่วยสำเร็จ',
        });
        } 

        console.log('แก้ไขข้อมูลผู้ป่วย', editedItem);
        response = await axios.put(`${this.endpointUrl}/api/patients/${editedItem.hn_id}`, {
          ages_id: editedItem.ages_id.age_id,
          gender: editedItem.gender,
          number: editedItem.number,
          tracking_patient_id: editedItem.tracking_patient_id,
          coordinate: editedItem.coordinate,
          type_patient_id: editedItem.type_patient_id,
          other: editedItem.other,
        });
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'แก้ไขข้อมูลสำเร็จ',
        });


        console.log('response', response);
        const savedPatient = response.data;
        this.$nextTick(() => {
          if (!editedItem.hn_id) {
            // Add new patient
            this.desserts.push(savedPatient);
          } else {
            // Update existing patient
            const index = this.desserts.findIndex(item => item.hn_id === savedPatient.hn_id);
            this.$set(this.desserts, index, savedPatient.hn_id);
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
          confirmButtonText: 'ตกลง',
          cancelButtonText: 'ยกเลิก',
        });

        if (result.isConfirmed) {
          // If the user confirms, proceed with the deletion
          try {
            const response = await axios.delete(this.endpointUrl + `/api/patients/${item.hn_id}`);
            if (response.status === 200) {
              // Remove the deleted patient from the local state
              this.desserts = this.desserts.filter(p => p.hn_id !== item.hn_id);
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
        // this.desserts = data;
        console.log("This data", data)
        this.$emit('data-loaded', data);

        // const formattedData = data.map(item => {
        //   // Assuming the service_date field contains the date to be formatted
        //   return {
        //     ...item,
        //     service_date: this.formatDate(item.service_date) // Format date here
        //   };
        // });

        this.desserts = data;
        console.log(this.desserts);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
    async fetchDataFromServer() {
      try {
        const { data } = await axios.get(this.endpointUrl + '/api/patients');
        // const formattedData = data.map(item => {
        //   // Assuming the service_date field contains the date to be formatted
        //   return {
        //     ...item,
        //     service_date: this.formatDate(item.service_date) // Format date here
        //   };
        // });
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
