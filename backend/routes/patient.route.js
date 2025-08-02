import express from "express";
import symptomsPredictionSchema from "../models/symptonprediction.model.js";
import riskSchema from "../models/riskpredction.model.js";
import prescriptionSchema from "../models/prescription.model.js";
import patientSchema from "../models/medicalhistory.model.js";
const router = express.Router();



// Get latest symptom entry
router.get("/latest-symptoms", async (req, res) => {
  const latest = await symptomsPredictionSchema.findOne().sort({ createdAt: -1 });
  res.json(latest); // ⛔️ This returns the whole object
});


// Get latest risk entry
router.get("/latest-risks", async (req, res) => {
  try {
    const latest = await riskSchema.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch latest risks" });
  }
});

// Get latest prescription
router.get("/latest-prescriptions", async (req, res) => {
  try {
    const latest = await prescriptionSchema.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch latest prescriptions" });
  }
});

// Get latest medical history
router.get("/latest-history", async (req, res) => {
  try {
    const latest = await patientSchema.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch latest history" });
  }
});

export default router;
