import admin from "firebase-admin";
import serviceAccount from "../firebase/firebase-admin-key.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://healthbro-3e366.firebaseio.com"
});

export default admin;
  
