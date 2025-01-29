const express = require("express");
const { getFolders } = require("../controllers/folderController");

const router = express.Router();

router.get("/", getFolders);

module.exports = router;
