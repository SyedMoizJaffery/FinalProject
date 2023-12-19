<!-- PasswordRecovery.vue -->

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
                <h1
                  class="q-mb-md text-h6"
                  style="
                    font-family: 'Your Custom Font', sans-serif;
                    font-weight: bold;
                  "
                >
                  Password Recovery
                </h1>

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
        const response = await axios.post(
          "http://192.168.11.164:3000/api/forgetpassword",
          {
            email: this.email,
          }
        );
        alert("email sent");
      } catch (error) {
        console.error("Error in sending email:", error);
        alert("Failed to send email. Please try again.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
