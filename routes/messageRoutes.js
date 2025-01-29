const express = require("express");
const messageController = require("../controllers/messageContoller");

const router = express.Router();

router.post("/send", messageController.sendMessage);
router.get("/dialogue", messageController.getDialogue);

module.exports = router;
