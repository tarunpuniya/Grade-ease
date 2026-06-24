const Grade = require("../models/Grade");

exports.addGrade = async (req, res) => {
  const grade = await Grade.create(req.body);
  res.json(grade);
};

exports.getStudentGrades = async (req, res) => {
  const { id } = req.params;
  const grades = await Grade.find({ studentId: id });
  res.json(grades);
};
