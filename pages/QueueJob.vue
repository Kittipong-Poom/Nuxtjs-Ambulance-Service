<template>
    <v-card>
        <v-card-title class="d-flex justify-center align-center head1">
            <span class="text-2xl font-semibold">ตารางจัดการคิวงาน</span>
        </v-card-title>

        <v-card-title>
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-text-field v-model="search" append-icon="mdi-magnify" outlined label="ค้นหา" class="w-0" hide-details />
        </v-card-title>

        <v-data-table :headers="headers" :items="filteredDesserts" :search="search" item-key="id" show-select
            v-model="selected" @input="handleSelectedItemsChange">
            <template v-slot:top>
                <v-toolbar flat>
                    <h5>👇เลือกทั้งหมด </h5>
                    <v-spacer></v-spacer>
                    <v-btn style="--clr: #4CAF50" class="button-excel mr-2 white--text" color="#4CAF50"
                        @click="exportToExcel">
                        <span class="button__icon-wrapper mr-2">
                            <svg width="10" class="button__icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 15">
                                <path fill="currentColor"
                                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z">
                                </path>
                            </svg>

                            <svg class="button__icon-svg  button__icon-svg--copy" xmlns="http://www.w3.org/2000/svg"
                                width="10" fill="none" viewBox="0 0 14 15">
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
            <!--ปุ่มแก้ไขนัดหมายผู้ป่วย-->
            <template v-slot:item.action="{ item }">
                <div class="d-flex">
                    <div class="button-container-queue mr-2 mb-2 ">
                        <button class=" mt-2 edit-button-queue" @click="openAppointmentDialog(item)">
                            <svg class="edit-svgIcon-queue" viewBox="0 0 512 512">
                                <path
                                    d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z">
                                </path>
                            </svg>
                        </button>
                    </div>
                    <v-btn color="blue" class="mr-2 mt-2.5 white--text" @click="openGoogleMaps(item)">
                        <v-icon>mdi-map-marker</v-icon>
                        เริ่มการนำทาง
                    </v-btn>
                </div>
            </template>

            <template v-slot:item.type_patient_name="{ item }">
                <v-chip :color="getTypeColor(item.type_patient_name)" class="my-chip" dark
                    :class="{ 'black--text': item.type_patient_name === 'ผู้ป่วยติดเตียง', }">
                    {{ item.type_patient_name }}
                </v-chip>
            </template>

            <template v-slot:item.status_case_id="{ item }">
                <v-chip :color="getStatusColor(item.status_case_id)" class="my-chip" dark
                    :class="{ 'black--text': item.status_case_id === 'กำลังดำเนินงาน', }"
                    :dark="item.status_case_id === 'รอรับงาน' || item.status_case_id === 'เสร็จสิ้น'">
                    {{ item.status_case_id }}
                </v-chip>
            </template>
        </v-data-table>

        <!-- <dialog-form :dialog="dialog" :edited-item="editedItem" :dialog-title="dialogTitle" @save="saveItem"
            @close="closeDialog" :hide-fields="{ actions: true }" /> -->

        <Appointment :dialog="isAppointmentDialogOpen" :editedItem="editedItem" :dialogTitle="dialogTitle"
            @close-dialog="isAppointmentDialogOpen = false" @update-success="handleUpdateSuccess" />
    </v-card>
</template>

<script>
import QueueJobJs from '../scripts/queuejob.js'
import '../styles/queuejob.css'
export default QueueJobJs
</script>