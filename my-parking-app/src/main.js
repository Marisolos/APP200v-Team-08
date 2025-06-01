import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import i18n from './i18n';


import "@/assets/styles.css";


const auth = getAuth();

//  Only mount the app after Firebase Auth has determined user state
let app;
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App);
    const pinia = createPinia();
    pinia.use(piniaPluginPersistedstate); //Enable persistedState
    app.use(pinia);
    app.use(i18n);
    app.use(router);
    app.use(VueGoogleMaps, {
      load: {
        key: "AIzaSyCfis5H1oNKr-NuNbBXOlwMaMhUY-5Mk5w",
      },
    });
    app.mount("#app");
  }
});
