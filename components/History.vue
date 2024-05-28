<template>
  <div>
    <v-dialog v-model="dialog" max-width="300">
      <v-card>
        <v-card-title class="text-center d-flex justify-center align-center">
          <span class="headline">{{ dialogTitle2 }}</span>
          
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-list>
                  <v-list-item v-for="appointment in appointments" :key="appointment.id">
                    <v-list-item-content>
                      <v-list-item-title>รหัสผู้ป่วย: {{ appointment.hn }}</v-list-item-title>
                      <v-list-item-subtitle>วันที่: {{ formatDate(appointment.service_date) }}</v-list-item-subtitle>
                      <v-list-item-subtitle>เวลา: {{ appointment.time }}</v-list-item-subtitle>
                      <v-list-item-subtitle>สถานะ: {{ appointment.status_case_id}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="blue darken-1" class="white--text" @click="closeDialog">ปิด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import axios from 'axios';

export default {
  props: {
    dialog: Boolean,
    hn: String,
    dialogTitle2: String,
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      appointments: [],
    };
  },
  methods: {
    async fetchAppointments(hn) {
      console.log('I get : ', hn);
      try {
        const { data } = await axios.get(`${this.endpointUrl}/api/appointment/${hn}`);
        this.appointments = data;
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    },
    formatDate(date) {
      return dayjs(date).format('DD-MM-YYYY');
    },
    closeDialog() {
      this.$emit('update:dialog', false); // Properly emit event to close dialog
      window.location.reload();
    },
  },
  mounted() {
    this.fetchAppointments(this.hn); // Pass hn prop correctly
  },
};
</script>

<style scoped>
/* Add any relevant styles here */
</style>