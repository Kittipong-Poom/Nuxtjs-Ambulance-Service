<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      
      <v-spacer />

      <v-row justify="end" align="center">
        <v-col cols="auto">
      <v-btn text to="/" >Home
        <v-icon >mdi-home</v-icon>
      </v-btn>
    </v-col>

    <!-- <v-col cols="auto">
      <v-btn text to="/Patient">About
        <v-icon >mdi-information</v-icon>
      </v-btn>
    </v-col>

    <v-col cols="auto">
      <v-btn text to="/contact">Contact
        <v-icon >mdi-contacts</v-icon>
      </v-btn>
    </v-col> -->

      </v-row>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

  </v-app>
</template>

<script >


export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,


      items: [
        {
          icon: 'mdi-bell-ring',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-map',
          title: 'Map-Service',
          to: '/Apps'
        },
        {
          icon: 'mdi-database',
          title: 'Patient',
          to: '/Patient'
        },
        {
          icon: 'mdi-database',
          title: 'JOB',
          to: '/JOB'
        },
        {
          icon:'mdi-star',
          title:'Dashboard',
          to:'/Dashboard'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Ambulance-Service'
    }
  },
  methods: {

  }
}
</script>
