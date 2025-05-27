const User = require("../models/userModel");

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { Twilio } = require("twilio");
const Guardian = require("../models/guardianModel");

const accountSID = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

// @ Create client

const client = new Twilio(accountSID, authToken);

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendOTp = async (phoneNumber, otp) => {
  const message = `Your verification code is ${otp}`;

  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_NUMBER,
      to: `+91${phoneNumber}`,
    });

    console.log(`Message sent with SID: ${response.sid}`);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    // Check if the user already exists
    const existingAccount = await User.findOne({ phoneNumber });

    if (existingAccount && !existingAccount.isPhoneVerified) {
      return res.status(400).json({
        status: "error",
        message:
          "Phone number is already in use, please verify your phone number",
      });
    }

    // Generate 6-digit OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    // Send OTP
    const otpSent = await sendOTp(phoneNumber, otp);

    if (!otpSent) {
      // If OTP failed to send, respond and stop further processing
      return res.status(500).json({
        status: "error",
        message: "Failed to send OTP.",
      });
    }

    // If no existing user or phone verification needed, create new user
    const newUser = await User.create(req.body);

    // Generate JWT token for the new user
    const token = signToken(newUser._id);

    // Set OTP and verification token to the user model
    newUser.verificationToken = token;
    newUser.otp = otp;

    await newUser.save({ validateBeforeSave: false });

    // If everything is successful, send a success response
    res.status(200).json({
      status: "success",
      message: "Otp has been sent. Please verify the account.",
    });
  } catch (err) {
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });

    if (user.otp === otp) {
      user.isPhoneVerified = true;
      user.otp = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(200).json({
        status: "success",
        message: "Otp is verified",
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.resendotp = async (req, res, next) => {
  try {
    const { phoneNumber } = req.params;
    const user = await User.findOne({ phoneNumber });

    if (user.isPhoneVerified) {
      return res.status(500).json({
        status: "error",
        message: "User is already verified",
      });
    }

    // Generate 6-digit OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    // Send OTP
    const otpSent = await sendOTp(phoneNumber, otp);

    if (otpSent) {
      user.otp = otp;
      await user.save({ validateBeforeSave: false });

      return res.status(200).json({
        status: "success",
        message: "Otp has been sent. Please verify the account.",
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Failed to send OTP.",
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        status: "error",
        message: "Enter email or password",
      });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No user found",
      });
    }

    if (!user.isPhoneVerified) {
      return res.status(400).json({
        status: "error",
        message: "Phone Number is not verified\nPlease verify the number",
      });
    }

    user.confirmPassword = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "User logged In successfully",
      data: user,
      jwtToken: signToken(user._id),
    });
  } catch (err) {
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.createNewUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body); // Create a new instance of User

    if (!newUser) {
      return res.status(404).json({
        status: "error",
        message: "User not created",
      });
    }

    await newUser.save(); // Save the newUser to the database

    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const users = await User.find({
      user_id: userId,
    });

    if (!users) {
      res.status(404).json({
        status: "error",
        message: "No user to this account",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User founded",
      length: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
      }
    );

    if (!updateUser) {
      return res.status(404).json({
        status: "fail",
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Updated the transaction",
      data: updateUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deleteData = await User.findByIdAndDelete(userId);
    if (!deleteData) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.updateGuardian = async (req, res, next) => {
  try {
    const updates = req.body.updates;

    // Create bulk operations based on each user update
    const bulkOperations = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $addToSet: { guardian: { $each: update.guardian } } },
      },
    }));

    // Execute bulkWrite with the bulk operations
    const result = await User.bulkWrite(bulkOperations);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.deleteGuardian = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { guardianNumber } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID and Guardian ID are required",
      });
    }

    // Remove guardian from user's guardian array
    const userData = await User.findByIdAndUpdate(
      userId,
      { $pull: { guardian: { phoneNumber: guardianNumber } } },
      { new: true }
    );

    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Remove userId from guardian's userId array
    const guardianData = await Guardian.findOneAndUpdate(
      {
        phoneNumber: guardianNumber,
      },
      { $pull: { userId: userId } },
      { new: true }
    );

    if (!guardianData) {
      return res.status(404).json({
        status: "error",
        message: "Guardian not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Guardian deleted successfully",
      data: userData, // ✅ return the updated user
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error: " + err.message,
    });
  }
};

exports.getGuardiansWithNumber = async (req, res, next) => {
  try {
    const user = await User.find({
      guardian: {
        $elemMatch: {
          phoneNumber: req.body.phoneNumber,
        },
      },
    }).select("name _id phoneNumber");

    if (!user || user.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.addAudioAndVideo = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { audioUrl, videoUrl } = req.body;

    const updateField = {};

    if (audioUrl) {
      updateField.audioUrl = {
        $each: [audioUrl],
        $slice: -3,
        $position: 0,
      };
    }

    if (videoUrl) {
      updateField.videoUrl = {
        $each: [videoUrl],
        $slice: -3,
        $position: 0,
      };
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: updateField,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Audio and video added successfully",
      data: user,
    });
  } catch (err) {
    return res.status(404).json({
      status: "error",
      message: "Server error: " + err.message,
    });
  }
};

exports.getAllGuardianNumber = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    console.log(userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No user found",
      });
    }

    const guardianNumbers = user.guardian.map(
      (guardian) => guardian.phoneNumber
    );

    return res.status(200).json({
      status: "success",
      data: guardianNumbers,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Server error: " + err.message,
    });
  }
};
