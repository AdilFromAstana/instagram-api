const http = require("http");
const app = require("./app");
const connectDB = require("./db");
const initializeData = require("./initData");
const { initializeWebSocket } = require("./services/socketService");

const HTTP_PORT = 5000; // Порт для API
const WEBSOCKET_PORT = 4000; // Порт для WebSocket

const httpServer = http.createServer(app); // HTTP сервер для API
const websocketServer = http.createServer(); // Отдельный сервер для WebSocket

const startServer = async () => {
  try {
    await connectDB();
    await initializeData();

    httpServer.listen(HTTP_PORT, () => {
      console.log(`HTTP сервер запущен на https://melek-crm.kz:${HTTP_PORT}`);
    });

    // Запуск WebSocket сервера
    initializeWebSocket(websocketServer);
    websocketServer.listen(WEBSOCKET_PORT, () => {
      console.log(
        `WebSocket сервер запущен на wss://melek-crm.kz:${WEBSOCKET_PORT}`
      );
    });
  } catch (error) {
    console.error("Ошибка при запуске сервера:", error.message);
    process.exit(1);
  }
};

startServer();
