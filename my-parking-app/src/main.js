import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "@/assets/styles.css";

const app = createApp(App);

// ✅ Ensure Firebase auth is loaded before mounting app
const auth = getAuth();
onAuthStateChanged(auth, () => {
  app.use(router);
  app.mount("#app");
});
