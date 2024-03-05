<template>
  <div>
    <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
      :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
    <div class="additional-text">
      <p>
        กราฟบ่งบอกถึงข้อมูลผู้ป่วยประจำปี 2566 <br>
        โดยมีฉุกเฉินเเทนเป็นสีเเดงที่บอกถึงการเกิดอุบัติเหตุ ในเเต่ละเดือน  <br>
        เเละให้สีฟ้าเเทนเป็นผู้ป่วยนัดรับ ในเเต่ละเดือน
      </p>
    </div>
  </div>
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
      default: () => {},
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
          "กรกฏาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
        datasets: [
          {
            label: "ฉุกเฉิน",
            backgroundColor: "#DD1B16",
            data: [5, 9, 4, 6, 8, 21, 15, 13, 18, 11, 10, 12],
          },
          {
            label: "นัดรับ",
            backgroundColor: "#4169E1",
            data: [8, 14, 7, 9, 12, 18, 13, 15, 10, 8, 7, 9],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
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
            text: 'ข้อมูลผู้ป่วยประจำปี 2566',
            font: {
              size: 16
            }
          },
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
        const tWithoutObserver = this.t.map(item => item);

        // Update data for the first dataset
        this.chartData.datasets[0].data.push(...tWithoutObserver);

        // Add data for the second dataset
        const tWithoutObserverSecond = this.countTypes(this.desserts);
        this.chartData.datasets[1].data.push(...tWithoutObserverSecond);
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

<style>
.additional-text {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #555;
}
</style>