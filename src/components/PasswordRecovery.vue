<!-- PasswordRecovery.vue -->

<template>
  <q-layout>
    <q-page-container>
      <q-page
        style="display: flex; align-items: center; justify-content: center"
      >
        <q-container>
          <div style="width: 350px">
            <q-card class="q-mb-md" style="max-width: 350px; margin: none">
              <q-card-section class="q-pa-md">
                <q-avatar
                  size="100px"
                  color="primary"
                  text-color="white"
                  class="q-mr-sm"
                >
                  <img
                    src="..\assets\forgotpassword.png"
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
                  Trouble logging in?
                </h1>

                <p>
                  Enter your email and we'll send you a link to get back into
                  your account.
                </p>

                <q-form @submit.prevent="sendEmail">
                  <q-input
                    v-model="email"
                    label="Email"
                    outlined
                    dense
                    placeholder="Enter your email"
                  />

                  <q-btn
                    type="submit"
                    label="Send Email"
                    color="primary"
                    class="q-mt-md"
                  />
                </q-form>

                <q-spinner v-if="loading" color="primary" size="40px" />
              </q-card-section>
            </q-card>
          </div>
        </q-container>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "axios";
import { HTTP } from "../helper/http-config";
import { Notify } from "quasar";

export default {
  data() {
    return {
      email: "",
      loading: false,
    };
  },
  methods: {
    async sendEmail() {
      this.loading = true;

      try {
        const response = await HTTP.post("auth/forget-Password/", {
          email: this.email,
        });
        // alert("email sent");
        Notify.create({
          position: "top",
          type: "positive",
          message: response.data?.message,
        });
      } catch (error) {
        console.error("Error in sending email:", error);
        // alert("Failed to send email. Please try again.");
        Notify.create({
          position: "top",
          type: "negative",
          message:error.response.data?.message,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
