const { Schema, model } = require("mongoose");

const FolderSchema = new Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
});

module.exports = model("Folder", FolderSchema);
