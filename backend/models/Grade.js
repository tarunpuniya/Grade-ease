const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  subject: String,
  score: Number,
  maxScore: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Grade", gradeSchema);
