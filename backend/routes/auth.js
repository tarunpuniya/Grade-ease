const router = require("express").Router();
const auth = require("../controllers/authController");

router.post("/student/send-otp", auth.studentSendOTP);
router.post("/student/verify-otp", auth.studentVerifyOTP);
router.post("/teacher/login", auth.teacherLogin);

module.exports = router;


