const mongoose = require("mongoose");

const guardianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    default_password: {
      type: String,
      default: "women@123",
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: "default.png",
  },

  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },
  message_template: {
    type: String,
    default: "I'm in trouble and need help! Here is my current location: ...",
  },
  guardian: [guardianSchema],
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  otp: Number,
  role: {
    type: String,
    required: true,
    enum: ["guardian", "user"],
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
  },
  videoUrl: [String],
  audioUrl: [String],
  communities: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Community",
          required: true,
          default:[],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
