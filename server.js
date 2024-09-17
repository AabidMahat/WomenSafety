const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const WebSocket = require("ws");
const app = require("./app");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_URL;
const locationController = require("./controllers/locationController");
const Location = require("./models/locationModel");
const feedbackController = require("./controllers/feedbackController");

mongoose
  .connect(DB)
  .then(() => {
    console.log("Database Connected Successfully 💥💥");
  })
  .catch((err) => {
    console.log("Failed to connect 🥲🥲");
  });

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    const data = JSON.parse(message);

    if (data.type === "locationUpdate") {
      if (Location.countDocuments === 0) {
        try {
          const location = await locationController.createLocation(data);
          ws.send(JSON.stringify({ status: "Success", data: location }));
        } catch (err) {
          ws.send(JSON.stringify({ status: "Error", data: err.message }));
        }
      } else {
        try {
          const location = await locationController.updateLocation(data);
          ws.send(JSON.stringify({ status: "Success", data: location }));
        } catch (err) {
          ws.send(JSON.stringify({ status: "Error", data: err.message }));
        }
      }
    } else if (data.type === "getFeedbacks") {
      try {
        const feedback = await feedbackController.getAllFeedback();
        ws.send(JSON.stringify({ status: "Success", data: feedback }));
      } catch (err) {
        ws.send(JSON.stringify({ status: "Error", data: err.message }));
      }
    }

    // Broadcast updated location to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            userId,
            latitude: latitude,
            longitude: longitude,
          })
        );
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
