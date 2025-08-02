import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String, // Doctor's or Patient's name
    required: false,
  },
  problem: {
    type: String, // Extracted or manually entered
    required: false,
  },
  transcription: {
    type: String,
    required: true, // This comes from Whisper
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prescription = mongoose.model("prescription", prescriptionSchema);
export default Prescription;
