import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    experienceYears: {
        type: Number,
        required: true,
    },
    patients: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        },
    ],
    avalabilty: {
        enum: ['on duty', 'unavailable', 'on leave']
    }
})

export const Doctor = mongoose.model('Doctor', doctorSchema);