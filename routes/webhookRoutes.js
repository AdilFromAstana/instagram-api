const express = require("express");
const webhookController = require("../controllers/webhookContoller");

const router = express.Router();

router.get("/", webhookController.verifyWebhook);
router.post("/", webhookController.handleWebhook);

module.exports = router;
