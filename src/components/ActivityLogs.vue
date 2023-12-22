<!-- ActivityLogs.vue -->

<template>
  <div>
    <!-- Activity Logs Table -->
    <q-table
      :rows="activityLogs"
      :columns="columns"
      row-key="logNo"
      class="shadow-0"
      bordered
    >
      <template v-slot:pagination="scope">
        <q-btn
          icon="chevron_left"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.prevPage"
        />

        <q-btn
          icon="chevron_right"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.nextPage"
        />
      </template>
    </q-table>

    <!-- Pagination Controls -->
    <div class="q-mt-md">
      <q-btn
        style=""
        :disable="!pagination.hasPrevPage"
        label="Previous"
        bordered
        class="shadow-0"
        @click="changePage(pagination.page - 1)"
      />
      <span style="margin: 10px">
        Page {{ pagination.page }} of {{ pagination.totalPages }}
      </span>
      <q-btn
        :disable="!pagination.hasNextPage"
        label="Next"
        @click="changePage(pagination.page + 1)"
      />
    </div>

    <!-- Chat Icon -->
    <q-btn
      v-if="showChatIcon"
      class="chat-icon"
      color="primary"
      round
      icon="chat"
      @click="toggleChat"
    />

    <!-- Chat Interface -->
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
  </div>
</template>


<script>
import axios from "axios";
import { HTTP } from "../helper/http-config";
import { Notify } from "quasar";

export default {
  data() {
    return {
      showChatIcon: true,
      showChat: false,
      chatMessages: [],
      newMessage: "",
      activityLogs: [],
      columns: [
        {
          name: "logNo",
          required: true,
          label: "Log No",
          align: "left",
          field: "logNo",
          sortable: true,
        },
        {
          name: "name",
          align: "left",
          label: "Name",
          field: "name",
          sortable: true,
        },
        {
          name: "email",
          align: "left",
          label: "Email",
          field: "email",
          sortable: true,
        },
        {
          name: "activity",
          align: "left",
          label: "Activity",
          field: "activity",
          sortable: true,
        },
        {
          name: "createdAt",
          align: "left",
          label: "Created At",
          field: "createdAt",
          sortable: true,
        },
      ],
      pagination: {
        page: 1,
        totalPages: 0,
        limit: 5,
        hasNextPage: false,
        hasPrevPage: false,
        nextLink: "",
        prevLink: "",
      },
    };
  },
  async mounted() {
    await this.loadActivityLogs();
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
    async loadActivityLogs() {
      try {
        const response = await HTTP.get(
          `log/get-logs?page=${this.pagination.page}&limit=${this.pagination.limit}`
        );
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          this.activityLogs = response.data.data[0].data.map((log, index) => ({
            logNo:
              index + 1 + (this.pagination.page - 1) * this.pagination.limit,
            name: log.username,
            email: log.userEmail,
            activity: log.action,
            createdAt: log.createdAt,
          }));
          this.pagination = {
            ...this.pagination,
            ...response.data.data[0].pagination,
          };
        } else {
          this.activityLogs = [];
          this.pagination = {
            ...this.pagination,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          };
        }
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        Notify.create({
          position: "top",
          type: "negative",
          message:error.response.data?.message,
        });
      }
    },
    async changePage(newPage) {
      this.pagination.page = newPage;
      await this.loadActivityLogs();
    },
  },
};
</script>



<style scoped>
.q-btn:before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: #ccc solid 1px;
  border-radius: inherit;
  box-shadow: none;
}

.bordered-btn {
  box-shadow: none !important;
  border: 1px solid #ccc;
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
</style>
