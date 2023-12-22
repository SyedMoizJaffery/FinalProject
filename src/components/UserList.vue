<!-- UserList.vue -->


<template>
  <div class="q-page-container" style="overflow: hidden; height: 80vh">
    <q-page style="display: flex; flex-direction: column; height: 100%">
      <div
        style="display: flex; align-items: center; margin-bottom: 20px"
        class="justify-end"
      >
        <q-btn
          @click="openAddUserModal"
          label="Add User"
          color="primary"
          style="margin-right: 10px"
        />

        <q-input
          v-model="searchTerm"
          label="Search"
          outlined
          dense
          placeholder="Search..."
          style="margin-left: 5px; width: 30ch"
          @input="applyFilters"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <q-dialog v-model="addUserModal" persistent>
        <q-card>
          <q-card-section style="width: 400px">
            <div style="display: flex; justify-content: center">
              <q-avatar
                size="80px"
                color="primary"
                text-color="white"
                class="q-mr-sm"
              >
                <img
                  src="..\assets\Adduser.jpg"
                  style="background-color: white"
                />
              </q-avatar>
            </div>
            <div style="display: flex; justify-content: center;color: gray; margin-top: 20px;">
              <p>A verification email will be sent to the user's email</p>
            </div>

            <q-form @submit.prevent="addUser">
              <q-input
                v-model="newUser.firstName"
                label="First Name"
                outlined
                dense
                style="margin-bottom: 10px"
              />
              <q-input
                v-model="newUser.lastName"
                label="Last Name"
                outlined
                dense
                style="margin-bottom: 10px"
              />
              <q-input
                v-model="newUser.email"
                label="Email"
                outlined
                dense
                type="email"
              />

              <q-card-actions align="right">
                <q-btn
                  label="Cancel"
                  color="primary"
                  flat
                  dense
                  @click="closeAddUserModal"
                />
                <q-btn
                  type="submit"
                  label="Add"
                  color="primary"
                  :disabled="!formIsValid"
                  dense
                />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <div
        style="flex-grow: 1; overflow: auto; max-height: 70vh"
        class="custom-scrollbar"
      >
        <q-table
          :rows="filteredUsers"
          :columns="columns"
          row-key="email"
          bordered
          class="shadow-0"
          virtual-scroll
        ></q-table>
      </div>
    </q-page>
  </div>

  <q-btn
    v-if="showChatIcon"
    class="chat-icon"
    color="primary"
    round
    icon="chat"
    @click="toggleChat"
  />

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

  <!-- Snackbar for success message -->
  <q-banner v-if="showSuccessBanner" class="bg-green-10 text-green">
    User Created Successfully
  </q-banner>

  <!-- Modal for error message -->
  <q-dialog v-model="showErrorModal">
    <q-card>
      <q-card-section>
        <div class="text-h6">Error Creating User</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Close"
          color="primary"
          @click="showErrorModal = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

  
  <script>
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { HTTP } from "../helper/http-config";
import { Notify } from "quasar";

export default {
  data() {
    return {
      showChatIcon: true,
      showChat: false,
      chatMessages: [],
      newMessage: "",

      addUserModal: false,
      showSuccessBanner: false,
      showErrorModal: false,
      searchTerm: "",
      newUser: {
        firstName: "",
        lastName: "",
        email: "",
      },
      isFormValid: false,
      users: [],
      columns: [
        {
          name: "firstName",
          label: "First Name",
          align: "center",
          field: "firstName",
        },
        {
          name: "lastName",
          label: "Last Name",
          align: "center",
          field: "lastName",
        },
        { name: "email", label: "Email", align: "center", field: "email" },
      ],
    };
  },
  computed: {
    formIsValid() {
      return (
        this.newUser.firstName && this.newUser.lastName && this.newUser.email
      );
    },
    filteredUsers() {
      if (!this.searchTerm) {
        return this.users;
      }
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      return this.users.filter((user) =>
        Object.keys(user).some(
          (key) =>
            user[key] &&
            user[key].toString().toLowerCase().includes(lowerSearchTerm)
        )
      );
    },
  },
  methods: {
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

    openAddUserModal() {
      this.addUserModal = true;
    },
    closeAddUserModal() {
      this.addUserModal = false;
    },
    async addUser() {
      try {
        const authStore = useAuthStore();
        const token = authStore.getToken();

        const response = await HTTP.post(
          "auth/create-user",
          {
            firstName: this.newUser.firstName,
            lastName: this.newUser.lastName,
            email: this.newUser.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const createdUser = response.data;
        this.users.push({
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          email: createdUser.email,
        });
        Notify.create({
          position: "top",
          type: "positive",
          message: response.data?.message,
        });

        this.newUser = { firstName: "", lastName: "", email: "" };
        this.addUserModal = false;
      } catch (error) {
        console.error("Error creating user:", error);
        Notify.create({
          position: "top",
          type: "negative",
          message:error.response.data?.message,
        });
      }
    },
    clearForm() {
      this.newUser = { firstName: "", lastName: "", email: "" };
      this.addUserModal = false;
    },
  },
  async created() {
    try {
      const response = await HTTP.get("auth/user/get-user");
      this.users = response.data.data.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      Notify.create({
          position: "top",
          type: "negative",
          message:error.response.data?.message,
        });
    }
  },
};
</script>
  
  
  
  <style scoped>
.q-card__section--vert {
  padding: 24px;
  align-content: center;
  align-items: center;
}

.text-h6 {
  text-align: center;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
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
  background-color: #e1ffe1;
  color: black;
  border-bottom-right-radius: 0;
}

.message.support {
  text-align: left;
  color: green;
  align-self: flex-start;
  background-color: #ccc;
  color: black;
  border-bottom-left-radius: 0;
}

@media (max-width: 380px) {
  .q-card-section {
    width: 280px;
  }
}
</style>
  