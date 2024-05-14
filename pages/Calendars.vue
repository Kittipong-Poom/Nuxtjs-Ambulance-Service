<template>
    <v-card >
      <h1 class="justify-center align-center d-flex">ปฏิทิน ปฏิบัติงาน</h1>
      <Calendar />
    </v-card>
  </template>
  
  <script>
  import Calendar from '@/components/Calendar.vue'
  import Swal from 'sweetalert2';
  export default {
    components: {
      Calendar
    },
    mounted(){
      this.showAlert();
    },
    methods:{
      showAlert() {
        Swal.fire({
          title: 'แจ้งเตือน',
          text: 'กรุณาเช็ควันที่ต้องไปรับผู้ป่วย',
          icon: 'warning',
        });
      }
    }
  }
  </script>
  
  <style>
  *{
    margin: 0 ;
    box-sizing: border-box;
  }
</style>