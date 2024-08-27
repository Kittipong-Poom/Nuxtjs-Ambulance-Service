import dayjs from 'dayjs';
import axios from 'axios';

export default {
  props: {
    dialog: Boolean,
    editedItem: {
      type: Object,
      default: () => ({
        service_date: '',
        time: '',
        lati: '',
        longi: '',
        status_case_id: '',
        hn: '',
        number: '',
        address: '',
      }),
    },
    dialogTitle: String,
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV === 'development' ? process.env.API_URL_DEVELOPMENT : process.env.API_URL_PRODUCTION,
      menu: false,
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
  methods: {
    updateTime() {
      if (this.selectedHour && this.selectedMinute) {
        this.editedItem.time = `${this.selectedHour}:${this.selectedMinute}`;
        this.timeMenu = false; // Close the menu after selecting time
      }
    },
    async save() {
      try {
        if (!this.editedItem.status_case_id) {
          this.$emit('error', 'โปรดเลือกสถานะ');
          return;
        }

        // Convert Thai date back to a format MySQL understands
        const gregorianDate = dayjs(this.editedItem.service_date);
        const buddhistYear = gregorianDate.year() + 543;
        const buddhistDate = gregorianDate.year(buddhistYear).format('YYYY-MM-DD');
        const postData = {
          service_date: buddhistDate,
          time: this.editedItem.time,
          hn: this.editedItem.hn,
          status_case_id: this.editedItem.status_case_id,
          lati: this.editedItem.lati,
          longi: this.editedItem.longi,
          number: this.editedItem.number,
          address: this.editedItem.address,
        };

        const response = await axios.post(`${this.endpointUrl}/api/appointments`, postData);
        this.closeDialog();
        this.$emit('save', response.data);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึก:', error);
      }
    },
    closeDialog() {
      this.$emit('update:dialog', false);
      this.$emit('close-dialog');
    },
  },
  mounted() {
    if (!this.editedItem.status_case_id) {
      this.editedItem.status_case_id = 'รอรับงาน';
    }
  },
};