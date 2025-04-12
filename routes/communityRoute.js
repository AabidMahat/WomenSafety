const express = require("express");

const communityController = require("../controllers/communityController");

const router = express.Router();

router.route("/createCommunity").post(communityController.createCommunity);
router.route("/getCommunitiesByUser/:id").get(communityController.getCommunitiesByUser);


module.exports = router;