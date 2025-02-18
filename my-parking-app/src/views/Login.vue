<template>
  <div>

    <!-- ✅ Login Container -->
    <div class="login-container">
      <!-- ✅ Car Image Above Sign-In Text -->
      <img src="@/assets/car-logo.png" alt="Car Logo" class="car-logo" />

      <h2 class="login-title">Sign in</h2>

      <!-- ✅ Google Sign-In Button -->
      <button @click="signInWithGoogle" class="login-btn">Sign in with Google</button>

      <!-- ✅ Email Sign-In Form -->
      <form @submit.prevent="signInWithEmail" class="login-form">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit" class="login-btn">Sign in with Email</button>
      </form>

      <!-- ✅ Signup Option -->
      <p>Don't have an account? <span @click="signUpWithEmail" class="signup-link">Sign up</span></p>
    </div>
  </div>
</template>

<script>
import { auth, provider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  name: "UserLogin",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    // ✅ Google Sign-In
    async signInWithGoogle() {
      try {
        await signInWithPopup(auth, provider);
        this.$router.push("/home"); // Redirect to home after login
      } catch (error) {
        console.error("Google Sign-In Error:", error);
      }
    },

    // ✅ Email Sign-In
    async signInWithEmail() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/home"); // Redirect to home after login
      } catch (error) {
        console.error("Email Sign-In Error:", error);
        alert(error.message);
      }
    },

    // ✅ Email Sign-Up (if user clicks "Sign up")
    async signUpWithEmail() {
      try {
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/home"); // Redirect to home after sign-up
      } catch (error) {
        console.error("Sign-Up Error:", error);
        alert(error.message);
      }
    }
  }
};
</script>

<style scoped>

/* ✅ Login Container */
.login-container {
  background-color: #40bd6e;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* ✅ Car Logo - Now Above the Sign-in Text */
.car-logo {
  width: 80px;
  height: auto;
  margin-bottom: 15px;
}

/* ✅ Sign-In Title */
.login-title {
  color: #95E6B3;
  font-family: Tahoma, sans-serif;
  font-size: 24px;
  margin-bottom: 20px;
}

/* ✅ Buttons */
.login-btn {
  background-color: white;
  color: #40bd6e;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 18px;
  font-family: Tahoma, sans-serif;
  cursor: pointer;
  transition: 0.3s;
  margin: 10px;
}

.login-btn:hover {
  background-color: #f0f0f0;
}

/* ✅ Form Inputs */
.login-form {
  display: flex;
  flex-direction: column;
  width: 250px;
}

.login-form input {
  padding: 10px;
  margin: 5px 0;
  border: none;
  border-radius: 10px;
  font-size: 16px;
}

/* ✅ Sign-Up Link */
.signup-link {
  color: white;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}
</style>
