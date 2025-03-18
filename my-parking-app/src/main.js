import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "@/assets/styles.css";

const app = createApp(App);
const auth = getAuth();

// ✅ Only mount app and apply router AFTER auth state is ready
onAuthStateChanged(auth, () => {
  app.use(router);
  app.mount("#app");
});

