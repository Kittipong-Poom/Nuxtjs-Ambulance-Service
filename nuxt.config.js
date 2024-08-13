import colors from 'vuetify/es5/util/colors';
const webpack = require('webpack');
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Add serverMiddleware to handle API routes or other server-side logic
  serverMiddleware: [],

  head: {
    titleTemplate: '%s ',
    title: 'Ambulance Project',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/ambulancecar.ico' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.8.12/tailwind-experimental.min.css'}
    ],
    script: [
      { src: 'https://code.jquery.com/jquery-3.4.1.min.js', body: true },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  presets: [
    "@babel/preset-env"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vuetify.js',
    { src: '~/plugins/chart.js', mode: 'client' },
  ],


  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/google-fonts',
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    [
      'nuxt-sweetalert2',
      {
        confirmButtonColor: '#FFFFFF',
      }
    ]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_URL, // Use the environment variable here
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  env: {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.NODE_ENV === 'production' ? process.env.API_URL_PRODUCTION : process.env.API_URL_DEVELOPMENT,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  
  build: {
    extend(config, ctx) {
      // Add a rule to handle .js files inside the vue-chartjs module
      config.module.rules.push({
        test: /\/node_modules\/vue-chartjs.*\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      });
    }
  }  
}
