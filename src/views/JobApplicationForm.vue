<!-- JobApplicationForm.vue -->

<template>
  <div>
    <div class="job-page">
      <q-card-actions vertical align="center">
        <form @submit.prevent="submitForm" class="job-form">
          <q-avatar
            style="align-self: center"
            size="80px"
            color="primary"
            text-color="white"
            class="q-mr-sm"
          >
            <img src="..\assets\JAF.png" style="background-color: white" />
          </q-avatar>

          <h5 class="job-heading">Enter Complete Information To Apply</h5>
          <div class="q-gutter-sm">
            <div class="input-row">
              <q-input
                bottom-slots
                v-model="username"
                :error="!validationState.username"
                label="Full Name"
                label-color="#537895"
                text-color="#537895"
                :dense="dense"
                input-style="color:black"
                input-class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="person" style="color: #a1a1a1" />
                </template>
                <template v-if="!validationState.username" v-slot:append>
                  <div style="color: red; font-size: 12px"></div>
                </template>
              </q-input>

              <q-input
                bottom-slots
                v-model="email"
                :error="!validationState.email"
                label="Email"
                :dense="dense"
                input-style="color:black"
                input-class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="email" style="color: #a1a1a1" />
                </template>
                <template v-if="!validationState.email" v-slot:append>
                  <div style="color: red; font-size: 12px"></div>
                </template>
              </q-input>
            </div>

            <div class="input-row">
              <q-input
                bottom-slots
                v-model="qualification"
                :error="!validationState.qualification"
                label="Qualification"
                label-color="#537895"
                text-color="#537895"
                :dense="dense"
                input-style="color:black"
                input-class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="school" style="color: #a1a1a1" />
                </template>
                <template v-if="!validationState.qualification" v-slot:append>
                  <div style="color: red; font-size: 12px"></div>
                </template>
              </q-input>

              <q-input
                bottom-slots
                v-model="cnic"
                :error="!validationState.cnic"
                label="CNIC"
                label-color="#537895"
                text-color="#537895"
                :dense="dense"
                input-style="color:black"
                input-class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="address" style="color: #a1a1a1" />
                </template>
                <template v-if="!validationState.cnic" v-slot:append>
                  <div style="color: red; font-size: 12px"></div>
                </template>
              </q-input>
            </div>

            <div class="input-row">
              <q-input
                bottom-slots
                v-model="address"
                :error="!validationState.address"
                label="Address"
                label-color="#537895"
                text-color="#537895"
                :dense="dense"
                input-style="color:black"
                input-class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="house" style="color: #a1a1a1" />
                </template>
                <template v-if="!validationState.address" v-slot:append>
                  <div style="color: red; font-size: 12px"></div>
                </template>
              </q-input>

              <q-input
                bottom-slots
                v-model="phoneNumber"
                :error="!validationState.phoneNumber"
                label="Phone Number"
                label-color="#537895"
                text-color="#537895"
                :dense="dense"
                input-style="color:black"
                input-class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" style="color: #a1a1a1" />
                </template>
                <template v-if="!validationState.phoneNumber" v-slot:append>
                  <div style="color: red; font-size: 12px"></div>
                </template>
              </q-input>
            </div>

            <div class="input-row">
              <q-input
                bottom-slots
                v-model="age"
                :error="!validationState.age"
                label="Age"
                label-color="#537895"
                text-color="#537895"
                :dense="dense"
                input-style="color:black"
                input-class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="Age" style="color: #a1a1a1" />
                </template>
                <template v-if="!validationState.age" v-slot:append>
                  <div style="color: red; font-size: 12px"></div>
                </template>
              </q-input>
              <div class="input-row">
                <q-file
                  v-model="uploadedFiles"
                  label="Upload CV"
                  color="blue-grey-6"
                  flat
                  style="width: 200px"
                />
              </div>
            </div>
          </div>
          <q-btn
            label="Submit"
            type="submit"
            class="q-mt-md q-mb-md numb"
            style="background-color: #0b00a6; color: white; width: 70px"
          />
        </form>

        <q-btn
          v-if="showChatIcon"
          class="chat-icon"
          color="primary"
          round
          icon="chat"
          @click="toggleChat"
        />

        <!-- Chat interface -->
        <div v-if="showChat" class="chat-interface">
          <div class="chat-messages">
            <div
              v-for="(message, index) in chatMessages"
              :key="index"
              :class="`message ${message.sender}`"
            >
              {{ message.text }}
            </div>
          </div>

          <q-input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Type your message..."
            dense
            outlined
            class="chat-input"
            style="margin-top: 10px; border-radius: 10px"
          />
        </div>
      </q-card-actions>
    </div>
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
      username: "",
      email: "",
      qualification: "",
      cnic: "",
      address: "",
      phoneNumber: "",
      age: "",
      uploadedFiles: "",

      showChatIcon: true,
      showChat: false,
      chatMessages: [],
      newMessage: "",

      validationState: {
        username: true,
        email: true,
        qualification: true,
        cnic: true,
        address: true,
        phoneNumber: true,
        age: true,
        uploadedFiles: true,
      },
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      Object.keys(this.validationState).forEach((key) => {
        if (!this[key] || (key === "uploadedFiles" && this[key].length === 0)) {
          this.validationState[key] = false;
          isValid = false;
        } else {
          this.validationState[key] = true;
        }
      });
      return isValid;
    },
    fileAdded(newFiles) {
      this.uploadedFiles = this.uploadedFiles.concat(newFiles);
    },
    fileRemoved(removedFile) {
      this.uploadedFiles = this.uploadedFiles.filter((f) => f !== removedFile);
    },
    async submitForm() {
      console.log({
        CV: this.uploadedFiles,
      });
      const formData = new FormData();

      formData.append("userName", this.username);
      formData.append("email", this.email);
      formData.append("cnic", this.cnic);
      formData.append("address", this.address);
      formData.append("qualification", this.qualification);
      formData.append("age", this.age);
      formData.append("phoneNumber", this.phoneNumber);
      formData.append("file", this.uploadedFiles);

      if (this.validateForm()) {
        try {
          const authStore = useAuthStore();
          const token = authStore.getToken();

          await HTTP.post("applicant/submit-form", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              // Authorization: `Bearer ${token}`,
            },
          });

          // alert("Form submitted successfully!");
        //   Notify.create({
        //   position: "top",
        //   type: "positive",
        //   message: response.data?.message,
        // });

          this.clearForm();
        } catch (error) {
          console.error("Error submitting form:", error);
          Notify.create({
          position: "top",
          type: "negative",
          message:error.response.data?.message,
        });
          // alert("Failed to submit form. Please try again.");
        }
      }
    },

    clearForm() {
      this.username = "";
      this.email = "";
      this.qualification = "";
      this.cnic = "";
      this.address = "";
      this.phoneNumber = "";
      this.age = "";
      this.uploadedFiles = [];
    },
    updateFileName() {
      this.cvFileName = this.cvFile ? this.cvFile.name : "";
    },
    toggleChat() {
      this.showChat = !this.showChat;
    },

    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.chatMessages.push({ text: this.newMessage, sender: "user" });
        this.newMessage = "";

        setTimeout(() => {
          this.chatMessages.push({
            text: "Support reply: Thanks for your message!",
            sender: "support",
          });
        }, 1000);
      }
    },
    goToLoginPage() {},
  },
  mounted() {
    const storedMessages = localStorage.getItem("chatMessages");
    this.chatMessages = storedMessages ? JSON.parse(storedMessages) : [];
  },
};
</script>

<style scoped>
.q-card__actions {
  padding: 0px;
  align-items: center;
}
.job-page {
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  align-content: center;
  justify-content: center;
}
.job-form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  padding: 10px 20px;
  padding-bottom: 0px;
  margin-top: 5px;
  background-color: white;
  border: 1px solid rgb(78, 73, 73);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
.job-heading {
  font-size: small;
  margin-bottom: 5px;
  font-weight: bold;
  color: #0b00a6;
  text-align: center;
}
.input-row {
  display: flex;
  gap: 40px;
}

@media (max-width: 380px) {
  .input-row {
    flex-direction: column;
    gap: 10px;
  }
}
.numb {
  align-self: center;
  margin-top: 10px;
}
.custom-input::placeholder {
  color: white;
}

.chat-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.chat-interface {
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 300px;
  background-color: #ffffff;
  border-top-left-radius: 8px;
  overflow: hidden;
}

.chat-messages {
  background-color: #f5f5f5;
  height: 200px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
}

.message {
  margin-bottom: 5px;
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 70%;
  word-break: break-word;
}

.message.user {
  text-align: right;
  color: green;
  align-self: flex-end;
  background-color: #e1ffe1; /* Light blue background for user messages */
  color: black;
  border-bottom-right-radius: 0;
}

.message.support {
  text-align: left;
  color: green;
  align-self: flex-start;
  background-color: #ccc; /* Light green background for support messages */
  color: black;
  border-bottom-left-radius: 0;
}

.chat-input {
}
</style>
