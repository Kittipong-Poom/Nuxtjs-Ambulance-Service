<template>
  <div>
    <h1 class="head-text">Dashboard</h1>
    <v-container class="bg-surface-variant">
      <v-row justify="center" align="center">
        <!-- Patient Card 1 -->
        <v-col cols="12" class="ma-2 pa-1 text-center">
          <DepartmentCard />
        </v-col>

        <v-col cols="12" class="ma-2 pa-1 text-center">
          <h3 class="patient head">สถิติผู้ป่วย</h3>
        </v-col>

        <!-- Charts Row -->
        <v-row justify="center" align="center" class="pa-4">
          <!-- BarChart -->
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-sheet class="pa-4" color="grey-lighten-3">
              <v-sheet :elevation="7" class="mx-auto rounded-xl" height="550" width="550px">
                <BarChartPatient :tableData="desserts" />
              </v-sheet>
            </v-sheet>
          </v-col>

          <!-- PieChart -->
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-sheet class="pa-4" color="grey-lighten-3">
              <v-sheet :elevation="7" class="mx-auto rounded-xl" height="550" width="550px">
                <PieChartPatient />
              </v-sheet>
            </v-sheet>
          </v-col>
        </v-row>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BarChartPatient from '../components/BarChartPatient.vue'
import PieChartPatient from '../components/PieChartPatient.vue'
export default {
  components: {
    BarChartPatient,
    PieChartPatient,
  },
  data() {
    return {
      desserts: [] // Define the "desserts" property as an empty array or initialize it with data
    };
  },
  created() {
    // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
    if (!localStorage.getItem('user')) {
      // ถ้าไม่มีข้อมูลใน localStorage ให้กลับไปหน้า Login
      this.$router.push('/');
    }
  },
};
</script>

<style>
.head-text {
  display: flex;
  justify-content: center;
  align-items: center;
}

.head {
  font-size: 24px;
  background-color: #4169E1;
  margin: 0;
  padding: 10px;
  display: inline-block;
  border-radius: 25px;
  color: white;

}
</style>