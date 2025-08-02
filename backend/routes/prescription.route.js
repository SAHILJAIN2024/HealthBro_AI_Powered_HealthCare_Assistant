import express from 'express';
import prescriptionSchema from "../models/prescription.model.js";

const router = express.Router();

// 🔍 GET /api/prescriptions?email=example@gmail.com
router.get('/prescriptions', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ message: "Missing or invalid email in query." });
        }

        const prescriptions = await prescriptionSchema.find({ email }).sort({ createdAt: -1 });

        if (prescriptions.length === 0) {
            return res.status(404).json({ message: "No prescriptions found for this email." });
        }

        res.status(200).json(prescriptions);
    } catch (error) {
        console.error("Error fetching prescriptions:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
