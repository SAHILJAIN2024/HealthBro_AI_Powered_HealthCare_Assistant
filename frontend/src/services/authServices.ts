import { auth } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const register = async (email: string, password: string): Promise<string> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return await userCredential.user.getIdToken();
};

export const login = async (email: string, password: string): Promise<string> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return await userCredential.user.getIdToken();
};