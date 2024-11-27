<template>
  <v-dialog v-model="dialog" max-width="800" @open="fetchAppointmentDate" @click:outside="closeDialog">
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <form @submit.prevent="save">
        <v-card-text>
          <v-text-field v-model="editedItem.hn" disabled outlined label="HN (Hospital Number)*"></v-text-field>
          <!-- ชื่อ_นามสกุล -->
          <v-text-field v-model="editedItem.fname_lname" prepend-inner-icon="mdi-information" label="ชื่อ_นามสกุล"
          outlined clearable></v-text-field>
          <!-- วันที่ -->
          <v-row>
            <v-col cols="12" md="6">
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                :return-value.sync="editedItem.service_date" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="formattedDate" label="วันที่นัดหมาย" outlined prepend-inner-icon="mdi-calendar"
                    readonly v-bind="attrs" v-on="on" clearable></v-text-field>
                </template>
                <v-date-picker v-model="dateString" no-title scrollable locale="th" show-adjacent-months>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(dateString)">
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <!-- เวลา -->
            <v-col cols="12" md="6">
              <v-menu v-model="timeMenu" :close-on-content-click="false" transition="scale-transition" offset-y
                min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="timeDisplay" label="เวลา" outlined clearable readonly v-bind="attrs"
                    v-on="on"></v-text-field>
                </template>
                <v-card class="pa-3" elevation="2" tile flat color="#ffffff">
                  <v-select v-model="selectedHour" :items="hours" label="ชั่วโมง" outlined clearable
                    @change="updateHour" class="mb-2"></v-select>
                  <v-select v-model="selectedMinute" :items="minutes" label="นาที" outlined clearable
                    @change="updateTime" class="mb-2"></v-select>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <!-- ละติจูด -->
              <v-text-field class="custom-icon-color" v-model="editedItem.lati" prepend-inner-icon="mdi-map-marker"
                label="ละติจูด" outlined ref="lati" clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <!-- ลองจิจูด -->
              <v-text-field class="custom-icon-color" v-model="editedItem.longi" prepend-inner-icon="mdi-map-marker"
                label="ลองจิจูด*" outlined ref="longi" clearable></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ml-3 mb-3">
            
            <v-btn class="button-location-queue type1-queue mb-5" color="#63EE6C" @click="getCurrentLocation"
              :loading="loading">ตำแหน่งล่าสุดของคุณ
            </v-btn>
            <v-btn class="ml-5" color="#FFCA28" @click="mapDialog = true">เปิดแผนที่</v-btn>
            
          </v-row>

          <v-dialog v-model="mapDialog" max-width="800px" @click:outside="closeMapDialog">
            <v-card>
              <v-card-title>
                <div class=" align-center justify-space-between w-100 text-center">
                  <span class="text-h5">เลือกตำแหน่งบนแผนที่</span>
                  <v-text-field v-model="searchQuery" placeholder="ค้นหาสถานที่" prepend-inner-icon="mdi-magnify" outlined dense hide-details
                    @keyup.enter="searchLocation">
                  </v-text-field>
                </div>
              </v-card-title>
              <v-card-text>
                <div id="map" style="height: 400px; border-radius: 25px;"></div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" class="white--text" @click="saveLocation">บันทึก</v-btn>
                <v-btn text color="red" class="white--text" @click="closeMapDialog">ยกเลิก</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- สถานะ -->
          <v-select v-model="editedItem.status_case_id" prepend-inner-icon="mdi-list-status" outlined label="สถานะ"
            :items="['รอรับงาน', 'เสร็จสิ้น', 'ยกเลิก']" clearable></v-select>

            <v-text-field v-model="editedItem.other" prepend-inner-icon="mdi-information" label="กรอกรายละเอียดเพิ่มเติม"
            outlined clearable></v-text-field>
          <!-- บันทึก -->
          <v-card-actions>
            <v-btn color="green" class="white--text button pa-6" @click="save">บันทึก</v-btn>
            <v-btn color="red" class="white--text button-cancel pa-6" @click="closeDialog">ยกเลิก</v-btn>
          </v-card-actions>
        </v-card-text>

      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogQueueManageJs from '../scripts/dialogqueuemanage.js'

export default DialogQueueManageJs

import '../styles/dialogqueuemanage.css'
</script>

<style scoped>
.custom-icon-color ::v-deep .v-input__prepend-inner .v-icon {
  color: red;
  /* เปลี่ยนสีไอคอนเป็นสีแดง */
}
</style>