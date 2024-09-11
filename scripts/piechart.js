import { Doughnut } from "vue-chartjs/legacy";
import axios from "axios";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: "DoughnutChartPatient",
  components: {
    Doughnut,
  },
  props: {
    chartId: {
      type: String,
      default: "doughnut-chart",
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
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV === 'development' ? process.env.API_URL_DEVELOPMENT : "https://ambulanceserver-uuhg.onrender.com",
      loaded: false,
      currentYear: new Date().getFullYear() + 543,
      chartData: {
        labels: ["ไตรมาส 1", "ไตรมาส 2", "ไตรมาส 3", "ไตรมาส 4"],
        datasets: [
          {
            backgroundColor: ["#4fea5b", "#e8b41e", "#b628ef", "#21eaed"],
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              generateLabels: function (chart) {
                const labels = [];
                labels.push({
                  text: "ไตรมาส 1",
                  fillStyle: "#4fea5b",
                  strokeStyle: "#4fea5b",
                  lineWidth: 2,
                  hidden: false,
                  index: 0,
                });
                labels.push({
                  text: "ไตรมาส 2",
                  fillStyle: "#e8b41e",
                  strokeStyle: "#e8b41e",
                  lineWidth: 2,
                  hidden: false,
                  index: 1,
                });
                labels.push({
                  text: "ไตรมาส 3",
                  fillStyle: "#b628ef",
                  strokeStyle: "#b628ef",
                  lineWidth: 2,
                  hidden: false,
                  index: 2,
                });
                labels.push({
                  text: "ไตรมาส 4",
                  fillStyle: "#21eaed",
                  strokeStyle: "#21eaed",
                  lineWidth: 2,
                  hidden: false,
                  index: 3,
                });
                return labels;
              },
            },
          },
          title: {
            position: "top",
            display: true,
            text: `อัตราการเกิดเหตุประจำปี ${new Date().getFullYear() + 543}`,
            font: {
              size: 16,
            },
          },
        },
      },
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const currentYear = new Date().getFullYear() + 543;

        // Reset chart data if it's a new year
        if (this.currentYear !== currentYear) {
          this.currentYear = currentYear;
          this.chartData.datasets[0].data = [0, 0, 0, 0]; // Reset data for new year
        }

        // Fetch data for emergency patients from /api/caseurgents
        const responseUrgent = await axios.get(
          this.endpointUrl + "/api/caseurgents"
        );
        const dataUrgent = responseUrgent.data;

        if (Array.isArray(dataUrgent)) {
          // Process data only for the current year
          this.chartData.datasets[0].data = this.countTypes(
            dataUrgent,
            currentYear
          );
        } else {
          console.error(
            "Response data from /api/caseurgents is not an array:",
            dataUrgent
          );
        }
        console.log(
          "Get Pie Chart Api Caseurgents",
          this.countTypes(dataUrgent, currentYear)
        );
        this.loaded = true;
      } catch (error) {
        console.log("Error Fetching Data:", error);
      }
    },

    countTypes(data, currentYear) {
      const quarterCounts = [0, 0, 0, 0]; // Initialize an array to store counts for each quarter
      data.forEach((item) => {
        const serviceDate = new Date(item.service_date);
        let year = serviceDate.getFullYear();

        // Convert Buddhist year to Gregorian year
        if (year > 2500) {
          year -= 543;
        }

        // Only count data for the current Buddhist year
        if (year + 543 === currentYear) {
          const month = serviceDate.getMonth(); // Get the month (0-11)
          const quarter = Math.floor(month / 3); // Determine which quarter (0-3)
          quarterCounts[quarter]++; // Increment count for the corresponding quarter
        }
      });
      return quarterCounts;
    },
  },
};
