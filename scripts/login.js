import axios from 'axios';
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2'; // Import SweetAlert library

export default {
  data() {
    return {
      endpointUrl: process.env.NODE_ENV === 'development' ? process.env.API_URL_DEVELOPMENT : process.env.API_URL_PRODUCTION,
      username: '',
      password: '',
      error: '',

    };
  },

  mounted(){
    console.log('ENV : '+ process.env.NODE_ENV)
  },
  methods: {
    async login() {
      
      this.error = ''; // Reset error message

      if (!this.username || !this.password) {
        this.error = 'โปรดกรอกรหัสผู้ใช้งานและรหัสผ่าน';
        return;
      }

      try {
        const salt = '$PBT$Lnwza_005#056%101*';
        const saltedPassword = this.password + salt;
        const hashedUsername = CryptoJS.SHA512(this.username).toString();
        const hashedPassword = CryptoJS.SHA512(saltedPassword).toString();
        console.log('ENV : '+ process.env.NODE_ENV)
        const response = await axios.get(`${this.endpointUrl}/api/admin/login`, {
          params: {
            
            username: hashedUsername,
            password: hashedPassword
          }
          
        });

        if (response.data.success) {
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
 
        

      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
        this.error = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      }
    }
  }
}