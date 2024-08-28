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
          : process.env.API_URL_PRODUCTION,
    };
  },
  methods: {
    async resetDataIfNeeded() {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Months are zero-based, so add 1
      const currentYear = today.getFullYear();

      // If last update month and year are not set or if they are different from current month and year
      if (
        this.lastUpdateMonth === null ||
        this.lastUpdateYear === null ||
        this.lastUpdateMonth !== currentMonth ||
        this.lastUpdateYear !== currentYear
      ) {
        // Reset data and counts
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

        // Update last update month and year to current values
        this.lastUpdateMonth = currentMonth;
        this.lastUpdateYear = currentYear;
      }
    },
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

    async getemergency() {
      try {
        const response = await axios.get(`${this.endpointUrl}/api/caseurgents`);
        this.emergencyCount = response.data.length;
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

    async getredemergency() {
      try {
        const response = await axios.get(`${this.endpointUrl}/api/getviolence`);
        this.redCount = response.data.length;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getyellowemergency() {
      try {
        const response = await axios.get(
          `${this.endpointUrl}/api/getviolence/yellow`
        );
        this.yellowCount = response.data.length;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getgreenemergency() {
      try {
        const response = await axios.get(
          `${this.endpointUrl}/api/getviolence/green`
        );
        this.greenCount = response.data.length;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getwhiteemergency() {
      try {
        const response = await axios.get(
          `${this.endpointUrl}/api/getviolence/white`
        );
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
    // this.getbedpatient();
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
