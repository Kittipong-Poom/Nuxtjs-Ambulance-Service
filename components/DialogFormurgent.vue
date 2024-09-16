<template>
  <v-dialog v-model="dialog" max-width="650" @click:outside="close">
    <v-card class="rounded-xl">
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline">{{ dialogTitle1 }}</span>
      </v-card-title>
      <form @submit.prevent="save">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.eventnum" prepend-inner-icon="mdi-numeric" label="เลขออกเหตุ 12 ตัว*"
                  outlined :rules="[rules.number]" clearable></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <!-- วันที่ -->
                <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                  :return-value.sync="editedItem.service_date" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="formattedDate" label="วันที่เกิดเหตุ" outlined
                      prepend-inner-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" clearable></v-text-field>
                  </template>
                  <v-date-picker  v-model="date" show-adjacent-months no-title scrollable :max="maxDate" locale="th">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      ยกเลิก
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(formatDateForPicker(date))">
                      ตกลง
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <!-- เวลา -->
              <v-col cols="12" md="12">
                <v-menu v-model="timeMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="timeDisplay" label="เวลา" outlined clearable readonly v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-card class="pa-3" elevation="2" tile flat color="#ffffff">
                    <v-select v-model="selectedHour" :items="hours" label="ชั่วโมง" outlined clearable @change="updateHour" class="mb-2"></v-select>
                    <v-select v-model="selectedMinute" :items="minutes" label="นาที" outlined clearable @change="updateMinute" class="mb-2"></v-select>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <!-- เพิ่มปุ่ม Current Location -->

            <!-- เพศ -->
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.gender" outlined label="เพศ*" prepend-inner-icon="mdi-gender-male-female"
                  :items="['ชาย', 'หญิง', 'อื่นๆ']" :rules="[rules.gender]" clearable></v-select>
              </v-col>
              <!-- อายุ -->
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.age" prepend-inner-icon="mdi-account-group" outlined label="อายุ*"
                  :items="['ต่ำกว่า 1 ปี', '1 - 12 ปี', '13 - 19 ปี', '20 - 39 ปี', '40 - 59 ปี', '60 ปีขึ้นไป']"
                  :rules="[rules.age]" clearable></v-select>
              </v-col>
            </v-row>

            <v-row>
              <!-- ประเภทผู้ป่วย -->
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.status" prepend-inner-icon="mdi-clipboard-list-outline" outlined
                  label="ประเภทผู้ป่วย*" :items="['อุบัติเหตุยานพาหนะ', 'อุบัติเหตุทั่วไป', 'ผู้ป่วยฉุกเฉิน']"
                  :rules="[rules.status]" clearable></v-select>
              </v-col>
              <!-- ความรุนแรงของประเภทผู้ป่วย -->
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.violence" outlined prepend-inner-icon="mdi-alert-outline"
                  label="ความรุนแรงของประเภทผู้ป่วย*"
                  :items="['ผู้ป่วยฉุกเฉินวิกฤติ', 'ผู้ป่วยฉุกเฉินเร่งด่วน', 'ผู้ป่วยไม่ฉุกเฉิน', 'ผู้ป่วยทั่วไป']"
                  :rules="[rules.violence]" clearable>

                  <template #item="{ item, on }">
                    <v-list-item v-on="on">
                      <v-list-item-content>
                        <v-chip :color="getChipColor(item)">
                          {{ item }}
                        </v-chip>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <!-- กลุ่มอาการฉุกเฉิน -->
            <v-combobox v-model="editedItem.emergency_group" :rules="[rules.emergency_group]"
              prepend-inner-icon="mdi-select-group" outlined :items='["1.ปวดท้อง/หลัง / เชิงกรานและขาหนีบ",
                "2.แอนาฟิแล็กลิส/ปฏิกิริยาภูมิแพ้",
                "3.สัตว์กัด",
                "4.เลือดออก (ไร้เหตุบาดเจ็บ)",
                "5.หายใจยากลำบาก",
                "6.หัวใจหยุดเต้น",
                "7.เจ็บแน่นทรวงอก/หัวใจ",
                "8.สำลักอุดทางหายใจ",
                "9.เบาหวาน",
                "10.ภยันตรายจากสภาพแวดล้อม",
                "11.(เว้นว่าง)",
                "12 ปวดศีรษะ/ลำคอ",
                "13.คลุ้มคลั่ง/จิตประสาท อารมณ์",
                "14.ยาเกินขนาด/ได้รับพิษ",
                "15.มีครรภ์/คลอด/นรีเวช",
                "16.ชัก",
                "17.ป่วย/อ่อนเพลีย (ไม่จำเพาะ)",
                "18. โรคหลอดเลือดสมองตีบตัน",
                "19.หมดสติ/ไม่ตอบสนอง/หมดสติชั่ววูบ",
                "20.เด็ก/ทารก",
                "21.ถูกทำร้าย/บาดเจ็บ",
                "22.บาดแผลไฟไหม้/ลวก",
                "23.อุบัติเหตุทางน้ำ",
                "24.พลัดตกหกล้ม/อุบัติเหตุ/เจ็บปวด",
                "25.อุบัติเหตุยานยนต์",
                "26.โรคอุบัติใหม่ - โควิท 19"]' hint="เลือกกลุ่มอาการฉุกเฉิน" label="กลุ่มอาการฉุกเฉิน*" multiple
              clearable chips>
            </v-combobox>

            <!-- ส่วนของการกรอก Latitude และ Longitude -->

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field class="custom-icon-color" v-model="editedItem.lati" label="ละติจูด" outlined
                  prepend-inner-icon="mdi-map-marker" clearable></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field class="custom-icon-color" v-model="editedItem.longi" label="ลองจิจูด"  outlined
                  prepend-inner-icon="mdi-map-marker" clearable></v-text-field>

              </v-col>
            </v-row>
            <v-btn class="button-location-urgents type1-urgents mb-8"  color="#63EE6C" @click="getCurrentLocation" :loading="loading">ตำแหน่งล่าสุดของคุณ
            </v-btn>

            <!-- การติดตามการนำส่งผู้ป่วย -->
            <v-select v-model="editedItem.patient_delivery" prepend-inner-icon="mdi-truck-plus" outlined
              label="การติดตามการนำส่งผู้ป่วย" :items="['เสียชีวิต', 'ส่งต่อโรงพยาบาล', 'ไม่ประสงค์ส่งต่อโรงพยาบาล']"
              :rules="[rules.delivery]" clearable>
            </v-select>
            
          </v-container>
          <!-- บันทึก -->
          <v-card-actions>
            <v-btn v-if="(dialogTitle1.includes('แก้ไข') || dialogTitle1.includes('จัดการผู้ป่วยใหม่'))"
              color="green" class="white--text button pa-6 rounded-xl " @click="save">บันทึก</v-btn>
            <v-btn color="red" class="white--text button-cancel pa-6 rounded-xl " @click="close">ยกเลิก</v-btn>
          </v-card-actions>
        </v-card-text>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogFormurgentsJs from '../scripts/diglogformurgents.js'

export default DialogFormurgentsJs
</script>

<style scoped>
.custom-icon-color ::v-deep .v-input__prepend-inner .v-icon {
  color: red;
  /* เปลี่ยนสีไอคอนเป็นสีแดง */
}
</style>