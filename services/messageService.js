const axios = require("axios");
const Message = require("../models/Message"); // Импорт модели Message
const Client = require("../models/Client");

exports.sendMessage = async ({
  recipientId,
  messageText,
  attachmentUrl,
  instToken,
  senderId,
}) => {
  try {
    console.log("instToken: ", instToken);
    const response = await axios.post(
      `https://graph.instagram.com/v21.0/${senderId}/messages`,
      {
        recipient: {
          id: recipientId,
        },
        message: messageText
          ? {
              text: messageText,
            }
          : {
              attachment: {
                type: "image",
                payload: {
                  url: attachmentUrl,
                },
              },
            },
      },
      {
        headers: {
          Authorization: `Bearer ${instToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending message: ", error.response?.data || error);
    throw new Error("Failed to send message");
  }
};

exports.getDialogueMessages = async (
  senderId,
  recipientId,
  lastMessageId = null,
  limit = 20
) => {
  if (!senderId || !recipientId) {
    throw new Error("Sender ID and Recipient ID are required.");
  }

  let lastMessageCreatedAt = null;
  if (lastMessageId) {
    const lastMessage = await Message.findById(lastMessageId);
    if (!lastMessage) {
      throw new Error("Invalid lastMessageId.");
    }
    lastMessageCreatedAt = lastMessage.createdAt;
  }

  const filter = {
    $or: [
      { sender_id: senderId, recipient_id: recipientId },
      { sender_id: recipientId, recipient_id: senderId },
    ],
    ...(lastMessageCreatedAt && { createdAt: { $lt: lastMessageCreatedAt } }), // Фильтруем по дате
  };

  const messages = await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit);

  await Message.updateMany(
    {
      sender_id: recipientId,
      recipient_id: senderId,
      isRead: false,
    },
    { $set: { isRead: true, readAt: new Date() } }
  );

  if (messages.length > 0) {
    await Client.updateOne(
      { instagram_id: recipientId },
      {
        $set: {
          "lastMessage.isRead": true,
          "lastMessage.readAt": new Date(),
        },
      }
    );
  }

  return messages.reverse();
};
