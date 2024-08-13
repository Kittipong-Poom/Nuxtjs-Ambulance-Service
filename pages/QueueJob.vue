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
            <v-text-field v-model="search" append-icon="mdi-magnify" outlined label="ค้นหา" class="rounded-pill"
        :class="{ 'text-field-expanded ': isFocused || search, 'text-field-collapsed': !isFocused && !search }"
        @focus="isFocused = true" @blur="isFocused = false" hide-details />
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
                    <v-btn color="#4CAF50" class="mr-2 mb-2 white--text mt-2" @click="openAppointmentDialog(item)">
                        <v-icon>mdi-pencil-box-multiple-outline</v-icon>
                        แก้ไข
                    </v-btn>
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
export default QueueJobJs
import '../styles/queuejob.css'
</script>