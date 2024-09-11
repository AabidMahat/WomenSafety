const express = require("express");
const notificationController = require("../controllers/sendNotification");

const router = express.Router();

router
  .route("/sendNotification")
  .post(notificationController.sendPushNotification);

module.exports = router;
