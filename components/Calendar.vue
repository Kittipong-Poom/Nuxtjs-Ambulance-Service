<template>
  <v-row class="fill-height">
    <v-col cols="auto" class="mini-calendar pl-5 hidden-sm-and-down"> <!-- Hide on small screens -->
      <v-date-picker class="white" color="#2B2C33" v-model="formattedDate" @change="updateMainCalendar"
        show-adjacent-months locale="th">
      </v-date-picker>
    </v-col>

    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn class="mr-4" :style="{ backgroundColor: 'blue', color: '#ffffff' }" @click="setToday">
            วันนี้
          </v-btn>
          <v-btn @click="prev">
            <v-icon style="font-weight: bold;"> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn class="ma-5" @click="next">
            <v-icon style="font-weight: bold;"> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ formattedFocus }}
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <!-- Dropdown for mobile -->
          <v-menu v-if="$vuetify.breakpoint.smAndDown" v-model="menu" :close-on-content-click="false" offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-btn :style="{ backgroundColor: '#2C3E50', color: '#ffffff' }" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'month'">
                <v-list-item-content>
                  <v-list-item-title>เดือน</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-content>
                  <v-list-item-title>สัปดาห์</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="type = 'day'">
                <v-list-item-content>
                  <v-list-item-title>วัน</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
 
          <!-- Button group for desktop -->
          <v-btn-group v-else>
            <v-btn :style="{ backgroundColor: type === 'month' ? '#1976D2' : '#2C3E50', color: '#ffffff' }"
              @click="type = 'month'">
              เดือน
            </v-btn>
            <v-btn :style="{ backgroundColor: type === 'week' ? '#1976D2' : '#2C3E50', color: '#ffffff' }"
              @click="type = 'week'">
              สัปดาห์
            </v-btn>
            <v-btn :style="{ backgroundColor: type === 'day' ? '#1976D2' : '#2C3E50', color: '#ffffff' }"
              @click="type = 'day'">
              วัน
            </v-btn>
          </v-btn-group>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="650">
        <!-- แสดง ปฏิทิน -->
        <v-calendar ref="calendar" v-model="focus" color="primary" locale="th" :events="events" :type="type"
          @click:event="showEvent" @click:more="viewDay" @click:date="viewDay" @change="updateRange"
          :overlap-threshold="15" :overlap-limit="5"></v-calendar>
        <!-- แสดง กดดูรายละเอียด -->
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card style="border-radius: 15px;" color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-html="selectedEvent.hn"></v-toolbar-title> <!-- เปลี่ยนเป็น HN -->
              <v-spacer></v-spacer>
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
import '../styles/calendar.css'
import CalendarJs from '../scripts/calendar.js'

export default CalendarJs
</script>