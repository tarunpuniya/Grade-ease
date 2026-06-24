const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  roll: String,
  email: String,
  password: String,
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", studentSchema);
