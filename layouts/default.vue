<template>
  <v-app dark>
    <!-- Navigation Drawer -->
    <v-navigation-drawer color="#1A437B" v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <!-- Main menu items -->
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon :style="{ color: 'white' }">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title :style="{ color: 'white' }">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Dropdown for Maps sub-items -->
        <v-list-group no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title :style="{ color: 'white' }">Maps</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="(subItem, index) in mapsSubItems" :key="index" :to="subItem.to" router exact>
            <v-list-item-content>
              <v-list-item-title :style="{ color: 'white' }">{{ subItem.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
     
    <v-app-bar color="#285CA2" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon 
      :disabled="!created" 
      color="#FFFF" 
      @click.stop="drawer = !drawer" 
    />
      
      <v-btn color="#FFFF" icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn color="#FFFF" icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>

      <v-toolbar-title class="white--text">{{ pageTitle }}</v-toolbar-title>

      <v-spacer />

      <!-- Conditional rendering of logout button -->
      <v-btn v-if="isLoggedIn" @click="logout" icon>
        <v-icon color="#FFFF">mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>


export default {
  created() {
    // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
    if (!localStorage.getItem('user')) {
        // ถ้าไม่มีข้อมูลใน localStorage ให้กลับไปหน้า Login
        this.$router.push('/');
    } else {
        // หากมีข้อมูลใน localStorage ให้เปิดใช้งานปุ่ม
        this.created = true;
    }
  },
  name: 'DefaultLayout',
  data() {
    return {
      desserts: [],
      // notifications: [],
      // showRedBadge: true,
      // notificationsCount: 0,
      showNotifications: false,
      clipped: false,
      drawer: false,
      darkMode: false,
      items: [

        {
          icon: 'mdi-view-dashboard',
          title: 'Dashboard',
          to: '/Dashboard'
        },
        {
          icon: 'mdi-table',
          title: 'จัดการข้อมูลผู้ป่วยทั่วไป',
          to: '/Patient'
        },
        {
          icon: 'mdi-table',
          title: 'ตารางจัดการคิวงาน',
          to: '/QueueJob'
        },
        {
          icon: 'mdi-calendar',
          title: 'ปฏิทินงาน',
          to: '/Calendars'
        },
        {
          icon: 'mdi-doctor',
          title: 'จัดการข้อมูลผู้ป่วยฉุกเฉิน',
          to: '/Queueurgent'
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Ambulance-Service',

    }

  },

  computed: {
    pageTitle() {
      const route = this.$route;
      switch (route.path) {
        case '/Dashboard':
          return 'Dashboard';
        case '/Patient':
          return 'จัดการข้อมูลผู้ป่วยทั่วไป';
        case '/Queueurgent':
          return 'จัดการข้อมูลผู้ป่วยฉุกเฉิน';
        case '/QueueJob':
          return 'ตารางจัดการคิวงาน';
        case '/Calendars':
          return 'ปฏิทินงาน';
        case '/Maps':
          return 'แผนที่พิกัดรถฉุกเฉิน';
        case '/MapsStaticUrgent':
          return 'แผนที่สถิติเคสฉุกเฉิน';
        case '/MapsStaticAppointment':
          return 'แผนที่สถิติเคสนัดรับ';
        default:
          return 'Ambulance-Service';
      }
    },
    mapsSubItems() {
      // Define sub-items for Maps dropdown
      return [
        {
          icon: 'mdi-map',
          title: 'พิกัดของรถฉุกเฉิน',
          to: '/Maps'
        },
        {
          icon: 'mdi-map',
          title: 'แผนที่สถิติเคสฉุกเฉิน',
          to: '/MapsStaticUrgent'
        },
        {
          icon: 'mdi-map',
          title: 'แผนที่สถิติเคสนัดรับ',
          to: '/MapsStaticAppointment'
        }
      ];
    },
    isLoggedIn() {
      return !!localStorage.getItem('user'); // Check if user data exists in localStorage
    }
  },

  methods: {
    logout() {
      localStorage.removeItem('user'); // ลบข้อมูลผู้ใช้จาก localStorage
      this.$router.push('/'); // นำทางไปยังหน้า login
      window.location.reload();
    },
    toggleMode() {
      this.darkMode = !this.darkMode
      this.$vuetify.theme.dark = this.darkMode
    },
    markNotificationsAsRead() {
      // Clear the notifications array
      this.notifications = [];
      // Hide the red badge
      this.showRedBadge = false;
    },

  },
}
</script>

<style scoped>
/* Add hover effect for v-list-item */
.v-list-item:hover,
.v-list-item--active {
  background-color: #3A87E3;
  /* Change to your desired hover color */
  cursor: pointer;
}

/* Add hover effect for v-btn inside v-list-item */
.v-list-item:hover .v-btn,
.v-list-item--active .v-btn {
  color: #3A87E3;
  /* Change to your desired button hover color */
}
</style>