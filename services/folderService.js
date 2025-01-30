const Folder = require("../models/Folder");

exports.getAllFolders = async () => {
  const folders = await Folder.find().sort({
    priority: 1,
  });
  return folders;
};
