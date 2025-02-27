import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import FindParking from "@/views/FindParking.vue";
import RentOut from "@/views/RentOut.vue";
import FAQ from "@/views/FAQ.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/home", component: Home },
  { path: "/finn-parkering", component: FindParking },
  { path: "/lei-ut", component: RentOut },
  { path: "/faq", component: FAQ },
  { path: "/:pathMatch(.*)*", redirect: "/login" } // ✅ Redirect unknown paths to login
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }; // ✅ Ensures page scrolls to top when navigating
  }
});

export default router;

