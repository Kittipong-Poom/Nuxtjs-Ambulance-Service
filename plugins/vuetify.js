// plugins/vuetify.js
import '@fortawesome/fontawesome-free/css/all.css'
import 'material-design-icons/iconfont/material-icons.css'
import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  // Your Vuetify configuration options here
  icons: {
    iconfont : 'fa' ||'md'
  },
  theme:{
    themes:{
      dark:{
        background:'#f4f5f9'
      }
    }
  }
});
