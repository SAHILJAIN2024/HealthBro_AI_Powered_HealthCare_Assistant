import express from 'express';
import fetch from 'node-fetch';
import symptomsPrediction from '../models/symptonprediction.model.js';
const router = express.Router();
const FASTAPI_URL = "http://127.0.0.1:8000/predict";

router.post('/predict', async (req, res) => {
  try {
    const { input_text, mode, uid } = req.body;

    if (!input_text || !mode) {
      return res.status(400).json({ message: 'Missing input_text or mode in request body.' });
    }

    const response = await fetch(FASTAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input_text, mode })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ message: 'Prediction failed', details: errorText });
    }

    const data = await response.json();

    const prediction = {
      uid: uid, 
      symptoms: input_text.split(',').map(s => s.trim()),
      severity: data.result?.severity || 'Unknown',
      doctorsuggestion: data.result?.suggested_doctor || 'Consult a doctor.',
      createdAt: new Date()
    };

    // Save to MongoDB
    const savedPrediction = await symptomsPrediction.create(prediction);

    res.json({ message: 'Prediction successful', savedPrediction });
  } catch (error) {
    console.error('AI prediction failed:', error);
    res.status(500).json({ message: 'AI prediction failed', error: error.message });
  }
});

router.get('/predictions/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const predictions = await symptomsPrediction.find({ uid }).sort({ createdAt: -1 });
    if (predictions.length === 0) {
      return res.status(404).json({ message: 'No predictions found for this user.' });
    }
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ message: 'Error fetching predictions', error: error.message });
  }

});

// DELETE /api/predictions/:id
router.delete('/predictions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await symptomsPrediction.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Prediction not found.' });
    }
    res.json({ message: 'Prediction deleted successfully.' });
  } catch (error) {
    console.error('Error deleting prediction:', error);
    res.status(500).json({ message: 'Failed to delete prediction', error: error.message });
  }
});


export default router;
