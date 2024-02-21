<template>
  <v-card class="mt-5">
    <v-sheet height="1500">
      <v-row>
        <!-- Mini Calendar -->
        <v-col cols="auto" class="mini-calendar pl-5">
          <v-date-picker v-model="formattedDate" @input="updateMainCalendar" color="primary" locale="th"></v-date-picker>
        </v-col>
        
        <!-- Main Calendar Component -->
        <v-col>
          <v-row justify="center" align="center">
            <!-- Today Button -->
            <v-col class="ml-5" cols="auto">
              <v-btn @click="goToToday" color="primary">Today</v-btn>
            </v-col>
            
            <!-- Previous Month Button -->
            <v-col cols="auto">
              <v-icon @click="previousMonth" color="primary">mdi-chevron-left</v-icon>
            </v-col>
            
            <!-- Next Month Button -->
            <v-col cols="auto">
              <v-icon @click="nextMonth" color="primary">mdi-chevron-right</v-icon>
            </v-col>
            
            <!-- Current Day Title -->
            <v-col>
              <v-toolbar-title v-if="$refs.calendar" class="ml-3">{{ currentDay }}</v-toolbar-title>
            </v-col>
            
            <!-- Toggle Buttons -->
            <v-col cols="auto">
              <v-btn-toggle class="ma-3" v-model="viewType">
                <v-btn value="month">Month</v-btn>
                <v-btn value="week">Week</v-btn>
                <v-btn value="day">Day</v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
          
          <v-calendar v-model="value" :events="events" color="primary" :type="viewType" @change="updateEvents" ref="calendar" locale="th" @click:day="onDayClick" @click:event="selectEvent"></v-calendar>
        </v-col>
      </v-row>
    </v-sheet>
    
    <!-- Menu for Selected Event -->
    <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
  <v-card v-if="selectedEvent" :color="selectedEvent.color" min-width="350px" flat>
    <v-toolbar dark>
      <v-btn icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <span>{{ selectedEvent.details }}</span>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="secondary" @click="selectedOpen = false">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-menu>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
      events: [
        // Example events
        {
          name: 'Event 555555',
          start: '2024-02-10',
          end: '2024-02-12',
          color: 'red',
          details: 'Event 555555 details'
        },
        {
          name: 'Event 2',
          start: '2024-02-15',
          end: '2024-02-17',
          color: 'blue',
          details: 'Event 2 details'
        }
      ],
      viewType: 'month',
      selectedOpen: false,
      selectedEvent: null,
      selectedElement: null
    };
  },
  computed: {
    currentDay() {
      const dateObject = new Date(this.value);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return dateObject.toLocaleDateString('th-TH', options);
    },
    // Format the date as a string for v-date-picker
    formattedDate: {
      get() {
        if (this.value instanceof Date) {
          return this.value.toISOString().substr(0, 10);
        } else {
          return null;
        }
      },
      set(newValue) {
        // Handle setting new date value
        this.value = newValue ? new Date(newValue) : new Date(); // Initialize as current date if null
      }
    }
  },
  methods: {
    updateEvents({ start, end }) {
      // Here you can fetch events from your API or perform any other logic
      // to update the events based on the visible range of the calendar
      if (end instanceof Date && start instanceof Date && end.getTime() - start.getTime() === 0) {
        this.viewType = 'day'; // Switch view to day view
        this.value = start; // Set the value to the selected day
      }
    },
    goToToday() {
      this.value = new Date(); // Set value to current date
      this.viewType = 'day'; // Switch view to day view
    },
    previousMonth() {
      this.value = new Date(this.value.getFullYear(), this.value.getMonth() - 1, 1);
    },
    nextMonth() {
      this.value = new Date(this.value.getFullYear(), this.value.getMonth() + 1, 1);
    },
    updateMainCalendar(date) {
      this.value = new Date(date); // Update main calendar value when mini calendar date is selected
      this.formattedDate = date; // Update mini calendar selected date
      this.viewType = 'day'; // Switch view to day view
    },
    onDayClick({ date }) {
      this.updateMainCalendar(date); // Update main calendar when a day is clicked
    },
    selectEvent(event, eventElement) {
      this.selectedEvent = event;
      this.selectedElement = eventElement;
      this.selectedOpen = true;
    }
  }
};
</script>

<style>
*{
  margin: 0;
  box-sizing: border-box;
}
</style>
