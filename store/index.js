// store/index.js
export const state = () => ({
    patientCount : 0, // Initialize patient count
    jobsCount : 0
  });
  
  export const mutations = {
    incrementPatientCount(state) {
      state.patientCount += 1;
    },
    decrementPatientCount(state) {
      state.patientCount = Math.max(0, state.patientCount - 1);
    },
    incrementJobsCount(state) {
      state.jobsCount += 1;
    },
    decrementJobsCount(state) {
      state.jobsCount = Math.max(0, state.jobsCount - 1);
    },
  };
  