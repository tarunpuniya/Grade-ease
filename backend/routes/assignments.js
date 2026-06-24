const router = require("express").Router();
const upload = require("../controllers/assignmentController");

router.post("/upload", upload.single("assignmentFile"));

module.exports = router;


