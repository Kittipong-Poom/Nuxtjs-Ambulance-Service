<template>
    <div>
      <LeafletStaticAppointment />
    </div>
  </template>
  
  <script>
  
  import LeafletStaticAppointment from '~/components/LeafletStaticAppointment.vue';
  
  export default {
    components: {
        LeafletStaticAppointment
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
  