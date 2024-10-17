const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Get Live Location

router.route("/signUp").post(userController.signUp);
router.route("/verifyOtp").post(userController.verifyOtp);
router.route("/resendOtp/:phoneNumber").get(userController.resendotp);

router.route("/logIn").post(userController.logIn);

router.route("/getAllUsers").post(userController.getAllUser);

router.route("/getUsers").post(userController.getUser);

module.exports = router;
