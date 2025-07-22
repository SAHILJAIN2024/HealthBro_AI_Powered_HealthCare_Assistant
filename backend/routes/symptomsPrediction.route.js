import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const FASTAPI_URL = "http://127.0.0.1:8000/predict";

router.post('/predict', async (req, res) => {
  try {
    const { input_text, mode } = req.body;

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
    res.json(data);
  } catch (error) {
    console.error('AI prediction failed:', error.message);
    res.status(500).json({ message: 'AI prediction failed', error: error.message });
  }
});

export default router;
