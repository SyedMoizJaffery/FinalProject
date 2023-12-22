<!-- UserDashboard.vue -->

<template>
  <q-layout>
    <q-header style="margin-bottom: 20px">
      <q-toolbar>
        <q-btn
          dense
          flat
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        ></q-btn>

        <span style="margin-left: 4%; font-size: 16px; font-weight: bolder">
          Welcome User
        </span>

        <q-space></q-space>

        <q-btn flat icon="power_settings_new" @click="logout" label="" />
      </q-toolbar>
    </q-header>

    <q-drawer
      style="background-color: rgb(245, 245, 245)"
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
    >
      <q-list>
        <q-item
          clickable
          v-for="item in menuItems"
          :key="item.name"
          :class="{ 'item-selected': isRouteActive(item.route) }"
          @click="navigateTo(item.route)"
        >
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Main content area -->
    <q-page-container>
      <q-page style="margin: 10px">
        <router-view></router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import ApplicantsList from "../components/ApplicantsList.vue";
import ChangePassword from "../components/ChangePassword.vue";

export default {
  components: {},
  data() {
    return {
      leftDrawerOpen: false,
      menuItems: [
        { label: "Applicants List", route: "applicants-list" },
        { label: "Change Password", route: "change-password" },
      ],
      selectedComponent: "ApplicantsList",
    };
  },
  methods: {
    isRouteActive(routeName) {
      console.log(
        "Current route:",
        this.$route.name,
        "Menu item route:",
        routeName
      );
      return this.$route.name === routeName;
    },
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    logout() {
      this.$router.push({ name: "login" });
    },
  },
  mounted: () => {
    useAuthStore().getToken();
  },
};
</script>

<style scoped>
.q-card__section--vert {
  padding: 0px;
}
</style>
