const clientService = require("../services/clientService");

exports.getClientsByFolder = async (req, res) => {
  try {
    const { folder } = req.params;
    const { lastClientId } = req.query;

    const clients = await clientService.getClientsByFolder({
      folder,
      lastClientId,
    });

    if (!clients) {
      return res
        .status(404)
        .json({ message: `No clients found in folder: ${folder}` });
    }

    return res.status(200).json({ clients });
  } catch (error) {
    console.error("Error fetching clients: ", error.message || error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await clientService.getClients();

    if (!clients) {
      return res.status(404).json({ message: `No clients found` });
    }

    return res.status(200).json({ clients });
  } catch (error) {
    console.error("Error fetching clients: ", error.message || error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

exports.updateClientFolder = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { folder } = req.body;

    const client = await clientService.updateClientFolder(clientId, folder);

    return res.status(200).json({ message: "Client folder updated", client });
  } catch (error) {
    console.error("Error updating client folder: ", error.message || error);
    return res
      .status(400)
      .json({ error: error.message || "Internal Server Error" });
  }
};

exports.updateClientsFolder = async (req, res) => {
  try {
    const { clientIds, folder } = req.body;

    if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
      return res
        .status(400)
        .json({ error: "clientIds must be a non-empty array" });
    }

    if (!folder) {
      return res.status(400).json({ error: "Folder code is required" });
    }

    const updatedClients = await clientService.updateClientsFolder(
      clientIds,
      folder
    );

    return res.status(200).json({
      message: "Clients updated successfully",
      updatedCount: updatedClients.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating client folder: ", error.message || error);
    return res
      .status(400)
      .json({ error: error.message || "Internal Server Error" });
  }
};

exports.updateClientTag = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { tag } = req.body;

    const client = await clientService.updateClientTag(clientId, tag);

    return res.status(200).json({ message: "Client tag updated", client });
  } catch (error) {
    console.error("Error updating client tag: ", error.message || error);
    return res
      .status(400)
      .json({ error: error.message || "Internal Server Error" });
  }
};

exports.updateClientNote = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { note } = req.body;

    const client = await clientService.updateClientNote(clientId, note);

    return res.status(200).json({ message: "Client note updated", client });
  } catch (error) {
    console.error("Error updating client note: ", error.message || error);
    return res
      .status(400)
      .json({ error: error.message || "Internal Server Error" });
  }
};
