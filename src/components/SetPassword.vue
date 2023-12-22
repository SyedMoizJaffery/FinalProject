<!-- SetPassword.vue -->

<template>
  <div class="">
    <q-card
      style="
        max-width: 400px;
        height: 80vh;
        width: 40vw;
        margin-top: 10vh;
        margin-left: 35vw;
      "
    >
      <q-card-section>
        <q-avatar
          size="80px"
          color="primary"
          text-color="white"
          class="q-mr-sm"
        >
          <img
            src="..\assets\setPassword.png"
            style="background-color: white"
          />
        </q-avatar>

        <h2 class="text-h6">Set Your Password</h2>

        <q-form @submit.prevent="setPassword">
          <p>Enter a password and then confirm the password</p>
          <q-input
            v-model="password"
            label="Set Password"
            type="password"
            outlined
            dense
            style="margin-bottom: 10px"
          />
          <q-input
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            outlined
            dense
          />

          <q-btn
            type="submit"
            label="Set Password"
            color="primary"
            class="q-mt-md"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { useRoute } from "vue-router";
import { HTTP } from "../helper/http-config";
import { Notify } from "quasar";

export default {
  data() {
    const route = useRoute();

    return {
      password: "",
      confirmPassword: "",
      route,
    };
  },
  methods: {
    async setPassword() {
      if (this.password === this.confirmPassword) {
        try {
          console.log(this.route.params);
          const response = await HTTP.post(
            `auth/set-password/${this.route.params.token}`,
            {
              password: this.password,
              confirmPassword: this.confirmPassword,
            }
          );
          Notify.create({
          position: "top",
          type: "positive",
          message: response.data?.message,
        });
          // alert("Password set successfully.");
          this.$router.push({ name: "login" });
        } catch (error) {
          console.error("Error setting password:", error);
          Notify.create({
          position: "top",
          type: "negative",
          message:error.response.data?.message,
        });
          // alert("Failed to set password. Please try again.");
        }
      } else {
        alert("Passwords do not match. Please try again.");
      }
    },
  },
};
</script>



<style scoped>
</style>
