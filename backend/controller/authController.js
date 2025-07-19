import admin from "../config/firebase.js";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "<your-api-key>",
  authDomain: "<your-project-id>.firebaseapp.com"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    return res.status(201).json({ uid: userCredential.user.uid, token: idToken });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    return res.status(200).json({ uid: userCredential.user.uid, token: idToken });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

export const verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return res.status(200).json({ uid: decoded.uid });
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};