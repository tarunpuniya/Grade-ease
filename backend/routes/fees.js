const router = require("express").Router();
const fee = require("../controllers/feeController");

router.get("/:id", fee.getFeeStatus);

module.exports = router;
