const Folder = require("../models/Folder");

exports.getAllFolders = async () => {
  const folders = await Folder.find();
  return folders;
};

