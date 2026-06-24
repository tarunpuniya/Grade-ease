const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  date: { type: String, required: true },
  present: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", attendanceSchema);

