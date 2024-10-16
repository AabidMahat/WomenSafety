const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  location: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },

  category: {
    type: String,
    required: true,
    enum: ["Dangerous", "Suspicious", "Safe"],
  },

  comment: {
    type: String,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: () => Date.now(),
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  guardianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guardian",
  },
});

feedbackSchema.post("save", async function (doc, next) {
  await doc.populate("userId", "name role");
  await doc.populate("guardianId", "name role");

  next();
});

const Feedback = mongoose.model("FeedBack", feedbackSchema);

module.exports = Feedback;
