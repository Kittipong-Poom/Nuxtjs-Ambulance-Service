<template>
  <div>
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
    <div class="additional-text">
      <p>กราฟบ่งบอกอัตราการเกิดอุบัติเหตุประจำปี 2566 ในรูปเเบบไตรมาสโดย
        ไตรมาสที่ 1 คือ ช่วงเดือนมกราคม - มีนาคม คือสีเเดง <br>
        ไตรมาสที่ 2 คือ ช่วงเดือนเมษายน - มิถุนายน คือสีฟ้า  <br>
        ไตรมาสที่ 3 คือ ช่วงเดือนกรกฎาคม - กันยายน คือสีม่วง<br>
        ไตรมาสที่ 4 คือ ช่วงเดือนตุลาคม - ธันวาคม คือสีเหลือง
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
        default: () => {}
      },
      plugins: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        chartData: {
          labels: ['ไตรมาส 1', 'ไตรมาส 2', 'ไตรมาส 3', 'ไตรมาส 4',],
          datasets: [
            {
              backgroundColor: ['#DD1B16', '#668Dc0', '#800080', '#E1DB1C',],
              data: [40 , 20 , 80 , 10]
            }
          ]
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
          legend: {
            position: 'right', // Set legend position to right
            labels: {
              // Define labels here
              generateLabels: function (chart) {
                const labels = [];
                labels.push({
                  text: 'ไตรมาส 1',
                  fillStyle: '#DD1B16',
                  strokeStyle: '#DD1B16',
                  lineWidth: 2,
                  hidden: false,
                  index: 0
                });
                labels.push({
                  text: 'ไตรมาส 2',
                  fillStyle: '#668Dc0',
                  strokeStyle: '#668Dc0',
                  lineWidth: 2,
                  hidden: false,
                  index: 1
                });
                labels.push({
                  text: 'ไตรมาส 3',
                  fillStyle: '#800080',
                  strokeStyle: '#800080',
                  lineWidth: 2,
                  hidden: false,
                  index: 2
                });
                labels.push({
                  text: 'ไตรมาส 4',
                  fillStyle: '#E1DB1C',
                  strokeStyle: '#E1DB1C',
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
    }
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