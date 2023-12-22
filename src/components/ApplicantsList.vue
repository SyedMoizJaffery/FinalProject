<!-- ApplicantsList.vue -->

<template>
  <div
    class="q-gutter-md q-items-center"
    style="display: flex; justify-content: right; margin-bottom: 10px"
  >
    <q-select
      v-model="selectedStatus"
      :options="statusOptions"
      label="Filter by Status"
      outlined
      dense
      @input="applyFilters"
      style="width: 20ch"
    />

    <!-- <q-btn
      @click="toggleSortOrder"
      color="primary"
      label="Sort by Date"
      icon="sort"
      dense
      style="margin-left: 10px"
    /> -->

    <q-input
      v-model="searchTerm"
      label="Search"
      outlined
      dense
      placeholder="Search..."
      style="margin-left: 10px; width: 30ch"
      @input="applyFilters"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>

  <div
    style="flex-grow: 1; overflow: auto; max-height: 70vh"
    class="custom-scrollbar"
  >
    <q-table
      :rows="applicants"
      :columns="columns"
      row-key="email"
      bordered
      class="shadow-0"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- <q-td key="id" :props="props">
            {{ props.row.name }}
          </q-td> -->
          <q-td key="username" :props="props">
            {{ props.row?.userName }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="dateapplied" :props="props">
            {{ props.row.createdAt }}
          </q-td>
          <q-td key="status" :props="props">
            {{ props.row.status }}
          </q-td>
          <q-td key="action" :props="props">
            <span
              @click="updateApplicant(props.row, 'accepted')"
              style="
                color: green;
                cursor: pointer;
                margin-right: 10px;
                text-decoration: none;
              "
            >
              Accept
            </span>
            <span
              @click="updateApplicant(props.row, 'rejected')"
              style="
                color: red;
                cursor: pointer;
                margin-right: 10px;
                text-decoration: none;
              "
            >
              Reject
            </span>
          </q-td>
          <q-td key="extra" :props="props">
            <span
              @click="viewDetails(props.row)"
              style="
                color: rgb(45, 45, 45);
                cursor: pointer;
                text-decoration: none;
              "
              >View Details</span
            >
          </q-td>
          <q-td key="cv" :props="props">
            <q-icon
              name="cloud_download"
              style="cursor: pointer"
              @click="downloadCv(props.row)"
            ></q-icon>
          </q-td>
        </q-tr>
      </template>
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

  <q-dialog v-model="detailsModalVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6" style="text-align: center">Applicant Details</div>
        <hr
          style="
            border: 0;
            height: 1px;
            background-color: lightgray;
            margin: 10px 0;
          "
        />
      </q-card-section>
      <q-card-section>
        <div
          style="
            display: flex;
            justify-content: center;
            padding: 20px;
            width: 400px;
          "
        >
          <div style="flex-basis: 40%; max-width: 40%">
            <div><strong>Name:</strong></div>
            <div><strong>Email:</strong></div>
            <div><strong>Date Applied:</strong></div>
            <div><strong>Status:</strong></div>
            <div><strong>Qualification:</strong></div>
            <div><strong>CNIC:</strong></div>
            <div><strong>Phone Number:</strong></div>
          </div>

          <div style="flex-basis: 60%; max-width: 60%">
            <div>{{ selectedApplicant.userName }}</div>
            <div>{{ selectedApplicant.email }}</div>
            <div>{{ selectedApplicant.createdAt }}</div>
            <div>{{ selectedApplicant.status }}</div>
            <div>{{ selectedApplicant.qualification }}</div>
            <div>{{ selectedApplicant.cnic }}</div>
            <div>{{ selectedApplicant.phoneNumber }}</div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" @click="closeDetailsModal" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/userStore";
import axios from "axios";
import { format } from "date-fns";
import { HTTP } from "../helper/http-config";
import { Notify } from "quasar";

export default {
  data() {
    return {
      showChatIcon: true,
      showChat: false,
      chatMessages: [],
      newMessage: "",

      detailsModalVisible: false,
      selectedApplicant: {},
      applicantsData: [],
      columns: [
        { name: "username", label: "Name", align: "center", field: "username" },
        { name: "email", label: "Email", align: "center", field: "email" },
        {
          name: "dateapplied",
          label: "Date Applied",
          align: "center",
          field: "dateapplied",
        },
        { name: "status", label: "Status", align: "center", field: "status" },
        { name: "action", label: "Action", align: "center", field: "action" },
        { name: "extra", label: "Extra", align: "center", field: "extra" },
        {
          name: "cv",
          label: "CV",
          align: "center",
          field: "cv",
        },
      ],
      selectedStatus: "",
      statusOptions: ["pending", "accepted", "rejected"],
      searchTerm: "",
      sortOrder: "ascending",
    };
  },
  async mounted() {
    try {
      const response = await HTTP.get("applicant/get-applicants");
      this.applicantsData = response.data.data;
    } catch (error) {
      console.error("Error fetching applicants:", error);
      Notify.create({
          position: "top",
          type: "negative",
          message:error.response.data?.message,
        });
    }
  },

  computed: {
    applicants() {
      return this.applicantsData
        .filter((applicant) => {
          // Filter by status
          if (
            this.selectedStatus &&
            applicant.status.toLowerCase() !== this.selectedStatus.toLowerCase()
          ) {
            return false;
          }
          // Filter by search term
          if (this.searchTerm) {
            const lowerSearchTerm = this.searchTerm.toLowerCase();
            return (
              (applicant.username &&
                applicant.username.toLowerCase().includes(lowerSearchTerm)) ||
              (applicant.email &&
                applicant.email.toLowerCase().includes(lowerSearchTerm))
              // Add other fields if needed
            );
          }
          return true;
        })
        .sort((a, b) => {
          const dateA = new Date(a.dateApplied);
          const dateB = new Date(b.dateApplied);
          return this.sortOrder === "ascending" ? dateA - dateB : dateB - dateA;
        });
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

    downloadCv(applicant) {
      const authStore = useAuthStore();
      const token = authStore.getToken();
      // const url = `download-cv/${applicant.applicantId}`;

      HTTP.get(`applicant/download-cv/${applicant.applicantId}`)
        .then((response) => {
          const fileURL = window.URL.createObjectURL(
            new Blob([response.data], {
              type: response.headers["content-type"],
            })
          );
          const fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", `${applicant.email}.pdf`); // Assuming the CV is a PDF file
          document.body.appendChild(fileLink);

          fileLink.click();

          document.body.removeChild(fileLink);
          window.URL.revokeObjectURL(fileURL);
        })
        .catch((error) => {
          console.error("Error downloading CV:", error);
          // alert("Failed to download CV. Please try again.");
          Notify.create({
          position: "top",
          type: "negative",
          message:error.response.data?.message,
        });
        });
    },
    viewDetails(applicant) {
      this.selectedApplicant = applicant;
      this.detailsModalVisible = true;
    },
    closeDetailsModal() {
      this.detailsModalVisible = false;
    },
    formatDate(dateString) {
      return format(new Date(dateString), "yyyy-MM-dd");
    },
    applyFilters() {
      this.searchTerm = this.searchTerm.trim();
    },
    toggleSortOrder() {
      this.sortOrder =
        this.sortOrder === "ascending" ? "descending" : "ascending";
    },
    async updateApplicant(applicant, status) {
      const authStore = useAuthStore();
      const token = authStore.getToken();

      try {
        await HTTP.patch(
          `applicant/update-applicants/${applicant.applicantId}`,
          { status: status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const index = this.applicantsData.findIndex(
          (a) => a.applicantId === applicant.applicantId
        );
        if (index !== -1) {
          this.applicantsData[index].status = status;
        }
      } catch (error) {
        console.error("Error updating applicant status:", error);
        // alert("Failed to update applicant status. Please try again.");
        Notify.create({
          position: "top",
          type: "negative",
          message:error.response.data?.message,
        });
      }
    },

    showSuccess(message) {},
    showError(message) {},
  },
};
</script>


<style scoped>
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
</style>
  