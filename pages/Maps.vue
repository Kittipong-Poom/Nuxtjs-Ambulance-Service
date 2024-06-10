<template>
  <div>
    <Leaflet />
  </div>
</template>

<script>
import Leaflet from '~/components/Leaflet.vue';

export default {
  components: {
    Leaflet
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
