import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: useStorage('users', []),
    applicants: useStorage('applicants', []),
  }),

  persist: true,

  actions: {
    addUser(user) {
      this.users.push(user);
    },
    addApplicant(applicant) {
      this.applicants.push({
        ...applicant,
        status: 'Pending',
        dateApplied: new Date().toISOString(),
      });
    },

    updateApplicantStatus(email, newStatus) {
      const index = this.applicants.findIndex(applicant => applicant.email === email);
      if (index !== -1) {
        this.applicants[index].status = newStatus;
      }
    },
  },
});
