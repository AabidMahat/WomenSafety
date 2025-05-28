const Community = require("../models/communityModel");
const User = require("../models/userModel");

exports.createCommunity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, imageUrl } = req.body;

    const community = await Community.create({
      name,
      description,
      createdBy: userId,
      createdAt: Date.now(),
      members: [userId],
      profileImage: imageUrl,
      memberCount: 1,
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { communities: community._id }
    });

    res.status(200).json({
      status: "success",
      data: community,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getCommunitiesByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const communities = await Community.find({ members: userId });

    res.status(200).json({
      status: "success",
      data: communities,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getAllCommunitiesPaginated = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const communities = await Community.aggregate([
      {
        $addFields: {
          memberCount: { $size: "$members" },
        },
      },
      { $sort: { memberCount: -1, _id: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await Community.countDocuments();

    res.status(200).json({
      status: "success",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCommunities: total,
      data: communities,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const communityId = req.body.communityId;
    const userId = req.user.id;

    const communityExists = await Community.findOne({
      _id: communityId,
      members: { $ne: userId },
    }).select('_id').lean();

    if (!communityExists) {
      return res.status(400).json({
        status: "error",
        message: "Community not found or user already joined",
      });
    }

    const userExists = await User.findOne({
      _id: userId,
      communities: { $ne: communityId },
    }).select('_id').lean();

    if (!userExists) {
      return res.status(400).json({
        status: "error",
        message: "User not found or already in community",
      });
    }

    await Promise.all([
      Community.updateOne(
        { _id: communityId },
        { $addToSet: { members: userId }, $inc: { memberCount: 1 } }
      ),
      User.updateOne(
        { _id: userId },
        { $addToSet: { communities: communityId } }
      )
    ]);

    return res.status(200).json({
      status: "success",
      message: "User successfully joined the community",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.leaveCommunity = async (req, res) => {
  try {
    const { communityId } = req.body;
    const userId = req.user.id;

    const community = await Community.findOne({
      _id: communityId,
      members: userId,
    }).select('_id').lean();

    if (!community) {
      return res.status(400).json({
        status: "error",
        message: "User is not a member of this community or community not found",
      });
    }

    const user = await User.findOne({
      _id: userId,
      communities: communityId,
    }).select('_id').lean();

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found or not a part of this community",
      });
    }

    await Promise.all([
      Community.updateOne(
        { _id: communityId },
        { $pull: { members: userId }, $inc: { memberCount: -1 } }
      ),
      User.updateOne(
        { _id: userId },
        { $pull: { communities: communityId } }
      )
    ]);

    return res.status(200).json({
      status: "success",
      message: "User has left the community",
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};