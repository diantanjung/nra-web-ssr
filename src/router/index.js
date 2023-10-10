import { createRouter, createWebHashHistory, createMemoryHistory } from "vue-router";
import { getJwtToken } from '@/utils/auth';
import { useAuthStore } from "@/stores/auth";
import NProgress from "nprogress/nprogress.js";
import { useToast } from 'vue-toastification'

// Main layouts
import LayoutBackend from "@/layouts/variations/BackendStarter.vue";
import LayoutSimple from "@/layouts/variations/Simple.vue";


// * ROUTES
import AttendanceRoutes from "./attendance";
import ApprovalRoutes from "./approval";
import LogBookRoutes from "./log-book";
import AnnouncementRoutes from "./announcement";

// * SURVEYOR
import SurveyorRoutes from "./surveyor/_index";
import MasterDataRoutes from "./master-data/_index";

// * AUTH
const Login = () => import("@/views/auth/LogInView.vue");

// * DASHBOARD
const Dashboard = () => import("@/views/admin/DashboardView.vue");

// * PROFILE
const Profile = () => import("@/views/admin/Profile/IndexView.vue");


// Set all routes
const routes = [
  {
    path: "/",
    redirect: "/login",
    component: LayoutSimple,
    children: [
      {
        path: "login",
        name: "login",
        component: Login,
      },
    ],
  },
  {
    path: "/admin",
    redirect: "/admin/dashboard",
    component: LayoutBackend,
    children: [
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: Dashboard,
      },
      {
        path: "profile",
        name: "admin-profile",
        component: Profile,
      },
      ...AttendanceRoutes,
      ...ApprovalRoutes,
      ...LogBookRoutes,
      ...AnnouncementRoutes,
      // * SURVEYOR
      ...SurveyorRoutes,
      // * MASTER DATA
      ...MasterDataRoutes
    ],
  },
];

// Create Router
const router = createRouter({
  // history: createWebHashHistory(),
  history: import.meta.env.SSR
      ? createMemoryHistory()
      : createWebHashHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "active",
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
  routes,
});

// NProgress
/*eslint-disable no-unused-vars*/
// NProgress.configure({ showSpinner: false });

router.beforeResolve((to, from, next) => {
  // NProgress.start();
  next();
});


const whiteList = ['/login', '/auth-redirect', '/forgot-password', '/reset-password/:code', '/forgot-password-success', '/reset-password-success']; // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  const toast = useToast()
  const store = useAuthStore();
  // determine whether the user has logged in
  const isUserLogged = getJwtToken();
  if (isUserLogged) {
    if (to.path === '/login') {
      next({ name: 'admin-dashboard' });
      // NProgress.done();
    } else {
      const hasRoles = store.auth && store.auth.role != undefined;
      if (hasRoles) {
        next();
      } else {
        try {
          await store.info()
          next();
          // NProgress.done();
        } catch (error) {
          next({ name: 'login' });
          NProgress.done();
          await store.logout()
        }
      }
    }
  } else {
    if (whiteList.includes(to.fullPath)) {
      next();
    } else {
      next({ name: 'login' });
      // NProgress.done();
    }
  }
});

router.afterEach((to, from) => {
  // NProgress.done();
});

export default router;
