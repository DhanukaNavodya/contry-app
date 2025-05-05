// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCmzZ28AeSxVHo9NTeANiM-l-DRAQoc45s",
  authDomain: "ereading-e5931.firebaseapp.com",
  projectId: "ereading-e5931",
  storageBucket: "ereading-e5931.firebasestorage.app",
  messagingSenderId: "172534545379",
  appId: "1:172534545379:web:2a692d37fd9402d902bed6",
  measurementId: "G-0QJCV41S6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app); // ✅ Now available for use

const db = getFirestore(app);

export { auth,db }; // ✅ Export auth for use in other files