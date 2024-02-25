// store/notifications.js
export const state = () => ({
    notifications: []
  });
  
  export const mutations = {
    addNotification(state, notification) {
      state.notifications.push(notification);
    }
  };
  
  export const actions = {
    addNotification({ commit }, notification) {
      commit('addNotification', notification);
    }
  };
  