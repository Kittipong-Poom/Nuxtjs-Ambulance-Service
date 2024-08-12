<template>
  <v-card>
    <v-card-title justify="center" class="center-container1">
      <h2 class="text-2xl font-semibold">ตารางเคสผู้ป่วยฉุกเฉิน</h2>
    </v-card-title>
    <v-card-title>
      <!-- Add new information -->
      <v-btn color="#1171b5" depressed class="button1 white--text" @click="openDialogurgent('add')">
        เพิ่มเคสผู้ป่วยฉุกเฉิน
      </v-btn>
      <v-spacer />
      <v-spacer />
      <v-spacer />
      <v-spacer />
      <v-text-field v-model="search" append-icon="mdi-magnify" outlined label="ค้นหา" class="w-12" hide-details />
    </v-card-title>

    <v-data-table :headers="headers" :items="desserts" :search="search" item-key="caseurgent_id" show-select
      v-model="selected" @input="handleSelectedItemsChange" @click:show-select="deleteSelectedItems">
      <template v-slot:top>
        <v-toolbar flat>
          <h5>👇เลือกทั้งหมด</h5>
          <v-spacer></v-spacer>
          <v-btn style="--clr: #4CAF50" class="button-excel mr-2 white--text" color="#4CAF50" @click="exportToExcel">
            <span class="button__icon-wrapper mr-2">
              <svg width="10" class="button__icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 14 15">
                <path fill="currentColor"
                  d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z">
                </path>
              </svg>

              <svg class="button__icon-svg  button__icon-svg--copy" xmlns="http://www.w3.org/2000/svg" width="10"
                fill="none" viewBox="0 0 14 15">
                <path fill="currentColor"
                  d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z">
                </path>
              </svg>
            </span>
            Export Excel
          </v-btn>
          <v-btn depressed class=" mb-0 mr-3 btn-all-delete white--text" color="red" @click="deleteSelectedItems">
            ลบสิ่งที่เลือก
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn color="#4CAF50" class="mr-2 mb-2 white--text mt-2" @click="openDialogurgent('edit', item)">
          <v-icon>mdi-pencil-box-multiple-outline</v-icon>
          แก้ไข
        </v-btn>
        <v-btn color="red" class="white--text mb-2" @click="deleteItem(item)">
          <v-icon>mdi-delete</v-icon>
          ลบ
        </v-btn>
      </template>
      <template v-slot:item.violence="{ item }">
        <v-chip class="my-chip" :color="getStatusColor(item.violence)"
          :class="{ 'black--text': item.violence === 'ผู้ป่วยฉุกเฉินเร่งด่วน' || item.violence === 'ผู้ป่วยทั่วไป', }"
          :dark="item.violence === 'ผู้ป่วยฉุกเฉินวิกฤติ' || item.violence === 'ผู้ป่วยไม่ฉุกเฉิน'">
          {{ item.violence }}
        </v-chip>
      </template>
    </v-data-table>

    <!---ปุ่มลบ-->

    <v-dialog v-model="confirm" max-width="350">
      <v-card>
        <v-card-title class="headline">
          ยืนยันการลบ?
        </v-card-title>
        <v-card-text>
          เมื่อยืนยันคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancelDelete">
            ยกเลิก
          </v-btn>
          <v-btn color="green darken-1" text @click="submitDelete">
            ตกลง
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <!-- Include the dialog -->
    <dialog-formurgent :dialog="dialog" :edited-item="editedItem" :dialog-title1="dialogTitle1" @save="saveItem"
      @close="closeDialog" />
    <!-- <notifications group="success" classes="custom-notification" />
    <notifications group="fail" classes="fail-noti" /> -->
  </v-card>
</template>

<script>
import '../styles/queueurgents.css'
import QueueUrgentsJS from '../scripts/queueurgents.js'

export default QueueUrgentsJS
</script>
