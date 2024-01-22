<!-- components/BarChart.vue -->
<template>
    <bar-chart :data="chartData" :options="chartOptions"></bar-chart>
  </template>
  
  <script>
  import { Bar, mixins } from 'vue-chartjs';
  
  export default {
    extends: Bar,
    mixins: [mixins.reactiveProp],
    props: ['data'],
    data() {
      return {
        chartData: {
          labels: Object.keys(this.data),
          datasets: [
            {
              label: 'Data Value',
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
              data: Object.values(this.data),
            },
          ],
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
        },
      };
    },
    mounted() {
      this.renderChart(this.chartData, this.chartOptions);
    },
  };
  </script>
  