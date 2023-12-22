// stores/auth.js
import { HTTP } from '@/helper/http-config';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    // isAdmin: false,
  }),
  actions: {
    setToken(newToken) {
      this.token = newToken;
      localStorage.setItem('authToken', newToken);
      HTTP.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    },
    clearToken() {
      this.token = null;
      localStorage.removeItem('authToken');
    },
    getToken() {
      HTTP.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      return this.token || localStorage.getItem('authToken');
    },
  },
  persist: true
});
