const admin = require("firebase-admin");

// Initialize the Firebase Admin SDK with the service account

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY, // handle line breaks correctly
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSAL_DOMAIN,
};

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
