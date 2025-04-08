import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import FindParking from "@/views/FindParking.vue";
import RentOut from "@/views/RentOut.vue";
import FAQ from "@/views/FAQ.vue";
import EditProfile from '@/views/EditProfile.vue';

const routes = [
  { path: "/login", component: Login },
  { path: "/home", component: Home, meta: { requiresAuth: true } },
  { path: "/finn-parkering", component: FindParking, meta: { requiresAuth: true } },
  { path: "/lei-ut", component: RentOut, meta: { requiresAuth: true } },
  { path: "/faq", component: FAQ, meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
  { path: "/edit-profile",
    name: "EditProfile",
    component: EditProfile }
  
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// ✅ Simplified guard
router.beforeEach((to, from, next) => {
  const user = getAuth().currentUser;
  
  if (to.meta.requiresAuth && !user) {
    next("/login");
  } else if (to.path === "/login" && user) {
    next("/home");
  } else {
    next();
  }
});

export default router;

