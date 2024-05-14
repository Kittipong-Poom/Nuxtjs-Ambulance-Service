<template>
  <div>
    <Pie :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
      :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
    <div class="additional-text">
      <p>กราฟบ่งบอกอัตราการเกิดอุบัติเหตุประจำปี 2566 ในรูปเเบบไตรมาสโดย
        ไตรมาสที่ 1 คือ ช่วงเดือนมกราคม - มีนาคม คือสีม่วงเข้ม <br>
        ไตรมาสที่ 2 คือ ช่วงเดือนเมษายน - มิถุนายน คือสีนํ้าเงิน <br>
        ไตรมาสที่ 3 คือ ช่วงเดือนกรกฎาคม - กันยายน คือสีม่วงแก่<br>
        ไตรมาสที่ 4 คือ ช่วงเดือนตุลาคม - ธันวาคม คือสีเหนือ
      </p>
    </div>
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs/legacy'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
  name: 'PieChartPatient',
  components: {
    Pie
  },
  props: {
    chartId: {
      type: String,
      default: 'pie-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => { }
    },
    plugins: {
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      chartData: {
        labels: ['ไตรมาส 1', 'ไตรมาส 2', 'ไตรมาส 3', 'ไตรมาส 4',],
        datasets: [
          {
            backgroundColor: ['#8481DD', '#8BC1F7', '#B2B0EA', '#FFCAC9',],
            data: [40, 20, 50, 20]
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top', // Set legend position to right
            labels: {
              // Define labels here
              generateLabels: function (chart) {
                const labels = [];
                labels.push({
                  text: 'ไตรมาส 1',
                  fillStyle: '#8481DD',
                  strokeStyle: '#8481DD',
                  lineWidth: 2,
                  hidden: false,
                  index: 0
                });
                labels.push({
                  text: 'ไตรมาส 2',
                  fillStyle: '#8BC1F7',
                  strokeStyle: '#8BC1F7',
                  lineWidth: 2,
                  hidden: false,
                  index: 1
                });
                labels.push({
                  text: 'ไตรมาส 3',
                  fillStyle: '#B2B0EA',
                  strokeStyle: '#B2B0EA',
                  lineWidth: 2,
                  hidden: false,
                  index: 2
                });
                labels.push({
                  text: 'ไตรมาส 4',
                  fillStyle: '#FFCAC9',
                  strokeStyle: '#FFCAC9',
                  lineWidth: 2,
                  hidden: false,
                  index: 3
                });
                return labels;
              }
            }

          },
          title: {
            position: 'top',
            display: true,
            text: 'อัตราการเกิดเหตุประจำปี 2566 ',        // Text of the title
            font: {
              size: 16 // Adjust font size if needed
            }
          }
        }
      }
    }
  },
}
</script>
<style>
.additional-text {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #555;
}
</style>