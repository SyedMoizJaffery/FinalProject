// main.js //

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import axios from 'axios';
import { useAuthStore } from './stores/auth';
import { HTTP } from './helper/http-config';

axios.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.getToken();
  if (token) {
    HTTP.config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

app.use(Quasar, quasarUserOptions).use(router).use(pinia).mount('#app');
