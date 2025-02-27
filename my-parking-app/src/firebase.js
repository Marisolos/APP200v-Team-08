import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

// ✅ Your Firebase configuration (REPLACE WITH YOUR OWN CONFIG IF CHANGED!)
const firebaseConfig = {
  apiKey: "AIzaSyDrGNUr4ZGwzBqVS6Fujt6fus63WS3vp6k",
  authDomain: "parkingapp-59c1a.firebaseapp.com",
  projectId: "parkingapp-59c1a",
  storageBucket: "parkingapp-59c1a.firebasestorage.app",
  messagingSenderId: "368876109026",
  appId: "1:368876109026:web:91ac7583d912c09644b2bb"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Authentication & Google Sign-In
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Ensure Redirect Mode is Correct
provider.setCustomParameters({
  prompt: "select_account"
});

// ✅ Initialize Firestore Database
const db = getFirestore(app); 

export { auth, provider, db }; // ✅ Export Firestore (db)
