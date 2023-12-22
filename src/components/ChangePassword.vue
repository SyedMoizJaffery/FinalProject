<!-- ChangePassword.vue -->

<template>
  <div>
    <q-card class="shadow-0">
      <q-card-section>
        <q-avatar
          size="100px"
          color="primary"
          text-color="white"
          class="q-mr-sm"
        >
          <img
            src="..\assets\changepassword.png"
            style="background-color: white"
          />
        </q-avatar>

        <h2 class="text-h6" style="text-align: center">Change Password</h2>

        <p>Enter your current password and a new password</p>

        <q-form
          @submit.prevent="changePassword"
          style="display: grid; justify-content: center"
        >
          <q-input
            v-model="password"
            label="Current Password"
            type="password"
            outlined
            dense
            style="margin-bottom: 10px; max-width: 400px"
          />
          <q-input
            v-model="newPassword"
            label="New Password"
            type="password"
            outlined
            dense
            style="margin-bottom: 10px; width: 300px"
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
import { HTTP } from "../helper/http-config";
import { Notify } from "quasar";

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

          await HTTP.patch(
            "auth/change-password",
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
        //   Notify.create({
        //   position: "top",
        //   type: "positive",
        //   message: response.data?.message,
        // });
        } catch (error) {
          console.error("Error changing password:", error);
          // alert("Failed to change password. Please try again.");
          Notify.create({
          position: "top",
          type: "negative",
          message:error.response.data?.message,
        });
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
