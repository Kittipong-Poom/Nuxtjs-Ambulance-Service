<template>
  <v-dialog v-model="dialog" max-width="650" @click:outside="close">
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <form ref="editedItemRef" @submit.prevent="save">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <!-- เบอร์โทรศัพท์ -->
                <v-text-field v-model="editedItem.hn" label="HN (Hospital Number)*"
                  prepend-inner-icon="mdi-hospital-building" outlined :rules="[rules.hn]" ref="hn"
                  clearable></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="input-container">
                  <!-- อายุ -->
                  <v-select v-model="editedItem.ages_id" label="อายุ" :items="items_ages" outlined item-text="age_name"
                    item-value="age_id" prepend-inner-icon="mdi-account-group" return-object clearable></v-select>
                </div>
              </v-col>
              <v-col cols="12">
                <!-- เพศ -->
                <v-select v-model="editedItem.gender" label="เพศ" prepend-inner-icon="mdi-gender-male-female" outlined
                  :items="['ชาย', 'หญิง', 'อื่นๆ']" clearable></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <!-- เบอร์โทรศัพท์ -->
                <v-text-field v-model="editedItem.number" prepend-inner-icon="mdi-phone-outline" label="เบอร์โทรศัพท์*"
                  outlined :rules="[rules.phone]" ref="number" clearable></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <!-- พิกัด -->
                <v-text-field v-model="editedItem.address" prepend-inner-icon="mdi-home" label="ที่อยู่" outlined
                  :rules="[rules.address]" ref="address" clearable></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <!-- เบอร์โทรศัพท์ -->
                <v-text-field class="custom-icon-color" v-model="editedItem.lati" prepend-inner-icon="mdi-map-marker"
                  label="ละติจูด*" outlined :rules="[rules.lati]" ref="lati" clearable></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <!-- พิกัด -->
                <v-text-field class="custom-icon-color" v-model="editedItem.longi" prepend-inner-icon="mdi-map-marker"
                  label="ลองติจูด*" outlined :rules="[rules.longi]" ref="longi" clearable></v-text-field>
              </v-col>

              <v-btn class="button-location type1 mb-5 ml-4 " color="#63EE6C" @click="getCurrentLocation" :loading="loading">ตำแหน่งล่าสุดของคุณ
              </v-btn>
              <!-- <v-btn color="green" class="mb-5 ml-4" @click="getCurrentLocation" text outlined
                :loading="loading">ตำแหน่งล่าสุดของคุณ</v-btn> -->
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <!-- การติดตามการนำส่งผู้ป่วย -->
                <v-select v-model="editedItem.tracking_patient_id" prepend-inner-icon="mdi-account-injury-outline"
                  label="การติดตามการนำส่งผู้ป่วย" outlined :items="items_tracking" item-text="tracking_name"
                  item-value="tracking_id" clearable></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <!-- เลือกประเภท -->
                <v-select v-model="editedItem.type_patient_id" prepend-inner-icon="mdi-clipboard-list-outline"
                  label="เลือกประเภท" :items="items_type" outlined item-text="type_patient_name"
                  item-value="type_patient_id" clearable></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <!-- เพิ่มเติม -->
                <v-text-field v-model="editedItem.other" prepend-inner-icon="mdi-information"
                  label="กรอกรายละเอียดเพิ่มเติม" outlined :rules="[rules.other]" clearable></v-text-field>
              </v-col>
              <v-card-actions>
                <v-btn v-if="(dialogTitle.includes('แก้ไข') || dialogTitle.includes('จัดการผู้ป่วยใหม่'))" color="green"
                  class="white--text button pa-6" @click.prevent="save">บันทึก</v-btn>
                <v-btn color="red" class="white--text button-cancel pa-6" @click="close">ยกเลิก</v-btn>

              </v-card-actions>
            </v-row>
          </v-container>
        </v-card-text>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogPatient from '../scripts/dialogform.js'

export default DialogPatient
</script>

<style scoped src="../styles/dialogaform.css"></style>