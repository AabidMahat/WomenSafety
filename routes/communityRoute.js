const express = require("express");

const communityController = require("../controllers/communityController");

const router = express.Router();

router.route("/createCommunity").post(communityController.createCommunity);
router.route("/getCommunitiesByUser/:id").get(communityController.getCommunitiesByUser);
router.route("/getAllCommunitiesPaginated").get(communityController.getAllCommunitiesPaginated);
router.route("/joinCommunity").post(communityController.joinCommunity);
router.route("/leaveCommunity").post(communityController.leaveCommunity);

module.exports = router;