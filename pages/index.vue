<template>
  <div class="login-page-container">
    <div class="login-page">
      <h2>Ambulance PBT</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">รหัสผู้ใช้งาน:</label>
          <input type="text" id="username" v-model="username">
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

export default {
  data() {
    return {
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      username: '',
      error: ''
    };
  },
  methods: {
    async login() {
      this.error = ''; // Reset error message

      // Check if the username field is empty
      if (!this.username) {
        this.error = 'โปรดกรอกรหัสผู้ใช้งาน';
        return;
      }

      try {
        // Encrypt username with CryptoJS
        const secretKey = '1234'; // Define your secret key
        const iv = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
        const encryptedUsername = CryptoJS.AES.encrypt(this.username, secretKey, { iv: iv }).toString();

        // Send request to the server using the encrypted username
        const response = await axios.get(`${this.endpointUrl}/api/admin/${encodeURIComponent(encryptedUsername)}`);

        // Check if user exists in the database
        if (response.data.length > 0) {
          localStorage.setItem('user', JSON.stringify(response.data[0]));  // Store user data in localStorage
          console.warn('เข้าสู่ระบบสำเร็จ');

          // Navigate to /Dashboard
          const redirect = this.$route.query.redirect || '/Dashboard';
          this.$router.push(redirect);

          // Refresh the page once
          setTimeout(() => {
            location.reload();
          }, 100); // Wait for 1 second before reloading

        } else {
          this.error = 'ไม่พบชื่อผู้ใช้งาน';
        }
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
  /* ให้กว้างสุดเท่าที่ทำได้ แต่ไม่เกิน max-width */
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
