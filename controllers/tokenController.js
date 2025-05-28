const Token = require("../models/tokenModel");
const User = require("../models/userModel");

exports.addOrUpdateFCMToken = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { fcm_token } = req.body;

    const updatedToken = await Token.updateOne(
      { userId },
      { $set: { fcm_token } },
      { upsert: true }
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

exports.getAllToken = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    const tokens = await Token.find({
      userId: { $in: userId },
    }).select("-__v");

    if (!tokens || tokens.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No tokens found",
      });
    }

    res.status(200).json({
      status: "success",
      data: tokens,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error fetching tokens",
      error: err.message,
    });
  }
};

exports.getTokenOnPhoneNumber = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    const result = await User.aggregate([
      { $match: { phoneNumber } },
      {
        $lookup: {
          from: "tokens",
          localField: "_id",
          foreignField: "userId",
          as: "token",
        },
      },
      { $unwind: "$token" },
      { $project: { "token.fcm_token": 1, _id: 0 } },
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No user or token found with this number",
      });
    }

    return res.status(200).json({
      status: "success",
      data: result[0].token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error fetching token on phone number",
      error: error.message,
    });
  }
};
