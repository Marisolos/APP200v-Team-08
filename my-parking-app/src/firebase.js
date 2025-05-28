import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "firebase/firestore";

// Your Firebase configuration
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

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Optional: Force Google account selection each time
provider.setCustomParameters({
  prompt: "select_account"
});

// Export everything you need in one go
export {
  auth,
  provider,
  db,
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs
};
