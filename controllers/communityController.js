const Community = require("../models/communityModel");
const User = require("../models/userModel");

exports.createCommunity = async (req, res) => {
    try {
        const { name, description } = req.body;
        const community = await Community.create({
        name,
        description,
        createdBy: req.body.createdBy,
        createdAt: Date.now(),
        members: [req.body.createdBy],
        profileImage: req.imageUrl || "default.png",
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
    const { communityId, userId } = req.body;

    const community = await Community.findById(communityId);
    if (!community) {
    return res.status(404).json({
        status: "error",
        message: "Community not found",
    });
    }

    const user = await User.findById(userId);
    if (!user) {
    return res.status(404).json({
        status: "error",
        message: "User not found",
    });
    }

    if (community.members.includes(userId) || user.communities.includes(communityId)) {
    return res.status(400).json({
        status: "error",
        message: "User already joined this community",
    });
    }

    community.members.push(userId);
    user.communities.push(communityId);

    await Promise.all([community.save(), user.save()]);

    res.status(200).json({
    status: "success",
    message: "User successfully joined the community",
    data: { community, user },
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

        const community = await Community.findById(communityId);
        if (!community) {
        return res.status(404).json({
            status: "error",
            message: "Community not found",
        });
        }

        if (!community.members.includes(userId)) {
        return res.status(400).json({
            status: "error",
            message: "User is not a member of this community",
        });
        }

        // Remove user from community
        community.members = community.members.filter(memberId => memberId.toString() !== userId);
        await community.save();

        // Remove community from user's list
        const user = await User.findById(userId);
        if (user) {
        user.communities = user.communities.filter(cId => cId.toString() !== communityId);
        await user.save();
        }

        res.status(200).json({
        status: "success",
        message: "User has left the community",
        data: {
            community,
            user,
        },
        });

    } catch (err) {
        res.status(500).json({
        status: "error",
        message: err.message,
        });
    }
};
  