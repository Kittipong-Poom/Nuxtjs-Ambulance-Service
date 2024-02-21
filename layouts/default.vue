<template>
  <v-app dark>
    <v-navigation-drawer color="#1A437B" v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item  v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon :style="{ color: 'white' }">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title :style="{ color: 'white' }">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="#285CA2" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon color="#FFFF" @click.stop="drawer = !drawer" />
      <v-btn color="#FFFF" icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn color="#FFFF" icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>

      <v-spacer />

      <v-row justify="end" align="center">
        <v-col cols="auto">
          <v-btn to="/Dashboard" class="ma-2 white--text" color="#3A87E3">
            <v-icon color="#FFF">mdi-home</v-icon>
            Home
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main>
      
      <v-container fluid>
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
          icon: 'mdi-view-dashboard',
          title: 'แดชบอร์ด',
          to: '/Dashboard'
        },
        {
          icon: 'mdi-table',
          title: 'จัดการข้อมูลผู้ป่วย',
          to: '/Patient'
        },
        {
          icon: 'mdi-table',
          title: 'ตารางจัดการคิวงาน',
          to: '/QueueJob'
        },
        {
          icon: 'mdi-doctor',
          title: 'คิวงานฉุกเฉิน',
          to: '/Queue'
        },
        
        {
          icon: 'mdi-calendar',
          title: 'ปฏิทินงาน',
          to: '/Calendars'
        },
        {
          icon: 'mdi-map',
          title: 'แผนที่',
          to: '/Maps'
        },
        
        
        // {
        //   icon: 'mdi-home-account',
        //   title: 'Welcome',
        //   to: '/'
        // },
        
        
        
        
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Ambulance-Service',

    }
  },
  methods: {

  }
}
</script>

<style scoped>
/* Add hover effect for v-list-item */
.v-list-item:hover,
.v-list-item--active {
  background-color: #3A87E3; /* Change to your desired hover color */
  cursor: pointer;
}

/* Add hover effect for v-btn inside v-list-item */
.v-list-item:hover .v-btn,
.v-list-item--active .v-btn {
  color: #3A87E3; /* Change to your desired button hover color */
}

</style>
