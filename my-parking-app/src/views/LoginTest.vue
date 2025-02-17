<template>
  <div class="container">
    <h2>Login Page</h2>
    <p>Welcome! Please log in using Google.</p>
    
    <!-- Google Sign-In Button -->
    <button @click="signInWithGoogle">Sign in with Google</button>
    
    <!-- Debugging Messages -->
    <p v-if="user">Signed in as: {{ user.displayName }}</p>
    <p v-if="error" style="color: red;">Error: {{ error }}</p>
  </div>
</template>

<script>
import { auth } from "@/firebase"; // ✅ Import initialized Firebase instance
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default {
  name: "UserLogin",
  data() {
    return {
      user: null,
      error: null
    };
  },
  methods: {
    async signInWithGoogle() {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        this.user = result.user; // Save logged-in user info
        console.log("User signed in:", this.user);
        this.$router.push("/home"); // Redirect to home after login
      } catch (err) {
        this.error = err.message;
        console.error("Login error:", err);
      }
    }
  }
};
</script>


<style scoped>
.container {
  text-align: center;
  margin-top: 50px;
}
button {
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  background: #4285F4;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
}
button:hover {
  background: #357ae8;
}
</style>

