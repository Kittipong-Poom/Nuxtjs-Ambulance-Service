import 'dayjs/locale/th';
import axios from 'axios';
import Swal from 'sweetalert2'
import L from "leaflet";
import "leaflet-control-geocoder";
export default {
  props: {
    dialog: Boolean,
    editedItem: Object,
    dialogTitle: String,
    hideFields: Object,
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV == 'development' ? process.env.API_URL_DEVELOPMENT : 'https://server-nuxtjs-ambulance.onrender.com',
      items_ages: [],
      loading: false,
      items_tracking: [],
      items_type: [],
      hideDatePicker: false,
      mapDialog: false,
      originalCoordinates: {
        lati: null,
        longi: null,
      },
      rules: {
        address: (value) => {
          if (!value) return "กรอกที่อยู่";
          if (value.length < 2) return "ที่อยู่ต้องกรอกให้ชัดเจน";
          return true;
        },
        phone: (value) => {
          if (!value) return "กรอกเบอร์โทรศัพท์";
          if (value.length !== 10) return "กรอกเบอร์โทรศัพท์ให้เป็น 10 ตัว";
          if (!/^\d+$/.test(value)) return "กรอกเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น";
          return true;
        },
        fname_lname: (value) => {
          if (!value) return "กรอกรายชื่อ";
          return true;
        },
        hn: (value) => { // Changed key to match template reference
          if (!value) return "กรอกเลข HN ";
          return true;
        },
        lati: (value) => { // Validate latitude if it exists
          if (!value) return "กรอกละติจูด";
          // Add additional validation logic if needed
          return true;
        },
        longi: (value) => { // Validate longitude if it exists
          if (!value) return "กรอกลองติจูด";
          // Add additional validation logic if needed
          return true;
        }
      },
      searchQuery: "", // สำหรับเก็บข้อความค้นหา
      map: null,
      marker: null,
      geocoder: null,
    };
  },
  created() {
    this.loaddata();
    this.loaddatatraking();
    this.loaddatatype();
  },
  watch: {
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

    async save() {
      try {
        // Validate the form fields
        const isValid = await this.validateForm();
        
        // Validate the phone number
        const phoneField = this.$refs.number;
        phoneField.validate();
    
        if (!isValid || phoneField.hasError) {
          Swal.fire({
            icon: 'warning',
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            text: 'มีข้อมูลที่จำเป็นต้องกรอกแต่ยังไม่ได้กรอก',
          });
          return;
        }
    
        // Check if the phone number has exactly 10 digits
        if (this.editedItem.number.length !== 10) {
          Swal.fire({
            icon: 'warning',
            title: 'กรอกเบอร์โทรศัพท์ไม่ถูกต้อง',
            text: 'กรอกเบอร์โทรศัพท์ให้เป็น 10 ตัว',
          });
          return;
        }
    
        // Save the edited item and close the dialog
        this.$emit('save', this.editedItem);
        this.close();
      } catch (error) {
        console.error('Error saving item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'ไม่สามารถบันทึกข้อมูลได้: ' + (error.response?.data?.message || error.message),
        });
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
    },
    close() {
      // Close the dialog
      this.$emit('close');
    },
    validateForm() {
      let isValid = true;
      for (const key in this.editedItem) {
        const fieldRef = this.$refs[key];
        if (fieldRef && fieldRef.validate) {
          fieldRef.validate();
          if (fieldRef.hasError) {
            isValid = false;
          }
        }
      }
      return isValid;
    },
    async loaddata() {
      const { data } = await axios.get(this.endpointUrl + '/api/ages');
      this.items_ages = data
    },
    async loaddatatraking() {
      const { data } = await axios.get(this.endpointUrl + '/api/tracking_patient');
      this.items_tracking = data
    },
    async loaddatatype() {
      const { data } = await axios.get(this.endpointUrl + '/api/type_patient');
      this.items_type = data
    }
  }
};