import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import Prescription from "../models/prescription.model.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { doctor_email, patient_id } = req.body;
    const file = req.file;

    if (!doctor_email || !patient_id || !file) {
      return res.status(400).json({ error: "Missing doctor_email, patient_id or file." });
    }

    console.log("📥 Upload received from doctor:", doctor_email, "for patient:", patient_id);

    // Prepare audio for transcription server
    const form = new FormData();
    form.append('file', fs.createReadStream(file.path));
    form.append('email', patient_id);

    const response = await fetch('http://localhost:8002/transcribe', {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    console.log("🧠 Whisper result:", result);
    fs.unlinkSync(file.path); // cleanup

    if (!response.ok || !result.transcript) {
      throw new Error(result.error || "Transcription failed or missing.");
    }

    // Save to MongoDB
    await Prescription.create({
      email: patient_id,
      name: doctor_email,
      transcription: result.transcript,
    });

    res.json({
      message: "✅ Prescription saved successfully.",
      transcript: result.transcript,
    });

  } catch (err) {
    console.error("❌ Error uploading voice note:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
