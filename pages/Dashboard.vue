<template>
  <div>
    <h1 class="head-text">แดชบอร์ด</h1>
    <v-container class="bg-surface-variant">
      <v-row justify="center" align="center">
        <!-- Patient Card 1 -->
        <DepartmentCard />

        <v-col cols="12" class="ma-2 pa-1 text-uppercase text-center" color="grey-lighten-3">
          
            <h2 class="patient align-center head  ">ผู้ป่วย</h2>
          
        </v-col>

        <!-- BarChart -->
        <v-col cols="12" md="6">
          <v-sheet class="pa-12" color="grey-lighten-3">
            <v-sheet :elevation="7" class="mx-auto rounded-xl" height="450" width="500">
              <BarChartPatient :tableData="desserts" />
            </v-sheet>
          </v-sheet>
        </v-col>

        <!-- PieChart -->
        <v-col cols="12" md="6">
          <v-sheet class="pa-12" color="grey-lighten-3">
            <v-sheet :elevation="7" class="mx-auto rounded-xl" height="450" width="450">
              <PieChartPatient />
            </v-sheet>
          </v-sheet>
        </v-col>

        <v-col cols="12">
          <v-sheet class="pa-1 text-uppercase text-center" color="grey-lighten-3">
            <h2 class="patient align-center head  ">คนรับงาน</h2>
          </v-sheet>
        </v-col>

        <!-- LineChart and PieChartJob -->
        <v-row justify="center">
          <!-- LineChart -->
          <v-col cols="12" md="6">
            <v-sheet class="pa-12" color="grey-lighten-3">
              <v-sheet :elevation="7" class="mx-auto rounded-xl" height="450" width="500">
                <LineChartJob />
              </v-sheet>
            </v-sheet>
          </v-col>

          <!-- PieChartJob -->
          <v-col cols="12" md="6">
            <v-sheet class="pa-12" color="grey-lighten-3">
              <v-sheet :elevation="7" class="mx-auto rounded-xl" height="450" width="450">
                <PieChartJob />
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
import PieChartJob from '../components/PieChartJob.vue'
import LineChartJob from '../components/LineChartJob.vue'
import Patient from './Patient.vue'
export default {
  components: {
    BarChartPatient,
    PieChartPatient,
    LineChartJob,
    Patient
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
  background-color: #4f9ac3;
  margin: 0;
  padding: 10px;
  display: inline-block;
  border-radius: 25px;
  color: white;

}
</style>
