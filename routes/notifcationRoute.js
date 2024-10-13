const express = require("express");
const notificationController = require("../controllers/sendNotification");

const router = express.Router();

router
  .route("/sendNotification")
  .post(notificationController.sendPushNotification);

router.route("/makeCall").post(notificationController.makeCall);

router.route("/triggerRecording").post(notificationController.triggerRecording);

router
  .route("/triggerVideoRecording")
  .post(notificationController.triggerVideoRecording);

module.exports = router;
