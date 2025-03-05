import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import FindParking from "@/views/FindParking.vue";
import RentOut from "@/views/RentOut.vue";
import FAQ from "@/views/FAQ.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/home", component: Home, meta: { requiresAuth: true } },
  { path: "/finn-parkering", component: FindParking, meta: { requiresAuth: true } },
  { path: "/lei-ut", component: RentOut, meta: { requiresAuth: true } },
  { path: "/faq", component: FAQ, meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", redirect: "/login" } // Redirect unknown paths to login
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }; // Ensures page scrolls to top when navigating
  }
});

// ✅ Navigation Guard: Redirects unauthenticated users to /login
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (to.meta.requiresAuth && !user) {
      next("/login"); // Redirect if user is not logged in
    } else {
      next(); // Proceed if user is logged in or accessing login page
    }
  });
});

export default router;
