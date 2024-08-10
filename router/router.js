import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/pages/Dashboard.vue";
import Patient from "@/pages/Patient.vue";
import QueueJob from "@/pages/QueueJob.vue";
import Calendars from "@/pages/Calendars.vue";
import Queueurgent from "@/pages/Queueurgent.vue";
import Maps from "@/pages/Maps.vue";
import MapsStaticAppointment from "@/pages/MapsStaticAppointment.vue"; // อิมพอร์ตเพิ่ม
import MapsStaticUrgent from "@/pages/MapsStaticUrgent.vue"; // อิมพอร์ตเพิ่ม
import index from "@/pages/index.vue"; // เปลี่ยนจาก components เป็น pages
Vue.use(Router);

export default new Router({
  routes: [
    { path: "/Dashboard", component: Dashboard },
    { path: "/Patient", component: Patient },
    { path: "/QueueJob", component: QueueJob },
    { path: "/Calendars", component: Calendars },
    { path: "/Queueurgent", component: Queueurgent },
    { path: "/Maps", component: Maps },
    { path: "/MapsStaticAppointment", component: MapsStaticAppointment },
    { path: "/MapsStaticUrgent", component: MapsStaticUrgent },
    { path: "/", name: "Index", component: index },
  ],
});
