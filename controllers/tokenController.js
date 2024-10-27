const Token = require("../models/tokenModel");

exports.addFCMToken = async (req, res, next) => {
  try {
    const newToken = await Token.create(req.body);

    if (!newToken) {
      return res.status(404).json({
        success: "error",
        message: "Failed to add token",
      });
    }
    res.status(201).json({
      success: true,
      message: "Token added successfully",
      data: newToken,
    });
  } catch (err) {
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};
