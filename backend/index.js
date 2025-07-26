import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import connectDB from './db/connectdb.js'; 
import cors from "cors";

const app = express();
app.use(cors()); // For dev, allow all

import authRoutes from "./routes/auth.routes.js";
import symptomsPrediction from "./routes/symptomsPrediction.route.js";
import patientRoutes from "./routes/patient.route.js";
import doctorRoutes from "./routes/doctor.route.js";
import userRoutes from "./routes/user.route.js";
// Middleware
app.use(express.json());

// Routes
app.use("/api", authRoutes); 
app.use("/api", symptomsPrediction);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/user", userRoutes);

// Server Listen
connectDB().then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 Server is running on port ${process.env.PORT || 5000}`);
    });
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});
