const Post = require("../models/postModel");

exports.createPost = async (req, res) => {
    try{
        const {title, description, createdBy, communityId} = req.body;
        const post = await Post.create({
            title,
            description,
            createdBy,
            communityId,
        });

        res.status(200).json({
            status: "success",
            data: post,
        });
    }
    catch(err){
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
}

exports.getCommunityPosts = async (req, res) => {
try {
    const { communityId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const posts = await Post.find({ communityId })
    .sort({ createdAt: -1 }) // latest first
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'username profileImage') // optional: show user info
    .lean();

    const totalPosts = await Post.countDocuments({ communityId });

    res.status(200).json({
    status: 'success',
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts,
    posts,
    });
} catch (err) {
    res.status(500).json({
    status: 'error',
    message: err.message,
    });
}
};