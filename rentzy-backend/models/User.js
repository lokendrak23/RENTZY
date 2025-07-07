// RENTZY-BACKEND/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // Changed "userType" to "role" for consistency
  role: { type: String, enum: ["tenant", "homeowner"], required: true },
});

module.exports = mongoose.model("User", userSchema);
