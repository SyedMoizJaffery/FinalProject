<!-- ChangePassword.vue -->

<template>
  <div>
    <q-card>
      <q-card-section>
        <h2 class="text-h6">Change Password</h2>

        <q-form @submit.prevent="changePassword">
          <q-input
            v-model="password"
            label="Current Password"
            type="password"
            outlined
            dense
          />
          <q-input
            v-model="newPassword"
            label="New Password"
            type="password"
            outlined
            dense
          />
          <q-input
            v-model="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            outlined
            dense
          />

          <q-btn
            type="submit"
            label="Change Password"
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

export default {
  data() {
    return {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    };
  },
  methods: {
    async changePassword() {
      if (this.validatePasswords()) {
        try {
          const authStore = useAuthStore();
          const token = authStore.getToken();

          await axios.patch(
            "http://192.168.11.164:3000/api/changepassword",
            {
              password: this.password,
              confirmPassword: this.confirmPassword,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("Password changed successfully!");
        } catch (error) {
          console.error("Error changing password:", error);
          alert("Failed to change password. Please try again.");
        }
      } else {
        alert("Passwords do not match or are invalid. Please try again.");
      }
    },
    validatePasswords() {
      return this.newPassword === this.confirmNewPassword;
    },
  },
};
</script>

<style scoped>
</style>
