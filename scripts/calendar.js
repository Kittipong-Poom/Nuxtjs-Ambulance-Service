import axios from "axios";
import dayjs from "dayjs";
export default {
  data: () => ({
    endpointUrl: process.env.NODE_ENV == 'development' ? process.env.API_URL_DEVELOPMENT : 'https://server-nuxtjs-ambulance.onrender.com',
    focus: "",
    type: "month",
    typeToLabel: {
      month: "เดือน",
      week: "สัปดาห์",
      day: "วัน",
      "4day": "4 วัน",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    desserts: [],
    formattedDate: new Date().toISOString().substr(0, 10), // Initialize formattedDate with today's date
  }),
  async mounted() {
    await this.fetchDesserts();
    // this.loadEventsFromPatients();
    console.log('ENV :', process.env.NODE_ENV, this.endpointUrl)
    console.log("my data event", this.events);
  },
  computed: {
    currentDay() {
      const dateObject = new Date(this.value);
      const options = { day: "numeric", month: "long", year: "numeric" };
      return dateObject.toLocaleDateString("th-TH", options);
    },
    formattedFocus() {
      if (!this.focus) return "";
      const dateObject = new Date(this.focus);
      const options = { day: "numeric", month: "long", year: "numeric" };
      return dateObject.toLocaleDateString("th-TH", options);
    },
  },
  methods: {
    updateMainCalendar(date) {
      this.focus = date;
      this.formattedDate = date; // อัปเดต formattedDate ด้วย
      this.type = "day";
    },
    viewDay({ date }) {
      this.focus = date;
      this.formattedDate = date; // Sync the date picker with the calendar
      this.type = "day";
    },
    setToday() {
      const today = new Date();
      this.focus = today; // ตั้ง focus ให้แสดงวันที่ปัจจุบัน
      this.formattedDate = today.toISOString().substr(0, 10); // อัปเดต formattedDate ด้วย
      this.type = "day"; // เปลี่ยนการแสดงผลเป็นรายวัน
    },
    prev() {
      this.$refs.calendar.prev();

    },
    next() {
      this.$refs.calendar.next();

    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },

    updateRange({ start, end }) {

    },
    async fetchDesserts() {
      try {
        // Fetch appointments and patients data
        const [appointmentsResponse, patientsResponse] = await Promise.all([
          axios.get(`${this.endpointUrl}/api/appointments`),
          axios.get(`${this.endpointUrl}/api/patients`)
        ]);
        const appointments = appointmentsResponse.data;
        const patients = patientsResponse.data;

        console.log("appointments", appointments);

        if (Array.isArray(appointments) && Array.isArray(patients)) {
          // Clear existing events
          this.events = [];

          appointments.forEach((appointment) => {
            const patient = patients.find(p => p.hn === appointment.hn);

            if (patient) {
              const gregorianDate = dayjs(appointment.service_date).subtract(543, 'year');
              const formattedDate = gregorianDate.format('YYYY-MM-DD');
              const timeComponents = appointment.time.split(':');
              const hours = parseInt(timeComponents[0], 10).toString().padStart(2, '0');
              const minutes = parseInt(timeComponents[1], 10).toString().padStart(2, '0');
              const formattedTime = `${hours}:${minutes}`;
              const startTime = `${formattedDate}T${formattedTime}`;
              // Map status_case_id to specific colors
              const statusColors = {

                'ยกเลิก': '#e0e0e0',  // Purple
                'เสร็จสิ้น': '#4caf50',  // Green
                // 'กำลังดำเนินงาน': '#ffeb3b',  // Yellow
                'รอรับงาน': '#f44336',  // Red
              };
              // Default color if status not found
              const eventColor = statusColors[appointment.status_case_id] || '#000000';
              
              const event = {
                name: appointment.status_case_id === 'ยกเลิก' ? 'เคสถูกยกเลิก' : appointment.hn,
                start: startTime,
                color: eventColor,
                address: `ที่อยู่ : ${appointment.address}`,
                lati: `ละติจูด : ${appointment.lati}`,
                longi: `ลองติจูด : ${appointment.longi}`,
                status_case_id: `สถานะ : ${appointment.status_case_id}`,
                time: `เวลา : ${formattedTime}`,
                type: `ประเภทผู้ป่วย : ${patient.type_patient_name || 'N/A'}`,
                trackpatient: `การติดตามการนำส่งผู้ป่วย : ${patient.tracking_name || 'N/A'}`,
                fname_lname: `ชื่อ-สกุล : ${patient.fname_lname || 'N/A'}`,
                class: appointment.status_case_id === 'ยกเลิก' ? 'cancelled-event' : '',
                hn: appointment.status_case_id === 'ยกเลิก' ? `<s>${appointment.hn}</s>` : appointment.hn, // ขีดฆ่า HN ถ้าเคสถูกยกเลิก
              };
              this.events.push(event);
            }
          });

          console.log("Events:", this.events);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }
};