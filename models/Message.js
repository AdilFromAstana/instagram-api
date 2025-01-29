const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender_id: { type: String, required: true },
    recipient_id: { type: String, required: true },
    content: { type: String },
    createdWay: { type: String },
    tags: { type: [String], default: [] },
    folder: {
      type: String,
      enum: ["new", "hot", "discount", "raise", "archive"],
      default: "new",
    },
    attachments: [
      {
        type: { type: String, default: null },
        url: { type: String, default: null },
      },
    ],
    isUnsupported: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    mid: { type: String, default: null },
    status: {
      type: String,
      enum: ["sent", "delivered", "failed"],
      default: "sent",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
