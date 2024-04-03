<!-- <template>
  
  <Pie
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
  
</template>

<script>
import { Pie } from 'vue-chartjs/legacy';

import {
Chart as ChartJS,
Title,
Tooltip,
Legend,
ArcElement,
CategoryScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
name: 'PieChartJob',
components: {
  Pie
},
props: {
  // ... (your existing props)
},
data() {
  return {
    chartData: {
      labels: ['รถพยาบาล', 'รับเคส'],
      datasets: [
        {
          backgroundColor: ['#4E53A4', '#9DCAFF'],
          data: [40, 20]
        }
      ]
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false
      // ... (any other chart options you need)
    }
  };
}
};
</script>

<style scoped>
.chart-description {
text-align: center;
margin-top: 10px; /* Adjust the margin as needed */
font-size: 14px; /* Adjust the font size as needed */
color: #555; /* Adjust the color as needed */
}
</style> -->