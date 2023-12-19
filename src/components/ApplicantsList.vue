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
      style="width: 70px"
    />

    <q-btn
      @click="toggleSortOrder"
      color="primary"
      label="Sort by Applying Date"
      icon="sort"
      dense
      style="margin-left: 10px"
    />

    <q-input
      v-model="searchTerm"
      label="Search by Name"
      outlined
      dense
      placeholder="Search..."
      style="margin-left: 10px; width: 15ch"
      @input="applyFilters"
    />
  </div>

  <div>
    <q-table :rows="applicants" :columns="columns" row-key="email">
      <template v-slot:body-cell-status="props">
        <q-td :props="props">{{ props.row.status }}</q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn @click="acceptApplicant(props.row)" color="positive" size="sm">
            Accept
          </q-btn>
          <q-btn @click="rejectApplicant(props.row)" color="negative" size="sm">
            Reject
          </q-btn>
          <q-btn @click="viewDetails(props.row)" color="primary" size="sm"
            >View Details</q-btn
          >
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { useUserStore } from "../stores/userStore";
import axios from "axios";
import { format } from "date-fns";

export default {
  data() {
    return {
      applicantsData: [],
      columns: [
        { name: "username", label: "Name", align: "left", field: "username" },
        { name: "email", label: "Email", align: "left", field: "email" },
        {
          name: "dateApplied",
          label: "Date Applied",
          align: "left",
          field: "dateApplied",
        },
        { name: "status", label: "Status", align: "left", field: "status" },
        { name: "action", label: "Action", align: "left", field: "action" },
      ],
      selectedStatus: "",
      statusOptions: ["Pending", "Accepted", "Rejected"],
      searchTerm: "",
      sortOrder: "ascending",
    };
  },
  async mounted() {
    try {
      const response = await axios.get(
        "http://192.168.11.164:3000/api/get-applicants"
      );
      this.applicantsData = response.data.data.map((user) => ({
        username: user.userName,
        email: user.email,
        dateApplied: format(new Date(), "yyyy-MM-dd"),
        status: "Pending",
      }));
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  },
  computed: {
    applicants() {
      return this.applicantsData
        .filter((applicant) => {
          if (this.selectedStatus && applicant.status !== this.selectedStatus) {
            return false;
          }
          if (
            this.searchTerm &&
            !applicant.username
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase())
          ) {
            return false;
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
    formatDate(dateString) {
      return format(new Date(dateString), "yyyy-MM-dd");
    },
    applyFilters() {},
    toggleSortOrder() {
      this.sortOrder =
        this.sortOrder === "ascending" ? "descending" : "ascending";
    },
    viewDetails(applicant) {
      alert(JSON.stringify(applicant, null, 2));
    },
    acceptApplicant(applicant) {
      this.updateApplicantStatus(applicant, "Accepted");
    },
    rejectApplicant(applicant) {
      this.updateApplicantStatus(applicant, "Rejected");
    },
    updateApplicantStatus(applicant, status) {
      const index = this.applicantsData.findIndex(
        (a) => a.email === applicant.email
      );
      if (index !== -1) {
        this.applicantsData[index].status = status;
      }
    },
  },
};
</script>


<style scoped>
</style>
  