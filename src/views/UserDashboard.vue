<!-- UserDashboard.vue -->

<template>
  <q-layout>
    <q-page-container style="padding: 0px">
      <q-page>
        <!-- Left-side navigation menu -->
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
            <q-card>
              <q-card-section>
                <component :is="selectedComponent"></component>
              </q-card-section>
            </q-card>
          </q-page>
        </q-page-container>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import ApplicantsList from "../components/ApplicantsList.vue";
import ChangePassword from "../components/ChangePassword.vue";

export default {
  components: {
    ApplicantsList,
    ChangePassword,
  },
  data() {
    return {
      menuItems: [
        { label: "Applicants List", route: "applicants-list" },
        { label: "Change Password", route: "change-password" },
      ],
      selectedComponent: "ApplicantsList",
    };
  },
  methods: {
    navigateTo(routeName) {
      this.selectedComponent = routeName;
    },
    logout() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
.q-card__section--vert {
  padding: 0px;
}
</style>
