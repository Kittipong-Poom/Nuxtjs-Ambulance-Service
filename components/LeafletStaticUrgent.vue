<template>
  <div>
    <div class="filter-container mb-5 d-flex align-center justify-center">
      <h1 class="filter-label text-xl mr-3">เลือกปีต้องการดูสถิติผู้ป่วยฉุกเฉิน :</h1>
      <select v-model="selectedYear" @change="onYearChange" class="custom-select">
        <option class="ma-2" v-for="year in years" :key="year" :value="year"> {{ year }} </option>
      </select>
    </div>

    <div id="map" style="height: 100vh; width: 100%;"></div>
  </div>
</template>


<script>
import '../styles/leafleturgents.css'
import LeafleturgentsJS from '../scripts/leafleturgents.js'

export default LeafleturgentsJS
</script>