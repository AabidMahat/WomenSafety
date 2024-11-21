const express = require("express");
const requestController = require("../controllers/requestController");

const router = express.Router();

router.route("/createRequest").post(requestController.addRequest);

router
  .route("/gurdianWithPhoneNUmber")
  .post(requestController.getGuardiansWithNumber);

router.route("/updateStatus").patch(requestController.updateStatus);

router.route("/deleteRequest").delete(requestController.deleteRequest);

router.route("/getUserbyId/:userId").get(requestController.getRequestByUserId);

module.exports = router;
