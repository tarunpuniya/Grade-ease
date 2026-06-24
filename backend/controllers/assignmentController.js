const Assignment = require("../models/Assignment");

exports.submitAssignment = async (req, res) => {
  const filePath = `/uploads/${req.file.filename}`;

  const data = await Assignment.create({
    studentId: req.body.studentId,
    subject: req.body.subject,
    filePath
  });

  res.json(data);
};

