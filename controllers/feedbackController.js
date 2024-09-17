const FeedBack = require("../models/feedbackModel");

exports.createFeedback = async (req, res, next) => {
  try {
    const feedback = await FeedBack.create(req.body);

    if (!feedback) {
      return res.status(500).json({
        success: "Failed",
        message: "Error while creating feedback ",
      });
    }

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

exports.getAllFeedback = async () => {
  const feedbacks = await FeedBack.find();
  if (!feedbacks) {
    throw new Error("No Feedback Found");
  }

  return feedbacks;
};
