<template>
  <v-app dark>
    <v-container class="error-container" fluid>
      <v-row align="center" justify="center">
        <v-col class="text-center">
          <v-img
            class="whale-image bounce-animation"
            src="whale404.png"
            alt="404 Whale"
            max-width="500"
          ></v-img>
          <h1 class="error-code ">{{ error.statusCode }}</h1>
          <p class="error-message ">
            {{ error.statusCode === 404 ? pageNotFound : otherError }}
          </p>
          <p class="countdown-message">
            จะกลับไปหน้า Dashboard ใน {{ countdown }}...
          </p>

        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: 'ขออภัย ไม่พบหน้าที่คุณต้องการ',
      otherError: 'เกิดข้อผิดพลาดบางอย่าง',
      countdown: 5 // ตั้งเวลาเริ่มต้นที่ 5 วินาที
    };
  },
  mounted() {
    this.startCountdown();
  },
  methods: {
    startCountdown() {
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(interval);
          this.$router.push('/Dashboard'); // เปลี่ยนไปหน้า Dashboard
        }
      }, 1000); // ลดค่าทุก 1 วินาที
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title
    };
  }
};
</script>

<style scoped>
.error-container {
  background-color: #87ceeb;
  text-align: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.whale-image {
  margin-bottom: 20px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #ffffff;
}

.error-message {
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 20px;
}

.countdown-message {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 20px;
}

/* การสร้างเอฟเฟกต์กระเด้ง */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

/* เพิ่มคลาสสำหรับ animation */
.bounce-animation {
  animation: bounce 2s infinite;
}
</style>
