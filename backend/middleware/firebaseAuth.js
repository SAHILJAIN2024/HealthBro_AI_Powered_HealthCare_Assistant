import { verifyIdToken } from '../config/firebase.js';

export const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const uid = await verifyIdToken(token);
    req.firebaseUid = uid;
    next();
  } catch (err) {
    console.error('Firebase verification error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};
