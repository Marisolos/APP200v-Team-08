<template>
  <div class="login-container">
    <!-- ✅ Parking Sign Image (signs.png) -->
    <img src="@/assets/signs.png" alt="Parking Signs" class="signs-image" />

    <!-- ✅ Login Section -->
    <div class="login-box">
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
/* ✅ Full Page Background */
.login-container {
  background-color: #B3C4AF;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  margin-top: 20px; /* Reduce this value to move it closer to the navbar */
}

/* ✅ Parking Sign Image */
.signs-image {
  max-width: 100px; /* Decrease this value to make it smaller */
  margin-bottom: 20px;
}

/* ✅ Login Box */
.login-box {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

/* ✅ Sign-In Title */
.login-title {
  color: #4a634f;
  font-family: Tahoma, sans-serif;
  font-size: 24px;
  margin-bottom: 20px;
}

/* ✅ Buttons */
.login-btn {
  background-color: #87A181;
  color: white;
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
  background-color: #75976e;
}

/* ✅ Form Inputs */
.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.login-form input {
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

/* ✅ Sign-Up Link */
.signup-link {
  color: #4a634f;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}
</style>
