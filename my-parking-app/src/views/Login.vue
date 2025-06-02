<template>
  <div class="page-container">
    <div class="login-wrapper">
      <!-- === Left Side: Login Form === -->
      <div class="login-form-container">
        <h2 class="login-title">Welcome back 👋</h2>
        <p class="login-subtitle">Please enter your details.</p>

        <!-- Google Sign-In -->
        <button @click="signInWithGoogle" class="login-btn">
          <img src="@/assets/google-icon.png" alt="Google" class="google-icon" />
          Sign in with Google
        </button>

        <p class="divider">or</p>

        <!-- Email Sign-In Form -->
        <form @submit.prevent="signInWithEmail" class="login-form">
          <input type="email" v-model="email" placeholder="Email" required />
          <input type="password" v-model="password" placeholder="Password" required />
          <button type="submit" class="login-btn">Sign in with Email</button>
        </form>

        <!-- Sign-Up Redirect -->
        <p class="signup-text">
          Don't have an account?
          <span @click="signUpWithEmail" class="signup-link">Sign up</span>
        </p>
      </div>

      <!-- === Right Side: Image Display === -->
      <div class="login-image">
        <img src="@/assets/parking-car.png" alt="Parking Car" />
      </div>
    </div>
  </div>
</template>

<script>
import { auth, provider } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { db } from "@/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs
} from "firebase/firestore";

export default {
  name: "UserLogin",
  data() {
    return {
      email: "",    // Bound to the input field for email
      password: ""  // Bound to the input field for password
    };
  },
  methods: {
    // Handle Google Sign-In
    async signInWithGoogle() {
      try {
        const result = await signInWithPopup(auth, provider);
        await this.saveUserToFirestore(result.user);
        this.$router.push("/finn-parkering");
      } catch (error) {
        console.error("Google Sign-In Error:", error);
      }
    },

    // Handle Email/Password Sign-In
    async signInWithEmail() {
      try {
        const result = await signInWithEmailAndPassword(auth, this.email, this.password);
        await this.saveUserToFirestore(result.user);
        this.$router.push("/finn-parkering");
      } catch (error) {
        console.error("Email Sign-In Error:", error);
        alert(error.message);
      }
    },

    // Handle Email/Password Sign-Up
    async signUpWithEmail() {
      try {
        const result = await createUserWithEmailAndPassword(auth, this.email, this.password);
        await this.saveUserToFirestore(result.user);
        this.$router.push("/finn-parkering");
      } catch (error) {
        console.error("Sign-Up Error:", error);
        alert(error.message);
      }
    },

    // Save new user data or update missing info in Firestore
    async saveUserToFirestore(user) {
      if (!user || !user.uid) return;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      const email = user.email || "user@example.com";
      const base = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      let username = base;

      // Generate unique username if not set
      if (!docSnap.exists() || !docSnap.data().username) {
        const usersSnap = await getDocs(collection(db, "users"));
        const existingUsernames = usersSnap.docs
          .map(doc => doc.data().username)
          .filter(Boolean);

        let count = 1;
        while (existingUsernames.includes(username)) {
          username = `${base}${count++}`;
        }
      }

      // Create new user document if it doesn't exist
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email,
          username,
          createdAt: new Date()
        });
      } else {
        const userData = docSnap.data();
        // Update username only if it doesn't already exist
        if (!userData.username) {
          await updateDoc(userRef, { username });
        }
      }
    }
  }
};
</script>

<style scoped>
/* === Container === */
.page-container {
  background-color: #ABC89D;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
  overflow: hidden;
}

/* === Login Box === */
.login-wrapper {
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 800px;
  height: 70vh;
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

/* === Form Area === */
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

/* === Buttons and Inputs === */
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

.google-icon {
  width: 20px;
  margin-right: 10px;
}

.login-form input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
}

/* === Sign-Up Link === */
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

/* === Image Area === */
.login-image {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
}

.login-image img {
  width: 95%;
  height: 95%;
  object-fit: cover;
  border-radius: 20px;
}
</style>
