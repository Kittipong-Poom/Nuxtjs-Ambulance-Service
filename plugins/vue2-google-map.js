import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyALHb17UaIgAO6vsaSCUYPPU4VjnYO3whs',
    libraries: 'places'
  },
})