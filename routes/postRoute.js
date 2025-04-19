const express = require("express");

const postController = require("../controllers/postController");

router = express.Router();

router.route("/createPost").post(postController.createPost);
router.route("/getCommunityPosts/:communityId").get(postController.getCommunityPosts);
router.route("/addCommentToPost").post(postController.addCommentToPost);
router.route("/getPostComments/:postId").get(postController.getPostComments);

module.exports = router;