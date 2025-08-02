import mongoose from 'mongoose';

const medicalHistorySchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  prescriptions: [
    {
      name: String,
      problem: String,
      prescription: String,
    },
  ],
  symptomPredictions: [
    {
      symptoms: [String],
      doctorsuggestion: String,
      severity: String,
      createdAt: Date,
    },
  ],
  compiledAt: {
    type: Date,
    default: Date.now,
  },
});

const MedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);
export default MedicalHistory;
