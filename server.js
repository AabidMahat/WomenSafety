const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const WebSocket = require("ws");
const app = require("./app");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_URL;
const Location = require("./models/locationModel");

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
    const { userId, latitude, longitude } = data;

    console.log(`Received location from ${userId}: ${latitude}, ${longitude}`);

    // Handle location update logic here
    const location = await Location.findOneAndUpdate(
      { userId },
      { $set: { latitude, longitude, updatedAt: new Date() } },
      { upsert: true, new: true }
    );

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
