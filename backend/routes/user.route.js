import express from "express";
import admin from "../config/firebase.js";
import User from "../models/users.model.js";
import Doctor from "../models/doctor.model.js";

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
    const uid = decoded?.uid;

    if (!uid) {
      return res.status(401).json({ error: "Invalid Firebase token or UID not found" });
    }

    console.log("🔥 Firebase UID:", uid);
    console.log("📨 Body received:", req.body);

    // Check if user already exists
    const existingUser =
      (await User.findOne({ uid: uid })) ||
      (await Doctor.findOne({ uid: uid }));

    console.log("🔍 Existing user found:", existingUser);

    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    const {
      role,
      email,
      name,
      phone,
      gender,
      age,
      specialization,
      experienceYears,
      availability,
      createdAt,
    } = req.body;

    let newUser;

    if (role === "patient") {
      newUser = new User({
        uid: uid,
        email,
        name,
        phone,
        gender,
        age: parseInt(age),
        role,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      });
    } else if (role === "doctor") {
      if (!specialization || !experienceYears) {
        return res.status(400).json({ error: "Missing required doctor fields" });
      }

      newUser = new Doctor({
        uid: uid,
        role,
        email,
        name,
        phone,
        specialization,
        experienceYears: parseInt(experienceYears),
        availability: availability || "unavailable",
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      });
    } else {
      return res.status(400).json({ error: "Invalid role provided" });
    }

    await newUser.save();
    res.status(201).json({ message: "✅ User created in MongoDB" });
  } catch (error) {
    console.error("🔥 MongoDB insert error:", error.message);
    res.status(500).json({ error: "Failed to create user in MongoDB" });
  }
});


// 🔍 Get user profile
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    let user = await User.findOne({ uid });
    if (!user) {
      user = await Doctor.findOne({ uid });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found in MongoDB" });
    }

    res.json({ profile: user });
  } catch (error) {
    console.error("❌ Error loading profile:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
