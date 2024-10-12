const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const guardianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must enter the name"],
  },
  email: {
    type: String,
    required: [true, "Must enter the email"],
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Please enter a valid email",
    },
  },
  phoneNumber: {
    type: String,
    required: [true, "Must enter the phone number"],
    validate: {
      validator: (value) => validator.isMobilePhone(value),
      message: "Please enter valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Enter the passowrd"],
    minLength: [8, "Password must be at least 8 characters"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm the password"],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: "Password are not same",
    },
  },

  isPhoneVerified: {
    type: Boolean,
    default: false,
  },

  verificationToken: String,

  otp: Number,

  role: {
    type: String,
    required: true,
    enum: ["gurdian", "user"],
  },
});

const Guardian = mongoose.model("Guardian", guardianSchema);

module.exports = Guardian;
