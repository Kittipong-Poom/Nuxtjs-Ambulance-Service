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
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar" >
              {{ formattedFocus }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
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
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            locale="th"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="selectedEvent.color"
                dark
              >
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </template>
  
  <script>
  export default {
    data: () => ({
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'เดือน',
        week: 'สัปดาห์',
        day: 'วัน',
        '4day': '4 วัน',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [
        // Example events
        {
          name: 'Event 555555',
          start: '2024-02-10',
          end: '2024-02-12',
          color: 'red',
          details: 'รายละเอียดกิจกรรม 555555'
        },
        {
          name: 'Event 2',
          start: '2024-02-15',
          end: '2024-02-17',
          color: 'blue',
          details: 'รายละเอียดกิจกรรม 2'
        }
      ],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      formattedDate: new Date().toISOString().substr(0, 10), // Initialize formattedDate with today's date
    }),
    computed: {
      currentDay() {
        const dateObject = new Date(this.value);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return dateObject.toLocaleDateString('th-TH', options);
      },
      formattedFocus() {
        if (!this.focus) return '';
        const dateObject = new Date(this.focus);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return dateObject.toLocaleDateString('th-TH', options);
      },
    },
    methods: {
      updateMainCalendar(date) {
        this.focus = date; // Update main calendar value when mini calendar date is selected
        this.type = 'day'; // Switch view to day view
      },
      viewDay ({ date }) {
        this.focus = date;
        this.type = 'day';
      },
      getEventColor (event) {
        return event.color;
      },
      setToday () {
        this.focus = '';
      },
      prev () {
        this.$refs.calendar.prev();
      },
      next () {
        this.$refs.calendar.next();
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event;
          this.selectedElement = nativeEvent.target;
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true));
        };
  
        if (this.selectedOpen) {
          this.selectedOpen = false;
          requestAnimationFrame(() => requestAnimationFrame(() => open()));
        } else {
          open();
        }
  
        nativeEvent.stopPropagation();
      },
      updateRange ({ start, end }) {
        // Implement your logic here if needed
      },
    },
  };
  </script>