<!-- <template>
    <v-dialog v-model="dialogVisible">

        <!-- <v-col> -->
        <!-- <v-row align="center" justify="center"> -->
        <!-- Loop through the patient data and display it in a card format -->
        <v-card outlined style="border-color: #49C8FF;" class="mx-auto rounded-xl my-cards" max-width="300">
            <v-card-text class=" dark--text">
                <!-- <v-card-title class="d-flex justify-center align-center">
                    Case {{ nextCaseNumber }}
                </v-card-title> -->
                <v-card-subtitle class="d-flex justify-center align-center">
                    <h1>HNnumber: {{ patient.hnnumber }}</h1>
                </v-card-subtitle>
                <v-card-subtitle>
                    อายุ: {{ patient.age }}
                </v-card-subtitle>
                <v-card-subtitle>
                    เพศ: {{ patient.gender }}
                </v-card-subtitle>
                <v-card-subtitle>
                    เบอร์โทรศัพท์: {{ patient.numberphone }}
                </v-card-subtitle>
                <v-card-subtitle>
                    ที่อยู่: {{ patient.address }}
                </v-card-subtitle>
                <v-card-subtitle>
                    เวลา: {{ patient.time }}
                </v-card-subtitle>
                <v-card-subtitle>
                    พิกัด: {{ patient.coordinate }}
                </v-card-subtitle>
                <v-card-subtitle>
                    ประเภทผู้ป่วย: <v-chip class="white--text" :color="getStatusColor(patient.type)"> {{
                        patient.type }}</v-chip>
                </v-card-subtitle>

            </v-card-text>
            <v-card-actions class="ma-3 justify-center d-flex align-center">
                <v-btn color="#49C8FF" class="rounded-xl white--text" @click="openDialog('edit', patient)">
                    รับงาน
                </v-btn>
            </v-card-actions>
        </v-card>
        <!-- </v-row> -->
        <!-- </v-col> -->


    </v-dialog>
</template>

<script>
import Patient from '~/pages/Patient.vue';
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
    components:{
        Patient,
    },
    props: {
        patient: {
            type: Object,
            required: true,
        },
        dialog: {
            type: Boolean,
            required: true
        },
    },
    data() {
        return {
            endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
            desserts: [],
            saved: {
                service_date: '',
                description: '',
            },
            dialogVisible: true,
            dialogTitle: '',
            statusColorMap: {
        'งานบริการ': 'green',
        'รอรับงาน': 'red',
        'กำลังดำเนินงาน': 'yellow',
        'เสร็จสิ้น': 'green',
        'ผู้ป่วยติดเตียง':'green',
      },
        }
    },

    methods: {
        close() {
            this.dialogVisible = false;
        },
        getStatusColor(casestatus) {
            return this.statusColorMap[casestatus] || 'defaultColor';
        },
        async savejob() {
            try {
                const postData = {
                    service_date: this.saved.service_date.trim(),
                    description: this.saved.description,
                    patient_id: this.saved.patient_id
                };

                //ในส่วนนี้ จะ post ก็ต่อเมื่อถ้า ลงเวลางานกรอกข้อมูลไรเสร็จ กด save ข้อมูลจะ post ทันที
                const response = await axios.post(`${this.endpointUrl}/api/jobs`, postData);
                console.log('postData:', postData);

                if (response.status >= 200 && response.status < 300) {
 
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'ลงเวลางานสำเร็จ',
                    });
                    this.close(); // อันนี้จะปิด dialog คลิกตรงไหนก็ได้เพื่อปิด
                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'ลงเวลางานผิดพลาด',
                    });
                    console.error('Error creating job:', response.data);
                }
            } catch (error) {
                console.error('Error creating job:', error);


                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to create job',
                });
            }
        },


        openDialog(action = null,patient) {
            this.dialogTitle = action === 'add' ? 'จัดการข้อมูลสำหรับ JOB' : 'แก้ไขข้อมูลของ JOB';
            this.saved.hnnumber = patient.hnnumber;
            this.dialog = true;
        },
    }
}
</script> -->
