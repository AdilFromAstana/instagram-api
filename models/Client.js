const { Schema, model } = require("mongoose");

const ClientSchema = new Schema({
  instagram_id: { type: String, required: true, unique: true },
  folder: { type: String, required: true, default: "new" },
  tag: { type: String, default: "" },
  note: { type: String, default: "" },
  lastMessage: { type: Object },
});

module.exports = model("Client", ClientSchema);
