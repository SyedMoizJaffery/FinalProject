// stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
  }),
  actions: {
    setToken(newToken) {
      this.token = newToken;
      localStorage.setItem('authToken', newToken);
    },
    clearToken() {
      this.token = null;
      localStorage.removeItem('authToken');
    },
    getToken() {
      return this.token || localStorage.getItem('authToken');
    },
  },
});
