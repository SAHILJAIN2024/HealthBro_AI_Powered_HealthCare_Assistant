
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARa0dTF58PAKKcWTye-GaiaV67meLH2qg",
  authDomain: "healthbro-3e366.firebaseapp.com",
  projectId: "healthbro-3e366",
  storageBucket: "healthbro-3e366.firebasestorage.app",
  messagingSenderId: "510649565619",
  appId: "1:510649565619:web:827dd77de7c7dbe1654bc6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
export const auth = getAuth(app);
export const db = getFirestore(app);