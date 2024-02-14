<template>
    <v-dialog>
        <v-card>
            <v-row class="mt-7" align="center" justify="center">
                <v-col>
                    <v-row align="center" justify="center">
                        <!-- ใช้วนลูปจากการอัพข้อมูลมาจาก data table ให้มาอยู่ในรูปแบบ card -->
                        <v-card v-for="(patient, index) in  " :key="patient.id" outlined style="border-color: #49C8FF;"
                            class="mx-auto rounded-xl my-cards" max-width="344" hover>
                            <v-card-item class="text-uppercase dark--text">
                                <v-card-title class="d-flex justify-center align-center">
                                    {{ patient.title }}
                                </v-card-title>
                                <v-card-subtitle>
                                    hnnumber: {{ patient.hnnumber }}
                                </v-card-subtitle>
                                <v-card-subtitle>
                                    Gender: {{ patient.gender }}
                                </v-card-subtitle>
                                <v-card-subtitle>
                                    Age: {{ patient.age }}
                                </v-card-subtitle>
                                <v-card-subtitle>
                                    PhoneNumber: {{ patient.numberphone }}
                                </v-card-subtitle>
                                <v-card-subtitle>
                                    Coordination: {{ patient.coordinate }}
                                </v-card-subtitle>
                                <v-card-subtitle>
                                    Patient type: {{ patient.status }}
                                </v-card-subtitle>
                                <v-card-subtitle>
                                    AdDress: {{ patient.address }}
                                </v-card-subtitle>
                            </v-card-item>
                            <v-card-actions class="ma-3 justify-center d-flex align-centerg">
                                <v-btn color="#49C8FF" class="rounded-xl white--text">
                                    รับงาน
                                </v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-row>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>