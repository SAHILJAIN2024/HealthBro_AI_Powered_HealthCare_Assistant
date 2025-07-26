// backend/models/users.model.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  name: String,
  phone: String,
  gender: String,
  age: Number,
  role: String,
  createdAt: { type: Date, default: Date.now }
});


const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;