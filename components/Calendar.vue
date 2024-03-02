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
      <v-sheet height="600">
        <v-calendar ref="calendar" v-model="focus" color="primary" locale="th" :events="events"
          :event-color="getEventColor" :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay"
          @change="updateRange"></v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name">

              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
              <br><strong><span v-html="selectedEvent.time"></span></strong>
              <br><span v-html="selectedEvent.type"></span>
              <br><strong><span v-html="selectedEvent.trackpatient"></span></strong>
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
    components:{
      Patient
    },
    // events: {
    //   type: Array,
    //   default: () => [],
    // },
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
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
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
    // loadEventsFromPatients() {
    //   this.desserts.forEach((patient) => {
    //     const event = {
    //       name: patient.hnnumber,
    //       start: patient.date_service,
    //       end: patient.date_service,
    //       color: "red",
    //       details: patient.address,
    //     };

    //     this.events.push(event);
    //   });
    // },
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
    updateRange({ start, end }) { },

    async fetchDesserts() {
      try {
        const response = await axios.get(`${this.endpointUrl}/api/patients`);
        const patients = response.data;
        console.log("patient", patients);

        // console.log("my data event", this.events);

        // for (var i = 0; i < patients.length; i++) {
        //   const year = parseInt(patients[i].date_service.slice(0, 4), 10) - 543;
        //   const month = parseInt(patients[i].date_service.slice(5, 7), 10);
        //   const day = parseInt(patients[i].date_service.slice(8, 10), 10);
        //   const newTimestamp = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        //   dataevent = {
        //     name: patients[i].hnnumber,
        //     start: newTimestamp,
        //     end: newTimestamp,
        //     color: "red",
        //     details: patients[i].address,
        //   }
        //   console.log("Data event pushed:", dataevent);


        //   this.events.push(dataevent);
        // }
        // console.log("Final number of events:", this.events.length);
        // console.log(this.events);
        if (Array.isArray(patients)) {
          // Clear existing events
          this.events = [];

          patients.forEach((patient,index) => {
            console.log();
            const date = new Date(patient.date_service);
            const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
            const year = date.getFullYear() - 543;
            const newTimestamp = `${year}-${month}-${day}`;
            const colorIndex = index % this.colors.length;
            const event = {
              name: `HN ${patient.hnnumber}`,
              start: newTimestamp,
              end: newTimestamp,
              color: this.colors[colorIndex],
              details: `ที่อยู่ : ${patient.address}`,
              time: `เวลา : ${patient.time}`,
              type: `ประเภทผู้ป่วย : ${patient.type}`,
              trackpatient: `การติดตามการนำส่งผู้ป่วย : ${patient.trackpatient}`
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
