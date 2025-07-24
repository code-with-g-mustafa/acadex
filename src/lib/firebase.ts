import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  projectId: "scholarsage-5mfk9",
  appId: "1:919880189059:web:a324e113e349f3737887b6",
  storageBucket: "scholarsage-5mfk9.firebasestorage.app",
  apiKey: "AIzaSyC3L9hsZn14Q2ikkK6sULTiXgLd1CmuiDE",
  authDomain: "scholarsage-5mfk9.firebaseapp.com",
  messagingSenderId: "919880189059",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };
