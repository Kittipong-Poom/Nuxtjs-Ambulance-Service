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
      endpointUrl: process.env.NODE_ENV === 'development' ? process.env.API_URL_DEVELOPMENT : process.env.API_URL_PRODUCTION,
      appointments: [],
    };
  },
  methods: {
    async fetchAppointments(hn) {
      console.log('Fetching appointments for:', hn);
      try {
        const { data } = await axios.get(`${this.endpointUrl}/api/appointment/${hn}`);
        this.appointments = data;
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    },
    formatDate(date) {
      return dayjs(date).format('DD-MM-YYYY');
    },
    closeDialog() {
      this.$emit('update:dialog', false);
      setTimeout(() => {
        location.reload();
      }, 100);
    },
  },
  mounted() {
    this.fetchAppointments(this.hn);
  },
};