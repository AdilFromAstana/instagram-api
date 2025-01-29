const User = require("./models/User");
const Folder = require("./models/Folder");

const folders = [
  { code: "new", title: "Новые" },
  { code: "hot", title: "Горячие" },
  { code: "discount", title: "Скидка" },
  { code: "archive", title: "Архив" },
];

const initializeData = async () => {
  try {
    const founderExists = await User.findOne({
      username: "admin",
    });
    if (!founderExists) {
      await User.create({
        username: "admin",
        password: "melekadmin01",
      });
      console.log("Founder created.");
    } else {
      console.log("Founder already exists.");
    }

    for (const folder of folders) {
      const exists = await Folder.findOne({ code: folder.code });
      if (!exists) {
        await Folder.create(folder);
        console.log(`Folder ${folder.code} added`);
      }
    }

    console.log("Initialization completed.");
  } catch (error) {
    console.error("Initialization error:", error.message);
    throw error;
  }
};

module.exports = initializeData;
