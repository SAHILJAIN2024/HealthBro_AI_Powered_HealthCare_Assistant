import express from "express";
import user from "../models/users.model.js";
import prescriptionSchema from "../models/prescription.model.js";
const router = express.Router();

router.get("/patients", async (req, res) => {
  
  try {
    const patients = await user.find({ role: "patient" }).sort({ createdAt: -1 });

    const formattedPatients = patients.map((p) => ({
      name: p.name || "Unknown",
      lastVisit: p.lastVisit || "N/A",
      status: p.status || "new",
    }));

    res.json(formattedPatients);
  } catch (err) {
    console.error("❌ Error fetching patients:", err);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});




router.get("/prescriptions", async (req, res) => {
  try {
    const latest = await prescriptionSchema.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (error) {
  console.error("Latest Prescription Error:", error);  // ADD THIS
  res.status(500).json({ error: "Failed to fetch latest prescription" });
}
});


router.get("/doctor/:doctorId/emergency-alerts", async (req, res) => {
  try {
    const { doctorId } = req.params;

    const alerts = await DoctorEmergencyAlert.find({ doctorId })
      .populate("patientId", "name age gender") // optional
      .sort({ createdAt: -1 });

    res.status(200).json(alerts);
  } catch (error) {
    console.error("Fetch doctor emergency alerts error:", error);
    res.status(500).json({ error: "Failed to fetch emergency alerts" });
  }
});


export default router;
