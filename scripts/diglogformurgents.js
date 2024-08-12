import dayjs from 'dayjs';
import 'dayjs/locale/th';
export default {
  props: {
    dialog: Boolean,
    editedItem: Object,
    dialogTitle1: String,
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      formattedTime: dayjs().format('HH:mm'),
      loading: false,
      snackbar: {
        show: false,
        timeout: 3000, // Adjust timeout as needed
        color: '', // Color for snackbar
        message: '' // Message to display in snackbar
      },
      rules: {
        number: (value) => {
          if (!value) return "กรอกเลขออกเหตุ";
          if (value.length !== 12) return "กรอกเลขออกเหตุให้ครบ 12 ตัว";
          if (!/^\d+$/.test(value)) return "กรอกเลขออกเหตุให้ครบเป็นตัวเลขเท่านั้น";
          return true;
        },
        age: (value) => {
          if (!value) return "กรุณาเลือกอายุให้ถูกต้อง";
          return true;
        },
        gender: (value) => {
          if (!value) return "กรุณาเลือกเพศ";
          return true;
        },
        violence: (value) => {
          if (!value) return "กรุณาเลือกความรุนแรงของประเภทผู้ป่วย";
          return true;
        },
        status: (value) => {
          if (!value) return "กรุณาเลือกประเภทผู้ป่วย";
          return true;
        },
        grouper: (value) => {
          if (!value) return "ต้องเลือกกลุ่มอาการฉุกเฉิน";
          return true;
        },
        delivery: (value) => {
          if (!value) return "ต้องเลือกการติดตามการนำส่งผู้ป่วย";
          return true;
        },
        emergency_group: (value) => {
          if (!value) return "ต้องเลือกกลุ่มอาการฉุกเฉิน";
          return true;
        }
      },
    };
  },
  computed: {
    formattedDate() {
      const thaiDate = dayjs(this.date).add(543, 'year');
      const thaiFormattedDate = thaiDate.format('DD-MM-YYYY');
      return thaiFormattedDate;
    }
  },
  methods: {
    getChipColor(item) {
      switch (item) {
        case 'ผู้ป่วยฉุกเฉินเร่งด่วน':
          return 'yellow';
        case 'ผู้ป่วยไม่ฉุกเฉิน':
          return 'green';
        case 'ผู้ป่วยฉุกเฉินวิกฤติ':
          return 'red';
        case 'ผู้ป่วยทั่วไป':
          return 'grey'; // or any other color you prefer
        default:
          return 'default-color'; // set a default color if needed
      }
    },
    async save() {
      try {
        if (this.validateForm()) {
          this.editedItem.service_date = this.formattedDate;
          this.editedItem.time = this.formattedTime; // Set the time to the formatted time
          this.$emit('save', this.editedItem);
          this.close();
        }
      } catch (error) {
        console.error('Error saving item:', error);
      }
    },
    close() {
      this.$emit('close');
    },
    validateForm() {
      for (const key in this.editedItem) {
        if (key === 'eventnum') { // Check if the field is 'eventnum'
          if (this.editedItem[key].length !== 12) {
            return false; // Return false if length is not 12
          }
        } else { // For other fields, validate as before
          const fieldRef = this.$refs[key];
          if (fieldRef && fieldRef.validate) {
            fieldRef.validate();
            if (fieldRef.hasError) {
              return false;
            }
          }
        }
      }
      return true;
    },
    updateTime() {
      this.formattedTime = dayjs().format('HH:mm');
    },
    formatDateForPicker(selectedDate) {
      const today = new Date(selectedDate);
      const selected = new Date(selectedDate);

      // Check if the selected date is today or in the future
      if (selected >= today) {
        return selected;
      } else {
        // If selected date is in the past, return today's date
        return today;
      }
    },
    async getCurrentLocation() {
      this.loading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        // ขอความอนุญาตให้เข้าถึงตำแหน่งปัจจุบันของผู้ใช้
        const position = await this.askForLocationPermission();
        // อ่านค่า Latitude และ Longitude จากตำแหน่งปัจจุบัน
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // กำหนดค่า Latitude และ Longitude ให้กับตัวแปร editedItem
        this.editedItem.lati = latitude;
        this.editedItem.longi = longitude;
        this.$forceUpdate();

        this.snackbar = {
          show: true,
          color: 'success',
          message: 'ดึงตำแหน่งปัจจุบันเสร็จสิ้น'
        };
      } catch (error) {
        console.error('Error getting current location:', error);
        // Update snackbar to show error message
        this.snackbar = {
          show: true,
          color: 'error',
          message: 'เกิดข้อผิดพลาดในการดึงตำแหน่ง'
        };
      } finally {
        // Reset loading state
        this.loading = false;
      }
    },
    askForLocationPermission() {
      return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
          reject(new Error('Geolocation is not supported by this browser.'));
        }
      });
    }
  },
  created() {
    // Update the time every minute
    setInterval(this.updateTime, 60000);
    // Initial update
    this.updateTime();
  },
};