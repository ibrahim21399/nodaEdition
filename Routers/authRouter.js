const express = require("express");
const { body, param, query } = require("express-validator");

const authController = require("../Controllers/authController")

const router = express.Router();

router.route("/api/login")
    .post(
        [
            body("email").isEmail().withMessage("email is not correct"),
            body("password").isLength({ min: 6, max: 15 }).withMessage("password must between 8 and 15")
        ],
        authController.login);

module.exports = router;