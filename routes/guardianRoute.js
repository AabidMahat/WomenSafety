const express = require("express");
const guardianController = require("../controllers/guardianController");

const router = express.Router();

// Get Live Location

router.route("/signUp").post(guardianController.signUp);
router.route("/verifyOtp").post(guardianController.verifyOtp);
router.route("/resendOtp/:phoneNumber").get(guardianController.resendotp);

router.route("/logIn").post(guardianController.logIn);

module.exports = router;