import Swal from "sweetalert2";
import dayjs from "dayjs";
import Appointment from "~/components/DialogQueueManage.vue";
import axios from "axios";
export default {
  components: {
    Appointment,
  },
  data() {
    return {
      isDialogVisible: false,
      isAppointmentDialogOpen: false,
      endpointUrl:
        process.env.NODE_ENV === "development"
          ? process.env.API_URL_DEVELOPMENT
          : process.env.API_URL_PRODUCTION,
      headers: [
        { text: "HN", value: "hn", align: "center" },
        { text: "เบอร์โทรศัพท์", value: "number", align: "center" },

        { text: "ที่อยู่", value: "address", align: "center" },
        { text: "ละติจูด", value: "lati", align: "center" },
        { text: "ลองติจูด", value: "longi", align: "center" },
        {
          text: "วันที่นัดหมาย : (วัน/เดือน/ปี)",
          value: "service_date",
          align: "center",
        },
        { text: "เวลานัดหมาย", value: "time", align: "center" },
        { text: "สถานะ", value: "status_case_id", align: "center" },
        { text: "", value: "action", sortable: false, align: "center" },
      ],
      selectedPatient: null,
      selectedItem: null,
      selected: [], // selected items
      dialog: false,
      dialogTitle: "",
      desserts: [],
      search: "",
      isFocused: false,
      editedItem: {
        hn: "",
        age_name: "",
        gender: "",
        tracking_name: "",
        service_date: new Date(),
        status_case_id: "",
        number: "",
        time: "",
        address: "",
        lati: "",
        longi: "",
        other: "",
        type_patient_name: "",
      },
      statusColorMap: {
        งานบริการ: "green",
        รอรับงาน: "red",
        กำลังดำเนินงาน: "yellow",
        ยกเลิก: "gray",
        เสร็จสิ้น: "green",
        ผู้ป่วยติดเตียง: "yellow",
        อื่นๆ: "blue",
      },
    };
  },
  computed: {
    filteredDesserts() {
      const search = this.search.toLowerCase();
      return this.desserts
        .filter((item) => {
          return Object.keys(item).some((key) => {
            return String(item[key]).toLowerCase().includes(search);
          });
        })
        .sort((a, b) => {
          const statusOrder = { รอรับงาน: 1, กำลังดำเนินงาน: 2, เสร็จสิ้น: 3 };
          const statusComparison =
            statusOrder[a.status_case_id] - statusOrder[b.status_case_id];

          if (statusComparison !== 0) {
            return statusComparison;
          }

          const dateA = dayjs(a.service_date, "YYYY-MM-DD");
          const dateB = dayjs(b.service_date, "YYYY-MM-DD");
          return dateA.isAfter(dateB) ? 1 : -1;
        });
    },
  },
  methods: {
    async exportToExcel() {
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
          // ใช้ข้อมูลที่เลือกถ้ามี ถ้าไม่มีให้ใช้ข้อมูลที่กรองไว้
          const dataToExport = this.selected.length
            ? this.selected
            : this.filteredDesserts;
          const exportData = dataToExport.map((item) => {
            return {
              appointment_id: item.id,
              HN: item.hn,
              เบอร์โทรศัพท์: item.number,
              ที่อยู่: item.address,
              ละติจูด: item.lati,
              ลองติจูด: item.longi,
              วันที่นัดหมาย: item.service_date,
              เวลา: item.time,
              สถานะ: item.status_case_id,
            };
          });
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
          XLSX.writeFile(workbook, "จัดการตารางคิวงาน.xlsx");
        })
        .catch((error) => {
          console.error("Error importing xlsx:", error);
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถส่งออกข้อมูลได้",
          });
        });
    },
    handleSelectedItemsChange(selectedItems) {
      // Update selectedForDeletion array when items are selected/unselected
      this.selected = selectedItems;
    },
    async deleteSelectedItems() {
      if (this.selected.length === 0) {
        // Show warning message if no item is selected
        Swal.fire("แจ้งเตือน", "กรุณาเลือกรายการที่ต้องการลบ", "warning");
        return; // Exit the function if no item is selected
      }

      // Perform deletion confirmation
      const result = await Swal.fire({
        title: "ยืนยันการลบ",
        text: "ถ้าลบแล้วไม่สามรถกู้คืนข้อมูลได้อีก",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "แน่นอน ลบ!",
      });

      // Proceed with deletion if confirmed
      if (result.isConfirmed) {
        try {
          // Delete only the selected items
          await Promise.all(
            this.selected.map(async (item) => {
              await axios.delete(
                `${this.endpointUrl}/api/appointmentsall/${item.id}`
              );
            })
          );

          // Remove the selected items from the desserts array
          this.desserts = this.desserts.filter(
            (dessert) => !this.selected.includes(dessert)
          );

          // Clear the selected items array
          this.selected = [];

          // Show deletion success message
          Swal.fire("ลบแล้ว!", "รายการที่เลือกได้ถูกลบแล้ว", "success");
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการลบรายการ:", error);
          // Show error message if deletion fails
          Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบรายการที่เลือกได้", "error");
        }
      }
    },

    async loadData() {
      try {
        const { data } = await axios.get(
          this.endpointUrl + "/api/appointments"
        );
        console.log("This Data QueueJob", data);

        const formattedData = data.map((item) => {
          if (item.time && typeof item.time === "string") {
            const [hours, minutes] = item.time.split(":");
            return {
              ...item,
              service_date: this.formatDate(item.service_date),
              time: `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`,
            };
          } else {
            console.error("Invalid time format:", item.time);
            return item;
          }
        });

        this.desserts = formattedData;
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    updateStatuses() {
      console.log("Updating statuses");
      const now = dayjs();

      this.desserts.forEach((item, index) => {
        console.log("Processing item:", item);
        const appointmentDateTime = dayjs(
          item.service_date + " " + item.time,
          "DD-MM-YYYY HH:mm"
        );

        if (
          item.status_case_id === "รอรับงาน" &&
          now.isAfter(appointmentDateTime)
        ) {
          this.$set(this.desserts, index, {
            ...item,
            status_case_id: "กำลังดำเนินงาน",
          });
        } else if (
          item.status_case_id === "กำลังดำเนินงาน" &&
          now.isAfter(appointmentDateTime.add(1, "hour"))
        ) {
          this.$set(this.desserts, index, {
            ...item,
            status_case_id: "เสร็จสิ้น",
          });
        }
      });
    },
    async fetchDataFromServer() {
      try {
        const { data } = await axios.get(
          `${this.endpointUrl}/api/appointments`
        );
        const formattedData = data.map((item) => {
          return {
            ...item,
            service_date: this.formatDate(item.service_date),
          };
        });
        this.desserts = formattedData;
      } catch (error) {
        console.error("Error fetching data from server:", error);
        throw error;
      }
    },
    openGoogleMaps(item) {
      const latitude = item.lati;
      const longitude = item.longi;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url);
    },
    openAppointmentDialog(item) {
      // Pass the service date along with other item properties
      this.editedItem = {
        ...item,
        service_date: new Date(
          item.service_date.substr(6, 4) -
            543 +
            "-" +
            item.service_date.substr(3, 2) +
            "-" +
            item.service_date.substr(0, 2)
        ),
      };
      this.dialogTitle = "แก้ไขนัดหมายผู้ป่วย";
      this.isAppointmentDialogOpen = true;
    },
    handleUpdateSuccess() {
      this.isAppointmentDialogOpen = false;
      console.log("Update was successful");
      this.fetchDataFromServer(); // Fetch data to get the latest updates
    },
    formatTime(time) {
      if (!time) return "";
      const timeObj = new Date(time);
      const hours = timeObj.getHours().toString().padStart(2, "0");
      const minutes = timeObj.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    },

    formatDate(inputDate) {
      const date = new Date(inputDate);
      const gregorianYear = date.getFullYear();
      const buddhistYear = gregorianYear;
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      return `${day}-${month}-${buddhistYear}`;
    },

    formatDateForsaveItem(dateString) {
      if (!dateString) {
        return null;
      }
      const datePart = dateString.split("-");
      const gregorianYear = parseInt(datePart[2]) - 543; // Convert Buddhist year to Gregorian calendar
      const formattedDate = `${gregorianYear}-${datePart[1]}-${datePart[0]}`;
      return formattedDate;
    },

    async saveItem(editedItem) {
      try {
        if (!editedItem.status_case_id) {
          this.$emit("error", "โปรดเลือกสถานะ");
          return;
        }

        editedItem.service_date = this.formatDateForsaveItem(
          editedItem.service_date
        );

        // Format the time to ensure it follows the HH:MM format
        editedItem.time = this.formatTime(editedItem.time);

        let response;
        if (editedItem.id) {
          response = await axios.put(
            `${this.endpointUrl}/api/appointments/${this.editedItem.id}`,
            editedItem
          );
        }
        const savedAppointment = response.data;

        if (!editedItem.id) {
          this.desserts.push(savedAppointment);
        } else {
          const index = this.desserts.findIndex(
            (item) => item.id === savedAppointment.id
          );
          if (index !== -1) {
            this.$set(this.desserts, index, savedAppointment);
          }
        }
        this.closeDialog();
        this.$emit("item-saved");
        const index = this.desserts.findIndex(
          (item) => item.id === savedAppointment.id
        );
        if (index !== -1) {
          this.$set(
            this.desserts[index],
            "status_case_id",
            savedAppointment.status_case_id
          );
        }
      } catch (error) {
        console.error("Error saving item:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "ไม่สามารถเพิ่มข้อมูลได้",
        });
      }
    },
    closeDialog() {
      this.selectedPatient = null;
      this.isDialogVisible = false;
    },
    getTypeColor(type) {
      return this.statusColorMap[type] || "defaultColor";
    },
    getStatusColor(type) {
      return this.statusColorMap[type] || "defaultColor";
    },
  },
  mounted() {
    console.log("ENV :", process.env.NODE_ENV, this.endpointUrl);
    this.loadData();
  },
  created() {
    // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
    if (!localStorage.getItem("user")) {
      // ถ้าไม่มีข้อมูลใน localStorage ให้กลับไปหน้า Login
      this.$router.push("/error");
    }
  },
};
