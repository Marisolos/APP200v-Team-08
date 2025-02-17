import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/LoginTest.vue"; // ✅ Check this path is correct
import Home from "./views/Home.vue";

const routes = [
  { path: "/", redirect: "/login" }, // Redirect to login by default
  { path: "/login", component: Login },
  { path: "/home", component: Home }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

