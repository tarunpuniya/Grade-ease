const router = require("express").Router();
const student = require("../controllers/studentController");

router.post("/add", student.addStudent);
router.get("/", student.getStudents);

module.exports = router;

