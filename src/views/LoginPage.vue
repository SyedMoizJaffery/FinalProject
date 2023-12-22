<!-- LoginPage.vue -->

<template>
  <q-layout>
    <q-page-container>
      <q-page
        style="display: flex; align-items: center; justify-content: center"
      >
        <q-container>
          <div style="width: 320px">
            <q-card class="q-mb-md" style="max-width: 300px; margin: none">
              <q-card-section class="q-pa-md">
                <q-avatar
                  size="80px"
                  color="primary"
                  text-color="white"
                  class="q-mr-sm"
                >
                  <img
                    src="..\assets\loginIcon.png"
                    style="background-color: white"
                  />
                </q-avatar>
                <h1
                  class="q-mb-md text-h6"
                  style="
                    font-family: 'Your Custom Font', sans-serif;
                    font-weight: bold;
                  "
                >
                  Login
                </h1>

                <q-form @submit.prevent="login" v-if="!loading">
                  <q-input
                    v-model="email"
                    label="Email"
                    outlined
                    dense
                    placeholder="Enter your email"
                    style="margin-bottom: 10px"
                  />
                  <q-input
                    v-model="password"
                    label="Password"
                    type="password"
                    outlined
                    dense
                    placeholder="Enter your password"
                  />

                  <q-btn
                    type="submit"
                    label="Login"
                    color="primary"
                    class="q-mt-md"
                    push
                    @click="login"
                  />
                </q-form>

                <q-spinner v-if="loading" color="primary" size="40px" />

                <q-btn
                  @click="goToPasswordRecovery"
                  label="Forgot Password?"
                  color="primary"
                  class="q-mt-md"
                  flat
                  style="font-size: 11px"
                />
              </q-card-section>
            </q-card>
          </div>
        </q-container>
      </q-page>
    </q-page-container>
  </q-layout>
  <q-snackbar
    v-model="snackbarVisible"
    :color="snackbarColor"
    :timeout="5000"
    @action="snackbarVisible = false"
  >
    {{ snackbarMessage }}
  </q-snackbar>
</template>
  
<script>
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { HTTP } from "../helper/http-config";
import { Notify } from "quasar";

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      
      snackbarVisible: false,
      snackbarMessage: "",
      snackbarColor: "",
    };
  },
  methods: {
    async login() {
      this.loading = true;

      try {
        const response = await HTTP.post("auth/logIn", {
          email: this.email,
          password: this.password,
        });

        const authStore = useAuthStore();
        authStore.setToken(response.data.data.token);

        console.log(response.data);
        const isAdmin = response.data.data.user.isAdmin;
        console.log(isAdmin);
        if (isAdmin) {
          this.$router.push({ name: "admin-dashboard" });
        } else {
          this.$router.push({ name: "user-dashboard" });
        }
        // Success response
        this.snackbarMessage = "Login successful!";
        this.snackbarColor = "green";
        this.snackbarVisible = true;
        Notify.create({
          position: "top",
          type: "positive",
          message: response.data?.message,
        });
      } catch (error) {
        console.error("Login error:", error);
        Notify.create({
          position: "top",
          type: "negative",
          message:error.response.data?.message,
        });
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        this.snackbarMessage = errorMessage;
        this.snackbarColor = "red";
        this.snackbarVisible = true;
      }

      this.loading = false;
    },
    goToPasswordRecovery() {
      this.$router.push({ name: "password-recovery" });
    },
  },
};
</script>



  
  <style scoped>
</style>
  