import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import router from "./router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "@/assets/styles.css";

import VueGoogleMaps from '@fawmi/vue-google-maps';

const auth = getAuth();
let app = null;

// Wait for Firebase Auth to init before mounting app
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    
    // Register Google Maps plugin
    app.use(VueGoogleMaps, {
      load: {
        key: 'AIzaSyCfis5H1oNKr-NuNbBXOlwMaMhUY-5Mk5w',
      },
    });

    app.mount("#app");
  }
});
