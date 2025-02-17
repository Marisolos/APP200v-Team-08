import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration (REPLACE WITH YOUR OWN CONFIG!)
const firebaseConfig = {
  apiKey: "AIzaSyDrGNUr4ZGwzBqVS6Fujt6fus63WS3vp6k",
  authDomain: "parkingapp-59c1a.firebaseapp.com",
  projectId: "parkingapp-59c1a",
  storageBucket: "parkingapp-59c1a.firebasestorage.app",
  messagingSenderId: "368876109026",
  appId: "1:368876109026:web:91ac7583d912c09644b2bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Ensure Redirect Mode is Correct
provider.setCustomParameters({
  prompt: "select_account"
});

export { auth, provider };