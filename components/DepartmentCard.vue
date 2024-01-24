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
                                <div>Patient</div>
                                <div class="text-lg-h6 update">{{ $store.state.patientCount }}</div>
                            </div>
                            <img class="img-select" src="patient1.jpg" alt="" style="width: 40%; height: auto;">
                        </v-sheet>
                    </v-sheet>
                </v-sheet>

                <!-- Patient Card 2 -->
                <v-sheet class="pa-12 " color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto rounded-xl" height="70" width="225">
                        <v-sheet class="my-box rounded-xl pa-2 d-flex justify-space-between align-center">
                            <div>
                                <div>Job</div>
                                <div class="text-lg-h6 update">{{ patientCount }}</div>
                            </div>
                            <img class="img-select" src="patient1.jpg" alt="" style="width: 40%; height: auto;">
                        </v-sheet>
                    </v-sheet>
                </v-sheet>

                <!-- Ambulance Car Card -->
                <v-sheet class="pa-12" color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto rounded-xl" height="70" width="225">
                        <v-sheet class="pa-2 rounded-xl d-flex justify-space-between align-center">
                            <div>
                                <div>Ambulance Car</div>
                                <div class="text-lg-h6">{{ ambulanceCarCount }}</div>
                            </div>
                            <img class="img-select" src="patient1.jpg" alt="" style="width: 40%; height: auto;">
                        </v-sheet>
                    </v-sheet>
                </v-sheet>
                <!-- Repeat for other elevations -->
            </v-row>

            <!-- Additional Rows -->
            <v-row justify="center">
                <v-sheet class="pa-12" color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto" height="90" width="225"></v-sheet>
                </v-sheet>

                <v-sheet class="pa-12" color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto" height="90" width="225"></v-sheet>
                </v-sheet>

                <v-sheet class="pa-12" color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto" height="90" width="225"></v-sheet>
                </v-sheet>
                <!-- Repeat for other elevations -->
            </v-row>
        </v-container>
    </div>
</template>
  
<script>
export default {
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
  