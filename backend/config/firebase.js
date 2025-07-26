// config/firebase.js
import admin from "firebase-admin";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const serviceAccount = require("../firebase/firebase-admin-key.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<your-project-id>.firebaseio.com"
  });
}

export default admin;
