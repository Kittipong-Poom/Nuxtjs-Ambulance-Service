import dayjs from 'dayjs';
import axios from 'axios';

export default {
  props: {
    dialog: Boolean,
    hn: String,
    dialogTitle2: String,
  },
  data() {
    return {
      localDialog: this.dialog,
      endpointUrl: process.env.NODE_ENV == 'development' ? process.env.API_URL_DEVELOPMENT : 'https://server-nuxtjs-ambulance.onrender.com',
      appointments: [],
      currentPage: 1,
      itemsPerPage: 4,
    };
  },
  watch: {
    dialog(newValue) {
      this.localDialog = newValue;  // Keep local data in sync with prop
    }
  },
  localDialog(newValue) {
    this.$emit('update:dialog', newValue); // Emit event to update parent prop
  },
  computed: {
    paginatedAppointments() {
      // Sort appointments, placing 'ยกเลิก' at the end
      const sortedAppointments = this.appointments.sort((a, b) => {
        if (a.status_case_id === 'ยกเลิก') return 1; // Move canceled cases to the end
        if (b.status_case_id === 'ยกเลิก') return -1; // Move canceled cases to the end
        return 0; // Preserve original order for other cases
      });
  
      // Paginate appointments
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return sortedAppointments.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.appointments.length / this.itemsPerPage);
    },
    hasMultiplePages() {
      return this.totalPages > 1;
    },
  },
  methods: {

    async fetchAppointments(hn) {
      console.log('Fetching appointments for:', hn);
      
      try {
        const { data } = await axios.get(`${this.endpointUrl}/api/appointment/${hn}`);
       
        this.appointments = data.sort((a, b) => {
          return new Date(a.service_date) - new Date(b.service_date);
        });
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    },
    formatDate(date) {
      return dayjs(date).format('DD-MM-YYYY');
    },
    closeDialog() {
      this.localDialog = false;
      this.$emit('update:dialog', false);
      setTimeout(() => {
        location.reload();
      }, 200);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
  mounted() {
    this.fetchAppointments(this.hn);
  },
};