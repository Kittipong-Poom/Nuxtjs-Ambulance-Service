<template>
  <div>
    <v-card>
      <v-card-title justify="center" class="center-container1">
        <span class="text-2xl font-semibold">ตารางข้อมูลผู้ป่วยทั่วไป</span>
      </v-card-title>
      <v-card-title>
        <!-- Add new information -->
        <v-btn depressed color="#2B2C33" class="button1 mb-2 mr-3 white--text" @click="openDialog('add')">
          จัดการผู้ป่วยใหม่
        </v-btn>

        <v-spacer />
        <div class="relative">
          <input v-model="search"  placeholder="ค้นหา..."
            class="input shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-56 transition-all focus:w-64 outline-none"
            name="search" type="search" />
          <svg class="size-6 absolute top-4 right-3 text-gray-500 w-6" stroke="currentColor" stroke-width="1.5"
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              stroke-linejoin="round" stroke-linecap="round"></path>
          </svg>
        </div>
      </v-card-title>

      <v-data-table v-model="selected" show-select depressed :headers="headers" item-key="hn_id" :items="desserts"
        :search="search" @input="handleSelectedItemsChange">
        <template v-slot:item.hn="{ item }">
          <span @click="openHistoryDialog(item.hn)" style="cursor: pointer; font-weight: bold;">{{ item.hn }}</span>
        </template>

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
            <v-btn depressed class=" mb-0 mr-3 btn-all-delete" color="red" dark @click="deleteSelectedItems">
              ลบสิ่งที่เลือก</v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.action="{ item }">
          <!--ปุ่มแก้ไข-->
          <div class="d-flex">
            <div class="button-container  mb-1 mr-2">
              <button class=" mt-2 edit-button" @click="openDialog('edit', item)">
                <svg class="edit-svgIcon" viewBox="0 0 512 512">
                  <path
                    d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z">
                  </path>
                </svg>
              </button>
            </div>
            <!--ปุ่มนัดหมาย-->
            <div class="button-container-appoint mb-1 mr-2">
              <button class=" mt-2 edit-button-appoint" @click="openAppointmentDialog(item)">
                <svg class="w-6 h-6 text-gray-800 dark:text-white edit-svgIcon-appoint"
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd"
                    d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <!--ปุ่มลบ-->
            <v-btn color="red " @click="deleteItem(item)"
              class="mt-2.5 flex justify-center items-center gap-2 w-11 h-12 cursor-pointer rounded-md shadow-2xl text-white font-semibold bg-gradient-to-r from-[#fb7185] via-[#e11d48] to-[#be123c] hover:shadow-xl hover:shadow-red-500 hover:scale-105 duration-300 hover:from-[#be123c] hover:to-[#fb7185]">
              <svg viewBox="0 0 15 15" class="w-5 fill-white">
                <svg class="w-6 h-6" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
                Button
              </svg>
            </v-btn>
          </div>
        </template>

        <template v-slot:item.type_patient_name="{ item }">
          <v-chip :color="getTypeColor(item.type_patient_name)" class="my-chip" dark
            :class="{ 'black--text': item.type_patient_name === 'ผู้ป่วยติดเตียง', }">
            {{ item.type_patient_name }}
          </v-chip>
        </template>
      </v-data-table>

      <!-- Confirmation Dialog -->
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
      <History v-if="isHistoryDialogOpen" :dialog="isHistoryDialogOpen" :hn="selectedHN" />

      <dialog-form :dialog="dialog" :edited-item="editedItem" :dialog-title="dialogTitle" @save="saveItem"
        @close="closeDialog" :hide-fields="{ dateAndTime: true }" />

      <dialog-appointment v-if="isAppointmentDialogOpen" :dialog="isAppointmentDialogOpen" :edited-item="editedItem"
        :dialog-title="dialogTitle" @save="saveItem" @close-dialog="isAppointmentDialogOpen = false" />
    </v-card>
  </div>
</template>

<script>

import '../styles/patient.css'; // Import the CSS file

import PatientJs from '../scripts/patient.js';

export default PatientJs;
</script>
