import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    prescriptions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "prescription",
        }
    ],
    attendedBy: { type: String,
        required: true 
    },
    attendedOn: { type: Date,
        default: Date.now 
    },
    duration: { type: String,
        required: true 
    },
    symptoms: { type: String,
        required: true 
    }
})

export const MedicalHistory = mongoose.model("medicalhistory", patientSchema);