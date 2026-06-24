const Attendance = require("../models/Attendance");

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const data = await Attendance.create(req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Mark attendance error:", err);
    res.status(500).json({ success: false });
  }
};

// Student attendance history
exports.getStudentAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.params.studentId });
    res.json({ success: true, records });
  } catch (err) {
    console.error("Get student attendance error:", err);
    res.status(500).json({ success: false });
  }
};

// Today attendance
exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const records = await Attendance.find({
      date: today,
    });
    res.json({ success: true, records });
  } catch (err) {
    console.error("Get today attendance error:", err);
    res.status(500).json({ success: false });
  }
};
