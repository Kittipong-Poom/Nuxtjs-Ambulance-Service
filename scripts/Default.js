export default {
  data() {
    return {
      isNavbarOpen: false,
      navItems: [
        { title: 'Dashboard', link: '/Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'ผู้ป่วยทั่วไป', link: '/Patient', icon: 'mdi-account-group' },
        { title: 'จัดการคิวงาน', link: '/QueueJob', icon: 'mdi-account-clock' },
        { title: 'ปฏิทิน', link: '/Calendars', icon: 'mdi-calendar' },
        { title: 'ผู้ป่วยฉุกเฉิน', link: '/Queueurgent', icon: 'mdi-alert' },
        { title: 'แผนที่พิกัดรถฉุกเฉิน', link: '/Maps', icon: 'mdi-map' }
      ]
    };
  },
  created() {
    // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
    if (!localStorage.getItem("user")) {
      // ถ้าไม่มีข้อมูลใน localStorage ให้กลับไปหน้า Login
      this.$router.push("/");
    } else {
      // หากมีข้อมูลใน localStorage ให้เปิดใช้งานปุ่ม
      this.created = true;
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("user"); // Check if user data exists in localStorage
    },
    isNavbarDisabled() {
      return !this.isLoggedIn; // Disable navbar if not logged in
    },
  },

  methods: {
    logout() {
      localStorage.removeItem("user"); // ลบข้อมูลผู้ใช้จาก localStorage
      this.$router.push("/"); // นำทางไปยังหน้า login
      setTimeout(() => {
        location.reload();
      }, 300);
    },
    redirectToLogin() {
      this.$router.push("/");
    },

    toggleNavbar() {
      if (!this.isNavbarDisabled) {
        this.isNavbarOpen = !this.isNavbarOpen;
      }
    },
    initNavbar() {
      const test = () => {
        const tabsNewAnim = $("#navbarSupportedContent");
        const activeItemNewAnim = tabsNewAnim.find(".active");
        const activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
        const activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
        const itemPosNewAnimTop = activeItemNewAnim.position();
        const itemPosNewAnimLeft = activeItemNewAnim.position();
        $(".hori-selector").css({
          top: itemPosNewAnimTop.top + "px",
          left: itemPosNewAnimLeft.left + "px",
          height: activeWidthNewAnimHeight + "px",
          width: activeWidthNewAnimWidth + "px",
        });

        // Add condition to disable interaction if not logged in
        if (this.isLoggedIn) {
          $("#navbarSupportedContent").on("click", "li", function (e) {
            $("#navbarSupportedContent ul li").removeClass("active");
            $(this).addClass("active");
            const activeWidthNewAnimHeight = $(this).innerHeight();
            const activeWidthNewAnimWidth = $(this).innerWidth();
            const itemPosNewAnimTop = $(this).position();
            const itemPosNewAnimLeft = $(this).position();
            $(".hori-selector").css({
              top: itemPosNewAnimTop.top + "px",
              left: itemPosNewAnimLeft.left + "px",
              height: activeWidthNewAnimHeight + "px",
              width: activeWidthNewAnimWidth + "px",
            });
          });
        } else {
          // If not logged in, disable pointer events and add a warning
          $(".navbar-nav").css("pointer-events", "none");
          $(".hori-selector").css("background-color", "white");
        }
      };

      $(document).ready(function () {
        setTimeout(function () {
          test();
        });
      });

      $(window).on("resize", function () {
        setTimeout(function () {
          test();
        }, 500);
      });

      $(".navbar-toggler").click(function () {
        $(".navbar-collapse").slideToggle(300);
        setTimeout(function () {
          test();
        });
      });

      const path = window.location.pathname.split("/").pop();
      const target = $('#navbarSupportedContent ul li a[href="' + path + '"]');
      target.parent().addClass("active");
    },
  },
  mounted() {
    this.initNavbar();
  },
};
