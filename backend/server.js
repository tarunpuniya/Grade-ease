// =========================
// server.js – GradeFlow Backend (Modular Version)
// =========================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads (assignments, files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- MongoDB Connection ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });

// ---------- Import Routes ----------
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const gradeRoutes = require("./routes/grades");
const attendanceRoutes = require("./routes/attendance");
const assignmentRoutes = require("./routes/assignments");
const feeRoutes = require("./routes/fees");
const classRoutes = require("./routes/classes");

// ---------- Register Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/classes", classRoutes);

// ---------- Frontend Serve (optional) ----------
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 GradeFlow Backend running at http://localhost:${PORT}`);
});


