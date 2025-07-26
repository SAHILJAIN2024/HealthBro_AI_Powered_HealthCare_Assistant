
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Database, getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC4FBu_DqryPCKixbMqbarvJU9maLB-vVY",
  authDomain: "health-broo.firebaseapp.com",
  projectId: "health-broo",
  storageBucket: "health-broo.firebasestorage.app",
  messagingSenderId: "178371786788",
  appId: "1:178371786788:web:79dea8c292c77819b280b1",
  databaseURL: "https://health-broo-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
export const auth = getAuth(app);
export const db = getDatabase(app);