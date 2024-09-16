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
      type: Object,
      default: () => ({}),
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      endpointUrl:
        process.env.NODE_ENV === "development"
          ? process.env.API_URL_DEVELOPMENT
          : process.env.API_URL_PRODUCTION,
      loaded: false, // Define the loaded property
      currentYear: new Date().getFullYear() + 543,
      chartData: {
        labels: [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฏาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ],
        datasets: [
          {
            label: "ผู้ป่วยฉุกเฉิน",
            backgroundColor: "#DD1B16",
            data: [],
          },
          {
            label: "ผู้ป่วยนัดรับ",
            backgroundColor: "#4169E1",
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              generateLabels: function (chart) {
                const labels = [];
                labels.push({
                  text: "ผู้ป่วยฉุกเฉิน",
                  fillStyle: "#DD1B16",
                  strokeStyle: "#DD1B16",
                  lineWidth: 2,
                  hidden: false,
                  index: 0,
                });
                labels.push({
                  text: "ผู้ป่วยนัดรับ",
                  fillStyle: "#4169E1",
                  strokeStyle: "#4169E1",
                  lineWidth: 2,
                  hidden: false,
                  index: 1,
                });
                return labels;
              },
            },
          },
          title: {
            display: true,
            text: `ข้อมูลผู้ป่วยประจำปี ${new Date().getFullYear() + 543}`,
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
        const currentYear = new Date().getFullYear() + 543; // ปีพุทธศักราช

        // โหลดปีล่าสุดที่บันทึกไว้จาก localStorage
        const lastLoadedYear = localStorage.getItem("lastLoadedYear");

        // รีเซ็ตข้อมูลหากปีเปลี่ยนไป
        if (!lastLoadedYear || parseInt(lastLoadedYear) !== currentYear) {
          // ถ้าปีปัจจุบันต่างจากปีที่โหลดล่าสุด
          this.currentYear = currentYear;
          this.chartData.datasets.forEach(
            (dataset) => (dataset.data = Array(12).fill(0)) // รีเซ็ตข้อมูลกราฟ
          );

          // บันทึกปีใหม่ลงใน localStorage
          localStorage.setItem("lastLoadedYear", currentYear);
        }

        // ดึงข้อมูลผู้ป่วยฉุกเฉินจาก /api/caseurgents
        const responseUrgent = await axios.get(
          this.endpointUrl + "/api/caseurgents"
        );
        const dataUrgent = responseUrgent.data;

        if (Array.isArray(dataUrgent)) {
          this.chartData.datasets[0].data = this.countTypes(dataUrgent);
        } else {
          console.error(
            "Response data from /api/caseurgents is not an array:",
            dataUrgent
          );
        }

        // ดึงข้อมูลผู้ป่วยนัดรับจาก /api/appointments
        const responseScheduled = await axios.get(
          this.endpointUrl + "/api/appointments"
        );
        const dataScheduled = responseScheduled.data;

        if (Array.isArray(dataScheduled)) {
          this.chartData.datasets[1].data = this.countTypes(dataScheduled);
        } else {
          console.error(
            "Response data from /api/appointments is not an array:",
            dataScheduled
          );
        }

        this.loaded = true; // กำหนดว่าโหลดข้อมูลเสร็จแล้ว
        console.log("Get Bar Chart Api Patient", this.countTypes(dataUrgent));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },

    countTypes(data) {
      const currentBuddhistYear = new Date().getFullYear() + 543; // ได้ปีพุทธศักราชปัจจุบัน
      const typeCounts = Array(12).fill(0); // สร้าง array ขนาด 12 ที่เก็บข้อมูลของแต่ละเดือน

      data.forEach((item) => {
        let serviceDate = new Date(item.service_date);

        // แปลงปีพุทธศักราชให้เป็นปีคริสต์ศักราช
        let year = serviceDate.getFullYear();

        if (year > 2500) {
          // สมมติว่าเป็นปีพุทธศักราช
          year -= 543; // แปลงปีพุทธศักราชเป็นคริสต์ศักราช
          serviceDate.setFullYear(year);
        }

        const buddhistYear = year + 543; // แปลงกลับเป็นปีพุทธศักราชเพื่อแสดงผล



        // ตรวจสอบว่าปีพุทธศักราชเป็นปีปัจจุบันหรือไม่
        if (buddhistYear === currentBuddhistYear) {
          const month = serviceDate.getMonth(); // ดึงค่าเดือน (0-11)
          typeCounts[month]++; // เพิ่มจำนวนของเดือนที่ตรงกัน
        }
      });
      return typeCounts;
    },
  },
};
