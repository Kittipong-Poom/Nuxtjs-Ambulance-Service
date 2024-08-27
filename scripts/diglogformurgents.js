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
      timeMenu: false,
      hours: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
      minutes: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
      selectedHour: '',
      selectedMinute: '',
      loading: false,
      snackbar: {
        show: false,
        timeout: 3000,
        color: '',
        message: ''
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
    },
    timeDisplay() {
      return this.selectedHour && this.selectedMinute
        ? `${this.selectedHour}:${this.selectedMinute}`
        : this.editedItem.time || this.formattedTime;
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
          return 'grey';
        default:
          return 'default-color';
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
        if (key === 'eventnum') {
          if (this.editedItem[key].length !== 12) {
            return false;
          }
        } else {
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
    updateHour(hour) {
      this.selectedHour = hour;
      this.updateTime();
    },
    updateMinute(minute) {
      this.selectedMinute = minute;
      this.updateTime();
    },
    updateTime() {
      if (this.selectedHour && this.selectedMinute) {
        this.formattedTime = `${this.selectedHour}:${this.selectedMinute}`;
        this.timeMenu = false; // Close the menu after updating time
      }
    },
    formatDateForPicker(selectedDate) {
      const today = new Date(selectedDate);
      const selected = new Date(selectedDate);

      if (selected >= today) {
        return selected;
      } else {
        return today;
      }
    },
    async getCurrentLocation() {
      this.loading = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const position = await this.askForLocationPermission();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
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
        this.snackbar = {
          show: true,
          color: 'error',
          message: 'เกิดข้อผิดพลาดในการดึงตำแหน่ง'
        };
      } finally {
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
    setInterval(this.updateTime, 60000);
    this.updateTime();
  },
};