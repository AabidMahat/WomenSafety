const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
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
