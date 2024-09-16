<template>
  <div class="login-page-container">
    <div class="login-page">
      <h2 class="text-2xl font-bold">Ambulance Service</h2>
      <li><strong>ชื่อผู้ใช้งาน:</strong> testuser</li>
      <li><strong>รหัสผ่าน:</strong> testpass</li>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">รหัสผู้ใช้งาน:</label>
          <input type="text" id="username" v-model="username">
        </div>
        <div class="form-group">
          <label for="password">รหัสผ่าน:</label>
          <input type="password" id="password" v-model="password">
        </div>
        <button type="submit white">เข้าสู่ระบบ</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import '../styles/login.css'; // Import CSS file
import LoginJs from '../scripts/login'

export default LoginJs;
</script>
