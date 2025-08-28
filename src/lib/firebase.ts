// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration - HARDCODED
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBcr9mv3RwCLX8HrSyETyZ9ZDfv-4xx74U",
  authDomain: "videoverse-k90qc.firebaseapp.com",
  projectId: "videoverse-k90qc",
  storageBucket: "videoverse-k90qc.firebasestorage.app",
  messagingSenderId: "1007523379046",
  appId: "1:1007523379046:web:d7158172ecfddd31e83aa7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
