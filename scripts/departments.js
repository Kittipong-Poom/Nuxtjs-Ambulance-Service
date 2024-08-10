
import axios from 'axios';

export default {

    data() {
        return {
            desserts: [],
            bedCount: '',
            serviceCount: '',
            serviceCountOther: '',
            serviceBedCount: '',
            AllserviceCount: '',
            redCount: '',
            yellowCount: '',
            greenCount: '',
            whiteCount: '',
            patientsCount: '',
            emergencyCount: '',
            lastUpdateMonth: null,
            lastUpdateYear: null,
            endpointUrl: process.env.NODE_ENV === 'development' ? process.env.API_URL_DEVELOPMENT : process.env.API_URL_PRODUCTION,
        }
    },
    created() {
        // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
        if (!localStorage.getItem('user')) {
          // ถ้าไม่มีข้อมูลใน localStorage ให้กลับไปหน้า Login
          this.$router.push('/error');
        }
      },
    methods: {
        async resetDataIfNeeded() {
            const today = new Date();
            const currentMonth = today.getMonth() + 1; // Months are zero-based, so add 1
            const currentYear = today.getFullYear();

            // If last update month and year are not set or if they are different from current month and year
            if (this.lastUpdateMonth === null || this.lastUpdateYear === null || this.lastUpdateMonth !== currentMonth || this.lastUpdateYear !== currentYear) {
                // Reset data and counts
                this.bedCount = '';
                this.serviceCount = '';
                this.serviceCountOther = '';
                this.serviceBedCount = '';
                this.AllserviceCount = '';
                this.redCount = '';
                this.yellowCount = '';
                this.greenCount = '';
                this.whiteCount = '';
                this.patientsCount = '';
                this.emergencyCount = '';

                // Update last update month and year to current values
                this.lastUpdateMonth = currentMonth;
                this.lastUpdateYear = currentYear;
            }
        },
        async getpatient() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/patients`);
                console.log(this.endpointUrl);
                console.log('getpatient:', response.data);
                if (Array.isArray(response.data)) {
                    this.patientsCount = response.data.length;
                    console.log('Data count:', this.patientsCount);
                } else {
                    console.log('Response data is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getemergency() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/caseurgents`);
                console.log(this.endpointUrl);
                console.log('getemergency:', response.data);
                this.emergencyCount = response.data.length;
                console.log('Data count:', this.emergencyCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        // async getbedpatient() {
        //     try {
        //         const response = await axios.get(`${this.endpointUrl}/api/gettype`);
        //         console.log(this.endpointUrl);
        //         console.log('getData:', response.data);
        //         this.bedCount = response.data.length;
        //         console.log('Data count:', this.bedCount);
        //     } catch (error) {
        //         console.error('Error:', error);
        //     }
        // },
        async getservicepatient() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/serviceCount`);
                console.log(this.endpointUrl);
                console.log('getservicepatient:', response.data);
                this.serviceCount = response.data.length;
                console.log('Data count:', this.serviceCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getservicepatientOther() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/gettype/service/other`);
                console.log(this.endpointUrl);
                console.log('getservicepatientOther:', response.data);
                this.serviceCountOther = response.data.length;
                console.log('Data count:', this.serviceCountOther);
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getservicepatientBed() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/bedCount`);
                console.log(this.endpointUrl);
                console.log('getservicepatientBed:', response.data);
                this.serviceBedCount = response.data.length;
                console.log('Data count:', this.serviceBedCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },


        async getAllservicepatient() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/patients`);
                console.log(this.endpointUrl);
                console.log('getAllservicepatient:', response.data);
                this.AllserviceCount = response.data.length;
                console.log('Data count:', this.AllserviceCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getredemergency() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/getviolence`);
                console.log(this.endpointUrl);
                console.log('getredemergency:', response.data);
                this.redCount = response.data.length;
                console.log('Data count:', this.redCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async getyellowemergency() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/getviolence/yellow`);
                console.log(this.endpointUrl);
                console.log('getyellowemergency:', response.data);
                this.yellowCount = response.data.length;
                console.log('Data count:', this.yellowCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async getgreenemergency() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/getviolence/green`);
                console.log(this.endpointUrl);
                console.log('getgreenemergency:', response.data);
                this.greenCount = response.data.length;
                console.log('Data count:', this.greenCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async getwhiteemergency() {
            try {
                const response = await axios.get(`${this.endpointUrl}/api/getviolence/white`);
                console.log(this.endpointUrl);
                console.log('getwhiteemergency:', response.data);
                this.whiteCount = response.data.length;
                console.log('Data count:', this.whiteCount);
            } catch (error) {
                console.error('Error:', error);
            }
        },
    },

    created() {
        console.log('ENV', this.endpointUrl)
        // this.getbedpatient();
        this.resetDataIfNeeded();
        this.getservicepatient();
        this.getredemergency();
        this.getyellowemergency();
        this.getgreenemergency();
        this.getwhiteemergency();
        this.getemergency();
        this.getpatient();
        this.getservicepatientOther();
        this.getAllservicepatient();
        this.getservicepatientBed();
    },
};