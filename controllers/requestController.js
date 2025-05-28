const Request = require("../models/requestModel");

exports.addRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { guardianData } = req.body;

    const bulkOperation = guardianData.map((guardian) => ({
      insertOne: {
        document: {
          userId: userId,
          guardians: guardian,
        },
      },
    }));

    const result = await Request.bulkWrite(bulkOperation);

    res.status(200).json({
      status: "success",
      message: "Request created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getGuardiansWithNumber = async (req, res, next) => {
  try {
    const request = await Request.find({
      status: "pending",
    })
      .where("guardians.phoneNumber")
      .equals(req.body.phoneNumber)
      .populate({
        path: "userId",
        select: "name phoneNumber _id",
      })
      .select("status userId");

    if (!request || request.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Request not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: request,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.deleteRequest = async (req, res, next) => {
  try {
    const updates = req.body.updates;

    const bulkOperations = updates.map((update) => ({
      deleteOne: {
        filter: {
          "guardians.phoneNumber": update.phoneNumber,
        },
      },
    }));

    await Request.bulkWrite(bulkOperations);

    res.status(200).json({
      status: "success",
      message: "Request Removed",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.body;

    const result = await Request.updateMany(
      { userId },
      { $set: { status } }
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getRequestByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const request = await Request.find({
      userId,
    }).select("status guardians");

    if (!request || request.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Request not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: request,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};