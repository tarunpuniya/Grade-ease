const Student = require("../models/student");
const Teacher = require("../models/Teacher");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateOTP } = require("../utils/otpGenerator");
const { sendEmail } = require("../utils/mailer");

let OTP_STORE = {};

exports.studentSendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  OTP_STORE[email] = otp;

  await sendEmail(email, "Your Login OTP", `Your OTP is: ${otp}`);

  res.json({ message: "OTP sent!" });
};

exports.studentVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (OTP_STORE[email] !== otp) return res.status(401).json({ error: "Invalid OTP" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET);

  res.json({ token });
};

exports.teacherLogin = async (req, res) => {
  const { email, password } = req.body;

  const teacher = await Teacher.findOne({ email });

  if (!teacher) return res.status(404).json({ error: "Teacher not found" });

  const match = await bcrypt.compare(password, teacher.password);
  if (!match) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET);

  res.json({ token });
};
