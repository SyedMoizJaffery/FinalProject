<!-- UserList.vue -->


<template>
  <div>
    <q-page>
      <q-page-sticky position="top-right">
        <q-btn
          @click="openAddUserModal"
          label="Add User"
          color="primary"
          style="margin: 20px"
        />
      </q-page-sticky>

      <q-dialog v-model="addUserModal" persistent>
        <q-card>
          <q-card-section>
            <q-card-title class="text-h6">Add User</q-card-title>
            <q-form @submit.prevent="addUser">
              <q-input
                v-model="newUser.firstName"
                label="First Name"
                outlined
                dense
              />
              <q-input
                v-model="newUser.lastName"
                label="Last Name"
                outlined
                dense
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
                <q-btn type="submit" label="Add" color="primary" dense />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-table
        style="margin-top: 70px"
        :rows="users"
        :columns="columns"
        row-key="email"
      ></q-table>
    </q-page>
  </div>
</template>
  
  <script>
import axios from "axios";
import { useAuthStore } from "../stores/auth";

export default {
  data() {
    return {
      addUserModal: false,
      newUser: {
        firstName: "",
        lastName: "",
        email: "",
      },
      users: [],
      columns: [
        {
          name: "firstName",
          label: "First Name",
          align: "left",
          field: "firstName",
        },
        {
          name: "lastName",
          label: "Last Name",
          align: "left",
          field: "lastName",
        },
        { name: "email", label: "Email", align: "left", field: "email" },
      ],
    };
  },
  methods: {
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

        const response = await axios.post(
          "http://192.168.11.164:3000/api/createuser",
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

        this.newUser = { firstName: "", lastName: "", email: "" };
        this.addUserModal = false;
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },
    clearForm() {
      this.newUser = { firstName: "", lastName: "", email: "" };
      this.addUserModal = false;
    },
  },
  async created() {
    try {
      const response = await axios.get(
        "http://192.168.11.164:3000/api/getuser/"
      );
      this.users = response.data.data.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },
};
</script>
  
  
  
  <style scoped>
</style>
  