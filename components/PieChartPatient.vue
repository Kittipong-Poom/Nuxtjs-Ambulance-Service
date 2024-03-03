<template>
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
          labels: ['ฉุกเฉิน', 'บาดเจ็บเล็กน้อย', 'หมดสติ', 'ฉุกเฉินเร่งด่วน','มารับที่พัก'],
          datasets: [
            {
              backgroundColor: ['#DD1B16', '#668Dc0', '#2d82b5', '#DD1B16','#86B6F6'],
              data: [40, 20,80, 10,20]
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
                  text: 'ฉุกเฉิน',
                  fillStyle: '#DD1B16',
                  strokeStyle: '#DD1B16',
                  lineWidth: 2,
                  hidden: false,
                  index: 0
                });
                labels.push({
                  text: 'บาดเจ็บเล็กน้อย',
                  fillStyle: '#668Dc0',
                  strokeStyle: '#668Dc0',
                  lineWidth: 2,
                  hidden: false,
                  index: 1
                });
                return labels;
              }
            }
            
          },
          title: {
            position: 'bottom',
            display: true,
            text: 'สรุปรวมประจำปีของปี 67 ', // Text of the title
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
  