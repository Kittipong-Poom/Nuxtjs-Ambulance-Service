<template>
  <div>
    <LeafletStaticUrgent />
  </div>
</template>

<script>

import LeafletStaticUrgent from '~/components/LeafletStaticUrgent.vue';

export default {
  components: {
    LeafletStaticUrgent
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

