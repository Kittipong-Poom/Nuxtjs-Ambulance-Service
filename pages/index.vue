<template>
  <div class="login-page-container">
    <div class="login-page">
      <h2>Ambulance Nanglae</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">รหัสผู้ใช้งาน:</label>
          <input type="text" id="username" v-model="username">
        </div>
        <div class="form-group">
          <label for="password">รหัสผ่าน:</label>
          <input type="password" id="password" v-model="password">
        </div>
        <button type="submit">เข้าสู่ระบบ</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2'; // Import SweetAlert library

export default {
  data() {
    return {
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' :  'http://localhost:5000',
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
        } else {
          this.error = 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
        }
 
        setTimeout(() => {
          location.reload();
        }, 100);

      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
        this.error = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      }
    }
  }
}
</script>

<style scoped>
/* สไตล์ที่ใช้สำหรับหน้าล็อกอิน */
.login-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-page {
  font-family: Arial, sans-serif;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 15px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
  border-radius: 15px;
}

.error {
  background-color: white;
  color: white;
  margin-top: 10px;
  text-align: center;
  padding: 10px;
  border-radius: 15px;
  border: 1px solid red;
}
</style>