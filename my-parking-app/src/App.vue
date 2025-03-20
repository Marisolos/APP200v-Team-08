<template>
  <div id="app">
    <nav class="navbar" v-if="isReady">
      <div class="nav-links">
        <router-link to="/home" v-if="user">Home</router-link>
        <router-link to="/finn-parkering" v-if="user">Find Parking</router-link>
        <router-link to="/lei-ut" v-if="user">Lei ut</router-link>
        <router-link to="/faq" v-if="user">FAQ</router-link>
      </div>
      <button @click="logout" v-if="user" class="logout-btn">Log out</button>
    </nav>
    
    <!-- ✅ Always render the router-view -->
    <router-view />
  </div>
</template>


<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from './router'; // Adjust if your router file is located elsewhere

export default {
  name: "App",
  data() {
    return {
      user: null,
      isReady: false,
    };
  },
  created() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    this.user = user;
    this.isReady = true;

    // ✅ Add this block inside the onAuthStateChanged callback:
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
    },
  },
};
</script>


<style scoped>
.navbar {
  display: flex;
  justify-content: center; /* ✅ Center the links */
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  font-family: "Nunito Sans", sans-serif;
  position: relative; /* ✅ Allows absolute positioning inside */
}

/* ✅ Keep previous navbar link styling */
.navbar a {
  color: #5B8D8A; /* ✅ Keep the same color */
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px; /* ✅ Space between links */
  transition: color 0.3s ease-in-out;
}

.navbar a:hover {
  color: black;
}

/* ✅ Wrapper for links to center them */
.nav-links {
  display: flex;
  gap: 20px; /* ✅ Space between links */
}

/* ✅ Logout Button (Positioned on the Right) */
.logout-btn {
  position: absolute;
  right: 30px; /* ✅ Aligns to the right */
  top: 50%;
  transform: translateY(-50%);
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