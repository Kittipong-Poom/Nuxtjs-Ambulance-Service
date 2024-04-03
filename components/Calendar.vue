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
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
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

      <v-sheet height="600" >
        <!-- แสดง ปฏิทิน -->
        <v-calendar ref="calendar" v-model="focus" color="primary" locale="th" :events="events"
          :event-color="getEventColor" :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay"
          @change="updateRange"></v-calendar>
        <!-- แสดง กดดูรายละเอียด -->
        <v-menu   v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card style="border-radius: 15px;"  color="grey lighten-4" min-width="350px" flat>
            <v-toolbar  :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn> -->
            </v-toolbar>
            <v-card-text>
              <v-icon>mdi-map-marker</v-icon> <span v-html="selectedEvent.address"></span>
              <br><strong> <v-icon>mdi-clock-time-four-outline</v-icon>  <span v-html="selectedEvent.time"></span></strong>
              <br><v-icon>mdi-medical-bag</v-icon > <span v-html="selectedEvent.type"></span>
              <br><v-icon>mdi-ambulance</v-icon><strong> <span v-html="selectedEvent.trackpatient"></span></strong>
              <br><v-icon>mdi-chat-processing</v-icon><strong> <span v-html="selectedEvent.other"></span></strong>
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
import Patient from "~/pages/Patient.vue";
import axios from "axios";
export default {
  data: () => ({
    components: {
      Patient
    },
    endpointUrl:
      process.env.NODE_ENV == "development"
        ? "http://localhost:5000"
        : "https://ambulance-fbf9.onrender.com",
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
  fetch() {
    this.fetchDesserts();
  },
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
      this.focus = "";
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
        const response = await axios.get(`${this.endpointUrl}/api/patients/time`);
        const patients = response.data;
        console.log("patient", patients);


        if (Array.isArray(patients)) {
          // Clear existing events
          this.events = [];

          patients.forEach((patient, index) => {
            console.log('My Detail :');

            const year = new Date(patient.service_date).getFullYear();
            const month = new Date(patient.service_date).getUTCMonth() + 1; // Add 1 because getUTCMonth() returns zero-based month
            const day = new Date(patient.service_date).getUTCDate() + 1;

            // Convert the Thai Buddhist year to the Gregorian year by subtracting 543
            const newyear = year - 543;

            // Format the components into the standard date format: YYYY-MM-DD
            const newTimestamp = `${newyear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            const timeComponents = patient.time.split(':');
            const hours = parseInt(timeComponents[0], 10).toString().padStart(2, '0');
            const minutes = parseInt(timeComponents[1], 10).toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;

            const colorIndex = index % this.colors.length;
            const event = {
              name: `HN ${patient.hn_id}`,
              start:`${newTimestamp}T${formattedTime}`,
              // end: `${newTimestamp}T${formattedTime}`,
              color: this.colors[colorIndex],
              address: `ที่อยู่ : ${patient.coordinate}`,
              time: `เวลา : ${formattedTime}`,
              type: `ประเภทผู้ป่วย : ${patient.type_patient_name}`,
              trackpatient: `การติดตามการนำส่งผู้ป่วย : ${patient.tracking_name}`,
              other: `เพิ่มเติม : ${patient.other}`,
            };
            this.events.push(event);
          });
        }
      } catch (error) {
        console.error("Error fetching desserts:", error);
      }
    }
  }
};
</script>


<style>

</style>