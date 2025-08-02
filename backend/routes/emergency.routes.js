import express from 'express';
import admin from '../config/firebase.js';
import Prescription from '../models/prescription.model.js'; // ✅ Use this model instead of medicalHistory
import emergency from '../models/emergencyAlert.model.js';

const router = express.Router();

router.post('/alert', async (req, res) => {
  const { patientId, doctorEmail } = req.body;

  if (!patientId || !doctorEmail) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const doctorUser = await admin.auth().getUserByEmail(doctorEmail);
    const doctorEmailFromFirebase = doctorUser.email;

    const patientHistory = await Prescription.find({ email: patientId })
      .sort({ createdAt: -1 })
      .lean();

    if (!patientHistory || patientHistory.length === 0) {
      return res.status(404).json({ message: 'No medical history found for this patient' });
    }

    const alert = await emergency.create({
      doctorEmail: doctorEmailFromFirebase, // ✅ correct field
      patientId,
      medicalHistory: patientHistory,
      createdAt: new Date(),
    });

    const io = req.app.get('io');
    io.to(doctorEmailFromFirebase).emit('emergencyAlert', alert); // ✅ emit by email

    res.status(200).json({ message: 'Alert sent to doctor successfully' });
  } catch (error) {
    console.error('❌ Error sending alert:', error);
    res.status(500).json({ message: 'Error sending alert', error: error.message });
  }
});


router.get('/alerts/:doctorEmail', async (req, res) => {
  const { doctorEmail } = req.params;

  if (!doctorEmail) {
    return res.status(400).json({ message: 'Doctor email is required' });
  }

  try {
    const alerts = await emergency
      .find({ doctorEmail }) // match based on email
      .sort({ createdAt: -1 })
      .limit(20);

    if (alerts.length === 0) {
      return res.status(404).json({ message: 'No alerts found for this doctor' });
    }

    res.status(200).json({ alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
  }
});

router.delete('/alert/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await emergency.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting alert:', error);
    res.status(500).json({ message: 'Failed to delete alert', error: error.message });
  }
});



export default router;