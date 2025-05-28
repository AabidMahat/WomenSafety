const Feedback = require("../models/feedbackModel");
const { notifyClientsNewFeedback } = require("../webSocket/feedback_websocket");

exports.createFeedback = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const feedback = await Feedback.create({
      ...req.body,
      userId,
    });

    if (!feedback) {
      return res.status(500).json({
        success: "Failed",
        message: "Error while creating feedback",
      });
    }

    notifyClientsNewFeedback(feedback);

    res.status(200).json({
      success: "Success",
      data: feedback,
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateFeedback = async (req, res, next) => {
  try {
    const { comment, category } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(req.params.id, {
      comment,
      category,
    });

    if (!feedback) {
      return res.status(404).json({
        success: "Failed",
        message: "Feedback not found",
      });
    }

    notifyClientsNewFeedback(feedback);

    return res.status(200).json({
      success: "Success",
      data: feedback,
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "name role avatar")
      .populate("guardianId", "name role avatar")
      .exec();

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(200).json({
        success: "Failed",
        message: "No Feedback Found",
        data:[]
      });
    }

    return res.status(200).json({
      success: "Success",
      data: feedbacks,
    });
  } catch (error) {
    return res.status(500).json({
      success: "Failed",
      message: error.message,
    });
  }
};

exports.getAllFeedbackForWebSocket = async () => {
  const feedbacks = await Feedback.find()
    .populate("userId", "name role avatar")
    .populate("guardianId", "name role avatar")
    .exec();

  if (!feedbacks) {
    throw new Error("Not able to fetch feedbacks");
  }
  return feedbacks;
};

exports.checkFeedbackPresent = async (req, res, next) => {
  const { location } = req.body;
  const userId = req.user.id;

  try {
    const feedback = await Feedback.findOne({
      userId: userId,
      "location.latitude": location.latitude,
      "location.longitude": location.longitude,
    })
      .populate("userId", "name role avatar")
      .populate("guardianId", "name role avatar")
      .exec();

    if (feedback) {
      return res.status(400).json({
        status: "fail",
        message: "Feedback already exists for this location by the same user.",
        data: feedback,
      });
    }

    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};
