<template>
  <div>
    <div class="filter-container mb-5 d-flex align-center justify-center">
      <h1 class="filter-label text-xl mr-3">เลือกปีต้องการดูสถิติผู้ป่วยนัดหมาย :</h1>
      <select v-model="selectedYear" @change="onYearChange" class="custom-select">
        <option class="ma-2" v-for="year in years" :key="year" :value="year"> {{ year }} </option>
      </select>
    </div>

    <div id="map" style="height: 100vh; width: 100%;"></div>
  </div>
</template>

<script>
import '../styles/leafletappoint.css'

import LeafletAppointJs from '../scripts/leafletappointment.js'

export default LeafletAppointJs
</script>