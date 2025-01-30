const express = require("express");
const router = express.Router();
const {
  getClientsByFolder,
  updateClientsFolder,
  updateClientFolder,
  updateClientTag,
  updateClientNote,
  getClients,
} = require("../controllers/clientController");

router.get("/", getClients);
router.get("/folder/:folder", getClientsByFolder);
router.put("/folder/:clientId", updateClientFolder);
router.put("/folder", updateClientsFolder);
router.put("/tag/:clientId", updateClientTag);
router.put("/note/:clientId", updateClientNote);

module.exports = router;
