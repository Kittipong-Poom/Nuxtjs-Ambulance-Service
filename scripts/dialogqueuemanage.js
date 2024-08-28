import dayjs from 'dayjs';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  props: {
    dialog: Boolean,
    editedItem: Object,
    dialogTitle: String,
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV === 'development' ? process.env.API_URL_DEVELOPMENT : process.env.API_URL_PRODUCTION,
      menu: false,
      loading: false,
      dateString: '',
      timeMenu: false, // Add this line
      hours: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
      minutes: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
      selectedHour: '',
      selectedMinute: '',
    };
  },
  computed: {
    formattedDate() {
      if (!this.editedItem.service_date) {
        return '';
      }
      const gregorianDate = dayjs(this.editedItem.service_date);
      const buddhistYear = gregorianDate.year() + 543;
      return gregorianDate.year(buddhistYear).format('DD-MM-YYYY');
    },
    timeDisplay() {
      return this.selectedHour && this.selectedMinute
        ? `${this.selectedHour}:${this.selectedMinute}`
        : this.editedItem.time;
    },
  },
  watch: {
    dateString(newDate) {
      if (newDate) {
        const [year, month, day] = newDate.split('-').map(Number);
        const gregorianYear = year - 543;  // Convert Buddhist year to Gregorian year
        this.editedItem.service_date = dayjs(new Date(gregorianYear, month - 1, day)).toISOString();
      }
    }
  },
  methods: {
    updateTime() {
      if (this.selectedHour && this.selectedMinute) {
        this.editedItem.time = `${this.selectedHour}:${this.selectedMinute}`;
        this.timeMenu = false; // Close the menu after selecting time
      }
    },
    updateHour() {
      this.updateTime(); // Optional: Call updateTime if you want to update time immediately when the hour is changed
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
    },
    async fetchAppointmentDate() {
      try {
        const response = await axios.get(`${this.endpointUrl}/api/appointment/${this.editedItem.hn}`);
        if (response.data && response.data.service_date) {
          this.dateString = response.data.service_date;
          this.editedItem.service_date = response.data.service_date;
        }
      } catch (error) {
        console.error('Error fetching appointment date:', error);
      }
    },
    async save() {
      try {
        // Convert Gregorian date to Buddhist date for storage
        const gregorianDate = dayjs(this.editedItem.service_date);
        const buddhistYear = gregorianDate.year() + 543;
        const buddhistDate = gregorianDate.year(buddhistYear).format('YYYY-MM-DD');
        console.log('Date check', buddhistDate)
        const response = await axios.put(`${this.endpointUrl}/api/appointments/${this.editedItem.id}`, { ...this.editedItem, service_date: buddhistDate });
  
        this.editedItem.status_case_id = response.data.status_case_id;
  
        this.$emit('update-success');
        this.closeDialog();
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'แก้ไขข้อมูลนัดหมายสำเร็จ',
        });
      } catch (error) {
        console.error('Error saving appointment:', error);
        alert('เกิดข้อผิดพลาดในการนัดหมาย.');
      }
    },
    closeDialog() {
      this.$emit('close-dialog');
    }
  }
};