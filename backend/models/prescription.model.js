import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    uid: { type: String,
        required: true,
        unique: true
    },
    name: { type: String,
        required: true
    },
    problem: { type: String,
        required: true
    },
    prescription: { type: String,
        required: true
    }
})

export const Prescription = mongoose.model("prescription", prescriptionSchema);