const webhookService = require("../services/webhookService");

exports.handleWebhook = async (req, res) => {
  const body = req.body;

  try {
    await webhookService.processWebhookEvent(body);
    res.status(200).send("EVENT_RECEIVED");
  } catch (error) {
    console.error("Error processing webhook event: ", error.message);
    res.status(500).send("Failed to process webhook");
  }
};

exports.verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};
