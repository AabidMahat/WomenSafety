const mongoose = require("mongoose");


const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Must enter the name"],
        unique: true,
    },
    members: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
    ],

    description: {
        type: String,
        required: [true, "Must enter the description"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    profileImage: {
        type: String,
        default: "default.png",
    },
    memberCount: {
        type: Number,
        default: 1,
    },
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;