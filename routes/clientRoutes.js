const express = require("express");
const router = express.Router();
const {
  getClientsByFolder,
  updateClientFolder,
  updateClientTag,
  updateClientNote,
  getClients,
} = require("../controllers/clientController");

// Endpoint для получения клиентов по папке
router.get("/", getClients);
router.get("/folder/:folder", getClientsByFolder);
router.put("/folder/:clientId", updateClientFolder);
router.put("/tag/:clientId", updateClientTag);
router.put("/note/:clientId", updateClientNote);

module.exports = router;
