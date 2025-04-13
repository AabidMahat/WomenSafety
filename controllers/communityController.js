const Community = require("../models/communityModel");

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