
<template>
  <v-card>
    <v-card-title justify="center" class="center-container1">
      <h1>เคสผู้ป่วยฉุกเฉิน</h1>
    </v-card-title>
    <v-card-title>
      <!-- Add new information -->
      <v-btn depressed class="button" color="primary" @click="openDialogurgent('add')">
        เพิ่มเคสผู้ป่วยฉุกเฉิน
      </v-btn>
      <v-spacer />
      <v-text-field v-model="search" append-icon="mdi-magnify" label="ค้นหา" single-line hide-details />
    </v-card-title>

    <v-data-table depressed :headers="headers"  :items="desserts" :search="search" @click:row="redirectToPatientDetail">
      <template v-slot:item.action="{ item }">
        <v-btn color="#4CAF50" class="mr-2 white--text" @click="openDialogurgent('edit', item)">
          <v-icon>mdi-pencil-box-multiple-outline</v-icon>
          แก้ไข
        </v-btn>
        <v-btn class="mr-2" color="primary" :readonly="viewMode" @click="openWatchDialog(item)">
          <v-icon>mdi-account-search-outline</v-icon>
          ดูข้อมูล
        </v-btn>
        <v-btn color="red" class="white--text" @click="deleteItem(item)">
          <v-icon>mdi-delete</v-icon>
          ลบ
        </v-btn>

      </template>

      <template v-slot:item.violence="{ item }">
        <v-chip class="my-chip2" :color="getStatusColor(item.violence)"
          :class="{ 'black--text': item.violence === 'ผู้ป่วยเฉินเร่งด่วน'|| item.violence === 'ผู้ป่วยทั่วไป', }"
          :dark="item.violence === 'ผู้ป่วยฉุกเฉินวิฤกติ' || item.violence === 'ผู้ป่วยไม่ฉุกเฉิน'">
          {{ item.violence }}
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
    <dialog-formurgent :dialog="dialog" :edited-item="editedItem" :dialog-title1="dialogTitle1" @save="saveItem"
      @close="closeDialog" :view-mode="viewMode" />
    <notifications group="success" classes="custom-notification" />
    <notifications group="fail" classes="fail-noti" />
  </v-card>
</template>

<script>
import dayjs from 'dayjs';
import { Notify } from 'vue-notification';
import DefaultLayout from '~/layouts/default.vue';
import DialogForm from '~/components/DialogForm.vue';
import DepartmentCard from '~/components/DepartmentCard.vue';
import BarChartPatient from '~/components/BarChartPatient.vue';
import DialogFormurgent from '~/components/DialogFormurgent.vue';
import axios from 'axios'
import Swal from 'sweetalert2';
export default {
  components: {
    DefaultLayout,
    DialogForm,
    DepartmentCard,
    BarChartPatient,
    DialogFormurgent,
    Notify
  },
  data() {
    return {
      confirm: false,
      confirmItem: null,
      dialogVisible: false,
      showNotifications: false,
      notifications: [],
      drawer: false,
      darkMode: false,
      search: '',
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      headers: [
        { text: 'วัน/เดือน/ปี', value: 'service_date',align: 'center'},
        { text: 'เวลา', value: 'time', align: 'center' },
        { text: 'เพศ', value: 'gender', align: 'center' },
        { text: 'อายุ', value: 'age', align: 'center' },
        { text: 'ประเภทผู้ป่วย', value: 'status', align: 'center' },
        { text: 'ความรุนแรงของประเภทผู้ป่วย', value: 'violence', align: 'center' },
        { text: 'กลุ่มอาการฉุกเฉิน', value: 'emergency_group', align: 'center'  },
        { text: 'จุดเกิดเหตุ', value: 'coordinate', align: 'center' },
        { text: 'การติดตามการนำส่งผู้ป่วย', value: 'patient_delivery', align: 'center' },
        { text: '', value: 'action', sortable: false , align: 'center'}
      ],
      //พิกัดจะให้กดคลิกแล้วให้เป็นหน้า map
      desserts: [],
      statusColorMap: {
        'ผู้ป่วยฉุกเฉินวิฤกติ': 'red',
        'ผู้ป่วยเฉินเร่งด่วน': 'yellow',
        'ผู้ป่วยไม่ฉุกเฉิน': 'green',
        'ผู้ป่วยทั่วไป': 'white'
      },
      dialog: false,
      dialogTitle1: '',
      editedItem: {
        service_date: '',
        time: '',
        gender: '',
        age: '',
        status: '',
        violence: '',
        emergency_group: '',
        coordinate: '',
        patient_delivery: ''
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
  computed: {
    formattedDesserts() {
      return this.desserts.map(dessert => ({
        ...dessert,
        service_date: this.formatThaiDate(dessert.service_date)
      }));
    },
    formatThaiDate(dateString) {
      // Extract the date parts
      const datePart = dateString.split('-');
      // Rearrange the date parts to match the desired format (DD-MM-YYYY)
      const formattedDate = `${datePart[2]}-${datePart[1]}-${datePart[0]}`;

      // Remove the time part
      const dateWithoutTime = formattedDate.split('T')[0];

      return dateWithoutTime;
    },
  },
  methods: {
    formatDate(inputDate) {
      const date = new Date(inputDate);
      const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    formatDateForMySQL(dateString) {
      // Extract the date parts
      const datePart = dateString.split('-');
      // Rearrange the date parts to match MySQL format (YYYY-MM-DD)
      const formattedDate = `${datePart[2]}-${datePart[1]}-${datePart[0]}`;
      return formattedDate;
    },
    formatDateWithoutTime(dateTimeString) {
      return dateTimeString.split('T')[0];
    },

    redirectToPatientDetail(item) {

      console.log('คลิก Row นี้:', item);
    },

    getStatusColor(violence) {
      return this.statusColorMap[violence] || 'primary';
    },
    openDialogurgent(action, item = null) {
      this.dialogTitle1 = action === 'add' ? 'จัดการผู้ป่วยใหม่เคสฉุกเฉิน' : 'แก้ไขข้อมูลผู้ป่วยฉุกเฉิน';
      this.editedItem = action === 'add' ? {} : { ...item };
      this.dialog = true;
      this.viewMode = action !== 'add';
      this.viewMode = false;
    },
    openWatchDialog(item) {
      this.dialogTitle1 = 'ดูข้อมูลผู้ป่วยฉุกเฉิน';
      this.dialogVisible = true;
      this.editedItem = { ...item };
      this.dialog = true;
      this.viewMode = true;
    },

    async saveItem(editedItem) {
      try {
        let response;
        editedItem.service_date = this.formatDateForMySQL(editedItem.service_date);

        if (!editedItem.caseurgent_id) {
          // Add new patient
          response = await axios.post(`${this.endpointUrl}/api/caseurgents`, editedItem);
          this.$notify({
            'group': 'success',
            'title': 'กรอกข้อมูลสำเร็จ',
            'text': 'คลิกกระดิ่งเพื่อดูข้อมูลเพิ่มเติม'
          })
          this.$store.commit('incrementPatientCount');

          this.notifications = [];
          this.showRedBadge = false;
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'แก้ไขข้อมูลสำเร็จ',
          });

        } else {
          // Update existing patient
          response = await axios.put(`${this.endpointUrl}/api/caseurgents/${editedItem.caseurgent_id}`, editedItem);
          this.$notify({
            'group': 'success',
            'title': 'แก้ไขข้อมูลสำเร็จ',
            'text': 'คลิกกระดิ่งเพื่อดูข้อมูลเพิ่มเติม'
          })
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'แก้ไขข้อมูลสำเร็จ',
          });
        }
        console.log('response', response);
        const savedUrgents = response.data;
        // Update the local state or trigger a refresh from the server
        // based on your application's architecture
        // For simplicity, updating the local state here:

        this.$nextTick(() => {
          if (!editedItem.caseurgent_id) {
            // Add new patient
            this.desserts.push(savedUrgents); // Push the newly added item to the desserts array
          } else {
            // Update existing patient
            const index = this.desserts.findIndex(item => item.caseurgent_id === savedUrgents.caseurgent_id);
            this.$set(this.desserts, index, savedUrgents);
          }
          this.closeDialog();
        });
        this.desserts = await this.fetchDataFromServer();
      } catch (error) {
        console.error('Error saving item:', error);
        this.$notify({
          'group': 'fail',
          'title': 'เพิ่มไม่สำเร็จ',
        })
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
            const response = await axios.delete(this.endpointUrl + `/api/caseurgents/${item.caseurgent_id}`);
            if (response.status === 200) {
              // Remove the deleted patient from the local state
              this.desserts = this.desserts.filter(p => p.caseurgent_id !== item.caseurgent_id);
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
        const { data } = await axios.get(this.endpointUrl + '/api/caseurgents')
        // this.desserts = data;
        console.log("This data", data)
        this.$emit('data-loaded', data);

        const formattedData = data.map(item => {
          // Assuming the date_service field contains the date to be formatted
          return {
            ...item,
            service_date: this.formatDate(item.service_date) // Format date here
          };
        });

        this.desserts = formattedData;
        console.log(this.desserts);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
    async fetchDataFromServer() {
      try {
        const { data } = await axios.get(this.endpointUrl + '/api/caseurgents');
        const formattedData = data.map(item => {
          // Assuming the date_service field contains the date to be formatted
          return {
            ...item,
            service_date: this.formatDate(item.service_date) // Format date here
          };
        });
        return formattedData;
      } catch (error) {
        console.error('Error fetching data from server:', error);
        throw error; // Propagate the error to the caller
      }
    },
    closeDialog() {
      // Close the dialog
      this.dialog = false;
      this.dialogTitle1 = '';
      this.editedItem = {};
      this.dialogVisible = false;
    },

  }
};
</script>

<style >
body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.custom-notification {
  margin: 0 5px 5px;
  padding: 10px;
  font-size: 18px;
  color: #ffffff;
  background: #68CD86;
  border-left: 5px solid #42A85F;
  ;
}

.fail-noti {

  margin: 0 0px 5px;
  padding: 10px;
  font-size: 18px;
  color: #ffffff;
  background: #E54D42;
  border-left-color: #B82E24;
}

.center-container1 {
  padding-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

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
  width: 130px;
  justify-content: center;
}

.v-notification {
  background-color: green;
  color: white;
}
</style>
