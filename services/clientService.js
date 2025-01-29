const Client = require("../models/Client");
const Folder = require("../models/Folder");
const { notifyNewMessage } = require("./socketService");

exports.getClientsByFolder = async ({
  folder,
  lastClientId = null,
  limit = 20,
}) => {
  if (!folder) {
    throw new Error("Folder is required");
  }

  let lastClientLastMessageCreatedAt = null;

  if (lastClientId) {
    const lastClient = await Client.findById(lastClientId).lean();
    if (!lastClient) {
      throw new Error("Invalid lastClientId.");
    }

    lastClientLastMessageCreatedAt = lastClient.lastMessage?.createdAt || null;
  }

  const filter = {
    folder,
    ...(lastClientLastMessageCreatedAt
      ? { "lastMessage.createdAt": { $lt: lastClientLastMessageCreatedAt } }
      : {}),
  };

  const clients = await Client.find(filter)
    .sort({ "lastMessage.createdAt": -1, _id: -1 })
    .limit(limit)
    .lean(); // `.lean()` улучшает производительность, если данные не модифицируются

  return clients;
};

exports.getClients = async () => {
  const clients = await Client.find();

  if (!clients || clients.length === 0) {
    return null;
  }

  return clients;
};

exports.updateClientFolder = async (clientId, folderCode) => {
  if (!clientId || !folderCode) {
    throw new Error("Client ID and folder name are required");
  }

  const folder = await Folder.findOne({ code: folderCode });
  if (!folder) {
    throw new Error(`Folder "${folder}" does not exist`);
  }

  const client = await Client.findOneAndUpdate(
    { instagram_id: clientId },
    { folder: folderCode },
    { new: true }
  );

  notifyNewMessage(null, client, "clientUpdate");

  if (!client) {
    throw new Error("Client not found");
  }

  return client;
};

exports.updateClientTag = async (clientId, tag) => {
  if (!clientId || !tag) {
    throw new Error("Client ID and tag are required");
  }

  const client = await Client.findOneAndUpdate(
    { instagram_id: clientId },
    { tag: tag },
    { new: true }
  );

  notifyNewMessage(null, client, "clientUpdate");

  if (!client) {
    throw new Error("Client not found");
  }

  return client;
};

exports.updateClientNote = async (clientId, note) => {
  if (!clientId || !note) {
    throw new Error("Client ID and tag are required");
  }

  const client = await Client.findOneAndUpdate(
    { instagram_id: clientId },
    { note: note },
    { new: true }
  );

  notifyNewMessage(null, client, "clientUpdate");

  if (!client) {
    throw new Error("Client not found");
  }

  return client;
};
