const messageService = require("../services/messageService");
const multer = require("multer");
const path = require("path");

const allowedMimeTypes = ["image/png", "image/jpeg", "image/gif"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Указываем путь до папки uploads внутри api
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const extension = path.extname(file.originalname); // Получаем расширение файла
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // Ограничение размера файла: 8 MB
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Разрешённый файл
    } else {
      cb(
        new Error(
          "Недопустимый формат файла. Разрешены только PNG, JPEG, GIF."
        ),
        false
      );
    }
  },
});

exports.sendMessage = [
  upload.single("attachment"),
  async (req, res) => {
    const { recipientId, messageText, senderId } = req.body;

    const instToken = req.headers["instagramtoken"];

    if (!recipientId) {
      return res.status(400).send("Recipient ID is required");
    }

    let attachmentUrl = null;
    if (req.file) {
      const filePath = req.file.filename;
      attachmentUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/uploads/${filePath}`;
    }

    console.log("attachmentUrl: ", attachmentUrl);

    try {
      const result = await messageService.sendMessage({
        recipientId,
        messageText,
        attachmentUrl,
        instToken,
        senderId,
      });

      console.log("Ссылка на файл:", attachmentUrl);

      res
        .status(200)
        .json({ message: "Message sent and saved successfully", result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

exports.getDialogue = async (req, res) => {
  try {
    const { senderId, recipientId, lastMessageId } = req.query;

    if (!senderId || !recipientId) {
      return res
        .status(400)
        .json({ error: "Sender ID and Receiver ID are required" });
    }

    const messages = await messageService.getDialogueMessages(
      senderId,
      recipientId,
      lastMessageId
    );

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching dialogue messages:", error.message || error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
