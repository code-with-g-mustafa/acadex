import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyBAcG1bwdcTqjcKFjp0_vCrVR8SZfuMunc",
  authDomain: "acadex-b7ce1.firebaseapp.com",
  projectId: "acadex-b7ce1",
  storageBucket: "acadex-b7ce1.firebasestorage.app",
  messagingSenderId: "907632257963",
  appId: "1:907632257963:web:7326fb4c819c2b5d3b80ee",
  measurementId: "G-TEJ9V1B2XZ"
};

// Initialize Firebase
let app;
let analytics;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };
