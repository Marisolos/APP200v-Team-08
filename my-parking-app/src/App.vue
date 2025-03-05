<template>
  <div id="app" v-if="isReady">
    <nav class="navbar">
      <div class="nav-links">
        <router-link to="/home" v-if="user">Home</router-link>
        <router-link to="/finn-parkering" v-if="user">Finn parkering</router-link>
        <router-link to="/lei-ut" v-if="user">Lei ut</router-link>
        <router-link to="/faq" v-if="user">FAQ</router-link>
      </div>
      <button @click="logout" v-if="user" class="logout-btn">Log out</button>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

export default {
  name: "App",
  data() {
    return {
      user: null,
      isReady: false, // ✅ Used to prevent a blank screen issue
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user; // ✅ Update user state
      this.isReady = true; // ✅ Ensures UI only renders after auth state is known
      this.$forceUpdate(); // ✅ Forces Vue to re-render immediately
    });
  },

  methods: {
  async logout() {
    try {
      const auth = getAuth();
      await signOut(auth);
      this.user = null;
      this.isReady = false; // ✅ Temporarily hide UI while updating

      this.$router.push("/login").then(() => {
        this.isReady = true; // ✅ Re-render after redirection
        setTimeout(() => {
          window.location.reload(); // ✅ Force refresh to clear state issues
        }, 100); 
      });
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }
}
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