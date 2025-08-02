// models/doctor.model.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  experienceYears: { type: Number, required: true },
  availability: {
    type: String,
    enum: ["on duty", "unavailable", "on leave"],
    default: "unavailable",
  },
  role: { type: String, default: "doctor" },
  createdAt: { type: Date, default: Date.now },
});

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export default Doctor;

