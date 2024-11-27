
import Swal from 'sweetalert2'; // Import SweetAlert library

export default {
  data() {
    return {
      endpointUrl: process.env.NODE_ENV === 'development' ? process.env.API_URL_DEVELOPMENT : "https://ambulanceserver-uuhg.onrender.com",
      username: '',
      password: '',
      error: '',
      testUsername: "testuser",
      testPassword: "testpass"
    };
  },

  mounted() {
    console.log('ENV : ' + process.env.NODE_ENV);
  },

  methods: {
    async login() {
      this.error = ''; // Reset error message

      // Use dummy data for testing
      if (this.username === this.testUsername && this.password === this.testPassword) {
        // Simulate a successful login response
        const response = {
          data: {
            success: true,
            token: 'dummy_token',
            user: {
              username: this.testUsername
            }
          }
        };
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.warn('เข้าสู่ระบบสำเร็จ');
        // Display SweetAlert notification
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          showConfirmButton: false,
          timer: 1500 // Close after 1.5 seconds
        });
        const redirect = this.$route.query.redirect || '/Dashboard';
        this.$router.push(redirect);
        setTimeout(() => {
          location.reload();
        }, 300);
      } else {
        this.error = 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
      }
    }
  }
}
