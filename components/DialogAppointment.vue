<template>
  <v-dialog v-model="dialog" max-width="800" @click:outside="closeDialog">
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <form @submit.prevent="save">
        <v-card-text>
          <v-text-field v-model="editedItem.hn" disabled outlined label="HN (Hospital Number)*"></v-text-field>

          <!-- ชื่อ_นามสกุล -->
          <v-text-field v-model="editedItem.fname_lname" prepend-inner-icon="mdi-account-box" label="ชื่อ_นามสกุล"
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
            <v-col cols="12" md="6">
              <!-- ละติจูด -->
              <v-text-field v-model="editedItem.lati" prepend-inner-icon="mdi-map-marker" class="custom-icon-color"
                label="ละติจูด" outlined ref="lati" clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <!-- ลองจิจูด -->
              <v-text-field v-model="editedItem.longi" class="custom-icon-color" prepend-inner-icon="mdi-map-marker"
                label="ลองติจูด*" outlined ref="longi" clearable></v-text-field>
            </v-col>
          </v-row>

          <!-- สถานะ -->
          <v-select v-model="editedItem.status_case_id" prepend-inner-icon="mdi-list-status" outlined label="สถานะ"
            :items="['รอรับงาน', 'เสร็จสิ้น', 'ยกเลิก']" clearable></v-select>

          <!-- กรอกรายระเอียดเพิ่มเติม -->
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
import DialogAppointJs from '../scripts/diglogappointment.js'

export default DialogAppointJs
</script>

<style scoped src="../styles/dialogappointment.css"></style>
