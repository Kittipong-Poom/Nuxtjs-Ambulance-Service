<template>
  <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
    :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
</template>

<script>
import { Bar } from "vue-chartjs/legacy";
import axios from "axios";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChartPatient",
  components: {
    Bar,
  },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => { },
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chartData: {
        labels: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
          "กรกฏาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคอม"],
        datasets: [
          {
            label: "ข้อมูล ผู้ป่วย",
            backgroundColor: ["#DD1B16", "#4169E1",],
            data: [5, 9, 4, 6, 8, 21, 15, 13, 18, 11, 10, 12],
          },
        ],
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
                  text: 'ฉุกเฉิน',
                  fillStyle: '#DD1B16',
                  strokeStyle: '#DD1B16',
                  lineWidth: 2,
                  hidden: false,
                  index: 0
                });
                labels.push({
                  text: 'นัดรับ',
                  fillStyle: '#4169E1',
                  strokeStyle: '#4169E1',
                  lineWidth: 2,
                  hidden: false,
                  index: 1
                });
                return labels;
              }
            }
          },
          title: {
            display: true,
            text: 'ข้อมูล ผู้ป่วย', // Text of the title
            font: {
              size: 16 // Adjust font size if needed
            }
          }
        }
      }
    };
  },
  fetch() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const { data } = await axios.get(this.endpointUrl + "/api/patients");
        this.desserts = data;
        console.log(this.desserts);
        this.t = this.countTypes(this.desserts);
        const tWithoutObserver = t.map(item => item);

        this.chartData.datasets[0].data.push(...tWithoutObserver);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },

    countTypes(data) {
      const typeCounts = {};

      data.forEach((item) => {
        const type = item.type;
        if (typeCounts[type]) {
          typeCounts[type]++;
        } else {
          typeCounts[type] = 1;
        }
      });
      return Object.values(typeCounts);
    },
  },
};
</script>
