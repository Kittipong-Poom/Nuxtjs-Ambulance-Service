import axios from "axios";

export default {
  data() {
    return {
      desserts: [],
      bedCount: "",
      serviceCount: "",
      serviceCountOther: "",
      serviceBedCount: "",
      AllserviceCount: "",
      redCount: "",
      yellowCount: "",
      greenCount: "",
      whiteCount: "",
      patientsCount: "",
      emergencyCount: "",
      lastUpdateMonth: null,
      lastUpdateYear: null,
      endpointUrl:
        process.env.NODE_ENV === "development"
          ? process.env.API_URL_DEVELOPMENT
          : "https://ambulanceserver-uuhg.onrender.com",
    };
  },
  methods: {
    async resetDataIfNeeded() {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Months are zero-based, so add 1
      const currentYear = today.getFullYear();

      // ถ้าเดือนหรือปีไม่ตรงกับปัจจุบัน ให้รีเซ็ตข้อมูลทั้งหมด
      if (
        this.lastUpdateMonth === null ||
        this.lastUpdateYear === null ||
        this.lastUpdateMonth !== currentMonth ||
        this.lastUpdateYear !== currentYear
      ) {
        // รีเซ็ตข้อมูลและตัวนับทั้งหมด
        this.bedCount = "";   
        this.serviceCount = "";
        this.serviceCountOther = "";
        this.serviceBedCount = "";
        this.AllserviceCount = "";
        this.redCount = "";
        this.yellowCount = "";
        this.greenCount = "";
        this.whiteCount = "";
        this.patientsCount = "";
        this.emergencyCount = "";
        
        // อัปเดตเดือนและปีสุดท้ายที่ทำการรีเซ็ต
        this.lastUpdateMonth = currentMonth;
        this.lastUpdateYear = currentYear;
      }
    },
    
    // ฟังก์ชันดึงข้อมูลจาก API ผู้ป่วยฉุกเฉิน
    async getpatient() {
      try {
        const response = await axios.get(`${this.endpointUrl}/api/patients`);
        if (Array.isArray(response.data)) {
          this.patientsCount = response.data.length;
        } else {
          console.log("Response data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async getservicepatient() {
      try {
        const response = await axios.get(
          `${this.endpointUrl}/api/serviceCount`
        );
        this.serviceCount = response.data.length;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async getservicepatientOther() {
      try {
        const response = await axios.get(
          `${this.endpointUrl}/api/gettype/service/other`
        );
        this.serviceCountOther = response.data.length;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async getservicepatientBed() {
      try {
        const response = await axios.get(`${this.endpointUrl}/api/bedCount`);
        this.serviceBedCount = response.data.length;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async getAllservicepatient() {
      try {
        const response = await axios.get(`${this.endpointUrl}/api/patients`);
        this.AllserviceCount = response.data.length;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    
    // ผู้ป่วยฉุกเฉินของเดือนปัจจุบัน
    async getemergency() {
      try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // เดือนปัจจุบัน
        const currentYear = today.getFullYear(); // ปีปัจจุบัน
    
        const response = await axios.get(`${this.endpointUrl}/api/caseurgents`, {
          params: {
            month: currentMonth,
            year: currentYear
          }
        });
        this.emergencyCount = response.data.length; // นับจำนวนผู้ป่วยในเดือนปัจจุบัน
      } catch (error) {
        console.error("Error:", error);
      }
    },
    
    async getredemergency() {
      try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // เดือนปัจจุบัน
        const currentYear = today.getFullYear(); // ปีปัจจุบัน
    
        const response = await axios.get(`${this.endpointUrl}/api/getviolence`, {
          params: {
            month: currentMonth,
            year: currentYear
          }
        });
        this.redCount = response.data.length; // นับจำนวนผู้ป่วยสีแดงในเดือนปัจจุบัน
      } catch (error) {
        console.error("Error:", error);
      }
    },
    
    async getyellowemergency() {
      try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // เดือนปัจจุบัน
        const currentYear = today.getFullYear();
    
        const response = await axios.get(`${this.endpointUrl}/api/getviolence/yellow`, {
          params: {
            month: currentMonth,
            year: currentYear
          }
        });
        this.yellowCount = response.data.length;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    
    async getgreenemergency() {
      try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // เดือนปัจจุบัน
        const currentYear = today.getFullYear();
    
        const response = await axios.get(`${this.endpointUrl}/api/getviolence/green`, {
          params: {
            month: currentMonth,
            year: currentYear
          }
        });
        this.greenCount = response.data.length;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    
    async getwhiteemergency() {
      try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // เดือนปัจจุบัน
        const currentYear = today.getFullYear();
    
        const response = await axios.get(`${this.endpointUrl}/api/getviolence/white`, {
          params: {
            month: currentMonth,
            year: currentYear
          }
        });
        this.whiteCount = response.data.length;
      } catch (error) {
        console.error("Error:", error);
      }
    },

  },

  async created() {
    if (!localStorage.getItem("user")) {
      // ถ้าไม่มีข้อมูลใน localStorage ให้กลับไปหน้า Login
      this.$router.push("/error");
    }
    console.log('ENV :',process.env.NODE_ENV, this.endpointUrl)
    
    await this.resetDataIfNeeded();
    
    // ดึงข้อมูลต่างๆ เมื่อคอมโพเนนต์ถูกสร้าง
    await Promise.all([
      this.getservicepatient(),
      this.getredemergency(),
      this.getyellowemergency(),
      this.getgreenemergency(),
      this.getwhiteemergency(),
      this.getemergency(),
      this.getpatient(),
      this.getservicepatientOther(),
      this.getAllservicepatient(),
      this.getservicepatientBed()
    ]);
  },
};
