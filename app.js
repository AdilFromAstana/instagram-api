const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const messageRoutes = require("./routes/messageRoutes");
const folderRoutes = require("./routes/folderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/folders", folderRoutes);

module.exports = app;
