<template>
  <div>
    <v-dialog v-model="localDialog" max-width="400" @click:outside="closeDialog">
      <div class="card">
        <div class="card-content">
          <p class="card-heading">ประวัติการนัดหมาย</p>
          <div v-if="appointments.length === 0" class="text-center mt-2 not-appointment">
            ยังไม่มีรายการนัดหมาย
          </div>
          <v-list-item 
            v-for="(appointment, index) in paginatedAppointments" 
            :key="appointment.id" 
            class="card-description d-flex flex-row justify-center align-center">
            <div class="d-flex flex-column text-center">
              <span>รหัสผู้ป่วย <span class="font-bold">:</span> <span class="font-semibold">{{ appointment.hn }}</span></span>
              <span>วันที่     <span class="font-bold">:</span> <span class="font-semibold">{{ formatDate(appointment.service_date) }}</span></span>
              <span>เวลา     <span class="font-bold">:</span> <span class="font-semibold">{{ appointment.time }}</span></span>
              <span>สถานะ   <span class="font-bold">:</span> 
              <span 
                :class="{
                  'status-waiting': appointment.status_case_id === 'รอรับงาน',
                  'status-in-progress': appointment.status_case_id === 'กำลังดำเนินงาน',
                  'status-completed': appointment.status_case_id === 'เสร็จสิ้น',
                  'status-cancelled': appointment.status_case_id === 'ยกเลิก'
                }"
              >
                {{ appointment.status_case_id }}
              </span>
            </span>
              <h2>➖➖➖➖➖➖➖➖➖➖➖</h2>
              <v-divider v-if="appointments.length > 1 && index < paginatedAppointments.length - 1"
                :key="'divider-' + appointment.id"></v-divider>
            </div>
          </v-list-item>
        </div>
        <div class="card-button-wrapper d-flex justify-center">
          <div v-if="hasMultiplePages" class="pagination-buttons card-button-wrapper">
            <button v-if="currentPage > 1" class="card-button blue white--text" @click="prevPage">ก่อนหน้า</button>
            <button v-if="currentPage < totalPages" class="card-button green white--text"  @click="nextPage">ถัดไป</button>
          </div>       
        </div>
        <button class="card-button red white--text" @click="closeDialog">ปิด</button>
        <button class="exit-button" @click="closeDialog">
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
