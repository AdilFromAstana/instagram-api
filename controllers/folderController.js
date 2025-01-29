const { getAllFolders } = require("../services/folderService");

exports.getFolders = async (req, res) => {
  try {
    const folders = await getAllFolders();
    return res.status(200).json({ folders });
  } catch (error) {
    console.error("Error fetching folders: ", error.message || error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
