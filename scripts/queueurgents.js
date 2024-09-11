import DialogFormurgent from "~/components/DialogFormurgent.vue";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  components: {
    DialogFormurgent,
  },
  data() {
    return {
      confirm: false,
      confirmItem: null,
      dialogVisible: false,
      selectedItems: [],
      selected: [],
      search: "",
      isFocused: false,
      endpointUrl:
        process.env.NODE_ENV === "development"
          ? process.env.API_URL_DEVELOPMENT
          : "https://ambulanceserver-uuhg.onrender.com",
      headers: [
        { text: "เลขออกเหตุ", value: "eventnum", align: "center" },
        { text: "วัน/เดือน/ปี", value: "service_date", align: "center" },
        { text: "เวลา", value: "time", align: "center" },
        { text: "เพศ", value: "gender", align: "center" },
        { text: "อายุ", value: "age", align: "center" },
        { text: "ประเภทผู้ป่วย", value: "status", align: "center" },
        {
          text: "ความรุนแรงของประเภทผู้ป่วย",
          value: "violence",
          align: "center",
        },
        {
          text: "กลุ่มอาการฉุกเฉิน",
          value: "emergency_group",
          align: "center",
          width: 400,
        },
        { text: "ละติจูด", value: "lati", align: "center" },
        { text: "ลองติจูด", value: "longi", align: "center" },
        {
          text: "การติดตามการนำส่งผู้ป่วย",
          value: "patient_delivery",
          align: "center",
        },
        { text: "", value: "action", sortable: false, align: "center" },
      ],
      //พิกัดจะให้กดคลิกแล้วให้เป็นหน้า map
      desserts: [],
      statusColorMap: {
        ผู้ป่วยฉุกเฉินวิกฤติ: "red",
        ผู้ป่วยฉุกเฉินเร่งด่วน: "yellow",
        ผู้ป่วยไม่ฉุกเฉิน: "green",
        ผู้ป่วยทั่วไป: "smoke",
      },
      dialog: false,
      dialogTitle1: "",
      editedItem: {
        eventnum: "",
        service_date: "",
        time: "",
        gender: "",
        age: "",
        status: "",
        violence: "",
        emergency_group: "",
        lati: "",
        longi: "",
        patient_delivery: "",
      },
    };
  },

  mounted() {
    console.log("ENV :", process.env.NODE_ENV, this.endpointUrl);
    this.loadData();
  },
  computed: {
    filteredDesserts() {
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
    formattedDesserts() {
      return this.desserts.map((dessert) => ({
        ...dessert,
        service_date: this.formatThaiDate(dessert.service_date),
      }));
    },
    formatThaiDate(dateString) {
      // Extract the date parts
      const datePart = dateString.split("-");
      // Rearrange the date parts to match the desired format (DD-MM-YYYY)
      const formattedDate = `${datePart[2]}-${datePart[1]}-${datePart[0]}`;

      // Remove the time part
      const dateWithoutTime = formattedDate.split("T")[0];

      return dateWithoutTime;
    },
  },
  created() {
    // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
    if (!localStorage.getItem("user")) {
      // ถ้าไม่มีข้อมูลใน localStorage ให้กลับไปหน้า Login
      this.$router.push("/error");
    }
  },
  methods: {
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
                `${this.endpointUrl}/api/caseurgents/${item.caseurgent_id}`
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
    async exportToExcel() {
      if (this.filteredDesserts.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "ไม่มีข้อมูล",
          text: "ไม่มีข้อมูลในตารางที่สามารถ Export Excel ได้",
        });
        return;
      }
      try {
        console.log("Fetching XLSX module...");
        const XLSX = await import("xlsx");
        console.log("XLSX module loaded:", XLSX);

        const dataToExport = this.selected.length
          ? this.selected
          : this.filteredDesserts;
        console.log("Data to export:", dataToExport);

        if (!dataToExport.length) {
          console.error("No data to export");
          return;
        }

        const exportData = dataToExport.map((item) => ({
          เลขออกเหตุ: item.eventnum,
          "วัน/เดือน/ปี": item.service_date,
          เวลา: item.time,
          เพศ: item.gender,
          อายุ: item.age,
          ประเภทผู้ป่วย: item.status,
          ความรุนแรงของประเภทผู้ป่วย: item.violence,
          กลุ่มอาการฉุกเฉิน: Array.isArray(item.emergency_group)
            ? item.emergency_group.join(", ")
            : item.emergency_group,
          ละติจูด: item.lati,
          ลองติจูด: item.longi,
          การติดตามการนำส่งผู้ป่วย: item.patient_delivery,
        }));

        console.log("Export data formatted:", exportData);

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, "เคสฉุกเฉิน.xlsx");
        console.log("Export completed");
      } catch (error) {
        console.error("Error importing xlsx:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถส่งออกข้อมูลได้",
        });
      }
    },

    //ใช้สำหรับ แปลง iso และแปลง DD-MM-YYYY
    formatDate(inputDate) {
      const date = new Date(inputDate);
      const day = date.getDate().toString().padStart(2, "0"); // Add leading zero if needed
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    //ใช้สำหรับ save ข้อมูล
    formatDateForsaveItem(dateString) {
      // Extract the date parts
      const datePart = dateString.split("-");
      // Rearrange the date parts to match MySQL format (YYYY-MM-DD)
      const formattedDate = `${datePart[2]}-${datePart[1]}-${datePart[0]}`;
      return formattedDate;
    },
    getStatusColor(violence) {
      return this.statusColorMap[violence] || "primary";
    },
    openDialogurgent(action, item = null) {
      this.dialogTitle1 =
        action === "add"
          ? "จัดการผู้ป่วยใหม่เคสฉุกเฉิน"
          : "แก้ไขข้อมูลผู้ป่วยฉุกเฉิน";
      this.editedItem = action === "add" ? {} : { ...item };
      this.dialog = true;
    },

    async saveItem(editedItem) {
      try {
        let response;
        editedItem.service_date = this.formatDateForsaveItem(
          editedItem.service_date
        );
        editedItem.emergency_group = JSON.stringify(editedItem.emergency_group);
        console.log("editedItem.emergency_group", editedItem.emergency_group);
        if (!editedItem.caseurgent_id) {
          // Add new patient
          response = await axios.post(
            `${this.endpointUrl}/api/caseurgents`,
            editedItem
          );

          this.showRedBadge = false;

          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "กรอกข้อมูลสำเร็จ",
          });
        } else {
          // Update existing patient
          response = await axios.put(
            `${this.endpointUrl}/api/caseurgents/${editedItem.caseurgent_id}`,
            editedItem
          );

          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "แก้ไขข้อมูลสำเร็จ",
          });
        }
        console.log("response", response);
        const savedUrgents = response.data;
        // Update the local state or trigger a refresh from the server
        // based on your application's architecture
        // For simplicity, updating the local state here:

        this.$nextTick(() => {
          if (!editedItem.caseurgent_id) {
            // Add new patient
            this.desserts.push(savedUrgents); // Push the newly added item to the desserts array
          } else {
            // Update existing patient
            const index = this.desserts.findIndex(
              (item) => item.caseurgent_id === savedUrgents.caseurgent_id
            );
            this.$set(this.desserts, index, savedUrgents);
          }
          this.closeDialog();
        });
        this.desserts = await this.fetchDataFromServer();
      } catch (error) {
        console.error("Error saving item:", error);
        // Show an error notification
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "ไม่สามารถเพิ่มข้อมูลได้",
        }).then(() => {
          this.openDialogurgent("add");
        });
      }
    },

    async deleteItem(item) {
      this.confirmItem = item;
      this.confirm = true;
    },
    cancelDelete() {
      // Reset the confirm dialog and clear the confirmItem
      this.confirm = false;
      this.confirmItem = null;
    },
    async submitDelete() {
      // Check if there is a confirmed item for deletion
      if (this.confirmItem) {
        const item = this.confirmItem;

        // Show a confirmation dialog using SweetAlert2
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
          // If the user confirms, proceed with the deletion
          try {
            const response = await axios.delete(
              this.endpointUrl + `/api/caseurgents/${item.caseurgent_id}`
            );
            if (response.status === 200) {
              // Remove the deleted patient from the local state
              this.desserts = this.desserts.filter(
                (p) => p.caseurgent_id !== item.caseurgent_id
              );
              this.$store.commit("decrementJobsCount");
              // Show success notification

              Swal.fire({
                icon: "success",
                title: "ลบข้อมูลสำเร็จ",
              });
              console.warn("This data delete already");
            } else {
              // Show an error notification
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "เกิดข้อผิดพลาดในการลบข้อมูล",
              });
            }
            this.desserts = await this.fetchDataFromServer();
          } catch (error) {
            console.error("Error deleting item:", error);

            // Show an error notification
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error deleting item",
            });
          }

          // Reset the confirm dialog and clear the confirmItem
          this.confirm = false;
          this.confirmItem = null;
        }
      }
    },
    async loadData() {
      try {
        const { data } = await axios.get(this.endpointUrl + "/api/caseurgents");

        // this.desserts = data;
        console.log("This Data Urgents", data);
        this.$emit("data-loaded", data);

        const formattedData = data.map((item) => {
          // Assuming the service_date field contains the date to be formatted
          return {
            ...item,
            service_date: this.formatDate(item.service_date), // Format date here
          };
        });

        this.desserts = formattedData;
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    async fetchDataFromServer() {
      try {
        const { data } = await axios.get(this.endpointUrl + "/api/caseurgents");
        const formattedData = data.map((item) => {
          // Assuming the service_date field contains the date to be formatted
          return {
            ...item,
            service_date: this.formatDate(item.service_date), // Format date here
          };
        });
        return formattedData;
      } catch (error) {
        console.error("Error fetching data from server:", error);
        throw error; // Propagate the error to the caller
      }
    },
    closeDialog() {
      // Close the dialog
      this.dialog = false;
      this.dialogTitle1 = "";
      this.editedItem = {};
      this.dialogVisible = false;
    },
  },
};
