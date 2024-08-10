<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <form @submit.prevent="save">
        <v-card-text>
          <v-text-field v-model="editedItem.hn" disabled  outlined label="HN (Hospital Number)*"></v-text-field>
          <!-- วันที่ -->
          <v-row>
            <v-col cols="12" md="6">
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                :return-value.sync="editedItem.service_date" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="formattedDate" label="วันที่นัดหมาย" outlined prepend-inner-icon="mdi-calendar"
                    readonly v-bind="attrs" v-on="on" clearable></v-text-field>
                </template>
                <v-date-picker  v-model="dateString" no-title scrollable locale="th" show-adjacent-months :min="new Date().toISOString()"> 
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
              <v-text-field v-model="editedItem.time" label="เวลา" outlined type="time"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <!-- ละติจูด -->
              <v-text-field v-model="editedItem.lati" prepend-inner-icon="mdi-map-marker" label="ละติจูด" outlined
                ref="lati"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <!-- ลองจิจูด -->
              <v-text-field v-model="editedItem.longi" prepend-inner-icon="mdi-map-marker" label="ลองติจูด*" outlined
                ref="longi"></v-text-field>
            </v-col>
          </v-row>

          <!-- สถานะ -->
          <v-select v-model="editedItem.status_case_id" outlined label="สถานะ"
                  :items="['รอรับงาน', 'กำลังดำเนินงาน', 'เสร็จสิ้น', 'ยกเลิก']"></v-select>
        </v-card-text>

        <!-- บันทึก -->
        <v-card-actions>
          <v-btn color="blue darken-1" class="white--text" @click="save">บันทึก</v-btn>
          <v-btn color="blue darken-1" class="white--text" @click="closeDialog">ยกเลิก</v-btn>
        </v-card-actions>

      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogAppointJs from '../scripts/diglogappointment.js'

export default DialogAppointJs
</script>
