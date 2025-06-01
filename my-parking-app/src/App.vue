<template>
  <div id="app">
    <div
      class="navbar"
      v-if="isReady"
      :class="{ fixed: showNavbarFixed }"
      ref="navbar"
    >
      <div class="navbar-left">
        <img src="@/assets/parq-logo-1.png" alt="Logo" class="logo" />
      </div>

      <div class="nav-links">
        <router-link to="/finn-parkering" v-if="user">{{ $t('nav.findParking') }}</router-link>
        <router-link to="/listings" v-if="user">{{ $t('nav.listings') }}</router-link>
        <router-link to="/register-parking-1" v-if="user">{{ $t('nav.register') }}</router-link>
        <router-link to="/faq" v-if="user">{{ $t('nav.faq') }}</router-link>
      </div>

      <div class="right-controls" v-if="user">
        <router-link to="/edit-profile" class="profile-link">
          <img :src="user.photoURL || defaultAvatar" alt="Profile" class="profile-img" />
        </router-link>
        <button @click="logout" class="logout-btn">{{ $t('nav.logout') }}</button>
        <select v-model="$i18n.locale" class="language-selector">
          <option value="no">🇳🇴 NO</option>
          <option value="en">🇬🇧 EN</option>
        </select>
      </div>
    </div>

    <div class="navbar-spacer" v-if="showNavbarFixed"></div>
    <router-view />
  <FooterComponent v-if="showFooter" /> <!-- Show Footer component -->
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from './router';
import defaultAvatar from "@/assets/default-user.png";
import FooterComponent from "@/components/Footer.vue"; // Import Footer component


export default {
  name: "App",
    components: {
    FooterComponent, // Register Footer component
  },
  data() {
    return {
      user: null,
      isReady: false,
      defaultAvatar,
      showNavbarFixed: false,
      lastScrollY: 0,
      scrollUpDistance: 0
    };
  },
  computed: {
  showFooter() {
    return this.$route.path !== '/login'; // Hide footer on login page
  }
},
created() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    this.user = user;
    this.isReady = true;

    // Redirect away from login if already authenticated
    if (user && this.$route.path === "/login") {
      this.$router.push("/finn-parkering");
    }
  });
},
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async logout() {
      const auth = getAuth();
      await signOut(auth);
      this.user = null;
      router.push("/login");
    },
    handleScroll() {
      const currentY = window.scrollY;
      const scrollDelta = currentY - this.lastScrollY;

      if (scrollDelta < 0) {
        this.scrollUpDistance += Math.abs(scrollDelta);
        if (this.scrollUpDistance > 30) {
          this.showNavbarFixed = true;
        }
      } else if (scrollDelta > 0) {
        this.scrollUpDistance = 0;
        this.showNavbarFixed = false;
      }

      this.lastScrollY = currentY;
    }
  }
};
</script>

<style scoped>
.navbar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  font-family: "Nunito Sans", sans-serif;
  z-index: 1000;
}

.navbar.fixed {
  position: fixed;
  top: -60px;
  left: 0;
  right: 0;
  animation: slideDown 0.3s ease-out forwards;
}

@keyframes slideDown {
  to {
    top: 0;
  }
}

.navbar-left {
  flex-shrink: 0;
}

.logo {
  height: 40px;
}

.nav-links {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  justify-content: center;
}

.navbar a {
  color: #5B8D8A;
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  transition: color 0.3s ease-in-out;
}

.navbar a:hover {
  color: black;
}

.right-controls {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4d7c5c;
}

.logout-btn {
  background-color: #5B8D8A;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background-color: #FED28D;
}

.navbar-spacer {
  height: 57px;
}

.language-selector {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
}

</style>
