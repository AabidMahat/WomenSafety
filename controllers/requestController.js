const Request = require("../models/requestModel");

exports.addRequest = async (req, res, next) => {
  try {
    const { guardianData, userId } = req.body;

    const bulkOperation = guardianData.map((guardian) => ({
      insertOne: {
        document: {
          userId: userId,
          guardian: guardian,
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

    if (!request) {
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

exports.updateStatus = async (req, res, next) => {
  try {
    const updates = req.body.updates;

    const bulkOperations = updates.map((update) => ({
      updateOne: {
        filter: { userId: update.userId },
        update: { status: update.status },
      },
    }));

    const result = await Request.bulkWrite(bulkOperations);

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
