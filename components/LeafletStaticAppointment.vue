<template>
  <div>
    
    เลือกปีต้องการดูสติถิ :
    
    <select v-model="selectedYear" @change="onYearChange" class="custom-select"> 
      <option v-for="year in years" :key="year" :value="year">{{ year }}</option> 
    </select>
    <div id="map" style="height: 100vh; width: 100%;"></div>
  </div>
</template>

<script>
import '../styles/leafletappoint.css'

import LeafletAppointJs from '../scripts/leafletappointment.js'

export default LeafletAppointJs
</script>