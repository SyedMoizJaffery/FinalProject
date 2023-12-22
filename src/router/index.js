// router/index.js //

import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage';
import JobApplicationForm from '../views/JobApplicationForm';
import AdminDashboard from '../views/AdminDashboard';
import PasswordRecovery from '../components/PasswordRecovery';
import UserList from '../components/UserList';
import ApplicantsList from '../components/ApplicantsList';
import ActivityLogs from '../components/ActivityLogs';
import UserDashboard from '../views/UserDashboard';
import SetPassword from '../components/SetPassword';
import ChangePassword from '../components/ChangePassword';
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: '/',
    name: 'job-application-form',
    component: JobApplicationForm,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/admin-dashboard',
    name: 'admin-dashboard',
    // beforeEnter: (to, from, next)=>{

    // },
    component: AdminDashboard,
    meta: {
      requiresAuth: true,
    },
    children: [

      
      { path: 'user-list', name: 'user-list', component: UserList },
      { path: 'applicants-list', name: 'adminApplicantslist', component: ApplicantsList },
      { path: 'activity-logs', name: 'activity-logs', component: ActivityLogs },
    ],
  },
  {
    path: '/user-dashboard',
    name: 'user-dashboard',
    component: UserDashboard,
    meta: {
      requiresAuth: true,
    },
    children: [
      { path: 'applicants-list', name: 'applicants-list', component: ApplicantsList },
      { path: '/change-password', name: 'change-password', component: ChangePassword },

    ],
  },
  {
    path: '/password-recovery',
    name: 'password-recovery',
    component: PasswordRecovery,
  },
  {
    path: '/set-password/:token',
    name: 'set-password',
    props: true,
    component: SetPassword,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.getToken();

  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
