const express = require("express");

const postController = require("../controllers/postController");

router = express.Router();

router.route("/createPost").post(postController.createPost);
router.route("/getCommunityPosts/:communityId").get(postController.getCommunityPosts);