import mongoose, { Schema } from "mongoose";

const symptomsPredictionSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  symptoms: {
    type: [String],
    required: true,
  },
  doctorsuggestion: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ["Mild", "Moderate", "Severe", "Low", "Medium", "High", "Unknown"], // include all possible values from API
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const symptomsPrediction = mongoose.model("symptomsPrediction", symptomsPredictionSchema);
export default symptomsPrediction;
