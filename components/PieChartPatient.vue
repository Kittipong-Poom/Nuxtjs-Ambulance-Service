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
          labels: ['ไตรมาส 1', 'ไตรมาส 2', 'ไตรมาส 3', 'ไตรมาส 4',],
          datasets: [
            {
              backgroundColor: ['#DD1B16', '#668Dc0', '#4FDEE0', '#E1DB1C',],
              data: [40 , 20 , 80 , 10]
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
                  fillStyle: '#4FDEE0',
                  strokeStyle: '#4FDEE0',
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
            position: 'bottom',
            display: true,
            text: 'อัตราการเกิดเหตุประจำปี 66 ', // Text of the title
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
  