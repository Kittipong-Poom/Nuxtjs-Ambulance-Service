<template>
    <v-card >
      <h1 class="justify-center align-center d-flex">ปฏิทิน ปฏิบัติงาน</h1>
      <Calendar />
    </v-card>
  </template>
  
  <script>
  import Calendar from '@/components/Calendar.vue'
  export default {
    components: {
      Calendar
    },
  }
  </script>
  
  <style>
  *{
    margin: 0 ;
    box-sizing: border-box;
  }
</style>