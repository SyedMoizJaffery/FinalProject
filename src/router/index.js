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
    component: AdminDashboard,
    children: [
      { path: 'user-list', name: 'user-list', component: UserList },
      { path: 'applicants-list', name: 'applicants-list', component: ApplicantsList },
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

export default router;
