<template>
  <v-row class="fill-height">
    <v-col cols="auto" class="mini-calendar pl-5">
      <v-date-picker v-model="formattedDate" @change="updateMainCalendar" color="primary" locale="th"></v-date-picker>
    </v-col>
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            วันนี้
          </v-btn>
          <v-btn small color="primary" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn small class="ma-5" color="primary" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ formattedFocus }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>วัน</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>สัปดาห์</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>เดือน</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 วัน</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <!-- แสดง ปฏิทิน -->
        <v-calendar ref="calendar" v-model="focus" color="primary" locale="th" :events="events"
          :event-color="getEventColor" :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay"
          @change="updateRange"></v-calendar>
        <!-- แสดง กดดูรายละเอียด -->
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card style="border-radius: 15px;" color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <!-- <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn> -->
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn> -->
            </v-toolbar>
            <v-card-text>
              <v-icon>mdi-map-marker</v-icon> <span v-html="selectedEvent.address"></span>
              <br><strong> <v-icon>mdi-clock-time-four-outline</v-icon> <span
                  v-html="selectedEvent.time"></span></strong>
              <br><v-icon>mdi-medical-bag</v-icon> <span v-html="selectedEvent.type"></span>
              <br><v-icon>mdi-ambulance</v-icon><strong> <span v-html="selectedEvent.trackpatient"></span></strong>
              <br><v-icon>mdi-chat-processing</v-icon><strong> <span v-html="selectedEvent.other"></span></strong>
              <br><v-icon>mdi-map-marker</v-icon><strong> <span v-html="selectedEvent.lati"></span></strong>
              <br><v-icon>mdi-map-marker</v-icon><strong> <span v-html="selectedEvent.longi"></span></strong>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                ปิด
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";
export default {
  data: () => ({
    apiUrl: process.env.endpointUrl,
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
    // names: [
    //   "Meeting",
    //   "Holiday",
    //   "PTO",
    //   "Travel",
    //   "Event",
    //   "Birthday",
    //   "Conference",
    //   "Party",
    // ],
    formattedDate: new Date().toISOString().substr(0, 10), // Initialize formattedDate with today's date
  }),
  // fetch() {
  //   this.fetchDesserts();
  // },
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
      this.type = "day";
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.type = 'day';
      // this.focus = new Date();
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
          axios.get(`${this.apiUrl}/api/appointments`),
          axios.get(`${this.apiUrl}/api/patients`)
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
                name: `HN ${appointment.hn}`,
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
</script>


<style></style>