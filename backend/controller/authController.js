import admin from "../config/firebase.js"; // your firebase-admin wrapper
import User from "../models/auth.model.js"; // your Mongoose model

// Register new user (Firebase Auth + MongoDB)
export const registerUser = async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) return res.status(401).json({ error: "No token provided" });

    // Verify token
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log("✅ Decoded UID:", decoded.uid);

    const { email, name, phone, gender, age, role } = req.body;

    // Save to MongoDB
    const userDoc = await User.create({
      uid: decoded.uid,
      email,
      name,
      phone,
      gender,
      age,
      role,
    });

    console.log("✅ User saved to MongoDB:", userDoc);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Error during registration:", err);
    return res.status(400).json({ error: err.message });
  }
};

export const verifyToken = async (req, res) => {
  console.log("🔐 Incoming token verification request...");

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
const user = await User.findOne({ uid: decoded.uid });

if (!user) return res.status(404).json({ error: "User not found" });


    return res.status(200).json({ uid: user.uid, role: user.role });
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ error: "Invalid token" });
  }
};

