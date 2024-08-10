<template>
  <div class="chart-container">
    <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
        :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" v-if="loaded"/>
    <div class="additional-text mt-4 text-sm md:text-base">
      <p>
        กราฟบ่งบอกถึงข้อมูลผู้ป่วยประจำปี {{ currentYear }} <br>
        โดยมีฉุกเฉินเเทนเป็นสีเเดงที่บอกถึงการเกิดอุบัติเหตุ ในเเต่ละเดือน <br>
        เเละให้สีฟ้าเเทนเป็นผู้ป่วยนัดรับ ในเเต่ละเดือน
      </p>
    </div>
  </div>
</template>
<script>
import '../styles/barchart.css'
import BarChartJs from '../scripts/barchart.js'

export default BarChartJs
</script>

