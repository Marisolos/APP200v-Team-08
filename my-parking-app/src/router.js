import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth";
import { useRegisterFormStore } from '@/stores/registerForm';


import Login from "@/views/Login.vue";
import FindParking from "@/views/FindParking.vue";
import FAQ from "@/views/FAQ.vue";
import RegisterParking1 from "@/views/RegisterParking1.vue";
import RegisterParking2 from "@/views/RegisterParking2.vue";
import RegisterParking3 from "@/views/RegisterParking3.vue";
import RegisterParking4 from "@/views/RegisterParking4.vue";
import EditProfile from "@/views/EditProfile.vue";
import Listings from "@/views/Listings.vue";

const routes = [
  { path: "/", redirect: "/finn-parkering" },
  { path: "/login", component: Login },
  { path: "/finn-parkering", component: FindParking, meta: { requiresAuth: true } },
  { path: "/register-parking-1", component: RegisterParking1, meta: { requiresAuth: true } },
  { path: "/register-parking-2", component: RegisterParking2, meta: { requiresAuth: true } },
  { path: "/register-parking-3", component: RegisterParking3, meta: { requiresAuth: true } },
  { path: "/register-parking-4", component: RegisterParking4, meta: { requiresAuth: true } },
  { path: "/edit-profile", component: EditProfile, meta: { requiresAuth: true } },
  { path: "/listings", component: Listings, meta: { requiresAuth: true } },
  { path: "/faq", component: FAQ, meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", redirect: "/login" }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
});

//  Auth guard after app is mounted
router.beforeEach((to, from, next) => {
  const user = getAuth().currentUser;

  if (to.meta.requiresAuth && !user) {
    next("/login");
  } else if (to.path === "/login" && user) {
    next("/finn-parkering");
  } 
  
else if (to.path.startsWith('/register-parking')) {
  const form = useRegisterFormStore();
  const stepOrder = [
    '/register-parking-1',
    '/register-parking-2',
    '/register-parking-3',
    '/register-parking-4'
  ];
  const targetStep = stepOrder.indexOf(to.path);

  // Bruk progressLevel til å begrense tilgang
  if (form.progressLevel < targetStep + 1) {
    return next(stepOrder[form.progressLevel - 1] || '/register-parking-1');
  }

  // Hvis alt er ok, gå videre
  next();
} else {
    next();
  }
});

export default router;