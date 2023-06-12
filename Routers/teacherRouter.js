const express = require("express");

const Controller = require("./../Controllers/teacherController");

const router = express.Router();
router
  .route("/api/teachers")
  .get(Controller.getActiveTeachers)
  .put(Controller.updateTeacher)
  .post(Controller.Createteacher);

router.route("/api/teachers/:id?").get(Controller.getTeacherById);

router.route("/api/allTeachers/notActive").get(Controller.getNotActiveTeachers);

router.route("/api/allTeachers/highRate").get(Controller.getHighRateTeachers);

router.route("/api/activateteacher/:id").post(Controller.activateTeacher);

router
  .route("/api/teacherFeedbackandRate/:id")
  .get(Controller.getFeedbackForTeacher);

module.exports = router;
