<!-- SetPassword.vue -->

<template>
  <div>
    <q-card style="max-width: 400px; margin: auto">
      <q-card-section>
        <h2 class="text-h6">Set Password</h2>

        <q-form @submit.prevent="setPassword">
          <q-input
            v-model="password"
            label="Set Password"
            type="password"
            outlined
            dense
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
          const response = await axios.post(
            "http://192.168.11.164:3000/api/setpassword",
            {
              password: this.password,
              confirmPassword: this.confirmPassword,
              token: this.route.params.token,
            }
          );

          alert("Password set successfully.");
          this.$router.push({ name: "login" });
        } catch (error) {
          console.error("Error setting password:", error);
          alert("Failed to set password. Please try again.");
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
