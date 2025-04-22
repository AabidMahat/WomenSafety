const mongoose = require("mongoose");



const commentSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userName: String,
    userImage: {
        type: String,
        default: "default.png",
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});



const postSchema = new mongoose.Schema({
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        required: true,
    },
    title: {
        type: String,
        required: [true, "Must enter the title"],
        unique: false,
    },
    description: {
        type: String,
        required: [true, "Must enter the description"],
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    images: [{
        type: mongoose.Schema.Types.String,
        default: [],
    }],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    comments:{
        type: [commentSchema],
        default: [],
    },
});

module.exports  = mongoose.model("Post", postSchema);