const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  total: Number,
  paid: Number,
  dueDate: String
});

module.exports = mongoose.model("Fee", feeSchema);
