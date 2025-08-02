import mongoose from "mongoose";

const riskSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patient", required: true },
  vitals: {
    age: Number,
    bp: Number,
    sugar: Number,
    heartRate: Number,
  },
  riskScore: Number,
  shapFactors: Object,
  predictedAt: { type: Date, default: Date.now }
});

export const RiskPrediction = mongoose.model("RiskPrediction", riskSchema);
export default riskSchema;