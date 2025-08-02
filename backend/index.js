import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import connectDB from './db/connectdb.js'; 
import cors from "cors";
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',"http://localhost:3000": true,
    methods: ['GET', 'POST','PUT', 'DELETE'],
  },
});
app.use(cors()); // For dev, allow all

import symptomsPrediction from "./routes/symptomsPrediction.route.js";
import patientRoutes from "./routes/patient.route.js";
import doctorRoutes from "./routes/doctor.route.js";
import userRoutes from "./routes/user.route.js";
import clinicalNotesRoutes from "./routes/clinicalNotes.routes.js"
import emergencyRoutes from "./routes/emergency.routes.js";
import prescriptionRoutes from "./routes/prescription.route.js";
// Middleware
app.use(express.json());
app.set("io", io); 

// Routes
app.use("/api", symptomsPrediction);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notes",clinicalNotesRoutes)
app.use("/api/emergency", emergencyRoutes);
app.use("/api", prescriptionRoutes);

// Server Listen
connectDB().then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 Server is running on port ${process.env.PORT || 5000}`);
    });
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});
