import mongoose from "mongoose";
import { type } from "os";

const voiceNoteSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId,
    ref: "Patient", required: true
  },
  doctorId: { type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor", required: true
 },

  transcription: {type: String,
    required: true
  },
  audioUrl: { type: String,
    required: true 
  },
  createdAt: { type: Date,
    default: Date.now 
  },
});

export const VoiceNote = mongoose.model("VoiceNote", voiceNoteSchema);
