import mongoose from 'mongoose';

const connectDB = async () => {

  if (!process.env.MONGO_URI) {
    throw new Error('❌ MONGO_URI not defined in .env');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    throw err;
  }
};

export default connectDB;
