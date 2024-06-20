<template>
  <div>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-center d-flex justify-center align-center">
          <span class="headline">{{ dialogTitle2 }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-list dense>
                  <v-card-subtitle class="text-center font-weight-bold">ประวัติการนัดหมาย</v-card-subtitle>
                  <div v-if="appointments.length === 0" class="text-center mt-5 not-appointment">
                    ยังไม่มีรายการนัดหมาย
                  </div>
                  <v-list-item v-else v-for="(appointment, index) in appointments" :key="appointment.id" class="appointment-item">
                    <v-card outlined>
                      <v-card-text>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-bold">
                            รหัสผู้ป่วย: {{ appointment.hn }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            วันที่: {{ formatDate(appointment.service_date) }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            เวลา: {{ appointment.time }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            สถานะ: {{ appointment.status_case_id }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                  <!-- <v-divider v-if="index < appointments.length - 1" :key="'divider-' + appointment.id"></v-divider> -->
                </v-list>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions class="justify-center">
            <v-btn color="blue darken-1" class="white--text" @click="closeDialog">ปิด</v-btn>
          </v-card-actions>
        </v-card-text>
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
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' :  'http://localhost:5000',
      appointments: [],
    };
  },
  methods: {
    async fetchAppointments(hn) {
      console.log('Fetching appointments for:', hn);
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
      this.$emit('update:dialog', false);
      setTimeout(() => {
        location.reload();
      }, 10);
    },
  },
  mounted() {
    this.fetchAppointments(this.hn);
  },
};
</script>

<style scoped>
.not-appointment{
  font-weight: 500;
  font-size: 22px;
}
.v-card-title {
  background-color: #f5f5f5;
  font-size: 1.2em;
  font-weight: bold;
}

.appointment-item {
  margin-bottom: 10px;
}

.v-card.outlined {
  border: 1px solid #e0e0e0;
  padding: 10px;
}

.v-list-item-title {
  color: #00796b;
}

.v-list-item-subtitle {
  color: #004d40;
}

</style>