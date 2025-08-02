import mongoose from "mongoose";

const DoctorEmergencyAlertSchema = new mongoose.Schema({
  doctorEmail: { type: String, required: true }, // ✅ Use email instead of UID
  patientId: { type: String, required: true },
  medicalHistory: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
});

const emergency = mongoose.model("DoctorEmergencyAlert", DoctorEmergencyAlertSchema);
export default emergency;