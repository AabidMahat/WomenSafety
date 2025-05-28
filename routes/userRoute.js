const express = require("express");
const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticationMiddleware");

const router = express.Router({ mergeParams: true });

router.route("/createUser").post(userController.createNewUser);

router.route("/getUser/:userId").get(authenticateToken, userController.getUser);

router.route("/updateUser/:userId").patch(authenticateToken, userController.updateUser);

router.route("/allUsers").get(authenticateToken, userController.getAllUsers);

router.route("/deleteUser/:userId").delete(authenticateToken, userController.deleteUser);

router.route("/signUp").post(userController.signUp);
router.route("/verifyOtp").post(userController.verifyOtp);
router.route("/resendOtp/:phoneNumber").get(userController.resendotp);

router.route("/logIn").post(userController.logIn);
router.route("/addGuardian").patch(authenticateToken, userController.updateGuardian);

router
  .route("/addAudioAndVideo/:userId")
  .patch(authenticateToken, userController.addAudioAndVideo);

router
  .route("/gurdianWithPhoneNUmber")
  .post(authenticateToken, userController.getGuardiansWithNumber);

router.route("/allGuardianNumber").post(authenticateToken, userController.getAllGuardianNumber);

router.route("/deleteGuardian/:userId").delete(authenticateToken, userController.deleteGuardian);
module.exports = router;
