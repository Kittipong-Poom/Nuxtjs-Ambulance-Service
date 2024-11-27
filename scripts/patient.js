import DialogAppointment from "~/components/DialogAppointment.vue";  // นำเข้า DialogAppointment Component
import DialogForm from "~/components/DialogForm.vue";  // นำเข้า DialogForm Component
import History from "~/components/History.vue";  // นำเข้า History Component
import axios from "axios";  // นำเข้า Axios สำหรับการทำ HTTP Requests
import Swal from "sweetalert2";  // นำเข้า SweetAlert2 สำหรับการแสดงผลแจ้งเตือน
import dayjs from "dayjs";  // นำเข้า dayjs สำหรับการจัดการกับวันที่

export default {
  components: {
    DialogForm,
    DialogAppointment,
    History,
  },
  data() {
    return {
      openHistoryCard: false,  // ตัวแปรสำหรับการเปิดหรือปิดการแสดงข้อมูลประวัติ
      selectedHN: null,  // ตัวแปรเก็บ HN ของผู้ป่วยที่เลือก
      hn: "",  // ตัวแปรเก็บค่า HN
      isHistoryDialogOpen: false,  // ตัวแปรสำหรับการเปิด/ปิด Dialog ประวัติ
      newDate: "",  // ตัวแปรสำหรับเก็บวันที่ใหม่
      confirm: false,  // ตัวแปรสำหรับการยืนยันการลบ
      confirmItem: null,  // เก็บข้อมูลที่เลือกสำหรับลบ
      dialogVisible: false,  // ตัวแปรสำหรับการแสดง Dialog
      events: [],  // ตัวแปรเก็บข้อมูล events
      selected: [],  // ตัวแปรเก็บรายการที่ถูกเลือก
      selectedForDeletion: [],  // ตัวแปรเก็บรายการที่เลือกสำหรับการลบ
      search: "",  // ตัวแปรเก็บข้อมูลการค้นหา
      action: "",  // ตัวแปรเก็บการกระทำที่ต้องการทำ
      isAppointmentDialogOpen: false,  // ตัวแปรสำหรับเปิด/ปิด Dialog นัดหมาย
      endpointUrl: process.env.NODE_ENV === "development" ? process.env.API_URL_DEVELOPMENT : 'https://server-nuxtjs-ambulance.onrender.com',  // ตั้งค่า URL สำหรับ API
      headers: [
        { text: "เลข-HN", value: "hn", align: "center" },
        { text: "ชื่อ_นามสกุล", value: "fname_lname", align: "center" },
        { text: "อายุ", value: "age_name", align: "center" },
        { text: "เพศ", value: "gender", align: "center" },
        { text: "เบอร์โทรศัพท์", value: "number", align: "center" },
        { text: "ประเภทผู้ป่วย", value: "type_patient_name", align: "center" },
        { text: "ที่อยู่", value: "address", align: "center" },
        { text: "ละติจูด", value: "lati", align: "center" },
        { text: "ลองติจูด", value: "longi", align: "center" },
        { text: "การติดตามการนำส่งผู้ป่วย", value: "tracking_name", align: "center" },
        { text: "รายละเอียดเพิ่มเติม", value: "other", align: "center" },
        { text: "", value: "action", sortable: false, align: "center" },
      ],
      desserts: [],  // ข้อมูลผู้ป่วย
      items_status: [],  // ข้อมูลสถานะ
      statusColorMap: {  // สีที่ใช้สำหรับแต่ละสถานะ
        งานบริการ: "green",
        ผู้ป่วยติดเตียง: "yellow",
        อื่นๆ: "blue",
      },
      dialog: false,  // ตัวแปรเปิด/ปิด Dialog
      dialogTitle: "",  // ชื่อของ Dialog
      editedItem: {  // ข้อมูลที่แก้ไขใน Dialog
        hn: "",
        ages_id: "",
        gender: "",
        number: "",
        tracking_patient_id: "",
        address: "",
        lati: "",
        longi: "",
        type_patient_id: "",
        other: "",
        fname_lname: "",
        service_date: null,
        time: null,
      },
    };
  },
  mounted() {
    // เมื่อ Component ถูกสร้างแล้ว ให้โหลดข้อมูล
    console.log("ENV :", process.env.NODE_ENV, this.endpointUrl);
    this.loadData();
  },
  computed: {
    filteredDesserts() {
      // ฟังก์ชันกรองข้อมูลที่จะแสดง
      if (!this.search) {
        return this.desserts;
      }
      const searchLower = this.search.toLowerCase();
      return this.desserts.filter((item) => {
        return Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        );
      });
    },
    formattedDate() {
      // ฟังก์ชันแปลงวันที่จากไทยเป็นแบบที่สามารถเก็บในฐานข้อมูลได้
      const thaiDate = dayjs(this.date, "DD-MM-YYYY");
      const thaiYearDate = thaiDate.add(543, "year");
      const formattedDate = thaiYearDate.format("YYYY-MM-DD");
      return formattedDate;
    },
  },
  methods: {
    openHistoryDialog(hn) {
      // ฟังก์ชันเปิด Dialog ประวัติของผู้ป่วย
      if (this.isAppointmentDialogOpen || this.dialog) {
        this.isAppointmentDialogOpen = false;
        this.dialog = false;
      }
      this.selectedHN = hn;
      console.log("เลขhn", hn);
      this.isHistoryDialogOpen = true;
      console.log("opennnn");
      this.$emit("open-history", hn);
    },

    async exportToExcel() {
      // ฟังก์ชันสำหรับส่งออกข้อมูลไปยังไฟล์ Excel
      if (this.filteredDesserts.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "ไม่มีข้อมูล",
          text: "ไม่มีข้อมูลในตารางที่สามารถ Export Excel ได้",
        });
        return;
      }

      import("xlsx")
        .then((XLSX) => {
          const dataToExport = this.selected.length
            ? this.selected
            : this.filteredDesserts;

          const exportData = dataToExport.map((item) => {
            return {
              เลข_HN: item.hn,
              ชื่อ_นามสกุล: item.fname_lname,
              อายุ: item.age_name,
              เพศ: item.gender,
              เบอร์โทรศัพท์: item.number,
              ประเภทผู้ป่วย: item.type_patient_name,
              การติดตามการนำส่งผู้ป่วย: item.tracking_name,
              ที่อยู่: item.address,
              ละติจูด: item.lati,
              ลองติจูด: item.longi,
              รายละเอียดเพิ่มเติม: item.other,
            };
          });

          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
          XLSX.writeFile(workbook, "ข้อมูลผู้ป่วยทั่วไป.xlsx");
        })
        .catch(error => {
          console.error('Error importing xlsx:', error);
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถส่งออกข้อมูลได้',
          });
        });
    },
    handleSelectedItemsChange(selectedItems) {
      // ฟังก์ชันอัพเดตรายการที่ถูกเลือก
      this.selected = selectedItems;
    },
    async deleteSelectedItems() {
      // ฟังก์ชันลบรายการที่เลือก
      if (this.selected.length === 0) {
        Swal.fire("แจ้งเตือน", "กรุณาเลือกรายการที่ต้องการลบ", "warning");
        return;  // ออกจากฟังก์ชันหากไม่มีรายการที่เลือก
      }

      // ฟังก์ชันยืนยันการลบ
      const result = await Swal.fire({
        title: "ยืนยันการลบ",
        text: "ถ้าลบแล้วไม่สามรถกู้คืนข้อมูลได้อีก",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "แน่นอน ลบ!",
      });

      if (result.isConfirmed) {
        try {
          // ลบรายการที่เลือก
          await Promise.all(
            this.selected.map(async (item) => {
              await axios.delete(
                `${this.endpointUrl}/api/patients/${item.hn_id}`
              );
              await axios.delete(
                this.endpointUrl + `/api/appointments/${item.hn}`
              );
            })
          );

          this.desserts = this.desserts.filter(
            (dessert) => !this.selected.includes(dessert)
          );

          this.selected = [];

          Swal.fire("ลบแล้ว!", "รายการที่เลือกได้ถูกลบแล้ว", "success");
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการลบรายการ:", error);
          Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบรายการที่เลือกได้", "error");
        }
      }
    },
    closeDialog() {
      // ฟังก์ชันปิด Dialog
      this.dialog = false;
      this.isAppointmentDialogOpen = false;
      this.isHistoryDialogOpen = false;
      this.dialogTitle = "";
      this.editedItem = {};
      this.dialogVisible = false;
    },
    async openAppointmentDialog(item) {
      // ฟังก์ชันเปิด Dialog นัดหมาย
      if (this.dialog || this.isHistoryDialogOpen) {
        this.dialog = false;
        this.isHistoryDialogOpen = false;
      }
      // Fetch status data
      try {
        const { data } = await axios.get(this.endpointUrl + "/api/status");
        this.items_status = data; // เก็บข้อมูลสถานะที่ดึงมาจาก API
      } catch (error) {
        console.error("Error fetching status data:", error); // ถ้ามีข้อผิดพลาดในการดึงข้อมูลสถานะ
      }

      // Set editedItem and dialogTitle based on item data
      this.editedItem = { ...item }; // คัดลอกข้อมูลจาก item มาเก็บใน editedItem เพื่อหลีกเลี่ยงการแก้ไขโดยตรง
      console.log(item);
      console.log(this.editedItem.age_name);
      this.dialogTitle = "นัดหมายผู้ป่วย"; // กำหนดชื่อหัวข้อของ dialog เป็น "นัดหมายผู้ป่วย"
      // แสดง dialog สำหรับนัดหมายผู้ป่วย
      this.isAppointmentDialogOpen = true;

    },
    formatDateForMySQL(dateString) {
      // แปลงวันที่ให้เป็นรูปแบบที่ MySQL ใช้
      if (!dateString) {
        return null; // ถ้าไม่มีข้อมูลวันที่ ให้คืนค่า null
      }
      const datePart = dateString.split("-");
      // แปลงวันที่ให้เป็นรูปแบบ MySQL (YYYY-MM-DD)
      const formattedDate = `${datePart[2]}-${datePart[1]}-${datePart[0]}`;
      return formattedDate;
    },
    getTypeColor(type) {
      return this.statusColorMap[type] || "defaultColor"; // คืนค่าสีตามประเภทสถานะ
    },

    openDialog(action, item = null) {
      // ก่อนเปิด dialog ใหม่ ตรวจสอบสถานะของ dialog อื่น ๆ และปิดทุกตัวที่เปิดอยู่
      if (this.isAppointmentDialogOpen || this.isHistoryDialogOpen) {
        this.isAppointmentDialogOpen = false;
        this.isHistoryDialogOpen = false;
      }

      // เปิด dialog ใหม่
      this.dialogTitle =
        action === "add" ? "จัดการผู้ป่วยใหม่" : "แก้ไขข้อมูลผู้ป่วย"; // กำหนดชื่อหัวข้อ dialog ตามการกระทำ
      this.editedItem = action === "add" ? {} : { ...item }; // กำหนดข้อมูลใน editedItem ขึ้นอยู่กับ action
      this.dialog = true;
    },

    async saveItem(editedItem) {
      try {
        const token = localStorage.getItem("token"); // ดึง token จาก localStorage
        let response;
        const isAddNewPatient = !editedItem.hn_id; // ตรวจสอบว่าคือการเพิ่มผู้ป่วยใหม่
        const isUpdatePatientInfo = editedItem.hn_id && !editedItem.time; // ตรวจสอบว่าคือการอัพเดทข้อมูลผู้ป่วย
        const isUpdateAppointment = editedItem.hn_id && editedItem.time; // ตรวจสอบว่าคือการอัพเดทนัดหมาย

        console.log("isAddNewPatient:", isAddNewPatient);
        console.log("isUpdatePatientInfo:", isUpdatePatientInfo);
        console.log("isUpdateAppointment:", isUpdateAppointment);

        if (isAddNewPatient) {
          // ถ้าเป็นการเพิ่มผู้ป่วยใหม่
          console.log("Adding new patient", editedItem);

          try {
            response = await axios.post(`${this.endpointUrl}/api/patients`, {
              hn: editedItem.hn,
              ages_id: editedItem.ages_id ? editedItem.ages_id.age_id : null,
              gender: editedItem.gender,
              number: editedItem.number,
              tracking_patient_id: editedItem.tracking_patient_id,
              address: editedItem.address,
              lati: editedItem.lati,
              longi: editedItem.longi,
              type_patient_id: editedItem.type_patient_id,
              fname_lname: editedItem.fname_lname,
              other: editedItem.other,
              service_date: null,
              time: null,
            });
            headers: {
              Authorization: `Bearer ${token}`; // ส่ง token ไปกับคำขอ
            }

            console.log("response:", response);

            Swal.fire({
              icon: "success",
              title: "สำเร็จ",
              text: "กรอกข้อมูลสำเร็จ",
            });
          } catch (error) {
            console.error("Error in axios.post:", error.response || error);

            Swal.fire({
              icon: "success",
              title: "สำเร็จ",
              text: "นัดหมายสำเร็จ",
            });
            return;
          }
        } else if (isUpdateAppointment) {
          // ถ้าเป็นการอัพเดทนัดหมาย
          console.log("Updating appointment", editedItem);

          try {
            response = await axios.put(
              `${this.endpointUrl}/api/patients/${editedItem.hn_id}`,
              {
                status_case_id: editedItem.status_case_id,
                service_date: editedItem.service_date,
                time: editedItem.time,
              }
            );
            console.log("response:", response);

            Swal.fire({
              icon: "success",
              title: "สำเร็จ",
              text: "อัพเดตการนัดหมายสำเร็จ",
            });
          } catch (error) {
            console.error(
              "Error in axios.put (appointment):",
              error.response || error
            );

            Swal.fire({
              icon: "error",
              title: "Error",
              text:
                "ไม่สามารถนัดหมายผู้ป่วยได้:11111 " +
                (error.response.data.message || error.message),
            });
            return;
          }
        } else if (isUpdatePatientInfo) {
          // ถ้าเป็นการอัพเดทข้อมูลผู้ป่วย
          console.log("Updating patient info", editedItem);

          try {
            response = await axios.put(
              `${this.endpointUrl}/api/patientsedit/${editedItem.hn_id}`,
              {
                hn: editedItem.hn,
                ages_id: editedItem.ages_id ? editedItem.ages_id.age_id : null,
                gender: editedItem.gender,
                number: editedItem.number,
                tracking_patient_id: editedItem.tracking_patient_id,
                address: editedItem.address,
                lati: editedItem.lati,
                longi: editedItem.longi,
                fname_lname: editedItem.fname_lname,
                type_patient_id: editedItem.type_patient_id,
                other: editedItem.other,
              }
            );
            console.log("response:", response);

            Swal.fire({
              icon: "success",
              title: "สำเร็จ",
              text: "แก้ไขข้อมูลสำเร็จ",
            });
          } catch (error) {
            console.error(
              "Error in axios.put (patient info):",
              error.response || error
            );

            Swal.fire({
              icon: "error",
              title: "Error",
              text:
                "ไม่สามารถแก้ไขข้อมูลได้:5555 " +
                (error.response.data.message || error.message),
            });
            return;
          }
        }

        console.log("response", response);

        const savedPatient = response.data;

        this.$nextTick(() => {
          if (isAddNewPatient) {
            this.desserts.push(savedPatient); // ถ้าเป็นการเพิ่มผู้ป่วยใหม่ ให้เพิ่มลงใน array
          } else {
            const index = this.desserts.findIndex(
              (item) => item.hn_id === savedPatient.hn_id
            );
            this.$set(this.desserts, index, savedPatient); // ถ้าเป็นการอัพเดท ให้แทนที่ข้อมูลเก่า
          }
          this.closeDialog();
        });
        this.desserts = await this.fetchDataFromServer(); // ดึงข้อมูลผู้ป่วยจาก server
      } catch (error) {
        console.error("Error saving item:", error.response || error);

        // แสดงการแจ้งเตือนเมื่อมีข้อผิดพลาด
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            "ไม่สามารถบันทึกข้อมูลได้: 66666" +
            (error.response.data.message || error.message),
        });
      }
    },

    async deleteItem(item) {
      this.confirmItem = item;
      this.confirm = true; // เปิด dialog การยืนยันการลบ
    },
    cancelDelete() {
      // รีเซ็ตการยืนยันการลบ
      this.confirm = false;
      this.confirmItem = null;
    },
    async submitDelete() {
      // ตรวจสอบว่ามี item ที่ถูกยืนยันการลบ
      if (this.confirmItem) {
        const item = this.confirmItem;

        // แสดง dialog การยืนยันการลบ
        const result = await Swal.fire({
          title: "ยืนยันการลบ?",
          text: "เมื่อยืนยันคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก",
        });

        if (result.isConfirmed) {
          // ถ้าผู้ใช้ยืนยันการลบ
          try {
            // ลบข้อมูลผู้ป่วยจาก API
            const response = await axios.delete(
              this.endpointUrl + `/api/patients/${item.hn_id}`
            );
            // ลบข้อมูลการนัดหมายจาก API
            await axios.delete(
              this.endpointUrl + `/api/appointments/${item.hn}`
            );

            if (response.status === 200) {
              // ถ้าลบข้อมูลสำเร็จ ลบข้อมูลออกจาก array ใน local
              this.desserts = this.desserts.filter((p) => p.hn !== item.hn);
              // แสดงการแจ้งเตือนการลบสำเร็จ
              Swal.fire({
                icon: "success",
                title: "ลบข้อมูลสำเร็จ",
              });
              console.warn("This data delete already");
            } else {
              // ถ้ามีข้อผิดพลาดในการลบแสดงการแจ้งเตือน
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "เกิดข้อผิดพลาดในการลบข้อมูล",
              });
            }
            // โหลดข้อมูลจากเซิร์ฟเวอร์ใหม่หลังการลบ
            this.desserts = await this.fetchDataFromServer();
          } catch (error) {
            console.error("Error deleting item:", error);
            // แสดงการแจ้งเตือนหากเกิดข้อผิดพลาดในการลบ
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error deleting item",
            });
          }

          // รีเซ็ตการแสดงผลยืนยันการลบ
          this.confirm = false;
          this.confirmItem = null;
        }
      }
    },
    async loadData() {
      try {
        // ดึงข้อมูลผู้ป่วยจากเซิร์ฟเวอร์
        const { data } = await axios.get(
          this.endpointUrl + "/api/patients",
          {}
        );
        console.log("This data Patient", data);
        // ส่งข้อมูลที่ดึงได้ไปยัง parent component
        this.$emit("data-loaded", data);
        // เก็บข้อมูลผู้ป่วยใน state
        this.desserts = data;
      } catch (error) {
        // แสดงข้อผิดพลาดถ้าไม่สามารถดึงข้อมูลได้
        console.error("Error loading data:", error);
      }
    },
    async fetchDataFromServer() {
      try {
        // ดึงข้อมูลผู้ป่วยจากเซิร์ฟเวอร์
        const { data } = await axios.get(this.endpointUrl + "/api/patients");
        return data; // ส่งข้อมูลกลับ
      } catch (error) {
        console.error("Error fetching data from server:", error);
        throw error; // หากเกิดข้อผิดพลาดให้ propagate error
      }
    },
  },
  created() {
    // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
    if (!localStorage.getItem("user")) {
      // ถ้าไม่มีข้อมูลใน localStorage ให้กลับไปหน้า Login
      this.$router.push("/error");
    }
  },
};
