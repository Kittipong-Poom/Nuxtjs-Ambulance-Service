// store/index.js
export const state = () => ({
    patientCount : 0 // Initialize patient count
  });
  
  export const mutations = {
    incrementPatientCount(state) {
      state.patientCount += 1;
    },
    decrementPatientCount(state) {
      state.patientCount = Math.max(0, state.patientCount - 1);
    },
  };
  