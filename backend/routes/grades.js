const router = require("express").Router();
const grade = require("../controllers/gradeController");

router.post("/add", grade.addGrade);
router.get("/:id", grade.getStudentGrades);

module.exports = router;


