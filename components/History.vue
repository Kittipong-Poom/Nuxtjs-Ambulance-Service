<template>
  <div>
    <v-dialog v-model="dialog" max-width="400">
      <div class="card">
        <div class="card-content">
          <p class="card-heading"> ประวัติการนัดหมาย </p>
          <div v-if="appointments.length === 0" class="text-center mt-2 not-appointment ">
            ยังไม่มีรายการนัดหมาย
          </div>
          <v-list-item v-for="appointment in appointments" :key="appointment.id" class="card-description d-flex flex-row justify-space-between align-center">
            <div class="d-flex flex-column">
              <span>รหัสผู้ป่วย <span class="font-bold">:</span> <span class="font-semibold">{{ appointment.hn }}</span></span>
              <span>วันที่     <span class="font-bold">:</span> <span class="font-semibold">{{ formatDate(appointment.service_date) }}</span></span>
              <span>เวลา     <span class="font-bold">:</span> <span class="font-semibold">{{ appointment.time }}</span></span>
              <span>สถานะ   <span class="font-bold">:</span> <span class="font-semibold">{{ appointment.status_case_id }}</span></span>
            </div>
          </v-list-item>
          <v-divider v-if="appointments.length > 1 && index < appointments.length - 1"
            :key="'divider-' + appointment.id"></v-divider>
        </div>
        <div class="card-button-wrapper">
          <button class="card-button red white--text" @click="closeDialog">ปิด</button>
        </div>
        <button class="exit-button" @click="closeDialog">
          <svg height="20px" viewBox="0 0 384 512">
            <path
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z">
            </path>
          </svg>
        </button>
      </div>

    </v-dialog>
  </div>
</template>

<script>
import HistoryJs from '../scripts/history.js'
import '../styles/history.css'
export default HistoryJs
</script>
