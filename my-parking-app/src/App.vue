<template>
  <div id="app">
    <nav class="navbar" v-if="isReady">
      <div class="nav-links">
        <router-link to="/home" v-if="user">Home</router-link>
        <router-link to="/finn-parkering" v-if="user">Find Parking</router-link>
        <router-link to="/lei-ut" v-if="user">Lei ut</router-link>
        <router-link to="/faq" v-if="user">FAQ</router-link>
      </div>

      <!-- 👤 Profile Picture & Log Out Button -->
      <div class="right-controls" v-if="user">
        <router-link to="/edit-profile" class="profile-link">
          <img :src="user.photoURL || defaultAvatar" alt="Profile" class="profile-img" />
        </router-link>
        <button @click="logout" class="logout-btn">Log out</button>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from './router';
import defaultAvatar from "@/assets/default-user.png"; // 🔁 Make sure this file exists

export default {
  name: "App",
  data() {
    return {
      user: null,
      isReady: false,
      defaultAvatar
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.isReady = true;

      if (this.$route && this.$route.path === "/login" && user) {
        this.$router.push("/home");
      }
    });
  },
  methods: {
    async logout() {
      const auth = getAuth();
      await signOut(auth);
      this.user = null;
      router.push("/login");
    }
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  font-family: "Nunito Sans", sans-serif;
  position: relative;
}

.navbar a {
  color: #5B8D8A;
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
  transition: color 0.3s ease-in-out;
}

.navbar a:hover {
  color: black;
}

.nav-links {
  display: flex;
  gap: 20px;
}

/* 🔗 Right side: profile + logout */
.right-controls {
  position: absolute;
  top: 50%;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  transform: translateY(-50%);
}

/* 👤 Profile Picture */
.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4d7c5c;
}

/* 🔘 Log out Button */
.logout-btn {
  background-color: #87A181;
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
</style>
