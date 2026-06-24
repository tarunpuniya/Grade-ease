const Fee = require("../models/Fee");

exports.getFeeStatus = async (req, res) => {
  const { id } = req.params;
  const fee = await Fee.findOne({ studentId: id });
  res.json(fee);
};
