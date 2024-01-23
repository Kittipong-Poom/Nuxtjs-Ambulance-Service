<template>
    <div>
        <h1 class="head-text">Dashboard Ambulance</h1>
        <v-container class="bg-surface-variant">
            <v-row justify="center">
                <v-sheet class="pa-12" color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto" height="70" width="225">
                        <v-sheet class="my-box pa-2 d-flex justify-space-between  align-center">
                            <div>
                                <div>Patient</div>
                                <div class="text-lg-h6">8</div>
                            </div>
                            <img class="img-select" src="patient1.jpg" alt="" style="width: 40%; height: auto;">
                        </v-sheet>
                    </v-sheet>
                </v-sheet>

                <v-sheet class="pa-12" color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto" height="70" width="225">
                        <v-sheet class="pa-2 d-flex justify-space-between align-center">
                            <div>
                                
                                <div>JOB</div>
                                <div class="text-lg-h6">8</div>
                            </div>
                            <img class="img-select" src="patient1.jpg" alt="" style="width: 40%; height: auto;">
                        </v-sheet>
                    </v-sheet>
                </v-sheet>

                <v-sheet class="pa-12" color="grey-lighten-3">
                    <v-sheet :elevation="7" class="mx-auto" height="70" width="225">
                        <v-sheet class="pa-2 d-flex justify-space-between align-center">
                            <div>
                                <div>Ambulance</div>
                                <div class="text-lg-h6">8</div>
                            </div>
                            <img class="img-select" src="patient1.jpg" alt="" style="width: 40%; height: auto;">
                        </v-sheet>
                    </v-sheet>
                </v-sheet>
                <!-- Repeat for other elevations -->

            </v-row>
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
  