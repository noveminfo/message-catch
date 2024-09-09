import express from "express";
import http from "http";
import WebSocket from "ws";
import bodyParser from "body-parser";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());

// Slack event handling endpoint
app.post("/slack/events", (req, res) => {
  const event = req.body;

  // Verify the request is coming from Slack (implement proper verification)

  if (event.type === "url_verification") {
    res.json({ challenge: event.challenge });
  } else if (event.type === "event_callback") {
    // Handle the event and send to connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(event));
      }
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Serve static files (including client-side JavaScript)
app.use(express.static("public"));

server.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
