<template>
  <v-app>
    <header>
      <nav scroll-behavior="elevate" class="navbar navbar-expand-custom navbar-mainbg">
        <button class="navbar-toggler" :class="{ disabled: isNavbarDisabled }" type="button" @click="toggleNavbar">
          <i class="fas fa-bars text-white"></i>
        </button>
        <div class="collapse navbar-collapse" :class="{ show: isNavbarOpen }" id="navbarSupportedContent">
          <ul class="navbar-nav d-flex w-100">
            <div class="hori-selector">
              <div class="left"></div>
              <div class="right"></div>
            </div>
            <li class="nav-item">
              <router-link class="nav-link" :to="isLoggedIn ? '/Dashboard' : '/'"
                :class="{ 'disabled-link': !isLoggedIn }" @click.prevent="!isLoggedIn && redirectToLogin"><i
                  class="fas fa-chart-bar"></i>Dashboard</router-link>
            </li>
            <li class="nav-item active">
              <router-link class="nav-link" :to="isLoggedIn ? '/Patient' : '/'"
                :class="{ 'disabled-link': !isLoggedIn }" @click.prevent="!isLoggedIn && redirectToLogin"><i
                  class="far fa-address-book"></i>ผู้ป่วยทั่วไป</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="isLoggedIn ? '/QueueJob' : '/'"
                :class="{ 'disabled-link': !isLoggedIn }" @click.prevent="!isLoggedIn && redirectToLogin"><i
                  class="fa-solid fa-users"></i>จัดการคิวงาน</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="isLoggedIn ? '/Calendars' : '/'"
                :class="{ 'disabled-link': !isLoggedIn }" @click.prevent="!isLoggedIn && redirectToLogin"><i
                  class="far fa-calendar-alt"></i>ปฏิทิน</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="isLoggedIn ? '/Queueurgent' : '/'"
                :class="{ 'disabled-link': !isLoggedIn }" @click.prevent="!isLoggedIn && redirectToLogin">
                <i class="fas fa-ambulance"></i>ผู้ป่วยฉุกเฉิน
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <router-link class="nav-link" :to="isLoggedIn ? '/Maps' : '/'" :class="{ 'disabled-link': !isLoggedIn }"
                @click.prevent="!isLoggedIn && redirectToLogin">
                <i class="fas fa-map"></i>แผนที่พิกัดรถฉุกเฉิน
              </router-link>
              <div class="dropdown-menu">
                <router-link class="dropdown-item" :to="isLoggedIn ? '/MapsStaticAppointment' : '/'"
                  :class="{ 'disabled-link': !isLoggedIn }" @click.prevent="!isLoggedIn && redirectToLogin">
                  แผนที่การนัดหมาย
                </router-link>
                <router-link class="dropdown-item" :to="isLoggedIn ? '/MapsStaticUrgent' : '/'"
                  :class="{ 'disabled-link': !isLoggedIn }" @click.prevent="!isLoggedIn && redirectToLogin">
                  แผนที่ฉุกเฉิน
                </router-link>
              </div>
            </li>
            <v-tooltip>
              <template v-slot:activator="{ on, attrs }">
                <button class="ml-auto mt-2 Btn-logout mr-3" v-if="isLoggedIn" @click="logout" icon v-bind="attrs" >
                  <div class="sign"><svg viewBox="0 0 512 512">
                      <path
                        d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z">
                      </path>
                    </svg></div>
                    <div class="text">ออกจากระบบ</div>
                </button>
              </template>
              
            </v-tooltip>
          </ul>
        </div>
      </nav>
    </header>
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import DefaultJs from '../scripts/Default.js';


import '../styles/Default.css'; // Import the CSS file

export default DefaultJs;
</script>
