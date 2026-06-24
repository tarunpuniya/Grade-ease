const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: String,
  year: String,
  subject: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }
});

module.exports = mongoose.model("Class", classSchema);
