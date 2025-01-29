const mongoose = require("mongoose");
const Client = require("../models/Client");
const Message = require("../models/Message");
const { notifyNewMessage } = require("../services/socketService");

async function retryCreateMessage(newMessage, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await Message.create(newMessage);
    } catch (error) {
      if (error.codeName === "WriteConflict" && attempt < retries - 1) {
        console.warn(
          `Write conflict detected. Retrying... (${attempt + 1}/${retries})`
        );
        await new Promise((res) => setTimeout(res, 100)); // 100ms пауза
      } else {
        throw error;
      }
    }
  }
}

exports.processWebhookEvent = async (body) => {
  if (body.object !== "instagram") {
    throw new Error("Unsupported webhook object type");
  }

  const processedEvents = [];
  for (const entry of body.entry) {
    if (entry.messaging) {
      for (const message of entry.messaging) {
        console.log("message", message);
        const isMyMessage = message?.message?.is_echo;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          const isDeleted = message.message.is_deleted;
          const senderId = message.sender.id;
          const recipientId = message.recipient.id;
          const mid = message.message.mid;
          const messageText = message.message?.text || null;

          const newMessage = {
            sender_id: senderId,
            recipient_id: recipientId,
            content: messageText,
            isDeleted,
            createdWay: "webhook",
            createdAt: "",
            isRead: isMyMessage,
            readAt: isMyMessage ? null : Date.now(),
            mid,
          };

          if (isDeleted) {
            await Message.updateOne({ mid }, { $set: { isDeleted: true } });

            notifyNewMessage(
              isMyMessage ? recipientId : senderId,
              { mid, isDeleted: true, ...newMessage },
              "message"
            );
          } else {
            const createdMessage = await retryCreateMessage([newMessage]);

            newMessage.createdAt = createdMessage[0].createdAt;
            newMessage._id = createdMessage[0]._id;
            newMessage.readAt = createdMessage[0].readAt;
            newMessage.isRead = createdMessage[0].isRead;

            await Client.findOneAndUpdate(
              {
                instagram_id: isMyMessage ? recipientId : senderId,
              },
              {
                $set: {
                  lastMessage: newMessage,
                },
                $setOnInsert: {
                  folder: "new",
                  tag: "",
                  note: "",
                },
              },
              { upsert: true }
            );

            notifyNewMessage(
              isMyMessage ? recipientId : senderId,
              newMessage,
              "message"
            );

            notifyNewMessage(
              null,
              {
                instagram_id: isMyMessage ? recipientId : senderId,
                lastMessage: newMessage,
              },
              "clientUpdate"
            );
          }

          processedEvents.push({
            senderId,
            messageText,
            timestamp: message.timestamp || Date.now(),
          });

          await session.commitTransaction();
        } catch (error) {
          await session.abortTransaction();
          console.error("TRANSACTION ERROR:", error);
        } finally {
          session.endSession();
        }
      }
    }
  }

  return processedEvents;
};
