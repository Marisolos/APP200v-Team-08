<template>
  <div class="page-container">
    <!-- White Box Wrapper -->
    <div class="login-wrapper">
      <!-- Left Side: Login Form -->
      <div class="login-form-container">
        <h2 class="login-title">Welcome back 👋</h2>
        <p class="login-subtitle">Please enter your details.</p>

        <!-- Google Sign-In Button -->
        <button @click="signInWithGoogle" class="login-btn">
          <img src="@/assets/google-icon.png" alt="Google" class="google-icon" />
          Sign in with Google
        </button>

        <!-- Divider -->
        <p class="divider">or</p>

        <!-- Email Sign-In Form -->
        <form @submit.prevent="signInWithEmail" class="login-form">
          <input type="email" v-model="email" placeholder="Email" required />
          <input type="password" v-model="password" placeholder="Password" required />
          <button type="submit" class="login-btn">Sign in with Email</button>
        </form>

        <!-- Signup Option -->
        <p class="signup-text">Don't have an account? <span @click="signUpWithEmail" class="signup-link">Sign up</span></p>
      </div>

      <!-- Right Side: Image -->
      <div class="login-image">
        <img src="@/assets/parking-car.png" alt="Parking Car" />
      </div>
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
    async signInWithGoogle() {
      try {
        await signInWithPopup(auth, provider);
        this.$router.push("/home"); // ✅ ADD THIS
      } catch (error) {
        console.error("Google Sign-In Error:", error);
      }
    },
    async signInWithEmail() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/home"); // ✅ ADD THIS
      } catch (error) {
        console.error("Email Sign-In Error:", error);
        alert(error.message);
      }
    },
    async signUpWithEmail() {
      try {
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/home");
      } catch (error) {
        console.error("Sign-Up Error:", error);
        alert(error.message);
      }
    }
  }
};
</script>

<style scoped>
/*  Full Page Background */
/*  Ensure Full-Screen Fit */
/*  Full Page Background */
.page-container {
  background-color: #ABC89D;
  height: 100vh; /* Full viewport height */
  display: flex;
  justify-content: center;
  align-items: flex-start; /*  Moves content closer to the top */
  padding-top: 40px; /*  Adds some space from the top */
  overflow: hidden; /* Prevents scrolling */
}

/* ✅ White Box Container */
.login-wrapper {
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 800px; /* Fixed width */
  height: 70vh; /*  Reduced height to bring it higher */
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

/* ✅ Login Form (Left Side) */
.login-form-container {
  width: 50%;
  padding: 40px;
  text-align: center;
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.login-subtitle {
  color: gray;
  font-size: 14px;
  margin-bottom: 20px;
}

/* ✅ Buttons */
.login-btn {
  background-color: #5B8D8A;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 10px 0;
  transition: 0.3s;
}

.login-btn:hover {
  background-color: #FED28D;
}

/* ✅ Google Icon */
.google-icon {
  width: 20px;
  margin-right: 10px;
}

/* ✅ Input Fields */
.login-form input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
}

/* ✅ Sign-Up Link */
.signup-text {
  margin-top: 10px;
  font-size: 14px;
}

.signup-link {
  color: #87A181;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}

/* ✅ Right Side: Image */
.login-image {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff; /* Light background behind image */
  height: 100%;
  border-top-right-radius: 20px; /* Rounded corner on the top-right */
  border-bottom-right-radius: 20px; /* Rounded corner on the bottom-right */
  border-top-left-radius: 20px; /* Rounded corner on the top-left */
  border-bottom-left-radius: 20px; /* Rounded corner on the bottom-left */
  overflow: hidden; /* Ensures image does not overflow */
}

.login-image img {
  width: 95%;
  height: 95%;
  object-fit: cover;
  border-top-right-radius: 20px; /* Matches the parent div */
  border-bottom-right-radius: 20px; /* Matches the parent div */
  border-top-left-radius: 20px; /* Rounded corner on the top-left */
  border-bottom-left-radius: 20px; /* Rounded corner on the bottom-left */
}
</style>

