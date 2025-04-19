const Community = require("../models/communityModel");
const User = require("../models/userModel");

exports.createCommunity = async (req, res) => {
    try {
        const { name, description, createdBy } = req.body;

        const community = await Community.create({
            name,
            description,
            createdBy,
            createdAt: Date.now(),
            members: [createdBy],
            profileImage: req.imageUrl || "default.png",
        });

        await User.findByIdAndUpdate(createdBy, {
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
        const userId = req.params.id;
        
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
        {
            $sort: { memberCount: -1 },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
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
    const {communityId, userId} = req.body;

    const communityExists = await Community.findOne({
        _id: communityId,
        members: {$ne: userId},
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
    const { communityId, userId } = req.body;

    // Check if the user is a member of the community
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

    // Check if the user has the community in their list
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

    // Perform both updates in parallel for atomicity
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
  