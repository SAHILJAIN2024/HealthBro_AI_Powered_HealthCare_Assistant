// backend/routes/user.routes.js
import express from "express";
import admin from "../config/firebase.js"; // Firebase admin SDK
import User from "../models/users.model.js"; // Mongoose model

const router = express.Router();

// 🔐 Create user in MongoDB
router.post("/create", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const firebaseUID = decoded.uid;

    console.log("🔥 Firebase UID:", firebaseUID);
    console.log("📨 Body received:", req.body);

    const existingUser = await User.findOne({ firebaseUID });
    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    const newUser = new User({
      uid: firebaseUID,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      gender: req.body.gender,
      age: parseInt(req.body.age), // ensure it's a number
      role: req.body.role,
      createdAt: req.body.createdAt || new Date().toISOString(),
    });
    console.log("📦 New user data:", newUser);

    await newUser.save().catch(err => {
      console.error("❌ Mongoose Save Error:", err.message, err.errors);
      throw err;
    });

    res.status(201).json({ message: "✅ User created in MongoDB" });
  } catch (error) {
    console.error("🔥 MongoDB insert error:", error.message, error);
    res.status(500).json({ error: "Failed to create user in MongoDB" });
  }
});


// 🔍 Get user profile from MongoDB
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const user = await User.findOne({ uid: uid });
    if (!user) return res.status(404).json({ error: "User not found in MongoDB" });

    res.json({ profile: user });
  } catch (error) {
    console.error("Error loading profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
