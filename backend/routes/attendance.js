const router = require("express").Router();
const attendance = require("../controllers/attendanceController");

router.post("/mark", attendance.markAttendance);
router.get("/student/:studentId", attendance.getStudentAttendance);
router.get("/today", attendance.getTodayAttendance);

module.exports = router;



