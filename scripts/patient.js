import DialogAppointment from "~/components/DialogAppointment.vue";
import DialogForm from "~/components/DialogForm.vue";
import History from "~/components/History.vue";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
export default {
  components: {
    DialogForm,
    DialogAppointment,
    History,
  },
  data() {
    return {
      openHistoryCard: false,
      selectedHN: null,
      hn: "",
      isHistoryDialogOpen: false,
      newDate: "",
      confirm: false,
      confirmItem: null,
      dialogVisible: false,
      events: [],
      selected: [], // selected items
      selectedForDeletion: [], // items selected for deletion
      search: "",
      action: "",
      isAppointmentDialogOpen: false,
      endpointUrl:
        process.env.NODE_ENV === "development"
          ? process.env.API_URL_DEVELOPMENT
          : process.env.API_URL_PRODUCTION,
      headers: [
        { text: "HN", value: "hn", align: "center" },
        { text: "อายุ", value: "age_name", align: "center" },
        { text: "เพศ", value: "gender", align: "center" },
        { text: "เบอร์โทรศัพท์", value: "number", align: "center" },
        { text: "ประเภทผู้ป่วย", value: "type_patient_name", align: "center" },
        {
          text: "การติดตามการนำส่งผู้ป่วย",
          value: "tracking_name",
          align: "center",
        },
        { text: "ที่อยู่", value: "address", align: "center" },
        { text: "ละติจูด", value: "lati", align: "center" },
        { text: "ลองติจูด", value: "longi", align: "center" },
        { text: "เพิ่มเติม", value: "other", align: "center" },
        { text: "", value: "action", sortable: false, align: "center" },
      ],
      //พิกัดจะให้กดคลิกแล้วให้เป็นหน้า map
      desserts: [],
      items_status: [],
      statusColorMap: {
        งานบริการ: "green",
        ผู้ป่วยติดเตียง: "yellow",
        อื่นๆ: "blue",
      },
      dialog: false,
      dialogTitle: "",
      editedItem: {
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
        service_date: null,
        time: null,
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
    formattedDate() {
      // Parse the Thai date string and subtract 543 years to get the correct year
      const thaiDate = dayjs(this.date, "DD-MM-YYYY");
      // เพิ่ม 543 ปีเพื่อเปลี่ยนเป็นปีไทย
      const thaiYearDate = thaiDate.add(543, "year");
      // กำหนดรูปแบบของวันที่ในรูปแบบ YYYY-MM-DD เพื่อให้สามารถจัดเก็บในฐานข้อมูลได้
      const formattedDate = thaiYearDate.format("YYYY-MM-DD");
      return formattedDate;
    },
  },
  methods: {
    openHistoryDialog(hn) {
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
              hn_id: item.hn_id,
              HN: item.hn,
              อายุ: item.age_name,
              เพศ: item.gender,
              เบอร์โทรศัพท์: item.number,
              ประเภทผู้ป่วย: item.type_patient_name,
              การติดตามการนำส่งผู้ป่วย: item.tracking_name,
              ที่อยู่: item.address,
              ละติจูด: item.lati,
              ลองติจูด: item.longi,
              เพิ่มเติม: item.other,
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
                `${this.endpointUrl}/api/patients/${item.hn_id}`
              );
              await axios.delete(
                this.endpointUrl + `/api/appointments/${item.hn}`
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
    closeDialog() {
      this.dialog = false;
      this.isAppointmentDialogOpen = false;
      this.isHistoryDialogOpen = false;
      this.dialogTitle = "";
      this.editedItem = {};
      this.dialogVisible = false;
    },
    async openAppointmentDialog(item) {
      // Close other dialogs if open
      if (this.dialog || this.isHistoryDialogOpen) {
        this.dialog = false;
        this.isHistoryDialogOpen = false;
      }
      // Fetch status data
      try {
        const { data } = await axios.get(this.endpointUrl + "/api/status");
        this.items_status = data;
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
      // Set editedItem and dialogTitle based on item data
      this.editedItem = { ...item }; // Clone the item to avoid direct mutation
      console.log(item);
      console.log(this.editedItem.age_name);
      this.dialogTitle = "นัดหมายผู้ป่วย";
      // Show the appointment dialog
      this.isAppointmentDialogOpen = true;
    },
    formatDateForMySQL(dateString) {
      // Extract the date parts
      if (!dateString) {
        return null; // Return an empty string if dateString is undefined or null
      }
      const datePart = dateString.split("-");
      // Rearrange the date parts to match MySQL format (YYYY-MM-DD)
      const formattedDate = `${datePart[2]}-${datePart[1]}-${datePart[0]}`;
      return formattedDate;
    },
    getTypeColor(type) {
      return this.statusColorMap[type] || "defaultColor";
    },

    openDialog(action, item = null) {
      // ก่อนเปิด dialog ใหม่ ตรวจสอบสถานะของ dialog อื่น ๆ และปิดทุกตัวที่เปิดอยู่
      if (this.isAppointmentDialogOpen || this.isHistoryDialogOpen) {
        this.isAppointmentDialogOpen = false;
        this.isHistoryDialogOpen = false;
      }

      // เปิด dialog ใหม่
      this.dialogTitle =
        action === "add" ? "จัดการผู้ป่วยใหม่" : "แก้ไขข้อมูลผู้ป่วย";
      this.editedItem = action === "add" ? {} : { ...item };
      this.dialog = true;
    },

    async saveItem(editedItem) {
      try {
        let response;
        const isAddNewPatient = !editedItem.hn_id;
        const isUpdatePatientInfo = editedItem.hn_id && !editedItem.time;
        const isUpdateAppointment = editedItem.hn_id && editedItem.time;

        console.log("isAddNewPatient:", isAddNewPatient);
        console.log("isUpdatePatientInfo:", isUpdatePatientInfo);
        console.log("isUpdateAppointment:", isUpdateAppointment);

        if (isAddNewPatient) {
          // Add new patient
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
              other: editedItem.other,
              service_date: null,
              time: null,
            });

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
          // Update appointment
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
          // Update patient information
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
            this.desserts.push(savedPatient);
          } else {
            const index = this.desserts.findIndex(
              (item) => item.hn_id === savedPatient.hn_id
            );
            this.$set(this.desserts, index, savedPatient);
          }
          this.closeDialog();
        });
        this.desserts = await this.fetchDataFromServer();
      } catch (error) {
        console.error("Error saving item:", error.response || error);

        // Show an error notification
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
              this.endpointUrl + `/api/patients/${item.hn_id}`
            );
            await axios.delete(
              this.endpointUrl + `/api/appointments/${item.hn}`
            );
            if (response.status === 200) {
              // Remove the deleted patient from the local state
              this.desserts = this.desserts.filter((p) => p.hn !== item.hn);
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
        const { data } = await axios.get(
          this.endpointUrl + "/api/patients",
          {}
        );
        console.log("This data Patient", data);
        this.$emit("data-loaded", data);
        this.desserts = data;
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    async fetchDataFromServer() {
      try {
        const { data } = await axios.get(this.endpointUrl + "/api/patients");

        return data;
      } catch (error) {
        console.error("Error fetching data from server:", error);
        throw error; // Propagate the error to the caller
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
