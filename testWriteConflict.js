const mongoose = require("mongoose");
const { processWebhookEvent } = require("./services/webhookService");

async function simulateParallelRequests() {
  const testEvent = {
    object: "instagram",
    entry: [
      {
        messaging: [
          {
            sender: { id: "12345" },
            recipient: { id: "67890" },
            message: {
              is_echo: false,
              mid: "test-mid-" + Math.random(),
              text: "Hello, world!",
            },
            timestamp: Date.now(),
          },
        ],
      },
    ],
  };

  const requests = [];
  for (let i = 0; i < 10; i++) {
    requests.push(processWebhookEvent(testEvent));
  }

  await Promise.allSettled(requests); // Выполняем 10 запросов параллельно

  console.log("✅ Тест завершён");
  mongoose.connection.close();
}

mongoose
  .connect('mongodb+srv://adilfirstus:EV8mXagb4ndWCPSw@cluster0.mj38j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => simulateParallelRequests())
  .catch(console.error);
