import dayjs from 'dayjs';
import axios from 'axios';
import Swal from 'sweetalert2';
import L from "leaflet";
import "leaflet-control-geocoder";
export default {
  props: {
    dialog: Boolean,
    editedItem: Object,
    dialogTitle: String,
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV == 'development' ? process.env.API_URL_DEVELOPMENT : 'https://server-nuxtjs-ambulance.onrender.com',
      menu: false,
      loading: false,
      dateString: '',
      timeMenu: false, // Add this line
      hours: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
      minutes: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
      selectedHour: '',
      selectedMinute: '',
      searchQuery: "", // สำหรับเก็บข้อความค้นหา
      map: null,
      marker: null,
      geocoder: null,
      mapDialog: false,
      originalCoordinates: {
        lati: null,
        longi: null,
      },
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
    },
    mapDialog(val) {
      if (val) {
        // เมื่อเปิด Dialog ให้บันทึกค่าต้นฉบับ
        this.originalCoordinates.lati = this.editedItem.lati;
        this.originalCoordinates.longi = this.editedItem.longi;
  
        // เปิด Dialog แล้วต้องสร้างหรือรีเฟรชแผนที่
        this.$nextTick(() => {
          if (!this.map) {
            this.initializeMap();
          } else {
            this.map.invalidateSize(); // รีเฟรชขนาดแผนที่
          }
        });
      }
    },
  },
  methods: {

    initializeMap() {
      this.map = L.map("map").setView([20.046378, 99.876267], 13);
    
      // เพิ่มแผนที่จาก tile server
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);
    
      // กำหนด custom icon
      const customIcon = L.icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    
      // เพิ่ม marker
      this.marker = L.marker([20.046378, 99.876267], {
        draggable: true,
        icon: customIcon,
      }).addTo(this.map);
    
      this.marker.on("dragend", (event) => {
        const { lat, lng } = event.target.getLatLng();
        this.updateCoordinates(lat, lng);
      });
    
      this.map.on("click", (event) => {
        const { lat, lng } = event.latlng;
        this.updateCoordinates(lat, lng);
        this.marker.setLatLng([lat, lng]);
      });
    
      this.geocoder = L.Control.Geocoder.nominatim();
    },
    
    updateCoordinates(lat, lng) {
      this.editedItem.lati = lat.toFixed(6);
      this.editedItem.longi = lng.toFixed(6);
    },
    saveLocation() {
      // กดบันทึกและปิด Dialog
      this.dialog = false;
    },
    searchLocation() {
      if (!this.searchQuery) return;

      // ใช้ geocoder ค้นหาตำแหน่ง
      this.geocoder.geocode(this.searchQuery, (results) => {
        if (results && results.length > 0) {
          const { center } = results[0];
          this.map.setView(center, 15); // ซูมไปยังตำแหน่งที่ค้นหา
          this.marker.setLatLng(center); // ย้าย marker ไปยังตำแหน่งนั้น
          this.updateCoordinates(center.lat, center.lng); // อัปเดตค่าละติจูดและลองจิจูด
        } else {
          alert("ไม่พบสถานที่ที่ค้นหา");
        }
      });
    },

    closeMapDialog() {
      // ย้อนค่าละติจูดและลองจิจูดกลับเป็นค่าต้นฉบับ
      this.editedItem.lati = this.originalCoordinates.lati;
      this.editedItem.longi = this.originalCoordinates.longi;
  
      // ปิด Dialog
      this.mapDialog = false;
    },
    saveLocation() {
      // กดบันทึกและปิด Dialog
      console.log("ตำแหน่งถูกบันทึก:", this.editedItem.lati, this.editedItem.longi);
      this.mapDialog = false;
    },
    close() {
      // ปิดเฉพาะ Dialog หลัก
      this.$emit('close');
    },

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