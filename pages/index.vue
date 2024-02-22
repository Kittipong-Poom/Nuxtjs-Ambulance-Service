<template>
  <div class="main" :style="mainStyle">
    <h1>ยินดีต้อนรับ</h1>
    <input
      type="text"
      name="username"
      id="username"
      placeholder="รหัสประจำตัว"
      :style="input"
      class="input-field"
    />
    <br />
    <input
      type="password"
      name="password"
      id="password"
      placeholder="รหัสผ่าน"
      :style="input"
      class="input-field"
    />
    <br />
    <input
     type="button"
     value="ยืนยัน"
     class="button"
     id="goToDashboard"
     :style="inputStyle"
    />

    <br />
    
  </div>
</template>

<script>
export default {
  name: "Login",
  //Custom style for main and input for make the page responsive:
  props: {
    mainStyle: String,
    inputStyle: String,
  },
  mounted() {
    // ใช้ mounted() เพื่อรอให้เอกสาร HTML โหลดเสร็จก่อนที่จะเพิ่มการทำงานเมื่อคลิกที่ปุ่ม
    document.getElementById("goToDashboard").addEventListener("click", function() {
      window.location.href = "/dashboard";
    });
  }
};
</script>

<style>
/* Import Poppins font: */
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

/* ปรับสไตล์ของส่วนหลัก (.main) เพื่อกำหนดพื้นหลัง, ขนาด, ตำแหน่ง, และเงา */
.main {
  background: rgba(255, 255, 255, 0.4); /* ปรับสีพื้นหลังให้มีความโปร่งแสง */
  position: absolute;
  top: 20%;
  left: 30%;
  width: 40%;
  text-align: center;
  padding: 5px;
  border-radius: 3rem; /* ทำให้มีรูปร่างโค้งมนของกล่อง */
  box-shadow: 0px 0px 8px -5px #000000; /* เพิ่มเงา */
  padding-top: 3%;
  padding-bottom: 5%;
  font-family: "Poppins", sans-serif;

  border: 2px solid #0da5c7; /* กำหนดสีขอบของ .main */
}

/* ปรับสไตล์ของหัวเรื่อง (h1) เพื่อเพิ่มขนาดและสีข้อความ */
h1 {
  cursor: default; /* ป้องกันการเลือกข้อความ */
  user-select: none; /* ป้องกันการเลือกข้อความ */
}

/* ปรับสไตล์ของ input เพื่อกำหนดขนาด, ขอบ, และพื้นหลัง */
.input-field {
  border-radius: 3rem; /* ทำให้มีรูปร่างโค้งมนของ input */
  border: 2px solid #0da5c7; /* กำหนดสีขอบของ input */
  background-color: white; /* กำหนดสีพื้นหลังของ input */
  padding: 10px;
  text-align: center;
  outline: none;
  margin: 10px;
  width: 30%;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif; /* ใช้แบบอักษร Poppins */
  font-weight: 400;
}

/* ปรับสไตล์ของ input เมื่อ hover หรือ active เพื่อเพิ่มเอฟเฟกต์สำหรับประสบการณ์ใช้งานที่ดีขึ้น */
.input-field:hover {
  border-color: #0da5c7; /* เปลี่ยนสีขอบของ input เมื่อ hover */
}

.input-field:active {
  border-color: #0da5c7; /* เปลี่ยนสีขอบของ input เมื่อ active */
}

/* ปรับสไตล์ของปุ่ม (button) เพื่อกำหนดสีพื้นหลังและข้อความ */
.button {
  cursor: pointer;
  user-select: none; /* ป้องกันการเลือกข้อความ */
  background-color: #0da5c7; /* กำหนดสีพื้นหลังของปุ่ม */
  color: white; /* กำหนดสีของข้อความของปุ่ม */
  padding: 10px 20px; /* ปรับขนาดของปุ่ม */
  border: none; /* ลบเส้นขอบของปุ่ม */
  border-radius: 3rem; /* ทำให้มีรูปร่างโค้งมนของปุ่ม */
}

/* ปรับสไตล์ของปุ่ม เมื่อ hover หรือ active เพื่อเพิ่มเอฟเฟกต์สำหรับประสบการณ์ใช้งานที่ดีขึ้น */
.button:hover {
  background-color: #0a8bac; /* เปลี่ยนสีพื้นหลังของปุ่มเมื่อ hover */
}

.button:active {
  background-color: #0a8bac; /* เปลี่ยนสีพื้นหลังของปุ่มเมื่อ active */
}

img {
  height: 2.2rem;
  margin: 10px;
  user-select: none; /* ป้องกันการเลือกข้อความ */
}

img:hover {
  box-shadow: 0px 0px 8px -5px #000000;
  cursor: pointer;
  border-radius: 200rem;
}
</style>
