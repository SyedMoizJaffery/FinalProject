<!-- AdminDashboard.vue -->

<template>
  <q-layout>
    <q-page-container style="padding: 0px">
      <q-page>
        <q-drawer show-if-above side="left">
          <q-list>
            <q-item
              clickable
              v-for="item in menuItems"
              :key="item.name"
              @click="navigateTo(item.route)"
            >
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-item clickable @click="logout">
            <q-item-section>
              <q-item-label>Logout</q-item-label>
            </q-item-section>
          </q-item>
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
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { label: "User List", route: "user-list" },
        { label: "Applicants List", route: "applicants-list" },
        { label: "Activity Logs", route: "activity-logs" },
      ],
    };
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    logout() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
</style>
