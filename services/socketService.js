const { Server } = require("socket.io");
let io;

const initializeWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["polling", "websocket"],
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });
  });
};

const notifyNewMessage = (roomId, message, type = "message") => {
  if (!io) {
    throw new Error("WebSocket сервер не инициализирован.");
  }

  if (type === "message") {
    io.to(roomId).emit("newMessage", message);
  } else if (type === "clientUpdate") {
    io.emit("clientUpdate", message);
  }
};

const getIo = () => {
  if (!io) {
    throw new Error("WebSocket not initialized");
  }
  return io;
};

module.exports = {
  initializeWebSocket,
  notifyNewMessage,
  getIo,
};
