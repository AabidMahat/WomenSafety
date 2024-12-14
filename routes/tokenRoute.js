const express = require("express");
const tokenController = require("../controllers/tokenController");

const router = express.Router();

router.route("/addToken").post(tokenController.addOrUpdateFCMToken);

router.route("/getAllToken").post(tokenController.getAllToken);

router.route("/getTokenOnNumber").post(tokenController.getTokenOnPhoneNumber);

module.exports = router;
