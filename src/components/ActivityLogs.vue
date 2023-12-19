<!-- ActivityLogs.vue -->

<template>
  <div>
    <h2 class="text-h6">Activity Logs</h2>
    <ul>
      <li v-for="(log, index) in activityLogs" :key="index">{{ log }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activityLogs: [],
    };
  },
  created() {
    this.loadActivityLogs();
  },
  methods: {
    loadActivityLogs() {
      const storedLogs = localStorage.getItem("activityLogs");
      this.activityLogs = storedLogs ? JSON.parse(storedLogs) : [];
    },
    addLog(logMessage) {
      const timestamp = new Date().toLocaleString();
      const formattedLog = `[${timestamp}] ${logMessage}`;
      this.activityLogs.push(formattedLog);

      localStorage.setItem("activityLogs", JSON.stringify(this.activityLogs));
    },
  },
};
</script>

<style scoped>
</style>
