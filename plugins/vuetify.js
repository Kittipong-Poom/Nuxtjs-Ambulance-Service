import '@fortawesome/fontawesome-free/css/all.css';
import 'material-design-icons/iconfont/material-icons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa' // Assuming you want to use Font Awesome icons
  },
  theme: {
    dark: true, // Enable dark mode by default
    themes: {
      dark: {
        primary: '#2196F3', // Example primary color for dark mode
        background: '#1E1E1E' // Example background color for dark mode
        // Add more theme colors as needed
      },
      light: {
        primary: '#1976D2', // Example primary color for light mode
        background: '#FFFFFF' // Example background color for light mode
        // Add more theme colors as needed
      }
    }
  }
});