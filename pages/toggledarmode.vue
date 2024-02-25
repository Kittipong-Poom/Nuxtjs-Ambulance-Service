<template>
  <div>
    <v-btn @click="toggleNotification">Toggle Notification</v-btn>
    <notifications group="success" />
    <v-badge color="red" overlap>
      <template v-slot:badge>
        <v-icon @click="showNotifications = !showNotifications">mdi-bell </v-icon>
      </template>
      <v-btn @click="showNotifications = !showNotifications">เคสฉุกเฉิน ({{ notifications.length }})</v-btn>
    </v-badge>

    <v-overlay :value="showNotifications" @click="showNotifications = false">
      <v-card>
        <v-card-title>เคสฉุกเฉิน</v-card-title>
        <v-list>
          <v-list-item v-for="(notification, index) in notifications" :key="index">
            <v-list-item-title>{{ notification }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-overlay>
    
  </div>
  
</template>

<script>

export default {
  data() {
    return { 
      showNotifications: false,
      notifications: [],
    };
  }, 
  methods: {
    toggleNotification() {
      this.$notify({
          'group':'success',
          'title':'Hello notify',
          'text':'Event'
        })
      if (this.showNotifications) {
        this.showNotifications = false;
        
      }
      
      else {
        this.notifications.push('มีเคสฉุกเฉิน กรุณารีบไปโดยด่วน:'
          );
      }
    },
    
  },
};
</script>
