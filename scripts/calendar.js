import axios from "axios";
import dayjs from "dayjs";
export default {
  data: () => ({
    endpointUrl: process.env.NODE_ENV === 'development' ? process.env.API_URL_DEVELOPMENT : process.env.API_URL_PRODUCTION,
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
    colors: [
      "#2450E0",
      "#7224E0",
      "#24E099",
      "#E0DE24",
      "#E04867",
      "#E05B24",
      "#E08175",
    ],
    formattedDate: new Date().toISOString().substr(0, 10), // Initialize formattedDate with today's date
  }),
  async mounted() {
    await this.fetchDesserts();
    // this.loadEventsFromPatients();
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
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      const today = new Date().toISOString().substr(0, 10); // สร้างวันที่ปัจจุบันในรูปแบบ 'YYYY-MM-DD'
      this.formattedDate = today; // อัปเดต formattedDate
      this.focus = new Date(); // อัปเดต focus หากต้องการให้ปฏิทินแสดงวันที่ปัจจุบัน
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
        console.log("patients", patients);

        if (Array.isArray(appointments) && Array.isArray(patients)) {
          // Clear existing events
          this.events = [];

          appointments.forEach((appointment, index) => {
            const patient = patients.find(p => p.hn === appointment.hn);

            if (patient && appointment.status_case_id !== 'ยกเลิก' && appointment.status_case_id !== 'เสร็จสิ้น') {
              // Convert the Thai Buddhist year to the Gregorian year by subtracting 543
              const gregorianDate = dayjs(appointment.service_date).subtract(543, 'year');
              const formattedDate = gregorianDate.format('YYYY-MM-DD');
              console.log(`Converted date: ${formattedDate}`);

              const timeComponents = appointment.time.split(':');
              const hours = parseInt(timeComponents[0], 10).toString().padStart(2, '0');
              const minutes = parseInt(timeComponents[1], 10).toString().padStart(2, '0');
              const formattedTime = `${hours}:${minutes}`;
              console.log(`Formatted time: ${formattedTime}`);

              // Create a Date object for the start time in ISO format
              const startTime = `${formattedDate}T${formattedTime}`;
              console.log(`Start time: ${startTime}`);

              const colorIndex = index % this.colors.length;
              const event = {
                name: ` ${appointment.hn}`,
                start: startTime,
                color: this.colors[colorIndex],
                address: `ที่อยู่ : ${appointment.address}`,
                lati: `ละติจูด : ${appointment.lati}`,
                longi: `ลองติจูด : ${appointment.longi}`,
                time: `เวลา : ${formattedTime}`,
                type: `ประเภทผู้ป่วย : ${patient.type_patient_name || 'N/A'}`, // Fallback to 'N/A' if undefined
                trackpatient: `การติดตามการนำส่งผู้ป่วย : ${patient.tracking_name || 'N/A'}`, // Fallback to 'N/A' if undefined
                other: `เพิ่มเติม : ${patient.other || 'N/A'}`, // Fallback to 'N/A' if undefined
                
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