const express = require("express");

const Controller = require("./../Controllers/studentController");

const router = express.Router();
router
  .route("/api/students")
  .get(Controller.getAllStudent)
  .post(Controller.createStudent)
  .put(Controller.updateStudent);

router
  .route("/api/students/:id?")
  .get(Controller.getStudentById)
  .delete(Controller.deleteStudent);

router.route("/api/BlockStudent/:id").post(Controller.blockAccount);

router.route("/api/ActiveStudent/:id").post(Controller.activateAccount);

router.route("/api/EnrollStudent").post(Controller.enrollStudent);

router.route("/api/teachers/:teacherId/ratings").post(Controller.addRating);

module.exports = router;
