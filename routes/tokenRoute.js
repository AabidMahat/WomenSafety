const express = require("express");
const tokenController = require("../controllers/tokenController");

const router = express.Router();

router.route("/addToken").post(tokenController.addFCMToken);

module.exports = router;
