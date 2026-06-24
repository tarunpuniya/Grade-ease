const router = require("express").Router();
const classes = require("../controllers/classController");

router.get("/", classes.getClasses);

module.exports = router;
