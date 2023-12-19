<!-- JobApplicationForm.vue -->

<template>
  <div>
    <div class="job-page">
      <q-card-actions vertical align="center">
        <form @submit.prevent="submitForm" class="job-form">
          
          <h5 class="job-heading">Enter Complete Information To Apply</h5>
          <div class="q-gutter-sm">
            <div class="input-row">
              <q-input
                bottom-slots
                v-model="username"
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
              </q-input>
              <q-input
                bottom-slots
                v-model="email"
                label="Email"
                :dense="dense"
                input-style="color:black"
                input-class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="email" style="color: #a1a1a1" />
                </template>
              </q-input>
            </div>
            <div class="input-row">
              <q-input
                bottom-slots
                v-model="qualification"
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
              </q-input>
              <q-input
                bottom-slots
                v-model="cnic"
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
              </q-input>
            </div>
            <div class="input-row">
              <q-input
                bottom-slots
                v-model="address"
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
              </q-input>
              <q-input
                bottom-slots
                v-model="phoneNumber"
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
              </q-input>
            </div>
            <div class="input-row">
              <q-input
                bottom-slots
                v-model="age"
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
              </q-input>
              <div class="input-row">
                <!-- CV Upload -->
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
              class="message"
            >
              {{ message }}
            </div>
          </div>

          <q-input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Type your message..."
            dense
            outlined
            class="chat-input"
          />
        </div>
      </q-card-actions>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "../stores/auth";

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
    };
  },
  methods: {
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
      formData.append("name", "value");
      formData.append("userName", this.username);
      formData.append("email", this.email);
      formData.append("cnic", this.cnic);
      formData.append("address", this.address);
      formData.append("qualification", this.qualification);
      formData.append("age", this.age);
      formData.append("phoneNumber", this.phoneNumber);
      formData.append("cv", this.uploadedFiles);

      if (this.validateForm()) {
        try {
          const authStore = useAuthStore();
          const token = authStore.getToken();

          await axios.post(
            "http://192.168.11.164:3000/api/submit-form",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("Form submitted successfully!");
          this.clearForm();
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("Failed to submit form. Please try again.");
        }
      }
    },
    validateForm() {
      // Implement your form validation logic here
      return (
        this.username &&
        this.email &&
        this.qualification &&
        this.cnic &&
        this.address &&
        this.phoneNumber &&
        this.age
      );
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
    goToLoginPage() {},
  },
  mounted() {
    const storedMessages = localStorage.getItem("chatMessages");
    this.chatMessages = storedMessages ? JSON.parse(storedMessages) : [];
  },
};
</script>

<style scoped>
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
  padding: 10px 20px;
  margin-top: 10px;
  background-color: white;
  border: 1px solid rgb(78, 73, 73);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-height: 700px;
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
.imag {
  width: 270px;
  height: 320px;
  margin-left: 21%;
  margin-bottom: -110px;
  margin-top: -35px;
}
@media (max-width: 380px) {
  .imag {
    margin-left: auto;
    margin-right: auto;
  }
  .input-row {
    flex-direction: column;
    gap: 10px;
  }
}
.numb {
  margin-top: -5px;
  margin-left: 39%;
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
  bottom: 20px;
  right: 20px;
  width: 300px;
  background-color: #ffffff;
  border-top-left-radius: 8px;
  box-shadow: -5px -5px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-messages {
  background-color: #ccc;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin-bottom: 5px;
}

.chat-input {
  border-top: 1px solid #ccc;
}
</style>
