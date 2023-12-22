<!-- AdminDashboard.vue -->

<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar>
        <q-btn
          dense
          flat
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        ></q-btn>

        <span style="margin-left: 4%; font-size: 16px; font-weight: bolder">
          Welcome Admin
        </span>

        <q-space></q-space>

        <q-btn
          flat
          @click="toggleProfileMenu"
          icon="person"
          aria-label="Profile"
        ></q-btn>

        <q-btn flat icon="power_settings_new" @click="logout" label="" />
      </q-toolbar>
    </q-header>

    <q-page-container style="padding: 0px">
      <q-page>
        <q-drawer
          style="background-color: rgb(245, 245, 245)"
          v-model="leftDrawerOpen"
          show-if-above
          side="left"
          :breakpoint="500"
        >
          <q-list
          :key="item.name"
          v-for="item in menuItems">
            <q-item
              clickable
             
              
              :class="{ 'item-selected': isRouteActive(item.route) }"
              @click="navigateTo(item.route)"
            >
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator style="margin-left: 20px; margin-right: 20px;" />
          </q-list>
        </q-drawer>

        <!-- Main content area -->
        <q-page-container>
          <q-page padding>
            <router-view></router-view>
          </q-page>
        </q-page-container>
      </q-page>
    </q-page-container>
  </q-layout>

  <!-- Dialog for Change Password and showing user email -->
  <q-dialog v-model="showProfileDialog">
    <q-card>
      <q-card-section style="margin: 0px; padding: 0px">
        <div class="text-h6" style="text-align: center">Profile</div>
        <div style="margin-top: 0px; margin-left: 16px; margin-bottom: 0px;">
         <strong>Email:</strong>  {{ userEmail }}
        </div>
      </q-card-section>

      <q-card-section style="text-align: center; margin: 0px; padding: 0px">
        <ChangePassword style="margin-top: 0px; padding-top: 0px" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          style="padding-top: 0px"
          flat
          label="Close"
          color="primary"
          @click="showProfileDialog = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>


<script>
import { useAuthStore } from "../stores/auth";
import ChangePassword from "../components/ChangePassword.vue";

export default {
  components: {
    ChangePassword,
  },
  data() {
    return {
      leftDrawerOpen: false,
      showProfileDialog: false,
      userEmail: "Admin123@gmail.com",
      menuItems: [
        { label: "User List", route: "user-list" },
        { label: "Applicants List", route: "applicants-list" },
        { label: "Activity Logs", route: "activity-logs" },
      ],
    };
  },
  computed: {
    firstName() {
      const authStore = useAuthStore();
      return authStore.firstName;
    },
  },
  methods: {
    toggleProfileMenu() {
      this.showProfileDialog = !this.showProfileDialog;
    },
    navigateTo(routeName) {
      this.$router.push(`/admin-dashboard/${routeName}`);
    },
    logout() {
      const authStore = useAuthStore();
      authStore.clearToken();
      this.userEmail = "";
      this.$router.push({ name: "login" });
    },
    isRouteActive(routeName) {
      return this.$route.name === routeName;
    },
  },
  mounted: () => {
    useAuthStore().getToken();
  },
};
</script>

<style scoped>
.item-selected {
  background-color: #c5c5c5;
}
.q-layout-padding {
  padding: 24px;
}

.q-card__section.q-card__section--vert :deep {
  padding-top: 0px;
  margin-top: 0px;
}
</style>
