<template>
    <div>
        <h1 class="head-text">Dashboard Ambulance</h1>
        <v-container class="bg-surface-variant">
            <v-row justify="center">
                <!-- Patient Card 1 -->
                <v-sheet class="pa-12" color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto rounded-xl" height="70" width="225">
                        <v-sheet class="my-box rounded-xl pa-2 d-flex justify-space-between align-center">
                            <div>
                                <div class="font-weight-black">Patient</div>
                                <div class="text-lg-h6 update">{{ $store.state.patientCount }}</div>
                            </div>
                            <v-icon color="#129" size="x-large">mdi-doctor</v-icon>
                        </v-sheet>
                    </v-sheet>
                </v-sheet>
                

                <!-- Patient Card 2 -->
                <v-sheet class="pa-12 " color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto rounded-xl" height="70" width="225">
                        <v-sheet class="my-box rounded-xl pa-2 d-flex justify-space-between align-center">
                            <div>
                                <div>Job</div>
                                <div class="text-lg-h6 update">{{ $store.state.jobsCount }}</div>
                            </div>
                            <v-icon  size="x-large">mdi-account-hard-hat</v-icon>
                        </v-sheet>
                    </v-sheet>
                </v-sheet>

                <!-- Ambulance Car Card -->
                <v-sheet class="pa-12" color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto rounded-xl" height="70" width="225">
                        <v-sheet class="pa-2 rounded-xl d-flex justify-space-between align-center">
                            <div>
                                <div>Ambulance Car</div>
                                <div class="text-lg-h6">NaN</div>
                            </div>
                            <v-icon color="red" size="x-large">mdi-ambulance</v-icon>
                        </v-sheet>
                    </v-sheet>
                </v-sheet>
                <!-- Repeat for other elevations -->
            </v-row>
            <!-- Additional Rows -->        
        </v-container>
        <BarChart />
    </div>
</template>
  
<script>
 import BarChart from '../components/BarChart.vue'
export default {
    components: {
      BarChart
    },
    computed: {
        patientCount() {
            return this.$store.state.patientCount;
        },
    },
};
</script>
  
<style>
.head-text {
    display: flex;
    justify-content: center;
    align-items: center;
}

.img-select {
    width: 70%;
}
</style>
  