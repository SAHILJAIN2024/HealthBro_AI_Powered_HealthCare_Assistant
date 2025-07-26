import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  name: String,
  phone: String,
  gender: String,
  age: Number,
  role: { type: String, enum: ["patient", "doctor"], required: true },
  
  // ✅ Add these fields
  lastVisit: { type: String, default: "N/A" },  // You can also use Date if you prefer
  status: { type: String, enum: ["new", "active", "follow-up", "urgent", "normal"], default: "new" },
});

export const user = mongoose.model("User", userSchema);
export default user;
