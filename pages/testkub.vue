<template>
    <div>
      <!-- Content of your page -->
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  
  export default {
    mounted() {
      // Show SweetAlert2 alert when the component is mounted
      this.showAlert();
    },
    methods: {
      showAlert() {
        Swal.fire({
          title: 'Hello!',
          text: 'This is an alert using SweetAlert2.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  </script>
  