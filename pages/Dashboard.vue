<template>
  
    <div class="cards">
      <DepartmentCard />

      <!-- More cards -->
    </div>
  
</template>

<script>
import DepartmentCard from '~/components/DepartmentCard.vue'

// Import other cards

export default {
  components: {
    DepartmentCard,

    // Register other cards
  }
}
</script>

<style>

</style>