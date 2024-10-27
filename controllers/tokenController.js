const Token = require("../models/tokenModel");

exports.addOrUpdateFCMToken = async (req, res, next) => {
  try {
    const { userId, fcm_token } = req.body;

    const updatedToken = await Token.updateOne(
      { userId: userId }, // Query to match document by userId
      { $set: { fcm_token: fcm_token } }, // Fields to update
      { upsert: true } // Upsert option: insert if not found
    );

    res.status(200).json({
      status: "success",
      message: "Token added or updated successfully",
      data: updatedToken,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error adding or updating token",
      error: err.message,
    });
  }
};
