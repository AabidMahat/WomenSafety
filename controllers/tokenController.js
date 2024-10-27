const Token = require("../models/tokenModel");

exports.addFCMToken = async (req, res, next) => {
  try {
    const newToken = await Token.create(req.body);

    if (!newToken) {
      return res.status(404).json({
        status: "error",
        message: "Failed to add token",
      });
    }
    res.status(200).json({
      status: "success",
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
