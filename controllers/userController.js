const User = require("../models/userModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { Twilio } = require("twilio");

const accountSID = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

// @ Create client

const client = new Twilio(accountSID, authToken);

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // @ Creating cookies with jwt token

  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOption);

  //   Return the response

  res.status(statusCode).json({
    status: statusCode,
    message: "User logged In",
    token,
    data: {
      user,
    },
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

    if (existingAccount) {
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

    if (otpSent) {
      res.status(200).json({
        status: "success",
        message: "Otp has been sent. Please verify the account.",
      });
    } else {
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

    await newUser.save();
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
    });
  } catch (err) {
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};
