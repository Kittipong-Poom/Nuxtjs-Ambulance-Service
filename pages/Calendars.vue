<template>
    <v-card >
      <span class="justify-center align-center d-flex text-2xl">ปฏิทิน ปฏิบัติงาน</span>
      <Calendar />
    </v-card>
  </template>
  
  <script>
  import Calendar from '@/components/Calendar.vue'
  export default {
    components: {
      Calendar
    },
    created() {
    // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
    if (!localStorage.getItem('user')) {
      // ถ้าไม่มีข้อมูลใน localStorage ให้กลับไปหน้า Login
      this.$router.push('/error');
    }
  },
  }
  </script>
  
  <style>
  *{
    margin: 0 ;
    box-sizing: border-box;
  }
</style>