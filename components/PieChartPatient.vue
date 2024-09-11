<template>
  <div class="chart-container">
    <Doughnut :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
      :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" v-if="loaded" />
    <div class="additional-text mt-4 text-sm md:text-base">
      <p>
        กราฟบ่งบอกอัตราการเกิดอุบัติเหตุประจำปี {{ currentYear }} ในรูปเเบบไตรมาสโดย<br>
        ไตรมาสที่ 1 คือ ช่วงเดือนมกราคม - มีนาคม คือสีเขียว <br>
        ไตรมาสที่ 2 คือ ช่วงเดือนเมษายน - มิถุนายน คือสีเหลือง <br>
        ไตรมาสที่ 3 คือ ช่วงเดือนกรกฎาคม - กันยายน คือสีม่วง<br>
        ไตรมาสที่ 4 คือ ช่วงเดือนตุลาคม - ธันวาคม คือสีฟ้า
      </p>
    </div>
  </div>
</template>

<script>
import '../styles/piechart.css'
import PieChartJs from '../scripts/piechart.js'

export default PieChartJs
</script>
