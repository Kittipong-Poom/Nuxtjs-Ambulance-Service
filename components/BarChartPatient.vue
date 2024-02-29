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
      t: '',
      count: [],
      desserts: [],
      endpointUrl:
        process.env.NODE_ENV == "development"
          ? "http://localhost:5000"
          : "https://ambulance-fbf9.onrender.com",
      chartData: {
        labels: ["ฉุกเฉิน", "ฉุกเฉินเร่งด่วน"],
        datasets: [
          {
            label: "ข้อมูล ผู้ป่วย",
            backgroundColor: "#86B6F6",
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
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
