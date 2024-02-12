<template>
  <v-container>
    <!-- //หัวข้อความ -->
    <v-col cols="12">
      <v-sheet class="pa-1 text-uppercase text-center" color="grey-lighten-3">
        <h2 class="patient align-center head  ">Your Work Queue</h2>
      </v-sheet>
    </v-col>
    <v-row class="mt-7" align="center" justify="center">
      <v-col>
        <v-row align="center" justify="center">
          <!-- ใช้วนลูปจากการอัพข้อมูลมาจาก data table ให้มาอยู่ในรูปแบบ card -->
          <v-card v-for="(patient, index) in desserts" :key="patient.id" outlined style="border-color: #49C8FF;"
            class="mx-auto rounded-xl my-cards" max-width="344" hover @click="selectCard(index)">
            <v-card-item class="text-uppercase dark--text">
              <v-card-title class="d-flex justify-center align-center">
                {{ patient.title }}
              </v-card-title>
              <v-card-subtitle>
                hnnumber: {{ patient.hnnumber }}
              </v-card-subtitle>
              <v-card-subtitle>
                Gender: {{ patient.gender }}
              </v-card-subtitle>
              <v-card-subtitle>
                Age: {{ patient.age }}
              </v-card-subtitle>
              <v-card-subtitle>
                PhoneNumber: {{ patient.numberphone }}
              </v-card-subtitle>
              <v-card-subtitle>
                Coordination: {{ patient.coordinate }}
              </v-card-subtitle>
              <v-card-subtitle>
                Patient type: {{ patient.status }}
              </v-card-subtitle>
              <v-card-subtitle>
                AdDress: {{ patient.address }}
              </v-card-subtitle>
            </v-card-item>
            <v-card-actions class="ma-3 justify-center d-flex align-centerg">
              <v-btn color="#49C8FF" class="rounded-xl white--text" @click="openDialog('add')">
                ลงเวลา&รับงาน
              </v-btn>
              <DialogQueue :dialog="dialog" :saved="saved" :dialog-title="dialogTitle" @save="savejob" @close="close"
                @open-dialog="openDialog" />
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DialogQueue from '~/components/DialogQueue.vue';

import axios from 'axios';
import Swal from 'sweetalert2';


export default {
  components: {
    DialogQueue
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      dialog: false,
      desserts: [],
      //saved ฟั่งชั่นนี้เก็บ object ไว้ในกรณีมีหลายตัว
      saved: {
        appointmenttime: '',
        service_date: '',
        description: '',
      },
      selectedCardIndex: null,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    //เลือก Card ที่เราเลือก
    selectCard(index) {
      this.selectedCardIndex = index;
    },

    // Remove card จากที่เราเลือก
    removeSelectedCard() {
      if (this.selectedCardIndex !== null) {
        this.desserts.splice(this.selectedCardIndex, 1);
        this.selectedCardIndex = null; 
      }
    },
    //ฟังชั่นนี้เอาไว้เซฟ ข้อมูล
    async savejob() {
      try {
        const postData = {
          appointmenttime: this.saved.appointmenttime.trim(),
          service_date: this.saved.service_date.trim(),
          description: this.saved.description.trim(),
          patient_id: this.saved.patient_id
        };

        //ในส่วนนี้ จะ post ก็ต่อเมื่อถ้า ลงเวลางานกรอกข้อมูลไรเสร็จ กด save ข้อมูลจะ post ทันที
        const response = await axios.post(`${this.endpointUrl}/api/jobs`, postData);
        console.log('postData:', postData);

        if (response.status >= 200 && response.status < 300) {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'ลงเวลางานสำเร็จ',
          });

          //ตัวแปรนี้ถ้ากรอกข้อมูลเสร็จจะ ทำการลบการ์ดทีละ 1 ชิ้น
          this.removeSelectedCard(); // Remove the selected card

          this.close(); // อันนี้จะปิด dialog คลิกตรงไหนก็ได้เพื่อปิด
        } else {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ลงเวลางานผิดพลาด',
          });
          console.error('Error creating job:', response.data);
        }
      } catch (error) {
        console.error('Error creating job:', error);


        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create job',
        });
      }
    },


    openDialog(action = null) {
      this.dialogTitle = action === 'add' ? 'จัดการข้อมูลสำหรับ JOB' : 'แก้ไขข้อมูลของ JOB';
      this.dialog = true;
    },
    async loadData() {
      try {
        const res = await axios.get(this.endpointUrl + '/api/patients');
        // this.desserts = data.data;
        this.desserts = res.data;
        console.log(this.desserts);
        // console.log("Loaded data:", data);
      }
      catch (error) {
        console.error('Error loading data:', error);
      }
    },
    close() {
      this.dialog = false;

    }
  },

};
</script>




<style scoped>
body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

/* Add your custom styles here if needed */

body {
  font-family: 'Open Sans', sans-serif;
}

.my-cards {
  font-family: 'Open Sans', sans-serif;
}

.head {
  font-size: 17px;
  background-color: #2FB6FF;
  margin: 0;
  padding: 10px;
  display: inline-block;
  border-radius: 25px;
  color: white;

}
</style>

