const admin = require("firebase-admin");
const serviceAccount = require("../config/notifcation_key.json");

// Initialize the Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendPushNotification = (req, res, next) => {
  try {
    const message = {
      notification: {
        title: "Poor Network Connection",
        body: "User network connection is poor. Please call her directly",
      },
      token: req.body.fcm_token, // Make sure to use 'token' here
    };

    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
        return res.status(200).send({
          message: "Notification sent successfully",
          response: response,
        });
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        return res.status(500).send({
          message: "Error sending push notification.",
          errCause: error.message,
        });
      });
  } catch (error) {
    return res.status(404).json({
      message: "Error sending push notification.",
      errCause: error.message,
    });
  }
};
